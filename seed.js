const db = require('./database');
// Array of products to insert into the database
const products = [
  { name: 'Cristiano Ronaldo', price: 49.99, category: 'soccer', condition: 'excellent', image: '/images/Cristiano Ronaldo.jpg' },
  { name: 'Lionel Messi', price: 69.99, category: 'soccer', condition: 'mint', image: '/images/Messi.jpg' },
  { name: 'James Rodriguez', price: 20.56, category: 'soccer', condition: 'fair', image: '/images/jrodriguez.jpg' },
  { name: 'Kobe Bryant', price: 599.99, category: 'basketball', condition: 'excellent', image: '/images/Kobe-Bryant-1996.webp' },
  { name: 'Michael Jordan', price: 150.53, category: 'basketball', condition: 'mint', image: '/images/Michael-Jordan.jpg' },
  { name: 'Patrick Mahomes', price: 59.99, category: 'football', condition: 'fair', image: '/images/mahomes.jpg' },
  { name: 'ZION WILLIAMSON', price: 155.99, category: 'basketball', condition: 'excellent', image: '/images/2019-20 ZION WILLIAMSON PANINI SILVER PRIZM ROOKIE CARD 155.webp' },
  { name: 'Lionel Messi, Stephen Curry', price: 89.99, category: 'soccer', condition: 'mint', image: '/images/2024 Topps Now MLS 128 Lionel Messi, Stephen Curry 50.webp' },
  { name: 'Pele, Lionel Messi, Cristiano', price: 400.99, category: 'soccer', condition: 'mint', image: '/images/THE TRIPLE! Pele, Lionel Messi, Cristiano Ronaldo 2022 Leaf Legends Card PGI 10 300.webp' },
  { name: 'Sterling', price: 39.99, category: 'soccer', condition: 'mint', image: '/images/sterling.jpg' },
  { name: 'Erling Haaland', price: 79.99, category: 'soccer', condition: 'excellent', image: '/images/2023 Topps Chrome UCL Erling Haaland Specimen 398.webp' }
];

// Insert products into the database
const seedDatabase = () => {
  db.serialize(() => {
    const deleteStmt = db.prepare("DELETE FROM products");
    deleteStmt.run();
    deleteStmt.finalize();

    const stmt = db.prepare("INSERT INTO products (name, price, category, condition, image) VALUES (?, ?, ?, ?, ?)");

    products.forEach(product => {
      stmt.run(product.name, product.price, product.category, product.condition, product.image);
    });

    stmt.finalize(() => {
      console.log('Database seeded with products!');
      db.close();
    });
  });
};

seedDatabase();