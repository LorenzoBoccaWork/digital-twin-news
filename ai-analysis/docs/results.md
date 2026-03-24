# Risultati e KPI — Digital Twin News

## KPI misurati

### Copertura news
- Fonti monitorate: 4 feed RSS pubblici
- Frequenza raccolta: ogni 15 minuti
- Articoli raccolti in 24h: ~200-400 (dipende dalle fonti)

### Accuratezza AI
- Sentiment analizzato: Positive / Neutral / Negative
- Fallback locale attivo se API non risponde
- Batch size: 10 articoli per chiamata

### Performance backend
- Endpoint principali: < 200ms di risposta
- Autenticazione JWT: token valido 24h
- Filtri: categoria, sentiment, fonte, rilevanza aziendale

### Profilazione aziendale
- Algoritmo: weighted interest (feedback +1 / -0.5)
- Aggiornamento: in tempo reale ad ogni feedback
- Multi-azienda: supporto profili multipli

## Screenshot da allegare
1. Dashboard con grafici sentiment e trending
2. Griglia articoli con chip sentiment
3. Feedback utente (thumbs up/down)
4. Filtro "Solo rilevanti" attivo
5. Terminal con pipeline in esecuzione
6. MongoDB con articoli Digital Twin

## Limitazioni documentate
- Sistema batch-based e non real-time puro
- Free tier LLM: utilizzo fallback locale
- Due scheduler indipendenti non sincronizzati
- Testing automatizzato non implementato (fuori scope MVP)