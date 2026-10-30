"""Documents API — upload, ingest, approve, publish, archive."""
from __future__ import annotations

import hashlib
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.database import get_db
from app.ingestion.pipeline import chunk_text, compute_content_hash, extract_text_from_file
from app.models.models import Document, DocumentChunk, IngestionJob, User
from app.rag.embeddings import embed_texts
from app.rag.vector_store import get_vector_store
from app.schemas.schemas import DocumentResponse
from app.security.dependencies import get_current_user, require_knowledge_manager

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = Path("./data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _doc_to_response(doc: Document) -> DocumentResponse:
    return DocumentResponse(
        id=doc.id,
        title=doc.title,
        source_url=doc.source_url,
        source_type=doc.source_type,
        issuing_organization=doc.issuing_organization,
        jurisdiction=doc.jurisdiction,
        product_category=doc.product_category,
        publication_date=doc.publication_date,
        effective_date=doc.effective_date,
        version=doc.version,
        approval_status=doc.approval_status,
        page_count=doc.page_count,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_knowledge_manager),
    status_filter: Optional[str] = None,
):
    query = select(Document).order_by(Document.created_at.desc())
    if status_filter:
        query = query.where(Document.approval_status == status_filter)
    result = await db.execute(query.limit(100))
    return [_doc_to_response(d) for d in result.scalars().all()]


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    issuing_organization: str = Form(""),
    jurisdiction: str = Form("IN"),
    product_category: str = Form("GENERAL"),
    effective_date: str = Form(""),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_knowledge_manager),
):
    # Validate extension
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in settings.allowed_extensions:
        raise HTTPException(status_code=400, detail=f"File type '{suffix}' not allowed")

    # Validate size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large (max {settings.MAX_UPLOAD_SIZE_MB}MB)")

    doc_id = str(uuid.uuid4())
    save_path = UPLOAD_DIR / f"{doc_id}{suffix}"
    save_path.write_bytes(content)

    source_type_map = {".pdf": "PDF", ".txt": "TXT", ".md": "MD", ".html": "HTML"}
    source_type = source_type_map.get(suffix, "TXT")

    doc = Document(
        id=doc_id,
        title=title,
        source_type=source_type,
        issuing_organization=issuing_organization,
        jurisdiction=jurisdiction,
        product_category=product_category,
        effective_date=effective_date or None,
        approval_status="DRAFT",
        file_path=str(save_path),
        file_size_bytes=len(content),
        created_by=user.id,
    )
    db.add(doc)
    await db.flush()

    # Trigger ingestion job (synchronous in dev; would be async worker in prod)
    job = IngestionJob(document_id=doc.id, status="PENDING", triggered_by=user.id)
    db.add(job)
    await db.flush()

    try:
        await _run_ingestion(doc, job, save_path, source_type, db)
    except Exception as e:
        job.status = "FAILED"
        job.error_message = str(e)[:500]
        doc.approval_status = "FAILED"

    return _doc_to_response(doc)


async def _run_ingestion(
    doc: Document,
    job: IngestionJob,
    file_path: Path,
    source_type: str,
    db: AsyncSession,
):
    job.status = "RUNNING"
    job.started_at = datetime.now(timezone.utc)

    # Extract text
    job.stage = "EXTRACTING"
    text, page_count = extract_text_from_file(file_path, source_type)
    if not text.strip():
        raise ValueError("Document produced no extractable text")

    doc.page_count = page_count
    doc.content_hash = compute_content_hash(text)

    # Chunk
    job.stage = "CHUNKING"
    raw_chunks = chunk_text(text, settings.CHUNK_SIZE_TOKENS, settings.CHUNK_OVERLAP_TOKENS)

    # Embed
    job.stage = "EMBEDDING"
    texts = [c["text"] for c in raw_chunks]
    embeddings = embed_texts(texts)

    # Store chunks in DB
    job.stage = "STORING"
    db_chunks = []
    store_entries = []
    for chunk_data, embedding in zip(raw_chunks, embeddings):
        chunk = DocumentChunk(
            document_id=doc.id,
            chunk_index=chunk_data["chunk_index"],
            text=chunk_data["text"],
            page_number=chunk_data.get("page_number"),
            section_title=chunk_data.get("section_title", ""),
            token_count=chunk_data.get("token_count"),
            embedding_model=settings.EMBEDDING_MODEL,
        )
        db.add(chunk)
        db_chunks.append((chunk, embedding))

    await db.flush()

    # Add to vector store
    job.stage = "INDEXING"
    store = get_vector_store()
    chunks_meta = []
    vecs = []
    for chunk, emb in db_chunks:
        chunks_meta.append({
            "chunk_id": chunk.id,
            "document_id": doc.id,
            "title": doc.title,
            "source_url": doc.source_url or "",
            "issuing_organization": doc.issuing_organization,
            "jurisdiction": doc.jurisdiction,
            "product_category": doc.product_category,
            "effective_date": doc.effective_date or "",
            "section_title": chunk.section_title or "",
            "page_number": chunk.page_number,
            "text": chunk.text,
        })
        vecs.append(emb)

    await store.add_chunks(chunks_meta, vecs)

    job.status = "COMPLETED"
    job.completed_at = datetime.now(timezone.utc)
    job.chunks_created = len(db_chunks)
    job.embeddings_created = len(db_chunks)
    doc.approval_status = "PENDING_REVIEW"


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_knowledge_manager),
):
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return _doc_to_response(doc)


@router.post("/{document_id}/approve")
async def approve_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_knowledge_manager),
):
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    if doc.approval_status not in ("PENDING_REVIEW", "DRAFT"):
        raise HTTPException(status_code=400, detail=f"Cannot approve document in status: {doc.approval_status}")
    doc.approval_status = "APPROVED"
    doc.reviewed_by = user.id
    return {"message": "Document approved", "id": document_id, "status": "APPROVED"}


@router.post("/{document_id}/publish")
async def publish_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_knowledge_manager),
):
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    if doc.approval_status != "APPROVED":
        raise HTTPException(status_code=400, detail="Document must be APPROVED before publishing")
    doc.approval_status = "PUBLISHED"
    doc.last_verified_at = datetime.now(timezone.utc)
    return {"message": "Document published", "id": document_id, "status": "PUBLISHED"}


@router.post("/{document_id}/archive")
async def archive_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_knowledge_manager),
):
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    doc.approval_status = "ARCHIVED"

    # Remove from vector store
    store = get_vector_store()
    await store.delete_by_document(document_id)
    return {"message": "Document archived", "id": document_id}
