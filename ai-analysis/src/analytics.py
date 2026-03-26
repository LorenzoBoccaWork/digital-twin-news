from db_connector import articles_collection
from collections import Counter
import json
from datetime import datetime

def generate_kpi_report():
    total = articles_collection.count_documents({})
    processed = articles_collection.count_documents({"sentiment": {"$ne": None}})
    coverage = round((processed / total * 100), 1) if total > 0 else 0

    # Distribuzione sentiment
    pipeline = [{"$group": {"_id": "$sentiment", "count": {"$sum": 1}}}]
    sentiment_dist = {r["_id"]: r["count"] for r in articles_collection.aggregate(pipeline)}

    # Top 10 trending topics
    all_topics = []
    for article in articles_collection.find({"trending_topics": {"$ne": []}}, {"trending_topics": 1}):
        all_topics.extend(article.get("trending_topics", []))
    top_topics = Counter(all_topics).most_common(10)

    # Top 10 entità
    all_entities = []
    for article in articles_collection.find({"entities": {"$ne": []}}, {"entities": 1}):
        all_entities.extend(article.get("entities", []))
    top_entities = Counter(all_entities).most_common(10)

    report = {
        "generated_at": datetime.now().isoformat(),
        "kpi": {
            "total_articles": total,
            "processed_articles": processed,
            "coverage_percentage": coverage,
        },
        "sentiment_distribution": sentiment_dist,
        "top_trending_topics": top_topics,
        "top_entities": top_entities
    }

    with open("output/kpi_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\n📊 KPI Report generato:")
    print(f"   Articoli totali: {total}")
    print(f"   Articoli analizzati: {processed} ({coverage}%)")
    print(f"   Sentiment: {sentiment_dist}")
    print(f"   Top topic: {top_topics[:5]}")

    return report

if __name__ == "__main__":
    generate_kpi_report()