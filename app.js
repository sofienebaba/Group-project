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
        req.session.userId = row.id;
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

app.post('/api/signout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Failed to log out' });
        }
        // Successfully logged out
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('/api/user-info', (req, res) => {
    const userId = req.session.userId; // Get the user ID from the session

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    db.get('SELECT username, email, dob FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).json({ error: 'Failed to fetch user info' });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

app.post('/api/change-name', (req, res) => {
    const { newName } = req.body;
    const userId = req.session.userId; 

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' }); 
    }

    if (!newName) {
        return res.status(400).json({ error: 'New name is required' });
    }

    // Update the user's name in the database
    db.run(`UPDATE users SET username = ? WHERE id = ?`, [newName, userId], function(err) {
        if (err) {
            console.error('Error updating name:', err.message);
            return res.status(500).json({ error: 'Failed to update name' });
        }
        res.json({ message: 'Name updated successfully' });
    });
});

app.post('/api/change-email', (req, res) => {
    const { newEmail } = req.body;
    const userId = req.session.userId; 

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' }); 
    }

    if (!newEmail) {
        return res.status(400).json({ error: 'New email is required' });
    }

    // Update the user's name in the database
    db.run(`UPDATE users SET email = ? WHERE id = ?`, [newEmail, userId], function(err) {
        if (err) {
            console.error('Error updating email:', err.message);
            return res.status(500).json({ error: 'Failed to update name' });
        }
        res.json({ message: 'Email updated successfully' });
    });
});

app.post('/api/add-to-cart', (req, res) => {
    const { productId, quantity } = req.body; // Get product ID and quantity from the request
    const userId = req.session.userId; // Get the user ID from the session

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' }); // User must be logged in
    }

    db.get('SELECT id FROM cart WHERE user_id = ? and purchased = FALSE', [userId], (err, cart) => {
        if (err) {
            console.error('Error fetching cart:', err);
            return res.status(500).json({ error: 'Failed to fetch cart' });
        }

        if (!cart) {
            db.run('INSERT INTO cart (user_id) VALUES (?)', [userId], function(err) {
                if (err) {
                    console.error('Error creating cart:', err);
                    return res.status(500).json({ error: 'Failed to create cart' });
                }

                const newCartId = this.lastID; // Get the ID of the newly created cart
                addProductToCart(newCartId, productId, quantity, res);
            });
        } else {
            // If the cart exists, add the product to the existing cart
            addProductToCart(cart.id, productId, quantity, res);
        }
    });
});

// Helper function to add product to cart
function addProductToCart(cartId, productId, quantity, res) {
    // Check if the product is already in the cart
    db.get('SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId], (err, row) => {
        if (err) {
            console.error('Error checking cart items:', err);
            return res.status(500).json({ error: 'Failed to check cart items' });
        }

        if (row) {
            // If the product is already in the cart, update the quantity
            const newQuantity = row.quantity + quantity; // Update quantity
            db.run('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?', [newQuantity, cartId, productId], (err) => {
                if (err) {
                    console.error('Error updating cart item:', err);
                    return res.status(500).json({ error: 'Failed to update cart item' });
                }
                res.json({ message: 'Product quantity updated in cart' });
            });
        } else {
            // If the product is not in the cart, insert it
            db.run('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity], (err) => {
                if (err) {
                    console.error('Error adding product to cart:', err);
                    return res.status(500).json({ error: 'Failed to add product to cart' });
                }
                res.json({ message: 'Product added to cart' });
            });
        }
    });
}

app.get('/api/cart', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    db.all(`
        SELECT 
            cart_items.cart_id, 
            products.id AS product_id, 
            products.name, 
            products.price, 
            products.image, 
            cart_items.quantity
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        JOIN cart ON cart_items.cart_id = cart.id
        WHERE cart.user_id = ?`, [userId], (err, rows) => {
            if (err) {
                console.error('Error fetching cart items:', err);
                return res.status(500).send('Error fetching cart items');
            }
            res.json(rows);
        });
});

app.get('/api/cart/count', (req, res) => {
    const userId = req.session.userId; // Get the user ID from the session

    if (!userId) {
        return res.status(401).json({ count: 0 }); // User must be logged in
    }

    db.get('SELECT SUM(quantity) AS count FROM cart_items WHERE cart_id IN (SELECT id FROM cart WHERE user_id = ?)', [userId], (err, row) => {
        if (err) {
            console.error('Error fetching cart count:', err);
            return res.status(500).json({ error: 'Failed to fetch cart count' });
        }
        res.json({ count: row.count || 0 }); // Return the total count or 0 if no items
    });
});

app.delete('/api/cart/:productId', (req, res) => {
    const productId = req.params.productId; // Get the item ID from the request parameters

    db.run('DELETE FROM cart_items WHERE product_id = ?', [productId], function(err) {
        if (err) {
            console.error('Error deleting cart item:', err);
            return res.status(500).json({ error: 'Failed to delete cart item' });
        }
        res.json({ message: 'Item removed from cart successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

