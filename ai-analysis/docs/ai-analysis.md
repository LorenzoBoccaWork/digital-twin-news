# AI & Analytics — Documentazione

## Stack tecnologico
- **Python 3.10** → linguaggio principale
- **Anthropic API (Claude Haiku)** → analisi LLM degli articoli
- **pymongo** → connessione MongoDB
- **Redis** → caching risultati AI
- **NLTK** → fallback NLP locale

## Pipeline AI

1. Recupero articoli non processati da MongoDB (batch di 10)
2. Invio al LLM con prompt standardizzato
3. Parsing risposta JSON strutturata
4. Calcolo rilevanza aziendale (weighted scoring)
5. Aggiornamento MongoDB con Digital Twin completo
6. Cache Redis per accesso rapido

## Prompt LLM
- Input: titolo + contenuto (max 1000 caratteri)
- Output: JSON con summary, sentiment, entities, trending_topics
- Batch: 10 articoli per ciclo, pausa 0.5s tra chiamate

## Fallback locale
Se l'API LLM non risponde:
- **Sentiment**: keyword matching locale
- **Summary**: prime 50 parole del contenuto
- **Topics**: categoria dell'articolo

## Algoritmo di rilevanza aziendale
- 👍 Pollice su: +1 al peso della categoria
- 👎 Pollice giù: -0.5 al peso della categoria
- I pesi vengono normalizzati tra 0 e 1
- Articoli con score > 0.5 appaiono nel feed "Solo Rilevanti"

## KPI misurati
- Copertura analisi: % articoli processati
- Distribuzione sentiment: Positive/Neutral/Negative
- Top 10 trending topics
- Top 10 entità estratte

## Limitazioni documentate
- Sistema batch-based (non real-time puro)
- Free tier API LLM: utilizzo fallback locale
- Due scheduler indipendenti (15 min pipeline, 20 min AI)