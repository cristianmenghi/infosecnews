document.addEventListener('DOMContentLoaded', function () {
    const feedsContainer = document.getElementById('feeds');
    const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    let currentCategoryDiv = null;

    fetch('feeds.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n').filter(line => line.trim() !== '');

            lines.forEach(line => {
                if (line.startsWith('#')) {
                    const categoryTitle = line.substring(1).trim();

                    const categorySection = document.createElement('div');
                    categorySection.className = 'category-section mb-5';

                    const categoryTitleElement = document.createElement('h2');
                    categoryTitleElement.className = 'col-12 mt-4';
                    categoryTitleElement.textContent = categoryTitle;

                    currentCategoryDiv = document.createElement('div');
                    currentCategoryDiv.className = 'row';

                    categorySection.appendChild(categoryTitleElement);
                    categorySection.appendChild(currentCategoryDiv);

                    feedsContainer.appendChild(categorySection);
                } else if (line.trim()) {
                    addFeedToCategory(currentCategoryDiv, line.trim());
                }
            });
        })
        .catch(error => console.error('Error loading the feeds.txt file:', error));

    function addFeedToCategory(categoryDiv, feedUrl) {
        const cacheKey = `rss_cache_${feedUrl}`;
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));

        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRATION_MS)) {
            displayFeed(categoryDiv, cachedData.data);
        } else {
            fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`)
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
                    displayFeed(categoryDiv, data);
                })
                .catch(error => console.error('Error fetching the RSS feed:', error));
        }
    }

    function displayFeed(categoryDiv, data) {
        const feedDiv = document.createElement('div');
        feedDiv.className = 'col-md-3 feed mb-4';

        const feedTitle = document.createElement('h5');
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

        categoryDiv.appendChild(feedDiv);
    }
});
