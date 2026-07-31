const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Prevent server process crashes on uncaught errors (prevents Hostinger 503 Service Unavailable)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors());
app.use(express.json());

// Function to auto-create students table if it doesn't exist in MySQL
async function initDb() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        roll VARCHAR(100) NOT NULL,
        class VARCHAR(100) NOT NULL,
        section VARCHAR(100) DEFAULT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        image TEXT DEFAULT NULL,
        address TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.execute(createTableQuery);
    console.log('Students table checked/created successfully in MySQL database.');
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log(`Database note: Could not connect to MySQL at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306} (${error.message}). This is normal in preview if the DB is remote.`);
    } else {
      console.error('Error initializing database table:', error.message);
    }
  }
}

// Run DB table initialization
initDb();

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

// Banner Dummy Route
app.get('/api/banner', (req, res) => {
  res.status(200).json({
    message: "Banner fetched successfully",
    banners: []
  });
});

// ================= STUDENTS CRUD API ROUTES ================= //

// 1. Add new student (CREATE)
app.post('/api/students', async (req, res) => {
  const { name, roll, roll_number, class: className, section, phone, image, address } = req.body;
  const studentRoll = roll || roll_number;
  
  if (!name || !studentRoll || !className) {
    return res.status(400).json({ error: "Name, Roll, and Class are required!" });
  }

  try {
    await initDb(); // Ensure table exists
    const query = `
      INSERT INTO students (name, roll, class, section, phone, image, address) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      name,
      studentRoll,
      className,
      section || null,
      phone || null,
      image || null,
      address || null
    ]);
    
    res.status(201).json({ 
      message: "Student added successfully!", 
      studentId: result.insertId 
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Get all students (READ ALL)
app.get('/api/students', async (req, res) => {
  try {
    await initDb(); // Ensure table exists
    const [rows] = await pool.execute('SELECT * FROM students ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ 
      error: 'Failed to fetch students', 
      details: error.message,
      suggestion: 'Please verify database connection credentials in .env and ensure MySQL database user has table permissions.'
    });
  }
});

// 3. Get single student by ID (READ SINGLE)
app.get('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found!" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Update student information (UPDATE)
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, roll, roll_number, class: className, section, phone, image, address } = req.body;
  const studentRoll = roll || roll_number;

  try {
    const query = `
      UPDATE students 
      SET name = ?, roll = ?, class = ?, section = ?, phone = ?, image = ?, address = ? 
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      name,
      studentRoll,
      className,
      section || null,
      phone || null,
      image || null,
      address || null,
      id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found!" });
    }

    res.status(200).json({ message: "Student updated successfully!" });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Delete student (DELETE)
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found!" });
    }

    res.status(200).json({ message: "Student deleted successfully!" });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

