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

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

// Fetch products (for your frontend)
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).send('Error fetching products');
    } else {
      res.json(rows);
    }
  });
});

// Add product to cart
app.post('/api/cart', (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).send('Missing user_id, product_id, or quantity');
  }

  db.get(
    `SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?`,
    [user_id, product_id],
    (err, row) => {
      if (err) {
        res.status(500).send('Error checking cart');
      } else if (row) {
        // If product is already in cart, update the quantity
        const newQuantity = row.quantity + quantity;
        db.run(
          `UPDATE cart SET quantity = ? WHERE id = ?`,
          [newQuantity, row.id],
          (err) => {
            if (err) {
              res.status(500).send('Error updating cart');
            } else {
              res.send('Cart updated successfully');
            }
          }
        );
      } else {
        // Add the product to the cart
        db.run(
          `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`,
          [user_id, product_id, quantity],
          (err) => {
            if (err) {
              res.status(500).send('Error adding to cart');
            } else {
              res.send('Product added to cart successfully');
            }
          }
        );
      }
    }
  );
});

// Fetch cart items for a user
app.get('/api/cart/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  db.all(
    `
    SELECT 
      cart.id AS cart_id, 
      products.id AS product_id, 
      products.name, 
      products.price, 
      products.image, 
      cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
    `,
    [user_id],
    (err, rows) => {
      if (err) {
        res.status(500).send('Error fetching cart items');
      } else {
        res.json(rows);
      }
    }
  );
});

// Remove a product from cart
app.delete('/api/cart/:cart_id', (req, res) => {
  const cart_id = req.params.cart_id;

  db.run(`DELETE FROM cart WHERE id = ?`, [cart_id], (err) => {
    if (err) {
      res.status(500).send('Error removing item from cart');
    } else {
      res.send('Item removed from cart');
    }
  });
});

// Update quantity of a product in cart
app.put('/api/cart/:cart_id', (req, res) => {
  const { quantity } = req.body;
  const cart_id = req.params.cart_id;

  if (!quantity) {
    return res.status(400).send('Quantity is required');
  }

  db.run(
    `UPDATE cart SET quantity = ? WHERE id = ?`,
    [quantity, cart_id],
    (err) => {
      if (err) {
        res.status(500).send('Error updating cart item');
      } else {
        res.send('Cart item updated successfully');
      }
    }
  );
});

// Get the count of items in the cart for a user
app.get('/api/cart/count/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  db.get(
    `SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?`,
    [user_id],
    (err, row) => {
      if (err) {
        res.status(500).send('Error fetching cart count');
      } else {
        res.json({ count: row.count || 0 });
      }
    }
  );
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
      `INSERT INTO users (username, email, dob, password ) VALUES (?, ?, ?, ?)`,
      [username, email, dob, hashedPassword],
      function(err) {
        if (err) {
          console.error('Error creating user:', err.message);
          return res.status(500).send('Error creating user');
        } else {
          res.status(201).send('User created successfully');
        }
      }
    );
  });
});
});

// Sign In (Authenticate User)
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

