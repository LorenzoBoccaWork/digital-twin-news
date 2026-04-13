# Backend BriefAI - Quick Start

## Cosa è stato fatto

### Architettura Completata
- **Framework**: Express.js + Mongoose
- **Autenticazione**: JWT (token 24h)
- **Database**: MongoDB (Atlas o locale)
- **Modelli**: `User`, `UserProfile`, `Article`
- **Middleware**: Autenticazione, logging (Morgan), security (Helmet, CORS)

### Componenti Implementati

#### 1. Modelli (`src/models/`)
- **User.js**: Schema utente con hash password e sync con `user_profiles`
- **UserProfile.js**: Profilo compatibile workflow n8n in collection `user_profiles`
- **Article.js**: Schema articoli con enrichment AI e metadata

#### 2. Route (`src/routes/`)
- **auth.js**: `/api/auth/register`, `/api/auth/login`
- **profile.js**: `/api/profile` (get/update profilo utente)
- **articles.js**: `/api/articles` (CRUD articoli)
- **stats.js**: `/api/stats` (statistiche aggregazione)

#### 3. Middleware (`src/middleware/`)
- **auth.js**: Verifica JWT e protegge route private

#### 4. Server (`src/server.js`)
- Express bootstrap, connessione MongoDB, wiring route, error handler

### Integrazioni
- n8n: compatibilità collection `user_profiles` per workflow 3/4
- MongoDB: sync automatica `User -> user_profiles` via hook post-save

### Bugfix Applicati
- Hook Mongoose `pre('save')` corretto da pattern errato (`next` in async) a ritorno asincrono

---

## Come Farla Partire

### 1. Prerequisiti
- Node.js >= 14 installato
- MongoDB disponibile (Atlas o locale via docker-compose)
- Variabili d'ambiente configurate

### 2. Setup Ambiente

```bash
# Copia il template .env
cp .env.example .env

# Configura il .env
# MONGO_URI=mongodb://localhost:27017/digital_twin  (locale)
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/database  (Atlas)
# JWT_SECRET=tuaChiaveSegreta
# PORT=3000
# NODE_ENV=development
```

### 3. Installare Dipendenze

```bash
npm install
```

### 4. Avviare il Backend

**Sviluppo (con reload automatico):**
```bash
npm run dev
```

**Produzione:**
```bash
npm start
```

Server avvierà su `http://localhost:3000` (o porta configurata).

### 5. Verificare Che Funzioni

```bash
# Health check
curl http://localhost:3000/health

# Registrazione utente
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Profilo (con token dal login)
curl -H "Authorization: Bearer TOKEN_QUI" http://localhost:3000/api/profile
```

---

## MongoDB su Docker

Se usi docker-compose locale:

```bash
# Avvia Mongo e altri servizi
docker-compose up -d

# Verifica se è running
docker ps | grep mongo
```

Connection string locale: `mongodb://localhost:27017/digital_twin`

---

## Struttura Cartelle Backend

```
backend/
├── src/
│   ├── server.js              # Entry point Express
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── UserProfile.js
│   │   └── Article.js
│   └── routes/
│       ├── auth.js
│       ├── profile.js
│       ├── articles.js
│       └── stats.js
├── package.json
├── .env
├── .env.example
└── docs/
    └── backend.md             # Documentazione dettagliata
```

---

## Importanti Note

1. **JWT Token**: Valido 24 ore. Rinnovalo in payload se necessario.
2. **CORS**: Configurato per localhost:3000. Adatta in produzione.
3. **Helmet**: Attivo per security headers.
4. **Morgan**: Log HTTP attivi in console.
5. **N8N Integration**: Assicurati che `user_profiles` sia sincronizzata prima di usarla in workflow.

---

## Troubleshooting

### Errore: "Cannot connect to MongoDB"
- Verifica che MongoDB sia avviato (`docker ps`)
- Controlla la stringa MONGO_URI in `.env`
- Se usi Atlas, assicurati IP whitelist sia aperto

### Errore: "JWT Secret not found"
- Configura JWT_SECRET in `.env`
- Riavvia il server

### Errore: "Port already in use"
- Cambia PORT in `.env` (es. 3001)
- O uccidi il processo: `lsof -ti:3000 | xargs kill -9`

---

## Test Completo

Usa il file `backend/docs/backend.md` per tutti i dettagli su:
- Endpoint API completi
- Schema Mongoose
- Error handling
- Security best practices
- Limiti e considerazioni