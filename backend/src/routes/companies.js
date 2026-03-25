const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const auth = require('../middleware/auth');

function computeRelevance(feedbackHistory) {
  const preferences = {};
  for (const fb of feedbackHistory) {
    if (!fb.category) continue;
    const weight = fb.interested ? 1 : -0.5;
    preferences[fb.category] = (preferences[fb.category] || 0) + weight;
  }
  const maxVal = Math.max(...Object.values(preferences), 1);
  for (const k in preferences) {
    preferences[k] = Math.max(0, preferences[k] / maxVal);
  }
  return preferences;
}

router.get('/', auth, async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const { article_id, interested, category } = req.body;
    const company = await Company.findOne({ company_id: req.params.id });
    if (!company) return res.status(404).json({ error: 'Azienda non trovata.' });
    company.feedback_history.push({ article_id, interested, category });
    company.computed_relevance = computeRelevance(company.feedback_history);
    await company.save();
    res.json({ message: 'Feedback registrato.', computed_relevance: company.computed_relevance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ company_id: req.params.id });
    if (!company) return res.status(404).json({ error: 'Azienda non trovata.' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;