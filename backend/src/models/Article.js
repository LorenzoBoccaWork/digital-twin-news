const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  article_id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  content: String,
  link: String,
  source: String,
  category: String,
  timestamp: String,
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative', null], default: null },
  entities: [String],
  trending_topics: [String],
  company_relevance: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
