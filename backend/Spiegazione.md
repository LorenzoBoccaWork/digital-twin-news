# Documento di Realizzazione Backend — BriefAI

---

## 1. INTRODUZIONE

### 1.1 Scopo del Backend

Il backend BriefAI fornisce un'API REST per:
- Autenticazione utenti tramite JWT
- Query articoli con filtri avanzati
- Gestione profilo utente
- Statistiche aggregate

Il backend si integra con i workflow n8n esistenti, condividendo il database MongoDB Atlas.

---

## 2. ARCHITETTURA

### 2.1 Componenti del Sistema

Il sistema è composto da tre livelli principali:

**n8n Workflows:**
- Raccolta automatica articoli (ogni 15 minuti)
- Elaborazione AI (batch processing)
- Ranking personalizzato
- Sistema di feedback

**Express Backend:**
- Autenticazione JWT
- API query articoli
- Gestione profili
- Statistiche

**MongoDB Atlas:**
- Storage condiviso
- Collections: users, user_profiles, articles

### 2.2 Integrazione

Il backend e n8n lavorano in parallelo:
- n8n raccoglie ed elabora articoli
- Backend gestisce autenticazione e query
- MongoDB sincronizza i dati tra i due sistemi

Quando un utente si registra via backend, un meccanismo automatico crea il profilo anche per n8n.

---

## 3. TECNOLOGIE UTILIZZATE

### 3.1 Stack Tecnologico

- Node.js 18.x
- Express 4.18
- MongoDB Atlas con Mongoose 7.x
- JWT per autenticazione
- bcryptjs per password hashing
- Helmet e CORS per sicurezza
- Morgan per logging

### 3.2 Dipendenze Principali

```
express, mongoose, dotenv, jsonwebtoken, bcryptjs, 
cors, helmet, morgan, nodemon
```

---

## 4. STRUTTURA DATABASE

### 4.1 Collection Users

Gestisce l'autenticazione degli utenti:

**Campi principali:**
- userId (univoco, generato automaticamente)
- email (univoco)
- password (hash bcrypt)
- username
- role (user o admin)
- Preferenze sincronizzate con user_profiles

**Sicurezza:**
- Password hashate con bcrypt (10 salt rounds)
- Token JWT con scadenza 24 ore

### 4.2 Collection UserProfiles

Utilizzata dai workflow n8n per il ranking:

**Campi:**
- userId
- categories (array categorie preferite)
- keywords (array parole chiave)
- weights (pesi dinamici per categoria)
- sentimentPreference
- preferredSources

**Sincronizzazione:**
Quando si crea un utente in users, viene automaticamente creato il profilo in user_profiles.

### 4.3 Collection Articles

Contiene gli articoli raccolti ed elaborati:

**Campi base:**
- uniqueKey (deduplicazione)
- title, url, pubDate, source, category, content

**Campi AI:**
- summary (max 50 parole)
- sentiment (Positive/Neutral/Negative)
- entities (array)
- trendingTopics (array)

**Metadata:**
- status (raw o processed)
- aiProcessed (boolean)
- processedAt (timestamp)

---

## 5. API ENDPOINTS

### 5.1 Autenticazione

**POST /api/auth/register**
- Registra nuovo utente
- Crea automaticamente user_profile
- Non richiede autenticazione

**POST /api/auth/login**
- Autentica utente
- Restituisce token JWT valido 24 ore
- Non richiede autenticazione

**GET /api/auth/me**
- Restituisce dati utente corrente
- Richiede token JWT

### 5.2 Articoli

**GET /api/articles**
- Lista articoli con paginazione
- Filtri disponibili: category, sentiment, source, search
- Parametri: limit (default 50), page
- Richiede token JWT

**GET /api/articles/:uniqueKey**
- Dettagli singolo articolo
- Richiede token JWT

### 5.3 Profilo

**GET /api/profile**
- Restituisce profilo utente corrente
- Include preferenze e pesi
- Richiede token JWT

**PUT /api/profile**
- Aggiorna preferenze utente
- Campi modificabili: categories, keywords, sentimentPreference
- Richiede token JWT

### 5.4 Statistiche

**GET /api/stats/sentiment**
- Distribuzione articoli per sentiment
- Aggregazione MongoDB
- Richiede token JWT

**GET /api/stats/categories**
- Distribuzione articoli per categoria
- Ordinata per frequenza
- Richiede token JWT

