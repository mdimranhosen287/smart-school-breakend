import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongoose initialization with fail-fast options
mongoose.set("bufferCommands", false);
let isMongoConnected = false;

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
    .then(() => {
      isMongoConnected = true;
      console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
      console.warn("MongoDB connection failed, falling back to in-memory store:", err.message);
    });
} else {
  console.log("No MONGODB_URI provided. Running with in-memory store.");
}

// In-Memory Data Store (Pre-populated for instant preview)
const db = {
  students: [
    { id: "STU-1001", name: "Aarav Sharma", class: "10-A", roll: 1, gender: "Male", parent: "Rajesh Sharma", phone: "+1 555-0192", status: "Active", attendanceRate: "96%" },
    { id: "STU-1002", name: "Ananya Roy", class: "10-A", roll: 2, gender: "Female", parent: "Sanjay Roy", phone: "+1 555-0143", status: "Active", attendanceRate: "98%" },
    { id: "STU-1003", name: "Rohan Patel", class: "10-B", roll: 1, gender: "Male", parent: "Vikram Patel", phone: "+1 555-0188", status: "Active", attendanceRate: "92%" },
    { id: "STU-1004", name: "Priya Das", class: "9-A", roll: 1, gender: "Female", parent: "Subhash Das", phone: "+1 555-0122", status: "Active", attendanceRate: "95%" },
    { id: "STU-1005", name: "Kabir Mehta", class: "9-B", roll: 1, gender: "Male", parent: "Anil Mehta", phone: "+1 555-0177", status: "Active", attendanceRate: "90%" }
  ],
  teachers: [
    { id: "TCH-201", name: "Dr. Evelyn Reed", subject: "Mathematics", email: "evelyn.reed@smartschool.edu", phone: "+1 555-0311", status: "Full-Time" },
    { id: "TCH-202", name: "Prof. Marcus Vance", subject: "Physics", email: "marcus.vance@smartschool.edu", phone: "+1 555-0322", status: "Full-Time" },
    { id: "TCH-203", name: "Sarah Jenkins", subject: "English Literature", email: "s.jenkins@smartschool.edu", phone: "+1 555-0333", status: "Full-Time" },
    { id: "TCH-204", name: "David Kim", subject: "Computer Science", email: "david.kim@smartschool.edu", phone: "+1 555-0344", status: "Full-Time" }
  ],
  classes: [
    { id: "CLS-10A", name: "Grade 10-A", teacher: "Dr. Evelyn Reed", room: "Room 301", studentsCount: 32 },
    { id: "CLS-10B", name: "Grade 10-B", teacher: "Prof. Marcus Vance", room: "Room 302", studentsCount: 30 },
    { id: "CLS-9A", name: "Grade 9-A", teacher: "Sarah Jenkins", room: "Room 201", studentsCount: 28 },
    { id: "CLS-9B", name: "Grade 9-B", teacher: "David Kim", room: "Lab 102", studentsCount: 29 }
  ],
  notices: [
    { id: "NTC-01", title: "Annual Science Exhibition 2026", category: "Event", date: "2026-08-05", author: "Principal Office", content: "All students from Grade 6-10 are invited to submit project prototypes by July 30th." },
    { id: "NTC-02", title: "Mid-Term Examination Schedule", category: "Exam", date: "2026-08-15", author: "Academic Cell", content: "Mid-term examinations will commence from August 15th. Detailed timetable published." },
    { id: "NTC-03", title: "Parent-Teacher Meeting (PTM)", category: "General", date: "2026-07-28", author: "Administration", content: "PTM for Grade 9 & 10 scheduled for Saturday 10:00 AM in the Auditorium." }
  ],
  attendance: [
    { date: "2026-07-27", class: "10-A", present: 30, absent: 2, percentage: 93.7 },
    { date: "2026-07-27", class: "10-B", present: 28, absent: 2, percentage: 93.3 },
    { date: "2026-07-27", class: "9-A", present: 27, absent: 1, percentage: 96.4 }
  ],
  fees: [
    { id: "FEE-801", studentId: "STU-1001", studentName: "Aarav Sharma", amount: 1200, dueDate: "2026-08-01", status: "Paid" },
    { id: "FEE-802", studentId: "STU-1002", studentName: "Ananya Roy", amount: 1200, dueDate: "2026-08-01", status: "Paid" },
    { id: "FEE-803", studentId: "STU-1003", studentName: "Rohan Patel", amount: 1200, dueDate: "2026-08-01", status: "Pending" }
  ]
};

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Smart School Backend API",
    version: "1.0.0",
    database: isMongoConnected ? "MongoDB Connected" : "In-Memory Store Active",
    timestamp: new Date().toISOString()
  });
});

