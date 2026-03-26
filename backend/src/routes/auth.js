const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    const { username, password, company_id } = req.body;
    const user = new User({ username, password, company_id });
    await user.save();
    res.status(201).json({ message: 'Utente registrato con successo.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Utente non trovato.' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Password errata.' });
    const token = jwt.sign(
      { userId: user._id, company_id: user.company_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, company_id: user.company_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
