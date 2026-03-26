# Backend & Infrastructure — Documentazione

## Stack tecnologico
- Node.js + Express → API REST
- MongoDB → storage articoli e Digital Twin
- Redis → deduplicazione articoli
- JWT → autenticazione stateless
- Docker → containerizzazione

## Endpoint API

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | /api/auth/register | Registrazione utente |
| POST | /api/auth/login | Login e token JWT |
| GET | /api/articles | Lista articoli con filtri |
| GET | /api/articles/:id | Singolo articolo |
| GET | /api/articles/relevant/:company_id | Articoli rilevanti per azienda |
| GET | /api/companies | Lista aziende |
| POST | /api/companies | Crea azienda |
| GET | /api/companies/:id | Dettaglio azienda |
| POST | /api/companies/:id/feedback | Feedback utente |
| GET | /api/stats/sentiment | Distribuzione sentiment |
| GET | /api/stats/categories | Articoli per categoria |
| GET | /api/stats/trending | Topic trending |
| GET | /api/stats/timeline | Timeline ultime 24h |
| GET | /health | Health check |

## Algoritmo weighted interest
- Pollice su → +1 sulla categoria
- Pollice giù → -0.5 sulla categoria
- Normalizzazione: ogni valore diviso per il massimo
- Valori negativi azzerati a 0

## Sicurezza
- JWT con scadenza 24h
- Helmet per header HTTP sicuri
- CORS configurato per frontend React
- Password hashate con bcrypt

## Avvio del progetto
docker compose up -d
npm run dev
