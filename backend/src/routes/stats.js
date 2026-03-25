const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');

router.get('/sentiment', auth, async (req, res) => {
  try {
    const result = await Article.aggregate([{ $group: { _id: '$sentiment', count: { $sum: 1 } } }]);
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/categories', auth, async (req, res) => {
  try {
    const result = await Article.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/trending', auth, async (req, res) => {
  try {
    const result = await Article.aggregate([
      { $unwind: '$trending_topics' },
      { $group: { _id: '$trending_topics', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/timeline', auth, async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const result = await Article.aggregate([
      { $match: { timestamp: { $gte: since } } },
      { $group: { _id: { $substr: ['$timestamp', 0, 13] }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;