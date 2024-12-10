document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartPage = window.location.pathname.includes("cart.html");
    const checkoutPage = window.location.pathname.includes("checkout.html");

    // Add to Cart Button Logic
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            const product = {
                id: this.getAttribute("data-id"),
                name: this.getAttribute("data-name"),
                price: this.getAttribute("data-price"),
                image: this.getAttribute("data-image"),
            };
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${product.name} has been added to your cart!`);
        });
    });

    // Display Cart Items on the Cart Page
    if (cartPage) {
        const cartContainer = document.querySelector(".cart-container");
        const cartSummary = document.createElement("div");
        cartSummary.classList.add("cart-summary");

        let total = 0;
        cart.forEach((item, index) => {
            total += parseFloat(item.price);

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-image">
                <p>${item.name}</p>
                <p>$${item.price}</p>
                <button class="cart-button" data-index="${index}">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        cartSummary.innerHTML = `
            <p>Total</p>
            <p>$${total.toFixed(2)}</p>
        `;
        cartContainer.appendChild(cartSummary);

        // Remove Items from Cart
        document.querySelectorAll(".cart-button").forEach((button) => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                window.location.reload(); // Refresh the page
            });
        });

        // Add checkout button functionality
        document.querySelector(".checkout-button").addEventListener("click", () => {
            localStorage.setItem("checkoutCart", JSON.stringify(cart));
        });
    }

    // Display Cart Items on the Checkout Page
    if (checkoutPage) {
        const checkoutContainer = document.querySelector(".order-items");
        const storedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

        let total = 0;
        storedCart.forEach((item) => {
            total += parseFloat(item.price);

            const checkoutItem = document.createElement("div");
            checkoutItem.classList.add("item");
            checkoutItem.innerHTML = `
                <p>${item.name}</p>
                <p>$${item.price}</p>
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
    }
});

// Function to update the cart count badge
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.length; 
    const cartBadge = document.getElementById("cart-count");

    // Update the badge text
    cartBadge.textContent = cartCount;

    // Hide the badge if the cart is empty
    if (cartCount === 0) {
        cartBadge.style.display = "none";
    } else {
        cartBadge.style.display = "flex";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount(); // Update the count on page load

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add to Cart Button Logic
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            const product = {
                id: this.getAttribute("data-id"),
                name: this.getAttribute("data-name"),
                price: this.getAttribute("data-price"),
                image: this.getAttribute("data-image"),
            };
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));

            // Show popup
            showPopup(`${product.name} has been added to your cart!`);

            // Update the cart count badge globally
            updateCartCount();
        });
    });
});
document.getElementById('checkout-pay-now').addEventListener('click', function() {
    document.getElementById('payment-modal').style.display = 'block';
});

var modal = document.getElementById('payment-modal');
var closeButton = document.getElementsByClassName('close')[0];

closeButton.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function closeAd(button) {
    const ad = button.parentElement; 
    ad.style.display = "none"; 
}
