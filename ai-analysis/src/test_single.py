from llm_client import analyze_article
import json

test_article = {
    "article_id": "test_001",
    "title": "L'intelligenza artificiale trasforma il settore bancario",
    "content": "Le banche italiane stanno adottando soluzioni di AI per migliorare la customer experience. Startup come FinAI stanno guidando questa rivoluzione nel fintech europeo.",
    "category": "Tecnologia",
    "source": "Test"
}

result = analyze_article(test_article)
print(json.dumps(result, indent=2, ensure_ascii=False))