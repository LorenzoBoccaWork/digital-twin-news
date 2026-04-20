# Backend BriefAI - Cose Mancanti e Come Sistemarle

Questo file riassume i punti che possono ancora bloccare il backend e i comandi per sistemarli.

## 1. MongoDB giusto

### Problema
Il backend non deve usare un Mongo qualsiasi, ma quello del progetto di Diego.

### Come sistemare
Apri il file `.env` e aggiorna `MONGO_URI` con la stringa corretta di Diego.

### Comando
```bash
cd /root/digital-twin-news/backend
nano .env
```

### Valore atteso
Esempio:
```env
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/briefai?retryWrites=true&w=majority
```

Se invece è un Mongo locale condiviso:
```env
MONGO_URI=mongodb://localhost:27017/briefai
```

---

## 2. MongoDB deve essere attivo

### Problema
Se Mongo non è acceso, `npm run dev` si ferma con errore di connessione.

### Come sistemare
Avvia il container Mongo oppure il servizio MongoDB usato dal progetto.

### Comandi
```bash
cd /root/digital-twin-news
docker compose up -d mongo
```

Verifica:
```bash
docker ps
```

Se vuoi fermarlo:
```bash
docker stop digital-twin-news_mongo_1
```

---

## 3. Dipendenze backend

### Problema
Se il backend non parte o mancano moduli, bisogna reinstallare le dipendenze.

### Come sistemare
Installa i pacchetti npm dentro la cartella backend.

### Comando
```bash
cd /root/digital-twin-news/backend
npm install
```

---

## 4. Avvio backend

### Problema
Il backend parte solo se `.env` e Mongo sono corretti.

### Come sistemare
Avvia il server in modalità sviluppo.

### Comando
```bash
cd /root/digital-twin-news/backend
npm run dev
```

### Controllo rapido
Se tutto va bene, devi vedere log simili a:
- connessione a MongoDB riuscita
- backend attivo su `http://localhost:5000`

---

## 5. Verifica endpoint

### Problema
Il backend può sembrare avviato ma non essere testato davvero.

### Come sistemare
Controlla l'endpoint di health.

### Comando
```bash
curl http://localhost:5000/health
```

Risposta attesa:
```json
{
  "status": "ok"
}
```

---

## 6. Porte occupate

### Problema
Se la porta 5000 è occupata, il backend non si avvia.

### Come sistemare
Trova il processo che usa la porta e chiudilo.

### Comandi
```bash
lsof -i :5000
kill -9 PID
```

Oppure cambia porta nel `.env`:
```env
PORT=5001
```

---

## 7. Controllo completo

### Sequenza consigliata
```bash
cd /root/digital-twin-news/backend
npm install
npm run dev
```

Se Mongo è locale via Docker:
```bash
cd /root/digital-twin-news
docker compose up -d mongo
cd /root/digital-twin-news/backend
npm run dev
```

Poi:
```bash
curl http://localhost:5000/health
```

---

## 8. Riassunto breve

Se il backend non parte, di solito manca uno di questi punti:
- `MONGO_URI` corretto nel file `.env`
- MongoDB acceso
- dipendenze installate con `npm install`
- porta 5000 libera

---

## 9. Nota importante

Al momento il backend è pensato per usare il Mongo configurato nel progetto, quindi se vuoi usare quello di Diego devi sostituire la `MONGO_URI` con la sua stringa reale.
