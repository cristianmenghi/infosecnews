document.addEventListener('DOMContentLoaded', function () {
    const feedsContainer = document.getElementById('feeds');
    let currentCategoryDiv = null;

    // Función para cargar el archivo feeds.txt
    fetch('feeds.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n').filter(line => line.trim() !== '');

            lines.forEach(line => {
                if (line.startsWith('#')) {
                    // Es una categoría
                    const categoryTitle = line.substring(1).trim();

                    // Crear un nuevo div para la categoría
                    const categorySection = document.createElement('div');
                    categorySection.className = 'category-section';

                    // Crear el título de la categoría
                    const categoryTitleElement = document.createElement('h2');
                    categoryTitleElement.className = 'col-12 mt-4';
                    categoryTitleElement.textContent = categoryTitle;

                    // Crear un contenedor de filas para los feeds dentro de la categoría
                    currentCategoryDiv = document.createElement('div');
                    currentCategoryDiv.className = 'row';

                    // Añadir el título y el contenedor de la categoría al categorySection
                    categorySection.appendChild(categoryTitleElement);
                    categorySection.appendChild(currentCategoryDiv);

                    // Añadir la categoría completa al feedsContainer
                    feedsContainer.appendChild(categorySection);
                } else if (currentCategoryDiv) {
                    // Es un URL de feed, añadirlo al contenedor actual de la categoría
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

                            currentCategoryDiv.appendChild(feedDiv);
                        })
                        .catch(error => console.error('Error fetching the RSS feed:', error));
                }
            });
        })
        .catch(error => console.error('Error loading the feeds.txt file:', error));
});
