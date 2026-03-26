import redis
import json
from dotenv import load_dotenv
import os

load_dotenv()

r = redis.Redis.from_url(os.getenv("REDIS_URL"), decode_responses=True)

def cache_digital_twin(article_id, data, ttl=3600):
    r.setex(f"dt:{article_id}", ttl, json.dumps(data))

def get_cached_digital_twin(article_id):
    data = r.get(f"dt:{article_id}")
    return json.loads(data) if data else None

def mark_batch_processed(batch_id):
    r.setex(f"batch:{batch_id}", 86400, "done")

def is_batch_processed(batch_id):
    return r.exists(f"batch:{batch_id}") == 1