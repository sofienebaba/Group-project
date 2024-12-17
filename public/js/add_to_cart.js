document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
        const product = {
            id: this.getAttribute("data-id"),
            name: this.getAttribute("data-name"),
            price: parseFloat(this.getAttribute("data-price")),
            image: this.getAttribute("data-image"),
            quantity: 1, // Set default quantity to 1
        };
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