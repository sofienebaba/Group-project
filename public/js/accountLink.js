const accountLink = document.querySelector('.nav-links li a[href="Account.html"]');

accountLink.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default link behavior

    try {
        // Check if the user is signed in by calling the server
        const response = await fetch('/api/check-auth');
        const result = await response.json();

        if (result.loggedIn) {
            // User is signed in, redirect to settings.html
            window.location.href = 'settings.html';
        } else {
            // User is not signed in, redirect to Account.html
            window.location.href = 'Account.html';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        // Optionally handle the error, e.g., redirect to Account.html
        window.location.href = 'Account.html';
    }
});