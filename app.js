const express = require('express');
const path = require('path');
const db = require('./database'); // Import the database

const app = express();
const PORT = 3000;

app.use(express.json());

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

app.post('/api/products/filter', (req, res) => {

    const filters = req.body;
    let conditions = [];
    let params = [];

    const selectedSports =  Object.keys(filters.sports)
        .filter(sport => filters.sports[sport] === true);

    if (selectedSports.length > 0) {
        conditions.push(`category IN (${selectedSports.map(() => '?').join(',')})`);
        params.push(...selectedSports);
    }

    const selectedConditions = Object.keys(filters.conditions)
        .filter(condition => filters.conditions[condition] === true);
    if (selectedConditions.length > 0) {
        conditions.push(`condition IN (${selectedConditions.map(() => '?').join(',')})`);
        params.push(...selectedConditions);
    }

    if (filters.price.min) {
        conditions.push('price >= ?');
        params.push(filters.price.min);
    }
    if (filters.price.max) {
        conditions.push('price <= ?');
        params.push(filters.price.max);
    }


    let query = "SELECT * FROM products";
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to fetch filtered products" });
        } else {
            res.json(rows);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
