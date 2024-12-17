document.addEventListener("DOMContentLoaded", function () {
    const cartPage = window.location.pathname.includes("cart.html");

    // Display Cart Items on the Cart Page
    if (cartPage) {
        fetch("/api/cart") // Fetch cart items for the logged-in user
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                return response.json();
            })
            .then((cartItems) => {
                const cartContainer = document.querySelector(".cart-container");
                const cartSummary = document.createElement("div");
                cartSummary.classList.add("cart-summary");
                console.log(cartItems);
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
                        const productId = this.getAttribute("data-id");
                        fetch(`/api/delete_item`, {
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
});



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
