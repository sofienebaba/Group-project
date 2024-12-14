document.addEventListener('DOMContentLoaded', function() {
  // Fetch product data from the backend API
  fetch('/api/products')
    .then(response => response.json())  // Parse the JSON response
    .then(products => {
      // Get the container element where products will be displayed
      const container = document.querySelector('.card-list');
  
      // Loop through all products and create HTML for each one
      products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card'); // Add the card class for styling
        
        // Set the content of the card with product details
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="card-image">
          <h3 class="card-title">${product.name}</h3>
          <p class="card-price">$${product.price}</p>
          <button 
            class="add-to-cart"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${product.price}"
            data-image="${product.image}">
            Add to Cart
          </button>
        `;
  
        // Append the card to the container in the HTML
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error fetching products:", error);
    });
});

const filterForm = document.getElementById("filter-form");
filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const formData = new FormData(filterForm);
    const filters = {
        sports: {
            soccer: formData.get('soccer') === 'soccer',
            basketball: formData.get('basketball') === 'basketball',
            baseball: formData.get('baseball') === 'baseball',
            football: formData.get('football') === 'football'
        },
        conditions: {
            mint: formData.get('mint') === 'mint',
            excellent: formData.get('excellent') === 'excellent',
            good: formData.get('good') === 'good',
            fair: formData.get('fair') === 'fair',
            poor: formData.get('poor') === 'poor'
        },
        price: {
            min: formData.get('min-value-price') || 0,
            max: formData.get('max-value-price') || Number.MAX_VALUE
        }
    };

    // Send filters to backend
    fetch('/api/products/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(products => {
        // Clear existing products
        const container = document.querySelector('.card-list');
        container.innerHTML = '';
        // Display filtered products
        products.forEach(product => {
            // Your existing card creation code
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="card-image">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-price">$${product.price}</p>
                <button 
                    class="add-to-cart"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-image="${product.image}">
                    Add to Cart
                </button>
            `;
            container.appendChild(card);
        });
    });
});