document.addEventListener('DOMContentLoaded', function () {
    const feedsContainer = document.getElementById('feeds');

    // Función para cargar el archivo feeds.txt
    fetch('feeds.txt')
        .then(response => response.text())
        .then(text => {
            // Convertir el texto en un array de URLs
            const feeds = text.split('\n').filter(line => line.trim() !== '');
            return feeds;
        })
        .then(feeds => {
            // Iterar sobre cada URL y cargar el RSS feed
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
        })
        .catch(error => console.error('Error loading the feeds.txt file:', error));
});
