const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const companyRoutes = require('./routes/companies');
const statsRoutes = require('./routes/stats');

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/stats', statsRoutes);

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
