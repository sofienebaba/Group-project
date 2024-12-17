const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./database'); // Import the database

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static files (images, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

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

app.post('/api/products/search', (req, res) => {
    const searchTerm = req.body.searchTerm.toLowerCase();
    // Use LIKE for partial matches, % means "match anything before or after"
    const query = "SELECT * FROM products WHERE LOWER(name) LIKE ?";
    const searchPattern = `%${searchTerm}%`;
    db.all(query, [searchPattern], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to search products" });
        } else {
            res.json(rows);
        }
    });
});


const bcrypt = require('bcrypt');

// Sign Up (Create New User)
app.post('/api/signup', (req, res) => {
    const { username, email, dob, password } = req.body;
    if (!username || !email || !password || !dob) {
        return res.status(400).send('Missing required fields');
    }

    // Check if email already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, existingUser) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password before saving to database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Server error');
            }
            // Insert the new user into the database
            db.run(
                `INSERT INTO users (username, email, dob, password) VALUES (?, ?, ?, ?)`,
                [username, email, dob, hashedPassword],
                function(err) {
                    if (err) {
                        console.error('Error creating user:', err.message);
                        return res.status(500).send('Error creating user');
                    } else {
                        // Automatically sign in the user
                        req.session.userId = this.lastID; // Store the new user's ID in the session
                        res.status(201).json({ message: 'User created and signed in successfully' });
                    }
                }
            );
        });
    });
});

app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
  
    // Find the user by email
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Server error');
      }
  
      if (!row) {
        return res.status(404).send('User not found');
      }
  
      // Compare the plain-text password with the hashed password
      bcrypt.compare(password, row.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).send('Server error');
        }
  
        if (!isMatch) {
          return res.status(400).send('Invalid password');
        }
  
        // Successful login
        res.send('Login successful');
      });
    });
  });

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next(); // User is authenticated
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// Use the isAuthenticated middleware for protected routes
app.get('/api/protected', isAuthenticated, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

app.get('/api/check-auth', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