**GET /api/stats/trending**
- Top 10 trending topics
- Basato su trendingTopics degli articoli
- Richiede token JWT

**GET /api/stats/sources**
- Distribuzione articoli per fonte
- Richiede token JWT

**GET /api/stats/overview**
- Statistiche generali sistema
- Total, processed, raw, recent articles
- Richiede token JWT

### 5.5 Health Check

**GET /health**
- Verifica stato server
- Non richiede autenticazione

**Totale endpoint:** 13

---

## 6. SICUREZZA

### 6.1 Autenticazione JWT

Ogni richiesta protetta richiede header:
```
Authorization: Bearer <token>
```

Il middleware verifica:
- Presenza del token
- Validità firma
- Scadenza (24 ore)

Token payload contiene: userId, email, role

### 6.2 Password Security

- Algoritmo: bcrypt
- Salt rounds: 10
- Hash automatico prima del salvataggio
- Verifica sicura al login

### 6.3 HTTP Security

**Helmet middleware** protegge da:
- XSS attacks
- Clickjacking
- MIME sniffing

**CORS configurato per:**
- Origin: localhost:3000 (sviluppo)
- Credentials: abilitato
- Configurabile per produzione

---

## 7. CONFIGURAZIONE

### 7.1 Variabili Ambiente

File .env richiesto:

```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/briefai
JWT_SECRET=stringa_segreta_forte_random
NODE_ENV=development
```

### 7.2 Comandi Disponibili

```bash
npm start     # Avvio produzione
npm run dev   # Avvio sviluppo con auto-reload
```

---

## 8. TESTING

### 8.1 Test Effettuati

Tutti i test eseguiti manualmente con cURL:

**Test autenticazione:**
- Registrazione nuovo utente
- Login con credenziali
- Verifica token JWT
- Accesso endpoint protetti

**Test query:**
- Lista articoli senza filtri
- Lista articoli con filtri multipli
- Query singolo articolo
- Paginazione

**Test statistiche:**
- Sentiment distribution
- Categories count
- Trending topics
- Overview generale

**Test sincronizzazione:**
- Verifica creazione user_profiles automatica
- Allineamento dati tra collections

### 8.2 Risultati

Tutti i test hanno dato esito positivo:
- 100% endpoint funzionanti
- Latenza media sotto 100ms
- Nessun errore durante esecuzione normale
- Sincronizzazione verificata manualmente in MongoDB

---

## 10. INTEGRAZIONE N8N

### 10.1 Flusso Dati

**Workflow n8n operano autonomamente:**
- Workflow 1: scrive articoli in status raw
- Workflow 2: aggiorna articoli a status processed
- Workflow 3: legge user_profiles per ranking
- Workflow 4: aggiorna weights in user_profiles

**Backend fornisce:**
- Autenticazione per frontend
- Query articoli elaborati
- Gestione profili utente
- Statistiche aggregate

### 10.2 Sincronizzazione Automatica

Quando un utente si registra via backend:

1. Viene creato documento in collection users
2. Un hook Mongoose si attiva automaticamente
3. Viene creato documento in user_profiles con:
   - Stesso userId
   - Pesi default (tech: 1.0, news: 1.0, etc)
   - Categories default
4. Workflow n8n trovano immediatamente il profilo

Questo permette a n8n di funzionare senza modifiche.

---

## 11. DEPLOYMENT

### 11.1 Ambiente Sviluppo

```bash
cd backend
npm install
npm run dev
```

Output atteso:
```
Connesso a MongoDB Atlas
Backend BriefAI attivo su http://localhost:5000
```

### 11.2 Ambiente Produzione

Piattaforme consigliate:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

Configurazione necessaria:
- MongoDB Atlas tier produzione (M2+)
- Variabili ambiente via platform
- CORS configurato con dominio reale
- NODE_ENV=production
- SSL/TLS certificato

### 11.3 Checklist Deploy

- MongoDB cluster produzione configurato
- JWT_SECRET rigenerato (string random 64 caratteri)
- CORS origin aggiornato
- Logs configurati
- Health check monitorato
- Backup database automatico

---

Avvio backend:
```bash
npm run dev
```

Test registrazione:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"user","password":"pass"}'
```

Test login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'
```

### Riferimenti

- Express.js Documentation
- Mongoose ODM
- JWT Best Practices
- MongoDB Atlas

---

**Autori:** Galluzzo Matteo, Salvafiorita Nicolò
**Data:** Aprile 2026
**Versione:** 1.0