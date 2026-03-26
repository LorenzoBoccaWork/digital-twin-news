import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

with open("config/prompt_template.txt", "r", encoding="utf-8") as f:
    PROMPT_TEMPLATE = f.read()

def analyze_article(article):
    prompt = PROMPT_TEMPLATE.replace("{title}", article.get("title", ""))
    prompt = prompt.replace("{content}", article.get("content", "")[:1000])

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )
        response_text = message.content[0].text.strip()

        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]

        result = json.loads(response_text)
        assert "content_summary" in result
        assert result["sentiment"] in ["Positive", "Neutral", "Negative"]
        assert isinstance(result["entities"], list)
        assert isinstance(result["trending_topics"], list)
        return result

    except Exception as e:
        print(f"  ⚠️  LLM fallback: {e}")
        return fallback_analysis(article)

def fallback_analysis(article):
    title = article.get("title", "").lower()
    content = article.get("content", "").lower()
    text = title + " " + content

    positive_words = ["crescita", "successo", "innovazione", "record", "growth"]
    negative_words = ["crisi", "crollo", "perdita", "rischio", "fallimento"]

    pos = sum(1 for w in positive_words if w in text)
    neg = sum(1 for w in negative_words if w in text)

    sentiment = "Positive" if pos > neg else "Negative" if neg > pos else "Neutral"
    words = article.get("content", "").split()
    summary = " ".join(words[:50]) + ("..." if len(words) > 50 else "")

    return {
        "content_summary": summary or article.get("title", ""),
        "sentiment": sentiment,
        "entities": [],
        "trending_topics": [article.get("category", "Generale")]
    }