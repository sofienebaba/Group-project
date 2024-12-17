document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');

  if (searchTerm) {
    fetch('/api/products/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searchTerm: searchTerm })
    })
    .then(response => response.json())
    .then(products => {
      const container = document.querySelector('.card-list');
      container.innerHTML = '';

      products.forEach(product => {
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
  } else {
    fetch('/api/products')
      .then(response => response.json())
      .then(products => {
        const container = document.querySelector('.card-list');

        products.forEach(product => {
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
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }
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

    fetch('/api/products/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(products => {
        const container = document.querySelector('.card-list');
        container.innerHTML = '';

        products.forEach(product => {
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
