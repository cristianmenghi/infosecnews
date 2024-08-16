const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const cache = require('@netlify/cache');

exports.handler = async function() {
  const cacheKey = 'rss-feeds';
  const cachedFeeds = await cache.get(cacheKey);

  if (cachedFeeds) {
    return {
      statusCode: 200,
      body: JSON.stringify(cachedFeeds)
    };
  }

  const data = fs.readFileSync('./src/feed.txt', 'utf8');
  const lines = data.split('\n');
  let feeds = {};
  let currentCategory = '';

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#')) {
      currentCategory = line.substring(1).trim();
      feeds[currentCategory] = [];
    } else if (line) {
      const feed = await parser.parseURL(line);
      feeds[currentCategory].push(feed);
    }
  }

  await cache.set(cacheKey, feeds, { maxAge: 24 * 60 * 60 });
  return {
    statusCode: 200,
    body: JSON.stringify(feeds)
  };
};
