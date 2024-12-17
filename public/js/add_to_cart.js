document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.cards-container'); // Assuming this is the parent container for the product cards

    // Attach a single event listener to the parent container
    container.addEventListener('click', async function (event) {
        // Check if the clicked element has the class 'add-to-cart'
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.getAttribute('data-id'); // Get product ID from data attribute
            const quantity = 1; // Set default quantity to 1

            try {
                const response = await fetch('/api/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId, quantity }), // Send product ID and quantity
                });

                const result = await response.json();
                if (response.ok) {
                    updateCartCount();
                } else {
                    alert(result.error || 'Failed to add product to cart!');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Something went wrong!');
            }
        }
    });
});

function updateCartCount() {
    fetch("/api/cart/count")
        .then((response) => response.json())
        .then((data) => {
            const cartBadge = document.getElementById("cart-count");
            cartBadge.textContent = data.count;

            if (data.count === 0) {
                cartBadge.style.display = "none";
            } else {
                cartBadge.style.display = "flex";
            }
        })
        .catch((error) => {
            console.error("Error updating cart count:", error);
        });
}