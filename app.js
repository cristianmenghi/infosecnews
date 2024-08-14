document.addEventListener('DOMContentLoaded', function () {
    const feedsContainer = document.getElementById('feeds');
    let currentCategory = '';

    // Función para cargar el archivo feeds.txt
    fetch('feeds.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n').filter(line => line.trim() !== '');

            lines.forEach(line => {
                if (line.startsWith('#')) {
                    // Es una categoría
                    currentCategory = line.substring(1).trim();
                    const categoryTitle = document.createElement('h2');
                    categoryTitle.className = 'col-12 mt-4';
                    categoryTitle.textContent = currentCategory;
                    feedsContainer.appendChild(categoryTitle);
                } else {
                    // Es un URL de feed
                    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(line.trim())}`)
                        .then(response => response.json())
                        .then(data => {
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

                            feedsContainer.appendChild(feedDiv);
                        })
                        .catch(error => console.error('Error fetching the RSS feed:', error));
                }
            });
        })
        .catch(error => console.error('Error loading the feeds.txt file:', error));
});
