"""
Document ingestion pipeline:
  File upload / URL → parse → chunk → embed → store → index
"""
from __future__ import annotations

import hashlib
import logging
import re
import time
from pathlib import Path
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Text extraction ────────────────────────────────────────────────────────────

def extract_text_from_file(file_path: Path, source_type: str) -> tuple[str, int]:
    """
    Extract plain text from a file.
    Returns (text, page_count).
    """
    suffix = source_type.lower()

    if suffix in ("pdf",):
        return _extract_pdf(file_path)
    elif suffix in ("txt", "md"):
        text = file_path.read_text(encoding="utf-8", errors="replace")
        return text, 1
    elif suffix in ("html",):
        return _extract_html(file_path)
    else:
        raise ValueError(f"Unsupported source type: {source_type}")


def _extract_pdf(path: Path) -> tuple[str, int]:
    try:
        import PyPDF2  # type: ignore
        pages = []
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            count = len(reader.pages)
            if count > settings.MAX_PAGES_PER_DOCUMENT:
                raise ValueError(f"PDF has {count} pages, exceeding limit of {settings.MAX_PAGES_PER_DOCUMENT}")
            for page in reader.pages:
                text = page.extract_text() or ""
                pages.append(text)
        return "\n\n".join(pages), count
    except ImportError:
        raise RuntimeError("PyPDF2 is not installed. Run: pip install pypdf2")


def _extract_html(path: Path) -> tuple[str, int]:
    try:
        from bs4 import BeautifulSoup  # type: ignore
        html = path.read_text(encoding="utf-8", errors="replace")
        soup = BeautifulSoup(html, "lxml")
        # Remove script and style
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()
        text = soup.get_text(separator="\n")
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text, 1
    except ImportError:
        raise RuntimeError("beautifulsoup4/lxml is not installed")


def compute_content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


# ── Chunking ───────────────────────────────────────────────────────────────────

def chunk_text(
    text: str,
    chunk_size: int = 600,
    overlap: int = 100,
) -> list[dict]:
    """
    Split text into overlapping chunks by token-approximate size.
    Uses word-based approximation (1 token ≈ 0.75 words).
    Returns list of dicts with: text, chunk_index, section_title, page_number.
    """
    # Detect headings for section association
    heading_pattern = re.compile(r"^#{1,4}\s+.+|^[A-Z][A-Za-z\s]{5,50}:?\s*$", re.MULTILINE)

    # Split into paragraphs
    paragraphs = re.split(r"\n{2,}", text.strip())
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    chunks: list[dict] = []
    current_words: list[str] = []
    current_section = ""
    chunk_index = 0
    word_limit = int(chunk_size * 0.75)  # approx words per chunk
    overlap_words = int(overlap * 0.75)

    for para in paragraphs:
        # Detect section heading
        if heading_pattern.match(para) and len(para) < 200:
            current_section = para.strip("#").strip()

        words = para.split()
        current_words.extend(words)

        while len(current_words) >= word_limit:
            chunk_words = current_words[:word_limit]
            chunks.append({
                "chunk_index": chunk_index,
                "text": " ".join(chunk_words),
                "section_title": current_section,
                "page_number": None,
                "token_count": len(chunk_words),
            })
            chunk_index += 1
            current_words = current_words[word_limit - overlap_words:]

    # Remaining words
    if current_words:
        chunks.append({
            "chunk_index": chunk_index,
            "text": " ".join(current_words),
            "section_title": current_section,
            "page_number": None,
            "token_count": len(current_words),
        })

    if not chunks:
        # Fallback: single chunk
        chunks = [{"chunk_index": 0, "text": text[:4000], "section_title": "", "page_number": None, "token_count": len(text.split())}]

    logger.info(f"Created {len(chunks)} chunks from document")
    return chunks


# ── SSRF protection ────────────────────────────────────────────────────────────

_BLOCKED_RANGES = [
    "127.", "10.", "192.168.", "172.16.", "172.17.", "172.18.", "172.19.",
    "172.20.", "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", "172.26.",
    "172.27.", "172.28.", "172.29.", "172.30.", "172.31.",
    "169.254.", "::1", "fc00::", "fd", "fe80::",
    "metadata.google", "169.254.169.254", "100.100.100.200",
]

_APPROVED_DOMAINS = [
    "rbi.org.in", "rbikehtahai.rbi.org.in", "npci.org.in",
    "bankassist.local", "localhost",
]


def validate_url_for_ingestion(url: str) -> None:
    """
    SSRF protection: validate that a URL is safe to fetch for document ingestion.
    Raises ValueError for unsafe URLs.
    """
    import urllib.parse
    parsed = urllib.parse.urlparse(url)

    if parsed.scheme not in ("http", "https"):
        raise ValueError(f"Only HTTP/HTTPS URLs are allowed. Got scheme: {parsed.scheme}")

    host = parsed.hostname or ""
    if not host:
        raise ValueError("URL has no hostname")

    for blocked in _BLOCKED_RANGES:
        if host.startswith(blocked) or host == blocked.rstrip("."):
            raise ValueError(f"URL resolves to a blocked private/internal address: {host}")

    # In non-dev environments, restrict to approved domains
    if settings.is_production:
        if not any(host.endswith(domain) for domain in _APPROVED_DOMAINS):
            raise ValueError(f"Domain '{host}' is not in the approved ingestion domain list")
