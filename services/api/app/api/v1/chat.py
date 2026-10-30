"""Chat API — main customer-facing AI query endpoint."""
from __future__ import annotations

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.database import get_db
from app.graph.workflow import process_query
from app.models.models import Conversation, Message, MessageCitation, RetrievalEvent, SupportCase
from app.schemas.schemas import (
    ChatRequest,
    ChatResponse,
    CitationResponse,
    ConversationSummary,
    MessageResponse,
)
from app.security.dependencies import get_current_user, get_optional_user
from app.models.models import User

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user),
):
    """
    Main chat endpoint. Runs the full LangGraph query workflow.
    Accessible anonymously or as authenticated user.
    """
    # Resolve or create conversation
    conversation_id = body.conversation_id
    if conversation_id:
        result = await db.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        conv = result.scalar_one_or_none()
        if not conv:
            conv = Conversation(
                id=conversation_id,
                user_id=user.id if user else None,
                title=body.query[:80],
            )
            db.add(conv)
            await db.flush()
        elif conv.user_id and user and conv.user_id != user.id:
            raise HTTPException(status_code=403, detail="Access denied to this conversation")
    else:
        conv = Conversation(
            id=str(uuid.uuid4()),
            user_id=user.id if user else None,
            title=body.query[:80],
        )
        db.add(conv)
        await db.flush()
        conversation_id = conv.id

    # Store user message
    user_msg = Message(
        conversation_id=conversation_id,
        role="user",
        content=body.query,
    )
    db.add(user_msg)
    await db.flush()

    # Run LangGraph workflow
    result = await process_query(
        query=body.query,
        conversation_id=conversation_id,
        user_id=user.id if user else None,
        is_demo_mode=settings.DEMO_MODE,
    )

    classification = result.get("classification")
    intent = classification.intent.value if classification else None
    risk_level = classification.risk_level.value if classification else None

    # Store assistant message
    assistant_msg = Message(
        conversation_id=conversation_id,
        role="assistant",
        content=result.get("answer", ""),
        intent=intent,
        risk_level=risk_level,
        answer_status=result.get("status"),
        latency_ms=result.get("latency_ms"),
        model_used=settings.GEMINI_MODEL if settings.LLM_PROVIDER == "gemini" else settings.LLM_PROVIDER,
    )
    db.add(assistant_msg)
    await db.flush()

    # Store retrieval event
    if result.get("retrieved_chunks"):
        rev = RetrievalEvent(
            message_id=assistant_msg.id,
            query_text=body.query[:500],
            retrieved_count=len(result.get("retrieved_chunks", [])),
            reranked_count=len(result.get("reranked_chunks", [])),
            evidence_sufficient=result.get("evidence_sufficient", False),
        )
        db.add(rev)

    # Store citations
    citations_out = []
    for i, cit in enumerate(result.get("citations", [])):
        mc = MessageCitation(
            message_id=assistant_msg.id,
            chunk_id=cit.get("chunk_id", ""),
            document_id=cit.get("document_id", ""),
            relevance_score=cit.get("relevance_score"),
            supporting_excerpt=cit.get("supporting_excerpt", "")[:500],
            citation_order=i,
        )
        db.add(mc)
        citations_out.append(CitationResponse(**{k: cit.get(k) for k in CitationResponse.model_fields}))

    # Create escalation case if needed
    if result.get("requires_human"):
        q_redacted = body.query[:200] + "…" if len(body.query) > 200 else body.query
        case = SupportCase(
            conversation_id=conversation_id,
            intent=intent,
            risk_level=risk_level,
            reason_code=result.get("escalation_reason"),
            status="OPEN",
            priority="CRITICAL" if risk_level == "CRITICAL" else ("HIGH" if risk_level == "HIGH" else "MEDIUM"),
            customer_question_redacted=q_redacted,
        )
        db.add(case)

    return ChatResponse(
        request_id=result.get("request_id", ""),
        conversation_id=conversation_id,
        message_id=assistant_msg.id,
        status=result.get("status", "SYSTEM_ERROR"),
        intent=intent,
        risk_level=risk_level,
        answer=result.get("answer", ""),
        citations=citations_out,
        limitations=result.get("limitations", []),
        follow_up_suggestions=result.get("follow_up_suggestions", []),
        requires_human=result.get("requires_human", False),
        escalation_reason=result.get("escalation_reason"),
        latency_ms=result.get("latency_ms"),
        is_demo_mode=settings.DEMO_MODE,
    )


@router.get("/conversations", response_model=list[ConversationSummary])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Conversation).where(Conversation.user_id == user.id).order_by(Conversation.updated_at.desc()).limit(50)
    )
    convs = result.scalars().all()

    summaries = []
    for conv in convs:
        count_result = await db.execute(
            select(func.count(Message.id)).where(Message.conversation_id == conv.id)
        )
        count = count_result.scalar() or 0
        summaries.append(ConversationSummary(
            id=conv.id,
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=count,
        ))
    return summaries


@router.get("/conversations/{conversation_id}", response_model=list[MessageResponse])
async def get_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user),
):
    result = await db.execute(select(Conversation).where(Conversation.id == conversation_id))
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if conv.user_id and user and conv.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    msg_result = await db.execute(
        select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
    )
    messages = msg_result.scalars().all()

    out = []
    for msg in messages:
        cit_result = await db.execute(
            select(MessageCitation).where(MessageCitation.message_id == msg.id).order_by(MessageCitation.citation_order)
        )
        cits = cit_result.scalars().all()
        out.append(MessageResponse(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            intent=msg.intent,
            risk_level=msg.risk_level,
            answer_status=msg.answer_status,
            created_at=msg.created_at,
            citations=[
                CitationResponse(
                    chunk_id=c.chunk_id,
                    document_id=c.document_id,
                    title="",
                    source_url=None,
                    supporting_excerpt=c.supporting_excerpt,
                    relevance_score=c.relevance_score,
                )
                for c in cits
            ],
        ))
    return out


@router.delete("/conversations/{conversation_id}", status_code=204)
async def delete_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Conversation).where(Conversation.id == conversation_id))
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Not found")
    if conv.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    await db.delete(conv)
