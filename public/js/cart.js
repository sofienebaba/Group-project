document.addEventListener("DOMContentLoaded", function () {
    const cartPage = window.location.pathname.includes("cart.html");
    const checkoutPage = window.location.pathname.includes("checkout.html");

    // Add to Cart Button Logic
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            const product = {
                id: this.getAttribute("data-id"),
                name: this.getAttribute("data-name"),
                price: parseFloat(this.getAttribute("data-price")),
                image: this.getAttribute("data-image"),
                quantity: 1, // Set default quantity to 1
            };

            // Send product to the backend
            fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            })
                .then((response) => {
                    if (response.ok) {
                        alert(`${product.name} has been added to your cart!`);
                        updateCartCount(); // Update cart count after adding the product
                    } else {
                        alert("Failed to add product to cart. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Error adding product to cart:", error);
                });
        });
    });

    // Display Cart Items on the Cart Page
    if (cartPage) {
        fetch("/api/cart")
            .then((response) => response.json())
            .then((cartItems) => {
                const cartContainer = document.querySelector(".cart-container");
                const cartSummary = document.createElement("div");
                cartSummary.classList.add("cart-summary");

                if (cartItems.length === 0) {
                    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                    return;
                }

                let total = 0;
                cartItems.forEach((item) => {
                    total += item.price * item.quantity;

                    const cartItem = document.createElement("div");
                    cartItem.classList.add("cart-item");
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-image">
                        <p>${item.name}</p>
                        <p>$${item.price.toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <button class="remove-item" data-id="${item.cart_id}">Remove</button>
                    `;
                    cartContainer.appendChild(cartItem);
                });

                cartSummary.innerHTML = `
                    <p>Total: $${total.toFixed(2)}</p>
                    <button class="checkout-button">Proceed to Checkout</button>
                `;
                cartContainer.appendChild(cartSummary);

                // Remove Items from Cart
                document.querySelectorAll(".remove-item").forEach((button) => {
                    button.addEventListener("click", function () {
                        const cartId = this.getAttribute("data-id");
                        fetch(`/api/cart/${cartId}`, {
                            method: "DELETE",
                        })
                            .then((response) => {
                                if (response.ok) {
                                    alert("Item removed from cart.");
                                    location.reload(); // Refresh the page
                                } else {
                                    alert("Failed to remove item from cart.");
                                }
                            })
                            .catch((error) => {
                                console.error("Error removing item from cart:", error);
                            });
                    });
                });
            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            });
    }

    // Display Cart Items on the Checkout Page
    if (checkoutPage) {
        fetch("/api/cart")
            .then((response) => response.json())
            .then((cartItems) => {
                const checkoutContainer = document.querySelector(".order-items");
                let total = 0;

                cartItems.forEach((item) => {
                    total += item.price * item.quantity;

                    const checkoutItem = document.createElement("div");
                    checkoutItem.classList.add("item");
                    checkoutItem.innerHTML = `
                        <p>${item.name}</p>
                        <p>$${item.price.toFixed(2)}</p>
                    `;
                    checkoutContainer.appendChild(checkoutItem);
                });

                const totalItem = document.createElement("div");
                totalItem.classList.add("item");
                totalItem.innerHTML = `
                    <p><strong>Total:</strong></p>
                    <p><strong>$${total.toFixed(2)}</strong></p>
                `;
                checkoutContainer.appendChild(totalItem);
            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            });
    }
});

// Function to update the cart count badge
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

// Payment Modal Logic
document.getElementById("checkout-pay-now").addEventListener("click", function () {
    document.getElementById("payment-modal").style.display = "block";
});

const modal = document.getElementById("payment-modal");
const closeButton = document.getElementsByClassName("close")[0];

closeButton.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
