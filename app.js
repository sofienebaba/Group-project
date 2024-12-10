const express = require('express');
const path = require('path');
const db = require('./database'); // Import the database

const app = express();
const PORT = 3000;

// Serve static files (images, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to fetch products from the database
app.get('/api/products', (req, res) => {
    const query = "SELECT * FROM products"; // SQL query to get all products
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to fetch products" });
        } else {
            res.json(rows); // Send products as JSON
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
