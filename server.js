const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Root Route
app.get('/', (req, res) => {
  res.send('Smart School Backend is Running!');
});

// Test Database Connection Route
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Database connected successfully!', result: rows[0].result });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      details: error.message,
      suggestion: 'Check DB_USER, DB_PASS, DB_NAME, and DB_HOST in .env. Ensure the database user is assigned to the database with ALL PRIVILEGES in Hostinger hPanel.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
