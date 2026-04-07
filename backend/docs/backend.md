# Backend and Infrastructure - BriefAI

## Architettura Ibrida

    +--------------------------------------------+
    | n8n Workflows (Orchestrazione)             |
    | - RSS Ingestion (ogni 15 min)              |
    | - AI Processing (batch dinamico)           |
    | - Feed Ranking (webhook)                   |
    | - Feedback Loop (webhook)                  |
    +---------------------+----------------------+
                          |
                          v
    +--------------------------------------------+
    | MongoDB Atlas                               |
    | Collections:                                |
    | - articles (articoli raw + processed)       |
    | - user_profiles (profilazione n8n)          |
    | - users (autenticazione backend)            |
    +---------------------+----------------------+
                          |
                          v
    +--------------------------------------------+
    | Express Backend (API REST)                 |
    | - Autenticazione JWT                       |
    | - Query articoli                           |
    | - Gestione profilo                         |
    | - Statistiche aggregate                    |
    +--------------------------------------------+

## Stack Tecnologico

| Componente | Tecnologia |
|------------|------------|
| Orchestrazione | n8n (self-hosted) |
| Backend API | Node.js + Express |
| Database | MongoDB Atlas |
| Autenticazione | JWT (24h expiry) |
| Password Hashing | bcryptjs |
| Sicurezza | Helmet + CORS |

## Endpoint API

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Registrazione utente | No |
| POST | /api/auth/login | Login con token JWT | No |
| GET | /api/auth/me | Info utente corrente | Si |
| GET | /api/articles | Lista articoli filtrati | Si |
| GET | /api/articles/:key | Singolo articolo | Si |
| GET | /api/profile | Profilo utente | Si |
| PUT | /api/profile | Aggiorna preferenze | Si |
| GET | /api/stats/sentiment | Distribuzione sentiment | Si |
| GET | /api/stats/categories | Articoli per categoria | Si |
| GET | /api/stats/trending | Top 10 trending topics | Si |
| GET | /api/stats/sources | Articoli per fonte | Si |
| GET | /api/stats/overview | Overview generale | Si |
| GET | /health | Health check | No |

## Sincronizzazione User e UserProfile

Quando un utente si registra tramite /api/auth/register, un post-save hook Mongoose crea o aggiorna automaticamente il documento in user_profiles con pesi di default.

Questo mantiene compatibilita con Workflow 3 e Workflow 4 in n8n senza modifiche.

## Sicurezza

- JWT con secret da variabile ambiente
- Password hashate con bcryptjs (10 salt rounds)
- CORS configurato per frontend specifico
- Helmet per header HTTP sicuri
- Input validation su route principali

## Limitazioni (Dev Environment)

- MongoDB Atlas free tier (512MB storage)
- Nessun rate limiting implementato
- JWT secret in file .env
- Logging semplificato con morgan
