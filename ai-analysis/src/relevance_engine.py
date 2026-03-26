from db_connector import get_all_company_ids, get_company_relevance_profile

def compute_company_relevance(digital_twin, article_category):
    company_ids = get_all_company_ids()
    company_relevance = {}
    topics = digital_twin.get("trending_topics", [])
    if article_category:
        topics.append(article_category)

    for company_id in company_ids:
        profile = get_company_relevance_profile(company_id)
        if not profile:
            company_relevance[company_id] = 0.1
            continue

        score = sum(profile.get(topic, 0) for topic in topics)
        max_possible = len(topics) if topics else 1
        normalized_score = min(score / max_possible, 1.0)
        company_relevance[company_id] = round(normalized_score, 2)

    return company_relevance