const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL);

async function cacheArticles(articles) {
  const key = 'articles:' + Date.now();
  await redis.setex(key, 3600, JSON.stringify(articles));
  console.log('Cached ' + articles.length + ' articoli con chiave ' + key);
  return key;
}

async function getCachedArticles() {
  const keys = await redis.keys('articles:*');
  if (keys.length === 0) return [];
  const latest = keys.sort().pop();
  const data = await redis.get(latest);
  return JSON.parse(data);
}

async function isArticleProcessed(article_id) {
  const exists = await redis.get('processed:' + article_id);
  return !!exists;
}

async function markArticleProcessed(article_id) {
  await redis.setex('processed:' + article_id, 86400, '1');
}

module.exports = { cacheArticles, getCachedArticles, isArticleProcessed, markArticleProcessed };
