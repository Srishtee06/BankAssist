"""Analytics, escalation cases, and system health endpoints."""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.database import get_db
from app.models.models import (
    AuditLog, CaseNote, Document, IngestionJob,
    Message, SupportCase, User,
)
from app.schemas.schemas import (
    AddNoteRequest, AnalyticsOverview, CaseResponse,
    HealthResponse, UpdateCaseRequest,
)
from app.security.dependencies import get_current_user, require_admin, require_staff

router = APIRouter(tags=["System"])


# ── Health ────────────────────────────────────────────────────────────────────

@router.get("/health/live", include_in_schema=True)
async def liveness():
    return {"status": "ok"}


@router.get("/health/ready", response_model=HealthResponse)
async def readiness():
    from app.services.llm_provider import get_llm_provider
    provider = get_llm_provider()
    return HealthResponse(
        status="ready",
        demo_mode=settings.DEMO_MODE,
        llm_provider=provider.model_name,
        vector_store_type=settings.VECTOR_STORE_TYPE,
        database=settings.DATABASE_URL.split("://")[0],
    )


# ── Analytics ──────────────────────────────────────────────────────────────────

analytics_router = APIRouter(prefix="/analytics", tags=["Analytics"])


@analytics_router.get("/overview", response_model=AnalyticsOverview)
async def analytics_overview(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
):
    # Total queries (assistant messages from conversations)
    total_q = await db.execute(select(func.count(Message.id)).where(Message.role == "user"))
    total_queries = total_q.scalar() or 0

    answered_q = await db.execute(
        select(func.count(Message.id)).where(
            Message.role == "assistant",
            Message.answer_status == "ANSWERED",
        )
    )
    answered = answered_q.scalar() or 0

    abstained_q = await db.execute(
        select(func.count(Message.id)).where(
            Message.role == "assistant",
            Message.answer_status == "ABSTAINED",
        )
    )
    abstained = abstained_q.scalar() or 0

    escalated_q = await db.execute(
        select(func.count(SupportCase.id))
    )
    escalated = escalated_q.scalar() or 0

    open_cases_q = await db.execute(
        select(func.count(SupportCase.id)).where(SupportCase.status == "OPEN")
    )
    open_cases = open_cases_q.scalar() or 0

    high_risk_q = await db.execute(
        select(func.count(Message.id)).where(
            Message.role == "assistant",
            Message.risk_level.in_(["HIGH", "CRITICAL"]),
        )
    )
    high_risk = high_risk_q.scalar() or 0

    docs_total_q = await db.execute(select(func.count(Document.id)))
    docs_total = docs_total_q.scalar() or 0

    docs_published_q = await db.execute(
        select(func.count(Document.id)).where(Document.approval_status == "PUBLISHED")
    )
    docs_published = docs_published_q.scalar() or 0

    docs_pending_q = await db.execute(
        select(func.count(Document.id)).where(Document.approval_status == "PENDING_REVIEW")
    )
    docs_pending = docs_pending_q.scalar() or 0

    failed_jobs_q = await db.execute(
        select(func.count(IngestionJob.id)).where(IngestionJob.status == "FAILED")
    )
    failed_jobs = failed_jobs_q.scalar() or 0

    avg_latency_q = await db.execute(
        select(func.avg(Message.latency_ms)).where(Message.role == "assistant")
    )
    avg_latency = float(avg_latency_q.scalar() or 0)

    assistant_count = answered + abstained
    abstention_rate = abstained / assistant_count if assistant_count > 0 else 0.0
    escalation_rate = escalated / total_queries if total_queries > 0 else 0.0

    return AnalyticsOverview(
        total_queries=total_queries,
        answered_queries=answered,
        abstention_rate=round(abstention_rate, 4),
        escalation_rate=round(escalation_rate, 4),
        high_risk_queries=high_risk,
        avg_latency_ms=round(avg_latency, 1),
        total_documents=docs_total,
        published_documents=docs_published,
        pending_review=docs_pending,
        open_cases=open_cases,
        failed_ingestion_jobs=failed_jobs,
    )


# ── Escalation cases ──────────────────────────────────────────────────────────

cases_router = APIRouter(prefix="/cases", tags=["Escalations"])


def _case_to_response(c: SupportCase) -> CaseResponse:
    return CaseResponse(
        id=c.id,
        conversation_id=c.conversation_id,
        intent=c.intent,
        risk_level=c.risk_level,
        reason_code=c.reason_code,
        status=c.status,
        priority=c.priority,
        assigned_staff_id=c.assigned_staff_id,
        customer_question_redacted=c.customer_question_redacted,
        resolution_summary=c.resolution_summary,
        created_at=c.created_at,
        updated_at=c.updated_at,
    )


@cases_router.get("", response_model=list[CaseResponse])
async def list_cases(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
    status_filter: Optional[str] = None,
    priority: Optional[str] = None,
):
    q = select(SupportCase).order_by(SupportCase.created_at.desc()).limit(100)
    if status_filter:
        q = q.where(SupportCase.status == status_filter)
    if priority:
        q = q.where(SupportCase.priority == priority)
    result = await db.execute(q)
    return [_case_to_response(c) for c in result.scalars().all()]


@cases_router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
):
    result = await db.execute(select(SupportCase).where(SupportCase.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return _case_to_response(case)


@cases_router.patch("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: str,
    body: UpdateCaseRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
):
    result = await db.execute(select(SupportCase).where(SupportCase.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if body.status:
        case.status = body.status
    if body.priority:
        case.priority = body.priority
    if body.resolution_summary:
        case.resolution_summary = body.resolution_summary
    return _case_to_response(case)


@cases_router.post("/{case_id}/assign")
async def assign_case(
    case_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
):
    result = await db.execute(select(SupportCase).where(SupportCase.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Not found")
    case.assigned_staff_id = user.id
    case.status = "ASSIGNED"
    return {"message": "Case assigned", "case_id": case_id, "assigned_to": user.id}


@cases_router.post("/{case_id}/notes")
async def add_note(
    case_id: str,
    body: AddNoteRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
):
    result = await db.execute(select(SupportCase).where(SupportCase.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Not found")
    note = CaseNote(
        case_id=case_id,
        author_id=user.id,
        content=body.content,
        is_internal=body.is_internal,
    )
    db.add(note)
    return {"message": "Note added", "case_id": case_id}


@cases_router.post("/{case_id}/resolve")
async def resolve_case(
    case_id: str,
    resolution: str = "",
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
):
    from datetime import datetime, timezone
    result = await db.execute(select(SupportCase).where(SupportCase.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Not found")
    case.status = "RESOLVED"
    case.resolution_summary = resolution
    case.resolved_at = datetime.now(timezone.utc)
    return {"message": "Case resolved", "case_id": case_id}


# ── Users (admin only) ────────────────────────────────────────────────────────

users_router = APIRouter(prefix="/users", tags=["Users"])


@users_router.get("", response_model=list[dict])
async def list_users(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
):
    result = await db.execute(select(User).order_by(User.created_at.desc()).limit(100))
    users = result.scalars().all()
    return [
        {"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role, "is_active": u.is_active}
        for u in users
    ]


@users_router.patch("/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    valid_roles = {"CUSTOMER", "SUPPORT_AGENT", "KNOWLEDGE_MANAGER", "EVALUATOR", "ADMIN"}
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")
    result = await db.execute(select(User).where(User.id == user_id))
    target = result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.role = role
    return {"message": "Role updated", "user_id": user_id, "role": role}
