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

// ================= STUDENTS CRUD API ROUTES ================= //

// 1. Add new student (CREATE)
app.post('/api/students', async (req, res) => {
  const { name, roll, class: className, section, phone, image, address } = req.body;
  
  if (!name || !roll || !className) {
    return res.status(400).json({ error: "Name, Roll, and Class are required!" });
  }

  try {
    const query = `
      INSERT INTO students (name, roll, class, section, phone, image, address) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      name,
      roll,
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
    const [rows] = await pool.execute('SELECT * FROM students ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
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
  const { name, roll, class: className, section, phone, image, address } = req.body;

  try {
    const query = `
      UPDATE students 
      SET name = ?, roll = ?, class = ?, section = ?, phone = ?, image = ?, address = ? 
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      name,
      roll,
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
