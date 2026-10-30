"""
BankAssist AI — Application Configuration
Uses pydantic-settings to load from environment / .env file.
"""
from __future__ import annotations

import secrets
from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ─────────────────────────────────────────────────────────────────
    APP_ENV: Literal["development", "production"] = "development"
    APP_SECRET_KEY: str = Field(default_factory=lambda: secrets.token_hex(32))
    APP_DEBUG: bool = False
    DEMO_MODE: bool = False
    PROJECT_NAME: str = "BankAssist AI"
    API_V1_PREFIX: str = "/api/v1"

    # ── Database ─────────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./bankassist.db"

    # ── Auth / JWT ───────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = Field(default_factory=lambda: secrets.token_hex(32))
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── LLM ──────────────────────────────────────────────────────────────────
    LLM_PROVIDER: Literal["gemini", "openai", "anthropic", "mock"] = "mock"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    LLM_TEMPERATURE: float = 0.1
    LLM_MAX_TOKENS: int = 2048
    LLM_TIMEOUT_SECONDS: int = 30
    LLM_MAX_RETRIES: int = 2

    # ── Embedding ─────────────────────────────────────────────────────────────
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    VECTOR_STORE_TYPE: Literal["faiss", "chroma"] = "faiss"
    VECTOR_STORE_PATH: str = "./data/vector_store"

    # ── RAG ───────────────────────────────────────────────────────────────────
    RETRIEVAL_TOP_K: int = 10
    RETRIEVAL_RERANK_TOP_K: int = 5
    RETRIEVAL_SIMILARITY_THRESHOLD: float = 0.25

    # ── Ingestion ─────────────────────────────────────────────────────────────
    MAX_UPLOAD_SIZE_MB: int = 20
    ALLOWED_UPLOAD_EXTENSIONS: str = ".pdf,.txt,.md,.html"
    MAX_PAGES_PER_DOCUMENT: int = 200
    CHUNK_SIZE_TOKENS: int = 600
    CHUNK_OVERLAP_TOKENS: int = 100

    # ── Security ──────────────────────────────────────────────────────────────
    CORS_ALLOWED_ORIGINS: str = "http://localhost:3000"
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 30
    MAX_REQUEST_SIZE_BYTES: int = 1_048_576

    # ── Seed data ────────────────────────────────────────────────────────────
    SEED_ADMIN_EMAIL: str = "admin@bankassist.local"
    SEED_ADMIN_PASSWORD: str = "AdminPass123!"
    SEED_AGENT_EMAIL: str = "agent@bankassist.local"
    SEED_AGENT_PASSWORD: str = "AgentPass123!"

    # ── Features ──────────────────────────────────────────────────────────────
    ENABLE_REGISTRATION: bool = True
    ENABLE_AUDIT_LOGS: bool = True

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.CORS_ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def allowed_extensions(self) -> list[str]:
        return [e.strip() for e in self.ALLOWED_UPLOAD_EXTENSIONS.split(",") if e.strip()]

    @property
    def vector_store_path(self) -> Path:
        return Path(self.VECTOR_STORE_PATH)

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
