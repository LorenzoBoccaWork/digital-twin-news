const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/stats', require('./routes/stats'));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connesso a MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Backend attivo su http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Errore connessione MongoDB:', err.message);
    process.exit(1);
  });