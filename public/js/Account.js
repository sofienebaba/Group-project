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
