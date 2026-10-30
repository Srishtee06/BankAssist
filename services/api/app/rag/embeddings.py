"""
Embedding service — wraps sentence-transformers for local embeddings.
All external calls are isolated here so the provider can be swapped.
"""
from __future__ import annotations

import asyncio
import logging
import time
from functools import lru_cache
from pathlib import Path
from typing import Optional

import numpy as np

from app.core.config import settings

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    """Lazy-load the embedding model (singleton)."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
            _model = SentenceTransformer(settings.EMBEDDING_MODEL)
            logger.info("Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise
    return _model


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed a list of texts. Returns list of float vectors."""
    model = _get_model()
    embeddings = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    return embeddings.tolist()


def embed_query(query: str) -> list[float]:
    """Embed a single query string."""
    return embed_texts([query])[0]


async def async_embed_texts(texts: list[str]) -> list[list[float]]:
    """Async wrapper around embed_texts for use in async FastAPI handlers."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, embed_texts, texts)


async def async_embed_query(query: str) -> list[float]:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, embed_query, query)
