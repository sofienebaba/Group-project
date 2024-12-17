document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("going to rpdoucts");
        // Get the search input value
        const searchInput = document.querySelector('.search-bar input').value;
        
        // Redirect to products page with search term as URL parameter
        window.location.href = `/products.html?search=${encodeURIComponent(searchInput)}`;
    });
});