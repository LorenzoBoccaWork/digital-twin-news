const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  company_id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  sector: String,
  preferences: [String],
  feedback_history: [{
    article_id: String,
    interested: Boolean,
    category: String,
    timestamp: { type: Date, default: Date.now }
  }],
  computed_relevance: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);