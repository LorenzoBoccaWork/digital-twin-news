const mongoose = require('mongoose');
require('dotenv').config();

const articleSchema = new mongoose.Schema({
  article_id: { type: String, unique: true },
  title: String,
  content: String,
  link: String,
  source: String,
  category: String,
  timestamp: String,
  sentiment: String,
  entities: [String],
  trending_topics: [String],
  company_relevance: Object
});

const Article = mongoose.model('Article', articleSchema);

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connesso a MongoDB');
}

async function saveArticles(articles) {
  let saved = 0;
  for (const article of articles) {
    try {
      await Article.updateOne(
        { article_id: article.article_id },
        { $set: article },
        { upsert: true }
      );
      saved++;
    } catch (err) {
      console.error('Errore salvataggio articolo ' + article.article_id + ':', err.message);
    }
  }
  console.log('Salvati ' + saved + ' articoli su MongoDB');
}

module.exports = { connectDB, saveArticles };
