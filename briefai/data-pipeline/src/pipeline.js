const cron = require('node-cron');
const { fetchAllFeeds } = require('./rssParser');
const { cacheArticles, getCachedArticles, isArticleProcessed, markArticleProcessed } = require('./cacheManager');
const { connectDB, saveArticles } = require('./dbConnector');

async function runPipeline() {
  console.log('[' + new Date().toISOString() + '] Avvio pipeline...');

  let articles = await fetchAllFeeds();

  if (articles.length === 0) {
    console.warn('Nessun articolo raccolto, uso fallback da cache Redis...');
    articles = await getCachedArticles();
  }

  const newArticles = [];
  for (const article of articles) {
    const alreadySeen = await isArticleProcessed(article.article_id);
    if (!alreadySeen) {
      newArticles.push(article);
      await markArticleProcessed(article.article_id);
    }
  }
  console.log('Nuovi articoli da processare: ' + newArticles.length);

  if (newArticles.length === 0) {
    console.log('Nessun articolo nuovo. Pipeline completata.');
    return;
  }

  await cacheArticles(newArticles);
  await saveArticles(newArticles);

  console.log('Pipeline completata. ' + newArticles.length + ' articoli processati.');
}

async function start() {
  await connectDB();
  await runPipeline();
  cron.schedule('*/15 * * * *', async () => {
    await runPipeline();
  });
  console.log('Scheduler attivo: pipeline ogni 15 minuti.');
}

start();
