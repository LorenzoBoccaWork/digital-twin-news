# Data Pipeline — Documentazione

## Fonti dati utilizzate
- TechCrunch RSS
- Ansa RSS
- The Verge RSS
- BBC Business RSS

## Architettura pipeline
Raccolta RSS -> Deduplicazione Redis -> Cache Redis -> Salvataggio MongoDB

## Schema articolo normalizzato
- article_id: identificatore univoco (base64 del link)
- title: titolo dell'articolo
- content: testo breve
- link: URL originale
- source: nome della fonte
- category: categoria (Tecnologia, Economia, Generale)
- timestamp: data e ora di pubblicazione
- sentiment: null (riempito dal Layer AI)
- entities: [] (riempito dal Layer AI)
- trending_topics: [] (riempito dal Layer AI)
- company_relevance: {} (riempito dal Backend)

## Frequenza aggiornamento
Ogni 15 minuti via node-cron

## Gestione errori
- Errore su singola fonte: gli altri feed continuano normalmente
- Fallback su Redis se tutte le fonti falliscono
- Deduplicazione tramite Redis con TTL 24h

## KPI
- 4 fonti RSS monitorate
- Deduplicazione in memoria RAM (Redis) per massima velocita
- Salvataggio con upsert: nessun duplicato in MongoDB