// Dashboard stats summary
app.get("/api/stats", (req, res) => {
  res.json({
    totalStudents: db.students.length,
    totalTeachers: db.teachers.length,
    totalClasses: db.classes.length,
    totalNotices: db.notices.length,
    averageAttendance: "94.8%",
    pendingFees: db.fees.filter((f) => f.status === "Pending").length,
    recentNotices: db.notices.slice(0, 3)
  });
});

// Students API
app.get("/api/students", (req, res) => {
  let list = db.students;
  if (req.query.class) {
    list = list.filter((s) => s.class.toLowerCase() === req.query.class.toLowerCase());
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    list = list.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }
  res.json(list);
});

app.post("/api/students", (req, res) => {
  const { name, class: className, parent, phone, gender } = req.body;
  if (!name || !className) {
    return res.status(400).json({ error: "Name and Class are required fields" });
  }
  const newStudent = {
    id: `STU-${1000 + db.students.length + 1}`,
    name,
    class: className,
    roll: db.students.filter((s) => s.class === className).length + 1,
    gender: gender || "Unspecified",
    parent: parent || "N/A",
    phone: phone || "N/A",
    status: "Active",
    attendanceRate: "100%"
  };
  db.students.push(newStudent);
  res.status(201).json(newStudent);
});

app.delete("/api/students/:id", (req, res) => {
  const index = db.students.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });
  const deleted = db.students.splice(index, 1);
  res.json({ message: "Student deleted successfully", student: deleted[0] });
});

// Teachers API
app.get("/api/teachers", (req, res) => {
  res.json(db.teachers);
});

