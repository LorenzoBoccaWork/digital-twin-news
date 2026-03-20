from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["digital_twin"]
articles_collection = db["articles"]

def get_unprocessed_articles(batch_size=10):
    return list(
        articles_collection.find(
            {"sentiment": None},
            {"_id": 0}
        ).limit(batch_size)
    )

def update_article_digital_twin(article_id, digital_twin_data):
    articles_collection.update_one(
        {"article_id": article_id},
        {"$set": {
            "content_summary": digital_twin_data.get("content_summary"),
            "sentiment": digital_twin_data.get("sentiment"),
            "entities": digital_twin_data.get("entities", []),
            "trending_topics": digital_twin_data.get("trending_topics", []),
            "company_relevance": digital_twin_data.get("company_relevance", {})
        }}
    )

def get_all_company_ids():
    companies_collection = db["companies"]
    return [c["company_id"] for c in companies_collection.find({}, {"company_id": 1})]

def get_company_relevance_profile(company_id):
    companies_collection = db["companies"]
    company = companies_collection.find_one({"company_id": company_id})
    return company.get("computed_relevance", {}) if company else {}