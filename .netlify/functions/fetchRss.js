const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const feedUrl = event.queryStringParameters.url;

  try {
    // Fetch the RSS data from the source
    const response = await fetch(feedUrl);
    const data = await response.text();

    // Return the response with caching headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
      },
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error fetching RSS feed: ${err.message}`
    };
  }
};
