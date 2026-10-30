"""Seed the vector store with sample documents."""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "services" / "api"))

from app.db.seed_data import SAMPLE_DOCUMENTS
from app.ingestion.pipeline import chunk_text
from app.rag.embeddings import embed_texts
from app.rag.vector_store import get_vector_store
from app.core.config import settings


async def seed():
    print("BankAssist AI — Seeding vector store with sample documents...")
    store = get_vector_store()
    await store.load()

    for doc in SAMPLE_DOCUMENTS:
        print(f"  Ingesting: {doc['title'][:60]}...")
        chunks_raw = chunk_text(doc["text"], settings.CHUNK_SIZE_TOKENS, settings.CHUNK_OVERLAP_TOKENS)
        texts = [c["text"] for c in chunks_raw]
        embeddings = embed_texts(texts)

        chunks_meta = []
        for i, (chunk, emb) in enumerate(zip(chunks_raw, embeddings)):
            chunk_id = f"{doc['id']}-chunk-{i}"
            chunks_meta.append({
                "chunk_id": chunk_id,
                "document_id": doc["id"],
                "title": doc["title"],
                "source_url": doc.get("source_url", ""),
                "issuing_organization": doc["issuing_organization"],
                "jurisdiction": doc["jurisdiction"],
                "product_category": doc["product_category"],
                "effective_date": doc.get("effective_date", ""),
                "section_title": chunk.get("section_title", ""),
                "page_number": chunk.get("page_number"),
                "text": chunk["text"],
            })

        vecs = [embed_texts([c["text"]])[0] for c in chunks_raw]
        await store.add_chunks(chunks_meta, vecs)
        print(f"    [OK] {len(chunks_meta)} chunks added")

    print(f"\nSeeding complete! Total vectors in store: {store.total_vectors}")
    print("[NOTE] Note: These are DEMO documents, not real banking policies.")


if __name__ == "__main__":
    asyncio.run(seed())
