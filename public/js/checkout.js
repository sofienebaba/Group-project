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

document.addEventListener("DOMContentLoaded", function () {

    // Display Cart Items on the Cart Page
        fetch("/api/cart") // Fetch cart items for the logged-in user
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                return response.json();
            })
            .then((cartItems) => {
                let cartId;
                const orderItems = document.querySelector(".order-items");
                console.log(orderItems);
                const cartSummary = document.createElement("div");
                cartSummary.classList.add("cart-summary");
                if (cartItems.length === 0) {
                    orderItems.innerHTML = "<p>Your cart is empty.</p>";
                    return;
                }

                let total = 0;
                cartItems.forEach((item) => {
                    total += item.price * item.quantity;
                    cartId = item.cart_id;
                    const cartItem = document.createElement("div");
                    cartItem.classList.add("cart-item");
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-image">
                        <p>${item.name}</p>
                        <p>$${item.price.toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <button class="remove-item" data-id="${item.product_id}">Remove</button>
                    `;
                    orderItems.appendChild(cartItem);
                });

                cartSummary.innerHTML = `
                    <p>Total: $${total.toFixed(2)}</p>
                    <button id="checkout-pay-now" class="checkout-button">Buy Now</button>
                `;
                orderItems.appendChild(cartSummary);

                // Remove Items from Cart
                document.querySelectorAll(".remove-item").forEach((button) => {
                    button.addEventListener("click", function () {
                        const productId = this.getAttribute("data-id");
                        console.log(productId);
                        fetch(`/api/cart/${productId}`, {
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
                // Payment Modal Logic
                const buyButton = document.getElementById("checkout-pay-now");
                buyButton.addEventListener("click", function () {
                    modal.style.display = "block";
                    const paymentForm = document.getElementById("payment-form");
                    paymentForm.addEventListener("submit", function (event) {
                        event.preventDefault();
                        fetch(`/api/purchase/${cartId}`, {
                            method: "POST",
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error('Failed to complete purchase');
                                }
                                return response.json();
                            })
                            .then((result) => {
                                alert(result.message); // Notify user of success
                                window.location.href = "index.html"; // Redirect to confirmation page
                            })
                            .catch((error) => {
                                console.error("Error completing purchase:", error);
                                alert("There was an error completing your purchase. Please try again.");
                            });
                    });
                });

            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            });
});

