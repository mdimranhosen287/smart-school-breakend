const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Prevent server process crashes on uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory fallback store when MySQL is unreachable
let memoryStudents = [
  {
    id: 1,
    name: "Rahim Ahmed",
    roll: "101",
    class: "10",
    section: "A",
    phone: "01700000000",
    image: "https://via.placeholder.com/150",
    address: "Dhaka, Bangladesh",
    created_at: new Date().toISOString()
  }
];
let nextStudentId = 2;
let useDatabase = true;

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
    useDatabase = true;
    console.log('Students table checked/created successfully in MySQL database.');
  } catch (error) {
    useDatabase = false;
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      console.log(`Database note: MySQL not reachable at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}. Using in-memory fallback storage.`);
    } else {
      console.error('Error initializing database table:', error.message);
    }
  }
}

// Run DB table initialization on startup
initDb();

// Basic Root Route
app.get('/', (req, res) => {
  res.send('Smart School Backend is Running!');
});

// Test Database Connection Route
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    useDatabase = true;
    res.json({ message: 'Database connected successfully!', result: rows[0].result });
  } catch (error) {
    useDatabase = false;
    console.error('Database connection error:', error);
    res.status(200).json({
      status: 'fallback',
      message: 'Running in fallback memory mode (MySQL unreachable)',
      details: error.message
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

  if (useDatabase) {
    try {
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
      
      return res.status(201).json({ 
        message: "Student added successfully!", 
        studentId: result.insertId 
      });
    } catch (error) {
      console.error('MySQL insert error, switching to memory fallback:', error.message);
      useDatabase = false;
    }
  }

  // Memory fallback
  const newStudent = {
    id: nextStudentId++,
    name,
    roll: studentRoll,
    class: className,
    section: section || null,
    phone: phone || null,
    image: image || null,
    address: address || null,
    created_at: new Date().toISOString()
  };
  memoryStudents.unshift(newStudent);
  res.status(201).json({ 
    message: "Student added successfully (Memory mode)!", 
    studentId: newStudent.id 
  });
});

// 2. Get all students (READ ALL)
app.get('/api/students', async (req, res) => {
  if (useDatabase) {
    try {
      const [rows] = await pool.execute('SELECT * FROM students ORDER BY id DESC');
      return res.status(200).json(rows);
    } catch (error) {
      console.error('MySQL fetch error, switching to memory fallback:', error.message);
      useDatabase = false;
    }
  }

  // Memory fallback
  res.status(200).json(memoryStudents);
});

// 3. Get single student by ID (READ SINGLE)
app.get('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  if (useDatabase) {
    try {
      const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Student not found!" });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error('MySQL fetch single error, switching to memory fallback:', error.message);
      useDatabase = false;
    }
  }

  // Memory fallback
  const student = memoryStudents.find(s => s.id == id);
  if (!student) {
    return res.status(404).json({ message: "Student not found!" });
  }
  res.status(200).json(student);
});

// 4. Update student information (UPDATE)
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, roll, roll_number, class: className, section, phone, image, address } = req.body;
  const studentRoll = roll || roll_number;

  if (useDatabase) {
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

      return res.status(200).json({ message: "Student updated successfully!" });
    } catch (error) {
      console.error('MySQL update error, switching to memory fallback:', error.message);
      useDatabase = false;
    }
  }

  // Memory fallback
  const index = memoryStudents.findIndex(s => s.id == id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found!" });
  }
  memoryStudents[index] = {
    ...memoryStudents[index],
    name: name !== undefined ? name : memoryStudents[index].name,
    roll: studentRoll !== undefined ? studentRoll : memoryStudents[index].roll,
    class: className !== undefined ? className : memoryStudents[index].class,
    section: section !== undefined ? section : memoryStudents[index].section,
    phone: phone !== undefined ? phone : memoryStudents[index].phone,
    image: image !== undefined ? image : memoryStudents[index].image,
    address: address !== undefined ? address : memoryStudents[index].address,
  };
  res.status(200).json({ message: "Student updated successfully (Memory mode)!" });
});

// 5. Delete student (DELETE)
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  if (useDatabase) {
    try {
      const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Student not found!" });
      }

      return res.status(200).json({ message: "Student deleted successfully!" });
    } catch (error) {
      console.error('MySQL delete error, switching to memory fallback:', error.message);
      useDatabase = false;
    }
  }

  // Memory fallback
  const index = memoryStudents.findIndex(s => s.id == id);
  if (index === -1) {
    return res.status(404).json({ message: "Student not found!" });
  }
  memoryStudents.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully (Memory mode)!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

