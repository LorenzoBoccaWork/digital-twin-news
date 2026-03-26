const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');

// ⚠️ PRIMA la route specifica, poi quella generica /:id
router.get('/relevant/:company_id', auth, async (req, res) => {
  try {
    const { company_id } = req.params;
    const articles = await Article.find({})
      .sort({ timestamp: -1 })
      .limit(200);

    const relevant = articles
      .filter(a => (a.company_relevance?.[company_id] || 0) > 0.5)
      .sort((a, b) => (b.company_relevance?.[company_id] || 0) - (a.company_relevance?.[company_id] || 0));

    res.json({ articles: relevant, total: relevant.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    const { category, sentiment, source, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (sentiment) filter.sentiment = sentiment;
    if (source) filter.source = source;
    const articles = await Article.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const total = await Article.countDocuments(filter);
    res.json({ articles, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findOne({ article_id: req.params.id });
    if (!article) return res.status(404).json({ error: 'Articolo non trovato.' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
