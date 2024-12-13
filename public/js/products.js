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
  console.log(formData);
});