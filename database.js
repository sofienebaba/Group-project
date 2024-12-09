const sqlite3 = require('sqlite3').verbose();

// Open a database (it will create the file if it doesn't exist)
const db = new sqlite3.Database('./ecommerce.db', (err) => {
  if (err) {
    console.error('Error opening the database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Create a table for products (if it doesn't already exist)
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
  `);
});

// Export the database connection
module.exports = db;
