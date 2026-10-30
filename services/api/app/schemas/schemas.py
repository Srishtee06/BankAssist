"""Pydantic request/response schemas for all API endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)

    @field_validator("password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: str
    role: str
    full_name: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime


# ── Chat ─────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    conversation_id: Optional[str] = None

    @field_validator("query")
    @classmethod
    def no_empty_query(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Query cannot be empty")
        return v.strip()


class CitationResponse(BaseModel):
    chunk_id: str
    document_id: str
    title: str
    source_url: Optional[str] = None
    issuing_organization: Optional[str] = None
    section: Optional[str] = None
    page: Optional[int] = None
    effective_date: Optional[str] = None
    supporting_excerpt: Optional[str] = None
    relevance_score: Optional[float] = None


class ChatResponse(BaseModel):
    request_id: str
    conversation_id: str
    message_id: str
    status: str
    intent: Optional[str] = None
    risk_level: Optional[str] = None
    answer: str
    citations: list[CitationResponse] = []
    limitations: list[str] = []
    follow_up_suggestions: list[str] = []
    requires_human: bool = False
    escalation_reason: Optional[str] = None
    latency_ms: Optional[int] = None
    is_demo_mode: bool = False


class ConversationSummary(BaseModel):
    id: str
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    message_count: int


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    intent: Optional[str]
    risk_level: Optional[str]
    answer_status: Optional[str]
    created_at: datetime
    citations: list[CitationResponse] = []


# ── Documents ─────────────────────────────────────────────────────────────────

class DocumentUploadMetadata(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    issuing_organization: str = Field(default="", max_length=500)
    jurisdiction: str = Field(default="IN", max_length=100)
    product_category: str = Field(default="GENERAL", max_length=200)
    publication_date: Optional[str] = None
    effective_date: Optional[str] = None
    source_url: Optional[str] = None


class DocumentResponse(BaseModel):
    id: str
    title: str
    source_url: Optional[str]
    source_type: str
    issuing_organization: str
    jurisdiction: str
    product_category: str
    publication_date: Optional[str]
    effective_date: Optional[str]
    version: str
    approval_status: str
    page_count: Optional[int]
    created_at: datetime
    updated_at: datetime


class IngestURLRequest(BaseModel):
    url: str
    title: str
    issuing_organization: str = ""
    jurisdiction: str = "IN"
    product_category: str = "GENERAL"


# ── Support Cases ─────────────────────────────────────────────────────────────

class CaseResponse(BaseModel):
    id: str
    conversation_id: Optional[str]
    intent: Optional[str]
    risk_level: Optional[str]
    reason_code: Optional[str]
    status: str
    priority: str
    assigned_staff_id: Optional[str]
    customer_question_redacted: Optional[str]
    resolution_summary: Optional[str]
    created_at: datetime
    updated_at: datetime


class UpdateCaseRequest(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    resolution_summary: Optional[str] = None


class AddNoteRequest(BaseModel):
    content: str = Field(min_length=1, max_length=5000)
    is_internal: bool = True


# ── Evaluation ────────────────────────────────────────────────────────────────

class RunEvaluationRequest(BaseModel):
    dataset_id: str


class EvaluationRunResponse(BaseModel):
    id: str
    dataset_id: str
    status: str
    total_cases: int
    completed_cases: int
    intent_accuracy: Optional[float]
    escalation_recall: Optional[float]
    abstention_accuracy: Optional[float]
    avg_latency_ms: Optional[float]
    error_rate: Optional[float]
    created_at: datetime


# ── Analytics ─────────────────────────────────────────────────────────────────

class AnalyticsOverview(BaseModel):
    total_queries: int
    answered_queries: int
    abstention_rate: float
    escalation_rate: float
    high_risk_queries: int
    avg_latency_ms: float
    total_documents: int
    published_documents: int
    pending_review: int
    open_cases: int
    failed_ingestion_jobs: int


# ── System ────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    version: str = "1.0.0"
    demo_mode: bool
    llm_provider: str
    vector_store_type: str
    database: str


class ErrorResponse(BaseModel):
    error: str
    error_code: Optional[str] = None
    detail: Optional[Any] = None


class PaginatedResponse(BaseModel):
    items: list[Any]
    total: int
    page: int
    page_size: int
    total_pages: int
