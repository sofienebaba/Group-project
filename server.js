const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // Assuming you use SQLite
const app = express();
const PORT = 3000;



// Database connection (use the correct path for your database)
const db = new sqlite3.Database('./database'); // Or another DB path

// Serve static files from the "public" and "images" folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route for the homepage
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the about us page
app.get('/about_us_faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about_us_faq.html'));
});

// Route for the cart page
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// Route for the checkout page
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

// Route for the products page
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

// Route for the account page
app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Account.html'));
});

// Route for the settings page
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// API Endpoint to fetch all products from the database
app.get('/api/products', (req, res) => {
  // Query the database to get all products
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(rows); // Send products as a JSON response
  });
});



const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Parse JSON bodies


app.post('/api/signup', (req, res) => {
  const { username, email, password, dob } = req.body;

  // Check for missing fields
  if (!username || !email || !password || !dob) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    // Insert user into the database
    const stmt = db.prepare("INSERT INTO users (username, email, password, dob) VALUES (?, ?, ?, ?)");
    stmt.run(username, email, hashedPassword, dob, (err) => {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ error: "Email already registered" });
        }
        return res.status(500).json({ error: "Error creating user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
    stmt.finalize();
  });
});

app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ error: "Both email and password are required" });
  }

  // Look for the user in the database by email
  const query = "SELECT * FROM users WHERE email = ?";
  db.get(query, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (!user) {
      // If the email does not exist in the database, the user is not registered
      return res.status(404).json({ error: "User not found" });
    }

    // If user exists, compare the entered password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Error comparing passwords" });
      }

      if (!isMatch) {
        // If passwords do not match
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // If both email and password are correct, proceed with sign-in
      res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
    });
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});