app.post("/api/teachers", (req, res) => {
  const { name, subject, email, phone } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ error: "Name and Subject are required" });
  }
  const newTeacher = {
    id: `TCH-${200 + db.teachers.length + 1}`,
    name,
    subject,
    email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@smartschool.edu`,
    phone: phone || "N/A",
    status: "Full-Time"
  };
  db.teachers.push(newTeacher);
  res.status(201).json(newTeacher);
});

// Classes API
app.get("/api/classes", (req, res) => {
  res.json(db.classes);
});

// Notices API
app.get("/api/notices", (req, res) => {
  res.json(db.notices);
});

app.post("/api/notices", (req, res) => {
  const { title, category, content, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and Content are required" });
  }
  const newNotice = {
    id: `NTC-0${db.notices.length + 1}`,
    title,
    category: category || "General",
    date: new Date().toISOString().split("T")[0],
    author: author || "Administration",
    content
  };
  db.notices.unshift(newNotice);
  res.status(201).json(newNotice);
});

// Attendance API
app.get("/api/attendance", (req, res) => {
  res.json(db.attendance);
});

app.post("/api/attendance", (req, res) => {
  const { className, presentCount, totalCount } = req.body;
  const present = Number(presentCount) || 0;
  const total = Number(totalCount) || 30;
  const record = {
    date: new Date().toISOString().split("T")[0],
    class: className || "10-A",
    present,
    absent: total - present,
    percentage: Number(((present / total) * 100).toFixed(1))
  };
  db.attendance.unshift(record);
  res.status(201).json(record);
});

// Fees API
app.get("/api/fees", (req, res) => {
  res.json(db.fees);
});

// AI Notice & Circular Generator Endpoint using @google/genai
app.post("/api/ai/generate-notice", async (req, res) => {
  const { topic, targetAudience, tone } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic parameter is required" });
  }

  const prompt = `You are an AI Communications Officer for Smart School Management. Draft a formal, clear, and engaging school notice based on the following details:
Topic/Event: ${topic}
Target Audience: ${targetAudience || "Students and Parents"}
Tone: ${tone || "Formal and Encouraging"}

Output format JSON:
{
  "title": "Clear catchy title",
  "category": "Category like Event, Exam, Circular, Holiday, or General",
  "content": "Detailed well-formatted notice message with date/location details if applicable."
}`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if API key is not yet configured
      return res.json({
        generatedNotice: {
          title: `Official Announcement: ${topic}`,
          category: "General",
          content: `Dear ${targetAudience || "Students and Parents"},\n\nThis is an official notice regarding ${topic}. Please take note of the upcoming schedules and guidelines.\n\nNote: For custom AI generations, please set GEMINI_API_KEY in the platform settings.\n\nWarm regards,\nSchool Administration`
        },
        note: "API Key not configured. Returning fallback structured template."
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text = response.text || "";
    let parsed;
    try {
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = {
        title: `Notice: ${topic}`,
        category: "General",
        content: text
      };
    }

    res.json({ generatedNotice: parsed });
  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500).json({
      error: "Failed to generate notice via AI",
      details: error.message
    });
  }
});

// Serve Single Page Application Admin UI
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart School Management Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; }
  </style>
</head>
<body class="text-slate-800">
  <div id="app" class="min-h-screen flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col justify-between p-4 flex-shrink-0">
      <div>
        <div class="flex items-center gap-3 px-2 py-3 border-b border-slate-800 mb-6">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
            🎓
          </div>
          <div>
            <h1 class="font-bold text-base leading-tight">Smart School</h1>
            <p class="text-xs text-slate-400">Admin Portal v1.0</p>
          </div>
        </div>

        <nav class="space-y-1" id="nav-menu">
          <button onclick="switchTab('dashboard')" id="btn-dashboard" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition bg-indigo-600 text-white">
            📊 <span>Dashboard</span>
          </button>
          <button onclick="switchTab('students')" id="btn-students" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">
            👨‍🎓 <span>Students</span>
          </button>
          <button onclick="switchTab('teachers')" id="btn-teachers" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">
            👩‍🏫 <span>Teachers</span>
          </button>
          <button onclick="switchTab('classes')" id="btn-classes" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">
            🏫 <span>Classes</span>
          </button>
          <button onclick="switchTab('notices')" id="btn-notices" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">
            📢 <span>Notices</span>
          </button>
          <button onclick="switchTab('ai')" id="btn-ai" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">
            🤖 <span>AI Generator</span>
          </button>
          <button onclick="switchTab('api')" id="btn-api" class="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">
            ⚡ <span>API Docs</span>
          </button>
        </nav>
      </div>

      <div class="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
        <p class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          API Online
        </p>
        <p class="text-[11px] text-slate-500">Port 3000 • Node.js Express</p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 md:p-8 overflow-y-auto">
      <!-- Header Bar -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h2 id="page-title" class="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p id="page-subtitle" class="text-sm text-slate-500">Real-time statistics & school metrics</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Backend Connected
          </span>
        </div>
      </header>

      <!-- TAB: DASHBOARD -->
      <section id="tab-dashboard" class="tab-content space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Students</p>
                <h3 id="stat-students" class="text-3xl font-bold text-slate-900 mt-2">--</h3>
              </div>
              <span class="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xl">👨‍🎓</span>
            </div>
            <p class="text-xs text-slate-500 mt-3 font-medium">Active Enrolled</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Teachers</p>
                <h3 id="stat-teachers" class="text-3xl font-bold text-slate-900 mt-2">--</h3>
              </div>
              <span class="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xl">👩‍🏫</span>
            </div>
            <p class="text-xs text-slate-500 mt-3 font-medium">Faculty Staff</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Classes</p>
                <h3 id="stat-classes" class="text-3xl font-bold text-slate-900 mt-2">--</h3>
              </div>
              <span class="p-2.5 bg-blue-50 text-blue-600 rounded-xl text-xl">🏫</span>
            </div>
            <p class="text-xs text-slate-500 mt-3 font-medium">Active Sections</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Attendance</p>
                <h3 id="stat-attendance" class="text-3xl font-bold text-slate-900 mt-2">--</h3>
              </div>
              <span class="p-2.5 bg-amber-50 text-amber-600 rounded-xl text-xl">📈</span>
            </div>
            <p class="text-xs text-slate-500 mt-3 font-medium">Daily Present Rate</p>
          </div>
        </div>

        <!-- Recent Notices & Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-slate-900 text-lg">Recent School Announcements</h3>
              <button onclick="switchTab('notices')" class="text-xs text-indigo-600 font-semibold hover:underline">View All →</button>
            </div>
            <div id="recent-notices-list" class="space-y-3">
              <p class="text-slate-400 text-sm italic">Loading announcements...</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-slate-900 text-lg mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button onclick="switchTab('students')" class="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>➕ Add New Student</span>
                  <span class="text-indigo-600">→</span>
                </button>
                <button onclick="switchTab('notices')" class="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>📢 Broadcast Notice</span>
                  <span class="text-indigo-600">→</span>
                </button>
                <button onclick="switchTab('ai')" class="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>🤖 Draft AI Notice</span>
                  <span class="text-indigo-600">→</span>
                </button>
              </div>
            </div>
            <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p class="font-semibold text-slate-800">System Status</p>
              <p>REST API Endpoint: <code class="text-indigo-600">/api/*</code></p>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB: STUDENTS -->
      <section id="tab-students" class="tab-content hidden space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 class="font-bold text-slate-900 text-lg">Student Directory</h3>
            <button onclick="openAddStudentModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow transition">
              + Add Student
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th class="p-3">ID</th>
                  <th class="p-3">Name</th>
                  <th class="p-3">Class</th>
                  <th class="p-3">Parent</th>
                  <th class="p-3">Phone</th>
                  <th class="p-3">Attendance</th>
                  <th class="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="students-table-body" class="divide-y divide-slate-100 text-sm text-slate-700">
                <!-- Loaded dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB: TEACHERS -->
      <section id="tab-teachers" class="tab-content hidden space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-lg">Faculty & Staff Directory</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="teachers-grid">
            <!-- Loaded dynamically -->
          </div>
        </div>
      </section>

      <!-- TAB: CLASSES -->
      <section id="tab-classes" class="tab-content hidden space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-lg">Classes & Sections</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="classes-grid">
            <!-- Loaded dynamically -->
          </div>
        </div>
      </section>

      <!-- TAB: NOTICES -->
      <section id="tab-notices" class="tab-content hidden space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 class="font-bold text-slate-900 text-lg">Post New Notice</h3>
            <form id="notice-form" onsubmit="postNotice(event)" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                <input type="text" id="notice-title" required class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600" placeholder="e.g. Sports Day Announcement">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select id="notice-category" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600">
                  <option value="Event">Event</option>
                  <option value="Exam">Exam</option>
                  <option value="Circular">Circular</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Content</label>
                <textarea id="notice-content" rows="4" required class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600" placeholder="Write notice details..."></textarea>
              </div>
              <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition">
                Publish Notice
              </button>
            </form>
          </div>

          <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 class="font-bold text-slate-900 text-lg">Notice Board</h3>
            <div id="notices-board" class="space-y-4">
              <!-- Loaded dynamically -->
            </div>
          </div>
        </div>
      </section>

      <!-- TAB: AI GENERATOR -->
      <section id="tab-ai" class="tab-content hidden space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 class="font-bold text-slate-900 text-lg flex items-center gap-2">
              <span>🤖</span> AI School Notice & Circular Draft Assistant
            </h3>
            <p class="text-sm text-slate-500">Powered by Gemini 2.5 Flash API</p>
          </div>

          <form id="ai-notice-form" onsubmit="generateAINotice(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Topic / Key Details</label>
              <input type="text" id="ai-topic" required class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600" placeholder="e.g., Postponement of Mathematics Exam to next Friday due to rainy weather">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Target Audience</label>
                <input type="text" id="ai-audience" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600" placeholder="e.g., Grade 10 Students & Parents">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Tone</label>
                <select id="ai-tone" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600">
                  <option value="Formal & Official">Formal & Official</option>
                  <option value="Warm & Encouraging">Warm & Encouraging</option>
                  <option value="Urgent Circular">Urgent Circular</option>
                </select>
              </div>
            </div>

            <button type="submit" id="btn-ai-submit" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2">
              <span>✨ Generate Notice with Gemini AI</span>
            </button>
          </form>

          <div id="ai-result" class="hidden mt-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3">
            <div class="flex justify-between items-center">
              <span id="ai-result-category" class="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg uppercase"></span>
              <button onclick="publishAIGeneratedNotice()" class="text-xs font-semibold text-indigo-700 hover:underline">Publish to Notice Board →</button>
            </div>
            <h4 id="ai-result-title" class="font-bold text-slate-900 text-base"></h4>
            <p id="ai-result-content" class="text-sm text-slate-700 whitespace-pre-line"></p>
          </div>
        </div>
      </section>

      <!-- TAB: API DOCS -->
      <section id="tab-api" class="tab-content hidden space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-lg">API Endpoint Documentation</h3>
          <p class="text-sm text-slate-500">Test live backend REST API endpoints directly from your browser.</p>

          <div class="space-y-3 font-mono text-xs">
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">GET</span>
                <span>/api/health</span>
              </span>
              <button onclick="testEndpoint('/api/health')" class="px-3 py-1 bg-slate-800 text-white rounded font-sans hover:bg-slate-700">Execute</button>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">GET</span>
                <span>/api/stats</span>
              </span>
              <button onclick="testEndpoint('/api/stats')" class="px-3 py-1 bg-slate-800 text-white rounded font-sans hover:bg-slate-700">Execute</button>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">GET</span>
                <span>/api/students</span>
              </span>
              <button onclick="testEndpoint('/api/students')" class="px-3 py-1 bg-slate-800 text-white rounded font-sans hover:bg-slate-700">Execute</button>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">GET</span>
                <span>/api/teachers</span>
              </span>
              <button onclick="testEndpoint('/api/teachers')" class="px-3 py-1 bg-slate-800 text-white rounded font-sans hover:bg-slate-700">Execute</button>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">GET</span>
                <span>/api/notices</span>
              </span>
              <button onclick="testEndpoint('/api/notices')" class="px-3 py-1 bg-slate-800 text-white rounded font-sans hover:bg-slate-700">Execute</button>
            </div>
          </div>

          <div id="api-output-container" class="hidden mt-4">
            <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Response JSON:</h4>
            <pre id="api-output" class="p-4 bg-slate-900 text-emerald-400 text-xs rounded-xl overflow-x-auto max-h-80"></pre>
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- Add Student Modal -->
  <div id="student-modal" class="hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-slate-900 text-lg">Add New Student</h3>
        <button onclick="closeAddStudentModal()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
      </div>
      <form onsubmit="saveStudent(event)" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
          <input type="text" id="modal-student-name" required class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Class & Section</label>
          <input type="text" id="modal-student-class" required placeholder="e.g. 10-A" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Parent/Guardian</label>
          <input type="text" id="modal-student-parent" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Contact Phone</label>
          <input type="text" id="modal-student-phone" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600">
        </div>
        <div class="pt-2 flex justify-end gap-2">
          <button type="button" onclick="closeAddStudentModal()" class="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Save Student</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let currentAIGeneratedNotice = null;

    document.addEventListener("DOMContentLoaded", () => {
      loadStats();
      loadNotices();
      loadStudents();
      loadTeachers();
      loadClasses();
    });

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('text-slate-300', 'hover:bg-slate-800', 'hover:text-white');
      });

      const selectedTab = document.getElementById('tab-' + tabId);
      const selectedBtn = document.getElementById('btn-' + tabId);
      if (selectedTab) selectedTab.classList.remove('hidden');
      if (selectedBtn) {
        selectedBtn.classList.remove('text-slate-300', 'hover:bg-slate-800', 'hover:text-white');
        selectedBtn.classList.add('bg-indigo-600', 'text-white');
      }

      const titles = {
        dashboard: { title: "Dashboard Overview", sub: "Real-time statistics & school metrics" },
        students: { title: "Student Management", sub: "Search, filter and manage student profiles" },
        teachers: { title: "Teachers Directory", sub: "Faculty members and subject assignments" },
        classes: { title: "Classes & Sections", sub: "Classrooms, schedules and student counts" },
        notices: { title: "School Notice Board", sub: "Publish circulars and announcements" },
        ai: { title: "AI Assistant", sub: "Draft school notices with Gemini AI" },
        api: { title: "API Documentation", sub: "Test live Express REST API endpoints" }
      };

      if (titles[tabId]) {
        document.getElementById('page-title').innerText = titles[tabId].title;
        document.getElementById('page-subtitle').innerText = titles[tabId].sub;
      }
    }

    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('stat-students').innerText = data.totalStudents;
        document.getElementById('stat-teachers').innerText = data.totalTeachers;
        document.getElementById('stat-classes').innerText = data.totalClasses;
        document.getElementById('stat-attendance').innerText = data.averageAttendance;

        const recentBox = document.getElementById('recent-notices-list');
        if (data.recentNotices && data.recentNotices.length > 0) {
          recentBox.innerHTML = data.recentNotices.map(n => \`
            <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">\${n.category}</span>
                <span class="text-xs text-slate-400">\${n.date}</span>
              </div>
              <h4 class="font-semibold text-slate-800 text-sm mt-1">\${n.title}</h4>
              <p class="text-xs text-slate-600 line-clamp-1 mt-1">\${n.content}</p>
            </div>
          \`).join('');
        }
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    }

    async function loadStudents() {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        const tbody = document.getElementById('students-table-body');
        tbody.innerHTML = data.map(s => \`
          <tr class="hover:bg-slate-50/50">
            <td class="p-3 font-mono text-xs text-slate-500">\${s.id}</td>
            <td class="p-3 font-semibold text-slate-900">\${s.name}</td>
            <td class="p-3"><span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium text-xs">\${s.class}</span></td>
            <td class="p-3">\${s.parent}</td>
            <td class="p-3 text-slate-500">\${s.phone}</td>
            <td class="p-3 font-medium text-emerald-600">\${s.attendanceRate}</td>
            <td class="p-3 text-right">
              <button onclick="deleteStudent('\${s.id}')" class="text-red-500 hover:text-red-700 font-semibold text-xs">Delete</button>
            </td>
          </tr>
        \`).join('');
      } catch (err) {
        console.error("Error loading students:", err);
      }
    }

    async function loadTeachers() {
      try {
        const res = await fetch('/api/teachers');
        const data = await res.json();
        const grid = document.getElementById('teachers-grid');
        grid.innerHTML = data.map(t => \`
          <div class="p-4 border border-slate-200 rounded-xl flex items-center gap-4 bg-slate-50/50">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
              \${t.name.charAt(0)}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">\${t.name}</h4>
              <p class="text-xs text-indigo-600 font-semibold">\${t.subject}</p>
              <p class="text-xs text-slate-500 mt-0.5">\${t.email}</p>
            </div>
          </div>
        \`).join('');
      } catch (err) {
        console.error("Error loading teachers:", err);
      }
    }

    async function loadClasses() {
      try {
        const res = await fetch('/api/classes');
        const data = await res.json();
        const grid = document.getElementById('classes-grid');
        grid.innerHTML = data.map(c => \`
          <div class="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-2">
            <div class="flex justify-between items-center">
              <h4 class="font-bold text-slate-900 text-base">\${c.name}</h4>
              <span class="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded">\${c.room}</span>
            </div>
            <p class="text-xs text-slate-500">Class Teacher: <span class="font-medium text-slate-800">\${c.teacher}</span></p>
            <p class="text-xs text-slate-500">Enrolled: <span class="font-bold text-indigo-600">\${c.studentsCount} Students</span></p>
          </div>
        \`).join('');
      } catch (err) {
        console.error("Error loading classes:", err);
      }
    }

    async function loadNotices() {
      try {
        const res = await fetch('/api/notices');
        const data = await res.json();
        const board = document.getElementById('notices-board');
        board.innerHTML = data.map(n => \`
          <div class="p-4 border border-slate-200 rounded-2xl bg-white space-y-2">
            <div class="flex justify-between items-center">
              <span class="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg uppercase">\${n.category}</span>
              <span class="text-xs text-slate-400">\${n.date} • \${n.author}</span>
            </div>
            <h4 class="font-bold text-slate-900 text-base">\${n.title}</h4>
            <p class="text-sm text-slate-600 whitespace-pre-line">\${n.content}</p>
          </div>
        \`).join('');
      } catch (err) {
        console.error("Error loading notices:", err);
      }
    }

    async function postNotice(e) {
      e.preventDefault();
      const title = document.getElementById('notice-title').value;
      const category = document.getElementById('notice-category').value;
      const content = document.getElementById('notice-content').value;

      await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content })
      });

      document.getElementById('notice-title').value = '';
      document.getElementById('notice-content').value = '';
      loadNotices();
      loadStats();
    }

    async function generateAINotice(e) {
      e.preventDefault();
      const topic = document.getElementById('ai-topic').value;
      const audience = document.getElementById('ai-audience').value;
      const tone = document.getElementById('ai-tone').value;

      const btn = document.getElementById('btn-ai-submit');
      btn.innerHTML = '⏳ Generating with Gemini...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/ai/generate-notice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, targetAudience: audience, tone })
        });
        const data = await res.json();
        if (data.generatedNotice) {
          currentAIGeneratedNotice = data.generatedNotice;
          document.getElementById('ai-result-category').innerText = data.generatedNotice.category || 'General';
          document.getElementById('ai-result-title').innerText = data.generatedNotice.title || 'Notice';
          document.getElementById('ai-result-content').innerText = data.generatedNotice.content || '';
          document.getElementById('ai-result').classList.remove('hidden');
        }
      } catch (err) {
        alert("Failed to generate notice: " + err.message);
      } finally {
        btn.innerHTML = '✨ Generate Notice with Gemini AI';
        btn.disabled = false;
      }
    }

    async function publishAIGeneratedNotice() {
      if (!currentAIGeneratedNotice) return;
      await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentAIGeneratedNotice.title,
          category: currentAIGeneratedNotice.category,
          content: currentAIGeneratedNotice.content,
          author: "Gemini AI Officer"
        })
      });
      alert("Notice published to school board!");
      switchTab('notices');
      loadNotices();
    }

    function openAddStudentModal() {
      document.getElementById('student-modal').classList.remove('hidden');
    }

    function closeAddStudentModal() {
      document.getElementById('student-modal').classList.add('hidden');
    }

    async function saveStudent(e) {
      e.preventDefault();
      const name = document.getElementById('modal-student-name').value;
      const className = document.getElementById('modal-student-class').value;
      const parent = document.getElementById('modal-student-parent').value;
      const phone = document.getElementById('modal-student-phone').value;

      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, class: className, parent, phone })
      });

      closeAddStudentModal();
      loadStudents();
      loadStats();
    }

    async function deleteStudent(id) {
      if (!confirm("Are you sure you want to delete student " + id + "?")) return;
      await fetch('/api/students/' + id, { method: 'DELETE' });
      loadStudents();
      loadStats();
    }

    async function testEndpoint(endpoint) {
      const res = await fetch(endpoint);
      const json = await res.json();
      document.getElementById('api-output').innerText = JSON.stringify(json, null, 2);
      document.getElementById('api-output-container').classList.remove('hidden');
    }
  </script>
</body>
</html>`);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
