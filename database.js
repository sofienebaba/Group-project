const sqlite3 = require('sqlite3').verbose();

// Open a database 
const db = new sqlite3.Database('./ecommerce.db', (err) => {
  if (err) {
    console.error('Error opening the database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Create a table for products 
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      condition TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Error creating products table:", err.message);
    } else {
      console.log("products table created successfully.");
    }
  }
);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      dob DATE NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    } else {
      console.log("Users table created successfully.");
    }
  });
});

// Create a table for cart
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      purchased BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error("Error creating cart table:", err.message);
    } else {
      console.log("Cart table created successfully.");
    }
  });
});

// Create a table for cart item
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cart_items (
      cart_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (cart_id, product_id),
      FOREIGN KEY (cart_id) REFERENCES cart (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `, (err) => {
    if (err) {
      console.error("Error creating cart table:", err.message);
    } else {
      console.log("Cart Item table created successfully.");
    }
  });
});




module.exports = db;
