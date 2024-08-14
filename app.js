document.addEventListener('DOMContentLoaded', function () {
    const feeds = [
        'https://www.404media.co/rss',
        'https://aboutdfir.com/feed',
        'https://blog.cryptographyengineering.com/feed',
        'http://feeds.feedburner.com/akamai/blog',
        'https://www.cisa.gov/cybersecurity-advisories/all.xml'
    ];

    const feedsContainer = document.getElementById('feeds');

    feeds.forEach(feedUrl => {
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`)
            .then(response => response.json())
            .then(data => {
                const feedDiv = document.createElement('div');
                feedDiv.className = 'feed';

                const feedTitle = document.createElement('h2');
                feedTitle.textContent = data.feed.title;
                feedDiv.appendChild(feedTitle);

                data.items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    const itemTitle = document.createElement('a');
                    itemTitle.href = item.link;
                    itemTitle.textContent = item.title;
                    itemTitle.target = '_blank';

                    itemDiv.appendChild(itemTitle);
                    feedDiv.appendChild(itemDiv);
                });

                feedsContainer.appendChild(feedDiv);
            })
            .catch(error => console.error('Error fetching the RSS feed:', error));
    });
});
