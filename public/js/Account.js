const signInLink = document.getElementById('signInLink');
const modal = document.getElementById('signInModal');
const closeModal = document.querySelector('.close');
const signInForm = document.getElementById('signInForm');

signInLink.addEventListener('click', (event) => {
    event.preventDefault(); 
    modal.style.display = 'block'; 
});


closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; 
});


window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


signInForm.addEventListener('submit', (event) => {
event.preventDefault();
window.location.href = 'settings.html';
});


// When the Sign-Up form is submitted, show the Sign-In modal
document.querySelector('.sign-up-form').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent the default form submission

// Show the sign-in modal after sign-up form submission
modal.style.display = 'block'; // Display sign-in modal
});

    // Toggle password visibility for both sign-up and sign-in
    document.querySelectorAll('.show-hide-btn').forEach(button => {
        button.addEventListener('click', function () {
            const passwordField = this.previousElementSibling;
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
        });
    });

    // When the Sign-Up form is submitted
document.querySelector('.sign-up-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('Email').value;
    const dob = document.getElementById('dob').value;
    const password = document.getElementById('password').value;

    // Create data object for the request
    const formData = {
        username: fullName,
        email: email,
        dob: dob,
        password: password,

    };
    try {
        // Send POST request to create a new user
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),  // Send the form data
        });

        // Handle the response
        const result = await response.text();
        console.log(response);
        if (response.ok) {
            alert('Sign Up Successful!');
            window.location.href = 'index.html';  // Show the sign-in modal after successful sign-up
        } else {
            alert(result.error || 'Sign Up Failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});
signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create data object for the request
    const signInData = {
        email: email,
        password: password,
    };

    try {
        // Send POST request to sign in
        const response = await fetch('http://localhost:3000/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signInData),  // Send email and password
        });

        // Handle the response
        const result = await response.json();
        if (response.ok) {
            alert('Sign In Successful!');
            window.location.href = 'settings.html';  // Redirect to another page after successful sign-in
        } else {
            alert(result.error || 'Sign In Failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});
