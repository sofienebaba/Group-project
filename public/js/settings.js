let settingsLink = document.getElementById("account-info-link")
let settingsDiv = document.getElementById("account-info")
settingsLink.style.color = "#ffcc00"
settingsDiv.style.display = "block"

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/user-info');
        const userInfo = await response.json();

        if (response.ok) {
            document.getElementById('user-name').textContent = userInfo.username;
            document.getElementById('user-email').textContent = userInfo.email;
            document.getElementById('user-dob').textContent = userInfo.dob;
        } else {
            console.error(userInfo.error || 'Failed to fetch user information');
            alert('Failed to load user information. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching user information:', error);
        alert('Something went wrong while fetching user information.');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const cardsContainer = document.querySelector(".cards-container"); // Adjust the selector to match your HTML

    // Fetch purchased cart items for the logged-in user
    fetch("/api/purchased-cart-items")
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch purchased cart items');
            }
            return response.json();
        })
        .then((cartItems) => {
            // Clear the container before populating
            cardsContainer.innerHTML = '';

            if (cartItems.length === 0) {
                cardsContainer.innerHTML = "<p>No purchased items found.</p>";
                return;
            }

            // Populate the cards container with purchased items
            cartItems.forEach((item) => {
                const card = document.createElement("div");
                card.classList.add("card-product");
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="card-image">
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-price">$${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                `;
                cardsContainer.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("Error fetching purchased cart items:", error);
        });
});

const nameChangeForm = document.getElementById("name-edit-form")

nameChangeForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const newName = document.getElementById('new-account-name').value;
    try {
        const response = await fetch('/api/change-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName }),
        });

        const result = await response.json();
        if (response.ok) {
            window.location.href = 'settings.html';
        } else {
            alert(result.error || 'Failed to change name!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});

const emailChangeForm = document.getElementById("email-edit-form")

emailChangeForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const newEmail = document.getElementById('new-email').value;
    try {
        const response = await fetch('/api/change-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newEmail }),
        });

        const result = await response.json();
        if (response.ok) {
            window.location.href = 'settings.html';
        } else {
            alert(result.error || 'Failed to change name!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});

const signOutButton = document.getElementById('signout-button'); // Assuming you have a button with this ID

signOutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.text();
        if (response.ok) {
            window.location.href = 'index.html'; // Redirect to home or login page
        } else {
            alert(result.error || 'Sign Out Failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});

function changeSettingsDiv(id) {
    settingsLink.style.color = "#ffffff"
    settingsDiv.style.display = "none"
    
    let settingsLinkName = id + "-link"
    settingsLink = document.getElementById(settingsLinkName)

    settingsDiv = document.getElementById(id)
    settingsLink.style.color = "#ffcc00"
    settingsDiv.style.display = "block"
}

function openEditInfo(id) {
    editPanel = document.getElementById(id)
    editPanel.style.display = "block"
}

function saveChanges() {
    editPanel.style.display = "none"
}

function closeModal() {
    editPanel.style.display = "none"
}
