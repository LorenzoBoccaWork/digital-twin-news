const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    categories: { type: [String], default: ['general'] },
    keywords: { type: [String], default: [] },
    weights: {
      type: Object,
      default: {
        tech: 1.0,
        news: 1.0,
        social: 1.0,
        'news-it': 1.0,
        general: 1.0,
      },
    },
    sentimentPreference: { type: String, default: 'all' },
    preferredSources: { type: [String], default: [] },
    lastFeedGeneratedAt: Date,
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'user_profiles', timestamps: false }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
