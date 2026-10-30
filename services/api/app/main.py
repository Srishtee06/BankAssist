"""
BankAssist AI — FastAPI Application Entry Point
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.auth import router as auth_router
from app.api.v1.chat import router as chat_router
from app.api.v1.documents import router as docs_router
from app.api.v1.system import (
    analytics_router,
    cases_router,
    router as system_router,
    users_router,
)
from app.core.config import settings
from app.db.database import create_all_tables

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger("bankassist")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    logger.info(f"Starting BankAssist AI — env={settings.APP_ENV} demo_mode={settings.DEMO_MODE}")

    # Create DB tables (dev convenience; use Alembic in production)
    await create_all_tables()

    # Seed admin user if not present
    await _seed_users()

    # Pre-load vector store
    from app.rag.vector_store import get_vector_store
    store = get_vector_store()
    await store.load()
    logger.info(f"Vector store ready — {store.total_vectors} vectors")

    yield

    logger.info("BankAssist AI shutting down")


async def _seed_users():
    """Create default admin and agent users if they don't exist."""
    from sqlalchemy import select
    from app.db.database import AsyncSessionLocal
    from app.models.models import User
    from app.security.auth import hash_password

    async with AsyncSessionLocal() as db:
        for email, password, role, name in [
            (settings.SEED_ADMIN_EMAIL, settings.SEED_ADMIN_PASSWORD, "ADMIN", "Admin User"),
            (settings.SEED_AGENT_EMAIL, settings.SEED_AGENT_PASSWORD, "SUPPORT_AGENT", "Support Agent"),
        ]:
            result = await db.execute(select(User).where(User.email == email))
            if not result.scalar_one_or_none():
                user = User(
                    email=email,
                    hashed_password=hash_password(password),
                    full_name=name,
                    role=role,
                    is_active=True,
                    is_verified=True,
                )
                db.add(user)
        await db.commit()
        logger.info("Seed users verified")


app = FastAPI(
    title="BankAssist AI API",
    description="Banking information assistant — retrieval-augmented, source-grounded, safety-first.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
PREFIX = settings.API_V1_PREFIX

app.include_router(auth_router, prefix=PREFIX)
app.include_router(chat_router, prefix=PREFIX)
app.include_router(docs_router, prefix=PREFIX)
app.include_router(system_router)
app.include_router(analytics_router, prefix=PREFIX)
app.include_router(cases_router, prefix=PREFIX)
app.include_router(users_router, prefix=PREFIX)

# ── Global error handling ─────────────────────────────────────────────────────

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {type(exc).__name__}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "An internal error occurred. Please try again.", "error_code": "INTERNAL_ERROR"},
    )


@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/health/ready",
        "demo_mode": settings.DEMO_MODE,
    }
