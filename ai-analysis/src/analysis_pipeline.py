import time
import hashlib
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

from db_connector import get_unprocessed_articles, update_article_digital_twin
from cache_manager import cache_digital_twin, get_cached_digital_twin, mark_batch_processed, is_batch_processed
from llm_client import analyze_article
from relevance_engine import compute_company_relevance

BATCH_SIZE = int(os.getenv("BATCH_SIZE", 10))

def generate_batch_id(articles):
    ids = "".join([a["article_id"] for a in articles])
    return hashlib.md5(ids.encode()).hexdigest()[:12]

def process_batch(articles):
    batch_id = generate_batch_id(articles)
    if is_batch_processed(batch_id):
        print(f"  ⏭️  Batch {batch_id} già processato, skip.")
        return 0

    processed = 0
    for i, article in enumerate(articles):
        article_id = article["article_id"]
        print(f"  [{i+1}/{len(articles)}] {article.get('title', '')[:60]}...")

        cached = get_cached_digital_twin(article_id)
        if cached:
            update_article_digital_twin(article_id, cached)
            processed += 1
            continue

        digital_twin_data = analyze_article(article)
        digital_twin_data["company_relevance"] = compute_company_relevance(
            digital_twin_data, article.get("category", "")
        )

        cache_digital_twin(article_id, digital_twin_data)
        update_article_digital_twin(article_id, digital_twin_data)
        processed += 1
        time.sleep(0.5)

    mark_batch_processed(batch_id)
    return processed

def run_analysis_pipeline():
    print(f"\n[{datetime.now().isoformat()}] Avvio analisi AI...")
    articles = get_unprocessed_articles(BATCH_SIZE)

    if not articles:
        print("  ℹ️  Nessun articolo da analizzare.")
        return

    total = process_batch(articles)
    print(f"✅ Pipeline completata: {total} articoli trasformati in Digital Twin")

if __name__ == "__main__":
    run_analysis_pipeline()