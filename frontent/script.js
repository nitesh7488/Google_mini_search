// Handle search functionality
async function performSearch() {
    const query = document.getElementById('searchInput').value;
    if (!query) {
      alert('Please enter a search query');
      return;
    }

    try {
      const isImageSearch = query.toLowerCase().includes('image') || 
                           query.toLowerCase().includes('photo') ||
                           query.toLowerCase().includes('picture');
      
      const endpoint = isImageSearch ? 'search-images' : 'search';
      const response = await fetch(`http://localhost:5000/${endpoint}?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      displayResults(data, isImageSearch);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
}

// Add click event for search button
document.getElementById('searchButton').addEventListener('click', performSearch);

// Add keypress event for enter key
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function displayResults(results, isImageSearch) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
      return;
    }

    if (isImageSearch) {
      // Display image results
      resultsContainer.classList.add('image-results');
      results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'image-item';
      resultItem.innerHTML = `
        <div class="image-container">
          <a href="${result.link}" target="_blank">
            <img src="${result.image}" alt="${result.title}">
          </a>
          <div class="image-description" ${result.wikipedia_url ? `onclick="window.open('${result.wikipedia_url}', '_blank')" style="cursor: pointer;"` : ''}>
            ${result.short_description}
            <button class="read-more-btn">Read More</button>
            <div class="full-description" style="display: none;">
              ${result.full_description}
            </div>
          </div>
        </div>
      `;

        resultsContainer.appendChild(resultItem);
      });

      // Add event listeners for Read More buttons
      document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const fullDescription = e.target.nextElementSibling;
          if (fullDescription.style.display === 'none') {
            fullDescription.style.display = 'block';
            e.target.textContent = 'Show Less';
          } else {
            fullDescription.style.display = 'none';
            e.target.textContent = 'Read More';
          }
        });
      });
    } else {
      // Display regular text results
      resultsContainer.classList.remove('image-results');
      results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
          <h3><a href="${result.link}" target="_blank">${result.title}</a></h3>
          <p>${result.snippet}</p>
        `;
        resultsContainer.appendChild(resultItem);
      });
    }
}
