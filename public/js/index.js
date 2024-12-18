document.addEventListener('DOMContentLoaded', function() {
  // Fetch product data from the backend API
  fetch('/api/products')
    .then(response => response.json())  // Parse the JSON response
    .then(products => {
      // Get the container element where products will be displayed
      const container = document.querySelector('.cards-container');
  
      // Limit to only the first 8 products
      const limitedProducts = products.slice(5, 9);

      // Loop through the limited products and create HTML for each one
      limitedProducts.forEach(product => {
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
// Function to close the sidebar (either left or right)
function closeAd(button) {
  // Find the parent 'aside' element (either left-sidebar or right-sidebar)
  const sidebar = button.closest('aside');
  
  // Hide the sidebar by setting its display to 'none'
  sidebar.style.display = 'none';
}

// Add event listener to close buttons
document.querySelectorAll('.close-ad').forEach(button => {
  button.addEventListener('click', function(event) {
      event.stopPropagation();  // Prevent other actions
      closeAd(button);  // Close the sidebar
  });
});
