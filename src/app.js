document.addEventListener('DOMContentLoaded', function () {
    const feedsContainer = document.getElementById('feeds');
  
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
  
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'row';
  
            categorySection.appendChild(categoryTitleElement);
            categorySection.appendChild(categoryDiv);
  
            feedsContainer.appendChild(categorySection);
          } else if (line.trim()) {
            const feedUrl = line.trim();
            addFeedToCategory(categoryDiv, feedUrl);
          }
        });
      })
      .catch(error => console.error('Error loading feeds.txt file:', error));
  
    function addFeedToCategory(categoryDiv, feedUrl) {
      fetch(`/api/fetchRss?url=${encodeURIComponent(feedUrl)}`)
        .then(response => response.text())
        .then(data => {
          const feedDiv = document.createElement('div');
          feedDiv.className = 'col-md-3 feed mb-4';
  
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "text/xml");
  
          const items = xmlDoc.getElementsByTagName('item');
  
          Array.from(items).forEach(item => {
            const title = item.getElementsByTagName('title')[0].textContent;
            const link = item.getElementsByTagName('link')[0].textContent;
  
            const itemDiv = document.createElement('div');
            const itemTitle = document.createElement('a');
            itemTitle.href = link;
            itemTitle.textContent = title;
            itemTitle.target = '_blank';
  
            itemDiv.appendChild(itemTitle);
            feedDiv.appendChild(itemDiv);
          });
  
          categoryDiv.appendChild(feedDiv);
        })
        .catch(error => console.error('Error fetching RSS feed:', error));
    }
  });
  