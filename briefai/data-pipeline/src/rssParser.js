const RSSParser = require('rss-parser');
const parser = new RSSParser();
const sources = require('../config/sources.json');

async function fetchFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.map(item => ({
      article_id: Buffer.from(item.link || item.title).toString('base64').slice(0, 20),
      title: item.title || '',
      content: item.contentSnippet || item.summary || '',
      link: item.link || '',
      source: source.name,
      category: source.category,
      timestamp: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      sentiment: null,
      entities: [],
      trending_topics: [],
      company_relevance: {}
    }));
  } catch (error) {
    console.error('Errore nel fetch di ' + source.name + ':', error.message);
    return null;
  }
}

async function fetchAllFeeds() {
  const results = [];
  for (const source of sources.sources) {
    const articles = await fetchFeed(source);
    if (articles) results.push(...articles);
  }
  return results;
}

module.exports = { fetchAllFeeds };
