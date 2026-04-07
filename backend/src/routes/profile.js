const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Profilo non trovato.',
      });
    }

    const weights = user.weights instanceof Map ? Object.fromEntries(user.weights) : user.weights || {};

    return res.json({
      success: true,
      profile: {
        userId: user.userId,
        email: user.email,
        username: user.username,
        categories: user.categories,
        keywords: user.keywords,
        weights,
        sentimentPreference: user.sentimentPreference,
        preferredSources: user.preferredSources,
        lastFeedGeneratedAt: user.lastFeedGeneratedAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { categories, keywords, sentimentPreference, preferredSources } = req.body;

    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utente non trovato.',
      });
    }

    if (categories) user.categories = categories;
    if (keywords) user.keywords = keywords;
    if (sentimentPreference) user.sentimentPreference = sentimentPreference;
    if (preferredSources) user.preferredSources = preferredSources;

    user.updatedAt = new Date();
    await user.save();

    const weights = user.weights instanceof Map ? Object.fromEntries(user.weights) : user.weights || {};

    return res.json({
      success: true,
      message: 'Profilo aggiornato con successo.',
      profile: {
        userId: user.userId,
        categories: user.categories,
        keywords: user.keywords,
        weights,
        sentimentPreference: user.sentimentPreference,
        preferredSources: user.preferredSources,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
