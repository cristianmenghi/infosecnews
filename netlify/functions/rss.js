const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const path = require('path');
const { promises: fsPromises } = require('fs');

exports.handler = async function() {
  const cacheDir = path.resolve('/tmp', 'rss-cache');
  const cacheFile = path.join(cacheDir, 'feeds.json');
  const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  try {
    await fsPromises.mkdir(cacheDir, { recursive: true });

    // Check if cache exists and is fresh
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const now = new Date().getTime();
      const age = now - stats.mtimeMs;

      if (age < CACHE_MAX_AGE) {
        const cachedData = await fsPromises.readFile(cacheFile, 'utf8');
        return {
          statusCode: 200,
          body: cachedData
        };
      }
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

    const feedsJSON = JSON.stringify(feeds);
    await fsPromises.writeFile(cacheFile, feedsJSON, 'utf8');

    return {
      statusCode: 200,
      body: feedsJSON
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`
    };
  }
};
