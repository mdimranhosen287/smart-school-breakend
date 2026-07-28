import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  DollarSign, 
  CheckSquare, 
  FileSpreadsheet, 
  Award, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Printer, 
  Download, 
  Search, 
  Coins, 
  Activity, 
  FileText, 
  Sliders, 
  UserPlus, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Code,
  Database,
  GraduationCap,
  Save,
  Filter,
  Send,
  Check,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

interface ReportsManagerProps {
  lang: 'en' | 'bn';
  schoolClasses: Array<{ id: string; name: string }>;
  students: Array<{
    id: string;
    photo: string;
    name: string;
    class: string;
    section: string;
    roll: string;
    group: string;
    guardianName: string;
    guardianPhone: string;
    status: 'Active' | 'Inactive';
    loginActive: boolean;
    deactivateReason?: string;
  }>;
  setStudents: React.Dispatch<React.SetStateAction<any[]>>;
  addAuditLog: (msg: string) => void;
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({
  lang,
  schoolClasses,
  students,
  setStudents,
  addAuditLog
}) => {
  // Global Filters for Reports
  const [reportStartDate, setReportStartDate] = useState('2026-01-01');
  const [reportEndDate, setReportEndDate] = useState('2026-12-31');
  const [reportClass, setReportClass] = useState('All');
  const [reportSection, setReportSection] = useState('All');
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  
  // Selection of the active nested sub-report
  const [activeReportOption, setActiveReportOption] = useState<string>('sibling_report');
  
  // Accordion Expand/Collapse State
  const [expandedReportCategories, setExpandedReportCategories] = useState<Record<string, boolean>>({
    student_reports: true,
    fees_reports: true,
    financial_reports: true,
    attendance_reports: true,
    human_resource_reports: true,
    examination_reports: true
  });

  // Pagination & Search States per sub-report
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Notification States
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- PRIMARY SECTION REPORT STATES ---
  const [primYear, setPrimYear] = useState('2026');
  const [primExam, setPrimExam] = useState('Annual Examination');
  const [primClass, setPrimClass] = useState('Class 3');
  const [primSection, setPrimSection] = useState('A');
  const [primPrintAttendance, setPrimPrintAttendance] = useState(true);
  const [primPrintGradeScale, setPrimPrintGradeScale] = useState(true);
  const [primPrintDate, setPrimPrintDate] = useState('2026-07-11');
  const [primSearch, setPrimSearch] = useState('');
  const [primRowsPerPage, setPrimRowsPerPage] = useState(10);
  const [primCurrentPage, setPrimCurrentPage] = useState(1);
  const [primSelectedStudentId, setPrimSelectedStudentId] = useState<string | null>(null);
  const [reportLang, setReportLang] = useState<'EN' | 'BN'>('EN');
  const [parentPhone, setParentPhone] = useState('+880 1711 223344');

  // --- HIGH SECTION REPORT STATES ---
  const [highYear, setHighYear] = useState('2026');
  const [highExam, setHighExam] = useState('Annual Examination');
  const [highClass, setHighClass] = useState('Class 8');
  const [highSection, setHighSection] = useState('A');
  const [highPrintAttendance, setHighPrintAttendance] = useState(true);
  const [highPrintGradeScale, setHighPrintGradeScale] = useState(true);
  const [highPrintDate, setHighPrintDate] = useState('2026-07-11');
  const [highSearch, setHighSearch] = useState('');
  const [highRowsPerPage, setHighRowsPerPage] = useState(10);
  const [highCurrentPage, setHighCurrentPage] = useState(1);
  const [highSelectedStudentId, setHighSelectedStudentId] = useState<string | null>(null);

  // Custom structure to store edited marks and options per high section student
  const [highStudentData, setHighStudentData] = useState<Record<string, {
    remarks: string;
    moral: 'Excellent' | 'Good' | 'Average' | 'Poor';
    attendanceDays: number;
    attendancePresent: number;
    coCurricular: {
      sports: string;
      cultural: string;
      scout: string;
      discipline: string;
      attendance: string;
    };
    subjects: Array<{
      subject: string;
      fullMarks: number;
      highest: number;
      mt: number; // Mid Term / Class Test
      se: number; // Semester End / Written Exam
      grace: number;
    }>;
  }>>({});

  // Helper to initialize and get student report card data for high section
  const getHighStudentDefaultData = (studentId: string) => {
    const lastDigit = parseInt(studentId.replace(/\D/g, '')) || 5;
    const baseMark = 68 + (lastDigit * 4) % 20; // range 68 to 88
    
    const defaultSubjects = [
      { subject: 'Bangla', fullMarks: 100, highest: 88, mt: Math.round(baseMark * 0.3) - 2, se: Math.round(baseMark * 0.5) + (lastDigit % 5), grace: 0 },
      { subject: 'English', fullMarks: 100, highest: 92, mt: Math.round((baseMark - 2) * 0.3), se: Math.round((baseMark - 2) * 0.5) + (lastDigit % 3), grace: 0 },
      { subject: 'Mathematics', fullMarks: 100, highest: 96, mt: Math.round((baseMark + 6) * 0.3), se: Math.round((baseMark + 6) * 0.5) + (lastDigit % 4), grace: 0 },
      { subject: 'Science', fullMarks: 100, highest: 90, mt: Math.round(baseMark * 0.3) + 1, se: Math.round(baseMark * 0.5) + (lastDigit % 2), grace: 0 },
      { subject: 'Bangladesh & Global Studies', fullMarks: 100, highest: 85, mt: Math.round((baseMark - 4) * 0.3), se: Math.round((baseMark - 4) * 0.5), grace: 0 },
      { subject: 'ICT', fullMarks: 100, highest: 95, mt: Math.round((baseMark + 5) * 0.3), se: Math.round((baseMark + 5) * 0.5) - 1, grace: 0 },
      { subject: 'Religion', fullMarks: 100, highest: 94, mt: Math.round((baseMark + 3) * 0.3), se: Math.round((baseMark + 3) * 0.5) + 1, grace: 0 }
    ];

    return {
      remarks: 'Maintain consistency and focus more on math/science.',
      moral: 'Excellent' as const,
      attendanceDays: 220,
      attendancePresent: 205 + (lastDigit % 10),
      coCurricular: {
        sports: 'Good',
        cultural: 'Good',
        scout: 'Excellent',
        discipline: 'Good',
        attendance: 'Good'
      },
      subjects: defaultSubjects
    };
  };

  const getOrInitStudentHighData = (studentId: string) => {
    return highStudentData[studentId] || getHighStudentDefaultData(studentId);
  };

  // Custom structure to store edited marks and options per student
  const [primStudentData, setPrimStudentData] = useState<Record<string, {
    remarks: string;
    moral: 'Excellent' | 'Good' | 'Average' | 'Poor';
    attendanceDays: number;
    attendancePresent: number;
    coCurricular: {
      sports: string;
      cultural: string;
      scout: string;
      discipline: string;
      attendance: string;
    };
    subjects: Array<{
      subject: string;
      fullMarks: number;
      highest: number;
      mt: number; // Mid Term / Class Test
      se: number; // Semester End / Written Exam
      grace: number;
    }>;
  }>>({});

  // Helper to initialize and get student report card data
  const getStudentDefaultData = (studentId: string) => {
    const lastDigit = parseInt(studentId.replace(/\D/g, '')) || 5;
    const baseMark = 68 + (lastDigit * 4) % 20; // range 68 to 88
    
    const defaultSubjects = [
      { subject: 'Bangla', fullMarks: 100, highest: 88, mt: Math.round(baseMark * 0.3) - 2, se: Math.round(baseMark * 0.5) + (lastDigit % 5), grace: 0 },
      { subject: 'English', fullMarks: 100, highest: 92, mt: Math.round((baseMark - 2) * 0.3), se: Math.round((baseMark - 2) * 0.5) + (lastDigit % 3), grace: 0 },
      { subject: 'Mathematics', fullMarks: 100, highest: 96, mt: Math.round((baseMark + 6) * 0.3), se: Math.round((baseMark + 6) * 0.5) + (lastDigit % 4), grace: 0 },
      { subject: 'Elementary Science', fullMarks: 100, highest: 90, mt: Math.round(baseMark * 0.3) + 1, se: Math.round(baseMark * 0.5) + (lastDigit % 2), grace: 0 },
      { subject: 'Bangladesh & Global Studies', fullMarks: 100, highest: 85, mt: Math.round((baseMark - 4) * 0.3), se: Math.round((baseMark - 4) * 0.5), grace: 0 },
      { subject: 'Religion', fullMarks: 100, highest: 94, mt: Math.round((baseMark + 3) * 0.3), se: Math.round((baseMark + 3) * 0.5) + 1, grace: 0 }
    ];

    return {
      remarks: 'Keep up the good work and maintain consistency.',
      moral: 'Good' as const,
      attendanceDays: 220,
      attendancePresent: 200 + (lastDigit % 15),
      coCurricular: {
        sports: 'Good',
        cultural: 'Good',
        scout: 'Good',
        discipline: 'Good',
        attendance: 'Good'
      },
      subjects: defaultSubjects
    };
  };

  const getOrInitStudentPrimData = (studentId: string) => {
    return primStudentData[studentId] || getStudentDefaultData(studentId);
  };

  // Helper to determine letter grade and point
  const getGradeAndPoint = (total: number) => {
    if (total >= 80) return { grade: 'A+', point: 5.00 };
    if (total >= 70) return { grade: 'A', point: 4.00 };
    if (total >= 60) return { grade: 'A-', point: 3.50 };
    if (total >= 50) return { grade: 'B', point: 3.00 };
    if (total >= 40) return { grade: 'C', point: 2.00 };
    if (total >= 33) return { grade: 'D', point: 1.00 };
    return { grade: 'F', point: 0.00 };
  };

  // ----------------------------------------------------
  // DATASETS DEFINITIONS (MOCK + DYNAMIC FROM STUDENTS)
  // ----------------------------------------------------

  // 1. Sibling Groups (Dynamic from real students grouped by Guardian Phone)
  const getSiblingGroups = () => {
    const grouped: Record<string, typeof students> = {};
    students.forEach(st => {
      if (st.guardianPhone) {
        if (!grouped[st.guardianPhone]) {
          grouped[st.guardianPhone] = [];
        }
        grouped[st.guardianPhone].push(st);
      }
    });

    // Sibling groups are contacts with more than 1 student
    return Object.entries(grouped)
      .filter(([_, group]) => group.length > 1)
      .map(([phone, group]) => ({
        guardianPhone: phone,
        guardianName: group[0].guardianName,
        children: group
      }));
  };

  // 2. Admission Applications Mock Data
  const [admissionsData, setAdmissionsData] = useState([
    { id: 'ADM-2026-001', name: 'Nabil Anjum', class: '6', gender: 'Male', date: '2026-06-15', status: 'Approved', fee: 5000 },
    { id: 'ADM-2026-002', name: 'Sadia Islam', class: '8', gender: 'Female', date: '2026-07-02', status: 'Pending', fee: 5000 },
    { id: 'ADM-2026-003', name: 'Tasnim Kabir', class: '1', gender: 'Female', date: '2026-07-05', status: 'Incomplete', fee: 3500 },
    { id: 'ADM-2026-004', name: 'Wasif Zaman', class: '9', gender: 'Male', date: '2026-07-09', status: 'Approved', fee: 6000 },
    { id: 'ADM-2026-005', name: 'Imtiaz Ahmed', class: '5', gender: 'Male', date: '2026-07-10', status: 'Pending', fee: 4000 }
  ]);

  // 3. Class Capacity Data
  const classCapacityData = [
    { name: 'Class 1', capacity: 80, enrolled: 72 },
    { name: 'Class 2', capacity: 80, enrolled: 68 },
    { name: 'Class 3', capacity: 90, enrolled: 85 },
    { name: 'Class 4', capacity: 90, enrolled: 78 },
    { name: 'Class 5', capacity: 100, enrolled: 95 },
    { name: 'Class 6', capacity: 100, enrolled: 89 },
    { name: 'Class 7', capacity: 100, enrolled: 82 },
    { name: 'Class 8', capacity: 100, enrolled: 91 },
    { name: 'Class 9', capacity: 80, enrolled: 75 },
    { name: 'Class 10', capacity: 80, enrolled: 78 }
  ];

  // 4. Receipts Data
  const receiptsData = [
    { id: 'RCP-89021', name: 'Aarav Hossain', class: '8', date: '2026-07-10', amount: 4500, method: 'bKash', status: 'Paid' },
    { id: 'RCP-89022', name: 'Maya Rahman', class: '6', date: '2026-07-09', amount: 3200, method: 'Cash', status: 'Paid' },
    { id: 'RCP-89023', name: 'Tanvir Ahmed', class: '9', date: '2026-07-08', amount: 5000, method: 'Bank Transfer', status: 'Paid' },
    { id: 'RCP-89024', name: 'Rafiq Karim', class: '10', date: '2026-07-05', amount: 4500, method: 'bKash', status: 'Paid' },
    { id: 'RCP-89025', name: 'Nadia Islam', class: '7', date: '2026-07-01', amount: 2500, method: 'Nagad', status: 'Paid' }
  ];

  // 5. Fine Ledger Data
  const [fineData, setFineData] = useState([
    { id: 'FIN-104', name: 'Aarav Hossain', class: '8', amount: 500, waived: 200, paid: 300, reason: 'Late Tuition Fee Payment', status: 'Settled' },
    { id: 'FIN-105', name: 'Nadia Islam', class: '7', amount: 1000, waived: 0, paid: 0, reason: 'Exam Registration Overdue', status: 'Unpaid' },
    { id: 'FIN-106', name: 'Tanvir Ahmed', class: '9', amount: 300, waived: 300, paid: 0, reason: 'Library Delay Penalty', status: 'Waived' },
    { id: 'FIN-107', name: 'Maya Rahman', class: '6', amount: 400, waived: 0, paid: 400, reason: 'Late Admission Return', status: 'Settled' }
  ]);

  // 6. Account Statement Ledger
  const accountStatement = [
    { id: 'TX-9021', date: '2026-07-10', desc: 'Tuition Fees bKash Collection Batch', cat: 'Student Fees', type: 'Credit', amount: 245000, bal: 1545000 },
    { id: 'TX-9022', date: '2026-07-09', desc: 'Primary Section Teacher Monthly Salaries', cat: 'Salaries & Wages', type: 'Debit', amount: 180000, bal: 1300000 },
    { id: 'TX-9023', date: '2026-07-07', desc: 'School Lab Broadband Lease', cat: 'Utilities', type: 'Debit', amount: 5000, bal: 1480000 },
    { id: 'TX-9024', date: '2026-07-05', desc: 'School Canteen Monthly Lease Rent', cat: 'Lease Incomes', type: 'Credit', amount: 15000, bal: 1485000 },
    { id: 'TX-9025', date: '2026-07-01', desc: 'Academic Stationery & Exam Sheet Printing', cat: 'Office Expenses', type: 'Debit', amount: 25000, bal: 1470000 }
  ];

  // 7. Non-tuition Incomes
  const nonTuitionIncomes = [
    { id: 'INC-301', source: 'Government Secondary Academic Grant', date: '2026-06-25', amount: 500000, ref: 'MIN-EDU-981' },
    { id: 'INC-302', source: 'Canteen Monthly Rental Lease', date: '2026-07-05', amount: 15000, ref: 'LEASE-CNT-01' },
    { id: 'INC-303', source: 'Auditorium Rental for Local NGO Seminar', date: '2026-07-02', amount: 25000, ref: 'NGO-REF-455' },
    { id: 'INC-304', source: 'School Uniform Sale Commission', date: '2026-06-30', amount: 35000, ref: 'VND-UNI-992' }
  ];

  // 8. Administrative Expenses
  const administrativeExpenses = [
    { id: 'EXP-501', desc: 'DESCO Electricity Monthly Bill', date: '2026-07-08', amount: 18500, payTo: 'Dhaka Electric Supply' },
    { id: 'EXP-502', desc: 'WASA Water Line Charge', date: '2026-07-07', amount: 6200, payTo: 'Dhaka WASA' },
    { id: 'EXP-503', desc: 'Science Laboratory Chemicals & Reagents', date: '2026-07-03', amount: 14500, payTo: 'Techno Science BD' },
    { id: 'EXP-504', desc: 'Administrative Tea Room & Guest Catering', date: '2026-07-01', amount: 3000, payTo: 'General Cash' }
  ];

  // 9. Monthly financial trend
  const financialMonthlyTrend = [
    { month: 'Jan 2026', income: 1500000, expense: 950000 },
    { month: 'Feb 2026', income: 1620000, expense: 1020000 },
    { month: 'Mar 2026', income: 1400000, expense: 890000 },
    { month: 'Apr 2026', income: 1800000, expense: 1150000 },
    { month: 'May 2026', income: 1650000, expense: 1080000 },
    { month: 'Jun 2026', income: 1950000, expense: 1200000 }
  ];

  // 10. Class Attendance Log Summary
  const classAttendanceSummary = [
    { class: 'Class 1', section: 'A', totalDays: 22, present: 1848, absent: 110, rate: 94.4 },
    { class: 'Class 2', section: 'A', totalDays: 22, present: 1650, absent: 108, rate: 93.8 },
    { class: 'Class 3', section: 'A', totalDays: 22, present: 1980, absent: 104, rate: 95.0 },
    { class: 'Class 4', section: 'A', totalDays: 22, present: 1625, absent: 133, rate: 92.4 },
    { class: 'Class 5', section: 'A', totalDays: 22, present: 1904, absent: 76, rate: 96.2 },
    { class: 'Class 6', section: 'A', totalDays: 22, present: 1680, absent: 80, rate: 95.4 },
    { class: 'Class 8', section: 'A', totalDays: 22, present: 1860, absent: 102, rate: 94.8 },
    { class: 'Class 10', section: 'A', totalDays: 22, present: 2138, absent: 62, rate: 97.2 }
  ];

  // 11. HR Payroll Mock Data
  const [payrollData, setPayrollData] = useState([
    { id: 'EMP-01', name: 'MD. Anisur Rahman', role: 'Senior Teacher', basic: 45000, allowance: 5000, pf: 2000, net: 48000, status: 'Paid' },
    { id: 'EMP-02', name: 'MST. Jesmin Ara', role: 'Assistant Teacher', basic: 40000, allowance: 4000, pf: 1500, net: 42500, status: 'Paid' },
    { id: 'EMP-03', name: 'Tariqul Islam', role: 'Principal', basic: 55000, allowance: 8000, pf: 3000, net: 60000, status: 'Paid' },
    { id: 'EMP-04', name: 'Farzana Chowdhury', role: 'Lecturer', basic: 38000, allowance: 4000, pf: 1500, net: 40500, status: 'Pending' }
  ]);

  // 12. Employee Leaves Data
  const leaveApplications = [
    { name: 'Zahidul Hasan', type: 'Sick Leave', dates: 'July 05 - July 07', days: 2, status: 'Approved', remarks: 'Medical Rest' },
    { name: 'Nigar Sultana', type: 'Maternity Leave', dates: 'May 01 - July 30', days: 90, status: 'Approved', remarks: 'Granted on submission' },
    { name: 'Biplob Kumar', type: 'Casual Leave', dates: 'July 12 - July 14', days: 3, status: 'Pending', remarks: 'Personal affairs' }
  ];

  // 13. Merit List Data
  const meritListData = [
    { rank: 1, name: 'Aarav Hossain', class: '8', roll: '12', marks: 954, gpa: 5.00, medal: 'Gold Medalist' },
    { rank: 2, name: 'Farhana Yeasmin', class: '5', roll: '02', marks: 948, gpa: 5.00, medal: 'Silver Scholar' },
    { rank: 3, name: 'Afrin Jahan', class: '3', roll: '01', marks: 942, gpa: 5.00, medal: 'Bronze Scholar' },
    { rank: 4, name: 'Tasfia Rahman', class: '9', roll: '04', marks: 938, gpa: 4.88, medal: 'Honor Student' },
    { rank: 5, name: 'Mahfuzur Rahman', class: '10', roll: '01', marks: 930, gpa: 4.85, medal: 'Honor Student' }
  ];

  // 14. Tabulation Sheet Mock Marks Data
  const tabulationData = [
    { roll: '12', name: 'Aarav Hossain', bangla: 85, english: 88, math: 95, science: 91, social: 84, total: 443, gpa: 5.00, result: 'Pass' },
    { roll: '05', name: 'Maya Rahman', bangla: 78, english: 82, math: 75, science: 80, social: 85, total: 400, gpa: 4.50, result: 'Pass' },
    { roll: '18', name: 'Tanvir Ahmed', bangla: 88, english: 70, math: 92, science: 85, social: 78, total: 413, gpa: 4.65, result: 'Pass' },
    { roll: '22', name: 'Nadia Islam', bangla: 42, english: 45, math: 38, science: 50, social: 52, total: 227, gpa: 2.80, result: 'Pass' },
    { roll: '03', name: 'Rafiq Karim', bangla: 90, english: 85, math: 96, science: 93, social: 88, total: 452, gpa: 5.00, result: 'Pass' }
  ];

  // ----------------------------------------------------
  // DIRECTORY CONFIGURATION
  // ----------------------------------------------------
  const reportCategories = [
    {
      id: 'student_reports',
      titleEn: 'Student Reports',
      titleBn: 'শিক্ষার্থী রিপোর্ট',
      icon: Users,
      items: [
        { id: 'login_credential', labelEn: 'Login Credential', labelBn: 'লগইন তথ্য' },
        { id: 'admission_report', labelEn: 'Admission Report', labelBn: 'ভর্তি রিপোর্ট' },
        { id: 'class_section_report', labelEn: 'Class & Section Report', labelBn: 'ক্লাস ও সেকশন রিপোর্ট' },
        { id: 'sibling_report', labelEn: 'Sibling Report', labelBn: 'সহোদর রিপোর্ট' }
      ]
    },
    {
      id: 'fees_reports',
      titleEn: 'Fees Reports',
      titleBn: 'ফি রিপোর্ট',
      icon: Wallet,
      items: [
        { id: 'receipts_report', labelEn: 'Receipts Report', labelBn: 'রশিদ রিপোর্ট' },
        { id: 'due_fees_report', labelEn: 'Due Fees Report', labelBn: 'বকেয়া ফি রিপোর্ট' },
        { id: 'fine_report', labelEn: 'Fine Report', labelBn: 'জরিমানা রিপোর্ট' }
      ]
    },
    {
      id: 'financial_reports',
      titleEn: 'Financial Reports',
      titleBn: 'আর্থিক রিপোর্ট',
      icon: DollarSign,
      items: [
        { id: 'account_statement', labelEn: 'Account Statement', labelBn: 'হিসাব বিবরণী' },
        { id: 'income_reports', labelEn: 'Income Reports', labelBn: 'আয় রিপোর্ট' },
        { id: 'expense_reports', labelEn: 'Expense Reports', labelBn: 'ব্যয় রিপোর্ট' },
        { id: 'transitions_reports', labelEn: 'Transitions Reports', labelBn: 'লেনদেন ট্র্যাকার' },
        { id: 'balance_sheet', labelEn: 'Balance Sheet', labelBn: 'ব্যালেন্স শীট' },
        { id: 'income_vs_expense', labelEn: 'Income Vs Expense', labelBn: 'আয় বনাম ব্যয়' }
      ]
    },
    {
      id: 'attendance_reports',
      titleEn: 'Attendance Reports',
      titleBn: 'হাজিরা রিপোর্ট',
      icon: CheckSquare,
      items: [
        { id: 'class_attendance_report', labelEn: 'Class Attendance', labelBn: 'শ্রেণী হাজিরা' }
      ]
    },
    {
      id: 'human_resource_reports',
      titleEn: 'Human Resource',
      titleBn: 'মানব সম্পদ রিপোর্ট',
      icon: FileSpreadsheet,
      items: [
        { id: 'payroll_summary', labelEn: 'Payroll Summary', labelBn: 'পে-রোল সারসংক্ষেপ' },
        { id: 'leave_reports', labelEn: 'Leave Reports', labelBn: 'ছুটি রিপোর্ট' }
      ]
    },
    {
      id: 'examination_reports',
      titleEn: 'Examination',
      titleBn: 'পরীক্ষা ও ফলাফল',
      icon: Award,
      items: [
        { id: 'primary_section', labelEn: 'Primary Section', labelBn: 'প্রাথমিক শাখা' },
        { id: 'high_section', labelEn: 'High Section', labelBn: 'উচ্চ শাখা' },
        { id: 'merit_list', labelEn: 'Merit List', labelBn: 'মেধা তালিকা' },
        { id: 'tabulation_sheet', labelEn: 'Tabulation Sheet', labelBn: 'ট্যাবুলেশন শীট' }
      ]
    }
  ];

  // Helper to toggle expanded categories
  const toggleCategory = (catId: string) => {
    setExpandedReportCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Helper to get selected option label
  const getSelectedOptionLabel = () => {
    for (const cat of reportCategories) {
      const item = cat.items.find(i => i.id === activeReportOption);
      if (item) {
        return lang === 'bn' ? item.labelBn : item.labelEn;
      }
    }
    return 'Report';
  };

  // ----------------------------------------------------
  // EXPORTS & PRINTS CONTROLLERS
  // ----------------------------------------------------
  const triggerPrint = () => {
    window.print();
    addAuditLog(`Admin printed ${activeReportOption} report.`);
    showToast(lang === 'bn' ? "প্রিন্ট চালু করা হচ্ছে..." : "Initiating print view...", "info");
  };

  const triggerExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Report,${getSelectedOptionLabel()}\n`;
    csvContent += `Generated On,${new Date().toISOString().slice(0, 10)}\n\n`;

    if (activeReportOption === 'login_credential') {
      csvContent += "Student ID,Name,Class,Section,Roll,Guardian Phone,Login Active\n";
      students.forEach(s => {
        csvContent += `"${s.id}","${s.name}","${s.class}","${s.section}","${s.roll}","${s.guardianPhone}",${s.loginActive}\n`;
      });
    } else if (activeReportOption === 'sibling_report') {
      csvContent += "Guardian Name,Guardian Phone,Children Names\n";
      getSiblingGroups().forEach(g => {
        const names = g.children.map(c => c.name).join(' | ');
        csvContent += `"${g.guardianName}","${g.guardianPhone}","${names}"\n`;
      });
    } else if (activeReportOption === 'admission_report') {
      csvContent += "Reg No,Applicant Name,Grade,Gender,Applied Date,Status,Fee (BDT)\n";
      admissionsData.forEach(a => {
        csvContent += `"${a.id}","${a.name}","${a.class}","${a.gender}","${a.date}","${a.status}",${a.fee}\n`;
      });
    } else if (activeReportOption === 'class_section_report') {
      csvContent += "Class Name,Capacity,Active Enrolled,Empty Vacancies\n";
      classCapacityData.forEach(c => {
        csvContent += `"${c.name}",${c.capacity},${c.enrolled},${c.capacity - c.enrolled}\n`;
      });
    } else if (activeReportOption === 'receipts_report') {
      csvContent += "Receipt No,Date,Name,Class,Amount (BDT),Method\n";
      receiptsData.forEach(r => {
        csvContent += `"${r.id}","${r.date}","${r.name}","${r.class}",${r.amount},"${r.method}"\n`;
      });
    } else {
      csvContent += "Table Column 1,Table Column 2,Table Column 3\n";
      csvContent += "Dummy row 1,100,Paid\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `School_${activeReportOption}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addAuditLog(`Exported ${activeReportOption} to Excel/CSV.`);
    showToast(lang === 'bn' ? "এক্সেল ফাইল ডাউনলোড সফল!" : "Excel file downloaded successfully!");
  };

  // ----------------------------------------------------
  // INTERACTIVE TAB ACTIONS
  // ----------------------------------------------------
  const toggleLoginAccess = (studentId: string) => {
    setStudents(prev => prev.map(st => {
      if (st.id === studentId) {
        const updatedStatus = !st.loginActive;
        addAuditLog(`Admin toggled login credential status for student ${st.name} (ID: ${studentId}) to ${updatedStatus ? 'Enabled' : 'Disabled'}`);
        showToast(lang === 'bn' ? `${st.name} এর লগইন অ্যাক্সেস পরিবর্তিত হয়েছে` : `Toggled login access for ${st.name}`);
        return { ...st, loginActive: updatedStatus };
      }
      return st;
    }));
  };

  const handleResetPassword = (studentName: string) => {
    addAuditLog(`Admin triggered password reset for student: ${studentName}`);
    showToast(lang === 'bn' ? `${studentName} এর সাময়িক পাসওয়ার্ড reset করা হয়েছে (Pass@123)` : `Password reset to temporary "Pass@123" for ${studentName}!`);
  };

  const handleApplyFineWaiver = (fineId: string, waiverAmt: number) => {
    setFineData(prev => prev.map(f => {
      if (f.id === fineId) {
        const netAmt = Math.max(0, f.amount - waiverAmt);
        addAuditLog(`Admin applied waiver of BDT ${waiverAmt} to Fine Invoice ${fineId}`);
        showToast(lang === 'bn' ? `জরিমানা মওকুফ BDT ${waiverAmt} সফলভাবে প্রয়োগ হয়েছে` : `Applied waiver of BDT ${waiverAmt} to ${f.name}!`);
        return { ...f, waived: waiverAmt, status: netAmt === 0 ? 'Waived' : f.status };
      }
      return f;
    }));
  };

  const handleSendSmsReminder = (parentName: string, amount: number) => {
    addAuditLog(`Admin dispatched automated SMS reminder to ${parentName} for outstanding due of BDT ${amount}`);
    showToast(lang === 'bn' ? `${parentName} কে বকেয়া রিমাইন্ডার এসএমএস পাঠানো হয়েছে` : `SMS collection reminder broadcast to ${parentName}!`);
  };

  const handleDisburseStaffPayroll = (empName: string, amount: number) => {
    setPayrollData(prev => prev.map(p => {
      if (p.name === empName) {
        addAuditLog(`Admin disbursed salary payment of BDT ${amount} to staff ${empName}`);
        showToast(lang === 'bn' ? `${empName} এর ব্যাংক একাউন্টে বেতন পাঠানো হয়েছে` : `Salary of BDT ${amount} disbursed to ${empName}!`);
        return { ...p, status: 'Paid' };
      }
      return p;
    }));
  };

  // ----------------------------------------------------
  // FILTERED DYNAMIC LISTS
  // ----------------------------------------------------
  const getFilteredStudents = () => {
    return students.filter(st => {
      const matchesClass = reportClass === 'All' || st.class === reportClass;
      const matchesSection = reportSection === 'All' || st.section === reportSection;
      const matchesSearch = !reportSearchQuery || 
        st.name.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
        st.id.toLowerCase().includes(reportSearchQuery.toLowerCase());
      return matchesClass && matchesSection && matchesSearch;
    });
  };

  const getFilteredReceipts = () => {
    return receiptsData.filter(r => {
      const matchesClass = reportClass === 'All' || r.class === reportClass;
      const matchesSearch = !reportSearchQuery || 
        r.name.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(reportSearchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  };

  const getFilteredFines = () => {
    return fineData.filter(f => {
      const matchesClass = reportClass === 'All' || f.class === reportClass;
      const matchesSearch = !reportSearchQuery || f.name.toLowerCase().includes(reportSearchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Toast Notification Capsule */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#005c53] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-emerald-500/20 flex items-center gap-2.5 animate-bounce">
          <CheckCircle className="h-5 w-5 text-emerald-300" />
          <span className="text-xs font-black">{toastMsg}</span>
        </div>
      )}

      {/* Top Header Panel */}
      <div className="bg-[#025644] text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6 scale-150">
          <GraduationCap className="h-64 w-64" />
        </div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/15 text-xs font-black rounded-full uppercase tracking-wider text-emerald-300 border border-white/10">
              {lang === 'bn' ? 'ডাটা এনালিটিক্স মডিউল' : 'School Administration Reports Panel'}
            </span>
            <span className="h-2 w-2 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-sans">
            {lang === 'bn' ? 'রিপোর্ট এবং বিশ্লেষণ পোর্টাল' : 'Central Reports & Analytics Portal'}
          </h2>
          <p className="text-xs text-emerald-100/80 font-semibold max-w-xl">
            {lang === 'bn' 
              ? 'স্কুলের আর্থিক হিসাব, ফি আদায়, শিক্ষার্থীদের সহোদর লিংক, পরীক্ষা এবং বেতন বিবরণীসহ ২০টি ভিন্ন রিপোর্ট বিশ্লেষণ করুন।' 
              : 'Direct real-time query interface across student registration databases, fee collections, academic merit, balance sheets, and HR leaves.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={triggerPrint}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="h-4 w-4 text-emerald-300" />
            <span>{lang === 'bn' ? 'প্রিন্ট করুন' : 'Print Report'}</span>
          </button>
          <button
            onClick={triggerExportExcel}
            className="px-4 py-2.5 bg-white text-[#025644] hover:bg-emerald-50 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{lang === 'bn' ? 'এক্সেল এক্সপোর্ট' : 'Export to Excel'}</span>
          </button>
        </div>
      </div>

      {/* GLOBAL FILTERING CONTROL BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-3xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#025644]" />
            <span>{lang === 'bn' ? 'রিপোর্ট ফিল্টারিং কন্ট্রোলস' : 'Dynamic Query Filters & Controls'}</span>
          </h3>
          <button
            onClick={() => {
              setReportStartDate('2026-01-01');
              setReportEndDate('2026-12-31');
              setReportClass('All');
              setReportSection('All');
              setReportSearchQuery('');
              setCurrentPage(1);
            }}
            className="text-[10px] text-[#025644] hover:underline font-black cursor-pointer"
          >
            {lang === 'bn' ? 'রিসেট ফিল্টারস' : 'Reset Filters'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Class Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {lang === 'bn' ? 'শ্রেণী (Class)' : 'Class Select'}
            </label>
            <select
              value={reportClass}
              onChange={(e) => {
                setReportClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#025644] rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">{lang === 'bn' ? 'সকল শ্রেণী (All)' : 'All Classes'}</option>
              {schoolClasses.map((cl) => (
                <option key={cl.id} value={cl.name}>{cl.name}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {lang === 'bn' ? 'শাখা (Section)' : 'Section'}
            </label>
            <select
              value={reportSection}
              onChange={(e) => {
                setReportSection(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#025644] rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">{lang === 'bn' ? 'সকল শাখা (All)' : 'All Sections'}</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* From Date */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {lang === 'bn' ? 'তারিখ হতে (From)' : 'From Date'}
            </label>
            <input
              type="date"
              value={reportStartDate}
              onChange={(e) => {
                setReportStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#025644] rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>

          {/* To Date */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {lang === 'bn' ? 'তারিখ পর্যন্ত (To)' : 'To Date'}
            </label>
            <input
              type="date"
              value={reportEndDate}
              onChange={(e) => {
                setReportEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#025644] rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>

          {/* Search Keywords */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {lang === 'bn' ? 'অনুসন্ধান করুন (Search)' : 'Search Keywords'}
            </label>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'নাম বা আইডি...' : 'Name, ID, etc...'}
                value={reportSearchQuery}
                onChange={(e) => {
                  setReportSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#025644] rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MASTER-DETAIL DIRECTORY SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COMPONENT: COLLAPSIBLE ACCORDION SIDEBAR */}
        <div className="w-full lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 shadow-3xs space-y-3 shrink-0">
          <p className="text-[10px] font-black text-[#005c53] uppercase tracking-wider border-b border-slate-100 pb-2 px-1">
            {lang === 'bn' ? 'রিপোর্ট তালিকা ডিরেক্টরি' : 'Reports Directory'}
          </p>
          
          <nav className="space-y-2">
            {reportCategories.map((category) => {
              const Icon = category.icon;
              const isExpanded = expandedReportCategories[category.id];
              return (
                <div key={category.id} className="space-y-1">
                  
                  {/* Category Header Toggler */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#005c53] rounded-2xl transition-all text-xs font-black text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-[#005c53]/5 text-[#005c53] rounded-lg">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="truncate">{lang === 'bn' ? category.titleBn : category.titleEn}</span>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Nested Sub-options */}
                  {isExpanded && (
                    <div className="pl-4 pr-1 py-1 space-y-1 ml-4 border-l border-emerald-500/10">
                      {category.items.map((subItem) => {
                        const isSubActive = activeReportOption === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setActiveReportOption(subItem.id);
                              setCurrentPage(1);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold transition-all text-left cursor-pointer ${
                              isSubActive
                                ? 'bg-emerald-50 text-[#025644] font-black shadow-3xs border border-emerald-100/30'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-[#005c53]'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isSubActive ? 'bg-[#025644]' : 'bg-slate-300'}`} />
                            <span className="truncate">{lang === 'bn' ? subItem.labelBn : subItem.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </nav>
        </div>

        {/* RIGHT COMPONENT: DYNAMIC CENTRAL REPORT VIEWER DETAIL PANEL */}
        <div className="w-full lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs min-h-[500px]">
          
          {/* Dynamic Active Report Header Area */}
          <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
                <h3 className="text-lg font-black text-slate-800 font-sans tracking-tight">
                  {getSelectedOptionLabel()}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-bold mt-1">
                {lang === 'bn' ? 'ফলাফল ফিল্টার ও অনুসন্ধানের উপর ভিত্তি করে রিয়েল-টাইমে আপডেট হয়েছে।' : 'Reflecting real-time parameterized database state.'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-150 rounded-lg text-[10px] font-mono font-bold">
                OPTION: {activeReportOption.toUpperCase()}
              </span>
            </div>
          </div>

          {/* DYNAMIC SUBTAB VIEWS */}
          {activeReportOption === 'sibling_report' && (() => {
            const groups = getSiblingGroups();
            return (
              <div className="space-y-6">
                
                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{lang === 'bn' ? 'মোট সহোদর পরিবার' : 'Total Sibling Families'}</p>
                      <p className="text-2xl font-black text-slate-800 mt-1">{groups.length}</p>
                    </div>
                    <div className="p-3 bg-[#005c53]/10 text-[#005c53] rounded-xl">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{lang === 'bn' ? 'মোট সহোদর শিক্ষার্থী' : 'Total Sibling Students'}</p>
                      <p className="text-2xl font-black text-slate-800 mt-1">{groups.reduce((sum, g) => sum + g.children.length, 0)}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Award className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Sibling List Card Container */}
                {groups.length === 0 ? (
                  <div className="border border-dashed border-slate-200 p-12 rounded-3xl text-center space-y-3 bg-slate-50/50">
                    <p className="text-sm font-black text-slate-500">{lang === 'bn' ? 'কোনো সহোদর শিক্ষার্থী পাওয়া যায়নি।' : 'No siblings detected.'}</p>
                    <p className="text-xs text-slate-400 font-bold max-w-md mx-auto">
                      {lang === 'bn' ? 'একই অভিভাবক ফোন নাম্বার শেয়ার করা শিক্ষার্থীরা এখানে তালিকাভুক্ত হবে।' : 'Students sharing the same guardian contact details in their registration profile will automatically render as sibling clusters here.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groups.map((group, idx) => (
                      <div key={idx} className="border border-slate-150 rounded-2xl p-4 space-y-3 bg-white hover:shadow-2xs transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="text-left">
                            <p className="text-xs font-black text-slate-800">{group.guardianName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Contact: {group.guardianPhone}</p>
                          </div>
                          <span className="self-start sm:self-center px-2 py-0.5 bg-[#005c53]/10 text-[#005c53] text-[10px] font-black rounded-lg">
                            {group.children.length} Siblings Enrolled
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.children.map(child => (
                            <div key={child.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100 text-xs">
                              <div className="text-left">
                                <p className="font-extrabold text-slate-800">{child.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Class {child.class} (Sec {child.section}) • Roll {child.roll}</p>
                              </div>
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded border border-emerald-100">
                                {child.id}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-end gap-2 pt-1.5">
                          <button 
                            onClick={() => showToast(lang === 'bn' ? "সহোদর লিঙ্কিং সফল" : "Sibling cluster successfully updated")}
                            className="text-[10px] text-[#005c53] hover:underline font-black cursor-pointer"
                          >
                            + Manage Sibling Linkages
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {activeReportOption === 'login_credential' && (() => {
            const filtered = getFilteredStudents();
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Student Name</th>
                        <th className="p-3 text-center">Class / Roll</th>
                        <th className="p-3">Portal Username</th>
                        <th className="p-3">Reset Code</th>
                        <th className="p-3 text-center">Access Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 italic">No registered students found.</td>
                        </tr>
                      ) : (
                        filtered.map(st => {
                          const username = st.name.toLowerCase().replace(/\s+/g, '') + st.roll;
                          return (
                            <tr key={st.id} className="hover:bg-slate-50/50">
                              <td className="p-3 text-slate-800 font-extrabold">{st.name}</td>
                              <td className="p-3 text-center">Class {st.class} / Roll {st.roll}</td>
                              <td className="p-3 text-slate-500 font-mono text-[11px]">{username}</td>
                              <td className="p-3 text-slate-400 font-mono text-[10px]">Pass@{st.roll}102</td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${st.loginActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                  {st.loginActive ? 'Login Enabled' : 'Login Frozen'}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-1.5">
                                <button
                                  onClick={() => toggleLoginAccess(st.id)}
                                  className={`px-2 py-1 rounded text-[10px] font-black cursor-pointer ${st.loginActive ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'}`}
                                >
                                  {st.loginActive ? 'Freeze' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleResetPassword(st.name)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-black cursor-pointer"
                                >
                                  Reset Pass
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'admission_report' && (() => {
            return (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-2xl text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Applications</p>
                    <p className="text-xl font-black text-slate-800 mt-0.5">142 Applications</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending Evaluation</p>
                    <p className="text-xl font-black text-amber-600 mt-0.5">12 Review Cycles</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Conversion rate</p>
                    <p className="text-xl font-black text-emerald-700 mt-0.5">85.4% Approved</p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Application ID</th>
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3 text-center">Grade Level</th>
                        <th className="p-3">Gender</th>
                        <th className="p-3">Date Applied</th>
                        <th className="p-3">Admission Fee Status</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {admissionsData.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-[10px] text-slate-500">{a.id}</td>
                          <td className="p-3 text-slate-800 font-extrabold">{a.name}</td>
                          <td className="p-3 text-center">Class {a.class}</td>
                          <td className="p-3">{a.gender}</td>
                          <td className="p-3">{a.date}</td>
                          <td className="p-3 text-emerald-700">BDT {a.fee.toLocaleString()} Paid</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              a.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              a.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'class_section_report' && (() => {
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classCapacityData.map((c, idx) => {
                    const ratio = Math.round((c.enrolled / c.capacity) * 100);
                    return (
                      <div key={idx} className="p-4 border border-slate-150 rounded-2xl bg-slate-50/40 text-xs text-left space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-extrabold text-slate-800 text-sm">{c.name}</p>
                          <span className="font-black text-[#005c53]">{ratio}% Occupied</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#005c53] h-full" style={{ width: `${ratio}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1">
                          <p>Maximum Capacity: {c.capacity}</p>
                          <p>Active Students: {c.enrolled} / Vacancy: {c.capacity - c.enrolled}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'receipts_report' && (() => {
            const filtered = getFilteredReceipts();
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Receipt Invoice</th>
                        <th className="p-3">Issued To</th>
                        <th className="p-3 text-center">Class Grade</th>
                        <th className="p-3">Date Settled</th>
                        <th className="p-3 text-right">Collected Amount</th>
                        <th className="p-3">Gateway Method</th>
                        <th className="p-3 text-center">Receipt Log</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {filtered.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-[11px] text-slate-500">{r.id}</td>
                          <td className="p-3 text-slate-800 font-extrabold">{r.name}</td>
                          <td className="p-3 text-center">Class {r.class}</td>
                          <td className="p-3">{r.date}</td>
                          <td className="p-3 text-right font-black text-emerald-700">BDT {r.amount.toLocaleString()}</td>
                          <td className="p-3 font-medium">{r.method}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-black uppercase">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'due_fees_report' && (() => {
            const list = [
              { name: 'Nadia Islam', class: '7', roll: '22', type: 'Monthly Tuition', amount: 4500, date: '2026-06-10', parent: 'Lipi Islam', phone: '+880 1719-112233' },
              { name: 'Tanvir Ahmed', class: '9', roll: '18', type: 'Laboratory Fees', amount: 1500, date: '2026-07-01', parent: 'Karim Ahmed', phone: '+880 1718-554433' },
              { name: 'Maya Rahman', class: '6', roll: '05', type: 'Annual Session Fee', amount: 3000, date: '2026-05-15', parent: 'Sumi Rahman', phone: '+880 1712-998877' }
            ];
            return (
              <div className="space-y-4 text-left">
                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-xs font-black text-amber-800">
                    Total school dues currently outstanding: BDT 9,000. Send bulk reminders below.
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class/Roll</th>
                        <th className="p-3">Outstanding Fee Category</th>
                        <th className="p-3 text-right">Due Balance</th>
                        <th className="p-3">Last Date</th>
                        <th className="p-3">Guardian Name</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {list.map((l, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 text-slate-800 font-extrabold">{l.name}</td>
                          <td className="p-3">Class {l.class} / Roll {l.roll}</td>
                          <td className="p-3 text-slate-500">{l.type}</td>
                          <td className="p-3 text-right text-rose-600 font-black">BDT {l.amount.toLocaleString()}</td>
                          <td className="p-3 text-slate-400">{l.date}</td>
                          <td className="p-3 text-slate-500">{l.parent}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleSendSmsReminder(l.parent, l.amount)}
                              className="px-2.5 py-1 bg-[#005c53] hover:bg-[#004c45] text-white rounded text-[10px] font-black cursor-pointer"
                            >
                              Dispatch SMS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'fine_report' && (() => {
            const filtered = getFilteredFines();
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Fine ID</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3 text-center">Class</th>
                        <th className="p-3">Fine Amount</th>
                        <th className="p-3">Waiver Applied</th>
                        <th className="p-3">Reason / Details</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Waiver Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {filtered.map(f => {
                        const netDue = f.amount - f.waived;
                        return (
                          <tr key={f.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-[11px] text-slate-500">{f.id}</td>
                            <td className="p-3 text-slate-800 font-extrabold">{f.name}</td>
                            <td className="p-3 text-center">Class {f.class}</td>
                            <td className="p-3 text-slate-700">BDT {f.amount}</td>
                            <td className="p-3 text-emerald-600">BDT {f.waived}</td>
                            <td className="p-3 text-slate-400">{f.reason}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                netDue === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}>
                                {netDue === 0 ? 'Settled/Waived' : 'Unpaid Balance'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {netDue > 0 && (
                                <button
                                  onClick={() => handleApplyFineWaiver(f.id, f.amount)}
                                  className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[9px] font-black cursor-pointer"
                                >
                                  100% Waive
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'account_statement' && (() => {
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Reference ID</th>
                        <th className="p-3">Posting Date</th>
                        <th className="p-3">Transaction Narration</th>
                        <th className="p-3">Ledger Head</th>
                        <th className="p-3 text-right">Debit (-)</th>
                        <th className="p-3 text-right">Credit (+)</th>
                        <th className="p-3 text-right">Running Treasury Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {accountStatement.map(stmt => (
                        <tr key={stmt.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-[11px] text-slate-500">{stmt.id}</td>
                          <td className="p-3 text-slate-400">{stmt.date}</td>
                          <td className="p-3 text-slate-800 font-extrabold">{stmt.desc}</td>
                          <td className="p-3 font-medium text-slate-500">{stmt.cat}</td>
                          <td className="p-3 text-right text-rose-600">
                            {stmt.type === 'Debit' ? `- ৳${stmt.amount.toLocaleString()}` : ''}
                          </td>
                          <td className="p-3 text-right text-emerald-700">
                            {stmt.type === 'Credit' ? `+ ৳${stmt.amount.toLocaleString()}` : ''}
                          </td>
                          <td className="p-3 text-right font-black text-slate-950">৳{stmt.bal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'income_reports' && (() => {
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Income ID</th>
                        <th className="p-3">Inward Source</th>
                        <th className="p-3">Receipt Date</th>
                        <th className="p-3 text-right">Inflow Amount</th>
                        <th className="p-3 font-mono">Reference Voucher</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {nonTuitionIncomes.map(inc => (
                        <tr key={inc.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-[11px] text-slate-500">{inc.id}</td>
                          <td className="p-3 text-slate-800 font-extrabold">{inc.source}</td>
                          <td className="p-3 text-slate-400">{inc.date}</td>
                          <td className="p-3 text-right font-black text-[#025644]">৳{inc.amount.toLocaleString()}</td>
                          <td className="p-3 font-mono text-slate-400 text-[10px]">{inc.ref}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'expense_reports' && (() => {
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Voucher ID</th>
                        <th className="p-3">Payment Category / Description</th>
                        <th className="p-3">Posting Date</th>
                        <th className="p-3 text-right">Disbursed Amount</th>
                        <th className="p-3">Paid Recipient</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {administrativeExpenses.map(exp => (
                        <tr key={exp.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-[11px] text-slate-500">{exp.id}</td>
                          <td className="p-3 text-slate-800 font-extrabold">{exp.desc}</td>
                          <td className="p-3 text-slate-400">{exp.date}</td>
                          <td className="p-3 text-right font-black text-rose-600">৳{exp.amount.toLocaleString()}</td>
                          <td className="p-3 text-slate-500">{exp.payTo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'transitions_reports' && (() => {
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Ref Code</th>
                        <th className="p-3">Posting Date</th>
                        <th className="p-3">Transaction Summary</th>
                        <th className="p-3 text-right">Value (BDT)</th>
                        <th className="p-3 text-center">Movement Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {accountStatement.map((stmt, sIdx) => (
                        <tr key={sIdx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-slate-400 text-[10px]">{stmt.id}</td>
                          <td className="p-3 text-slate-400">{stmt.date}</td>
                          <td className="p-3 text-slate-800 font-extrabold">{stmt.desc}</td>
                          <td className="p-3 text-right font-black">৳{stmt.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              stmt.type === 'Credit' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                              {stmt.type === 'Credit' ? 'CREDIT (INFLOW)' : 'DEBIT (OUTFLOW)'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'balance_sheet' && (() => {
            return (
              <div className="space-y-6 text-left">
                <div className="p-4 bg-[#025644]/5 border border-[#025644]/10 rounded-2xl">
                  <p className="text-xs font-black text-slate-800">
                    {lang === 'bn' ? 'আর্থিক বছরের ব্যালেন্স শীট (School Fiscal Health Sheet)' : 'Balance Sheet Overview - Fiscal Year 2026'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* ASSETS */}
                  <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/40 space-y-3">
                    <h4 className="font-black text-[#025644] text-sm border-b border-slate-150 pb-2">1. ASSETS (সম্পদ)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between font-extrabold text-slate-700">
                        <span>Cash & Treasury Bank Balance</span>
                        <span>৳1,545,000</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Student Tuition Receivables</span>
                        <span>৳180,000</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Laboratory & Computer Systems Equipment</span>
                        <span>৳1,500,000</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>School Property & Library Assets</span>
                        <span>৳9,000,000</span>
                      </div>
                      <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-2 text-sm mt-1">
                        <span>TOTAL ASSETS</span>
                        <span>৳12,225,000</span>
                      </div>
                    </div>
                  </div>

                  {/* LIABILITIES & EQUITIES */}
                  <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/40 space-y-3">
                    <h4 className="font-black text-rose-700 text-sm border-b border-slate-150 pb-2">2. LIABILITIES & EQUITY</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-700 font-extrabold">
                        <span>Accounts Payable (Vendors due)</span>
                        <span>৳95,000</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Unearned Event Deposits</span>
                        <span>৳30,000</span>
                      </div>
                      <div className="flex justify-between text-slate-500 border-b border-slate-150 pb-2 mb-2">
                        <span>Employee Accrued Salaries</span>
                        <span>৳40,500</span>
                      </div>
                      <div className="flex justify-between text-slate-700 font-extrabold">
                        <span>Retained Surplus Earnings</span>
                        <span>৳9,059,500</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>School Founder Development Fund</span>
                        <span>৳3,000,000</span>
                      </div>
                      <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-2 text-sm mt-1">
                        <span>TOTAL LIABILITIES & EQUITY</span>
                        <span>৳12,225,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'income_vs_expense' && (() => {
            return (
              <div className="space-y-6">
                <div className="w-full h-[260px] bg-slate-50 p-3 rounded-2xl border border-slate-150">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialMonthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis tickFormatter={(v) => `৳${v/1000}k`} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <Tooltip formatter={(v: any) => [`৳${v.toLocaleString()}`, '']} />
                      <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                      <Bar dataKey="income" name="Total Inward Revenue" fill="#025644" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="Operational Outward Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'class_attendance_report' && (() => {
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Class & Section</th>
                        <th className="p-3 text-center">Academic Days</th>
                        <th className="p-3 text-center">Total Present Marks</th>
                        <th className="p-3 text-center">Total Absent Marks</th>
                        <th className="p-3 text-center">Monthly Attendance Rate</th>
                        <th className="p-3 text-center">Alert Condition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {classAttendanceSummary.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 text-slate-900 font-extrabold">{c.class} ({c.section})</td>
                          <td className="p-3 text-center">{c.totalDays} days</td>
                          <td className="p-3 text-center text-[#025644]">{c.present} pupils</td>
                          <td className="p-3 text-center text-rose-500">{c.absent} pupils</td>
                          <td className="p-3 text-center font-black text-slate-900">{c.rate}%</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              c.rate >= 95 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {c.rate >= 95 ? 'Target Met' : 'Check absenteeism'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'payroll_summary' && (() => {
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Staff ID</th>
                        <th className="p-3">Employee Name</th>
                        <th className="p-3">Designation / Role</th>
                        <th className="p-3 text-right">Basic Pay</th>
                        <th className="p-3 text-right">Allowances</th>
                        <th className="p-3 text-right">Provident Fund Deduct</th>
                        <th className="p-3 text-right">Net Disbursement BDT</th>
                        <th className="p-3 text-center">Salary Status</th>
                        <th className="p-3 text-right">Payroll Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {payrollData.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-[10px] text-slate-500">{emp.id}</td>
                          <td className="p-3 text-slate-800 font-extrabold">{emp.name}</td>
                          <td className="p-3 text-slate-500">{emp.role}</td>
                          <td className="p-3 text-right">৳{emp.basic.toLocaleString()}</td>
                          <td className="p-3 text-right text-emerald-700">+ ৳{emp.allowance.toLocaleString()}</td>
                          <td className="p-3 text-right text-rose-500">- ৳{emp.pf.toLocaleString()}</td>
                          <td className="p-3 text-right font-black text-slate-900">৳{emp.net.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              emp.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {emp.status === 'Pending' && (
                              <button
                                onClick={() => handleDisburseStaffPayroll(emp.name, emp.net)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-black cursor-pointer animate-pulse"
                              >
                                Disburse BDT
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'leave_reports' && (() => {
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3">Staff Name</th>
                        <th className="p-3">Leave Type</th>
                        <th className="p-3">Applied Leave Interval</th>
                        <th className="p-3 text-center">Duration</th>
                        <th className="p-3">Approval Comments</th>
                        <th className="p-3 text-center">Leave Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {leaveApplications.map((app, aIdx) => (
                        <tr key={aIdx} className="hover:bg-slate-50/50">
                          <td className="p-3 text-slate-800 font-extrabold">{app.name}</td>
                          <td className="p-3 text-slate-500">{app.type}</td>
                          <td className="p-3 text-slate-500">{app.dates}</td>
                          <td className="p-3 text-center font-bold text-slate-900">{app.days} working days</td>
                          <td className="p-3 text-slate-400 italic font-medium">"{app.remarks}"</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'primary_section' && (() => {
            const primarySectionStudentsList = [
              { id: 'STD-1001', name: 'Ayesha Rahman', category: 'Student', registerNo: 'STD 1001', roll: '01', mobile: '+880 1711 223344', remarks: 'Excellent progress' },
              { id: 'STD-1002', name: 'Tanvir Hasan', category: 'Student', registerNo: 'STD 1002', roll: '02', mobile: '--', remarks: 'Good performance' },
              { id: 'STD-1003', name: 'Mohnaz Karim', category: 'Student', registerNo: 'STD 1003', roll: '03', mobile: '--', remarks: 'Very attentive' },
              { id: 'STD-1024', name: 'Aarav Hossain', category: 'Student', registerNo: 'STD 1024', roll: '12', mobile: '+880 1711 223344', remarks: 'Excellent in math' },
              { id: 'STD-1025', name: 'Maya Rahman', category: 'Student', registerNo: 'STD 1025', roll: '05', mobile: '+880 1712 998877', remarks: 'Creative student' },
              { id: 'STD-1026', name: 'Tanvir Ahmed', category: 'Student', registerNo: 'STD 1026', roll: '18', mobile: '+880 1718 554433', remarks: 'Very disciplined' },
              { id: 'STD-1028', name: 'Rafiq Karim', category: 'Student', registerNo: 'STD 1028', roll: '03', mobile: '+880 1722 665544', remarks: 'Improving steadily' },
              { id: 'STD-1029', name: 'Priya Das', category: 'Student', registerNo: 'STD 1029', roll: '09', mobile: '+880 1731 778899', remarks: 'Highly active' },
              { id: 'STD-1030', name: 'Sami Akhter', category: 'Student', registerNo: 'STD 1030', roll: '14', mobile: '+880 1741 334455', remarks: 'Polite and helpful' },
              { id: 'STD-1032', name: 'Lubna Sultana', category: 'Student', registerNo: 'STD 1032', roll: '07', mobile: '+880 1761 223399', remarks: 'Great academic focus' }
            ];

            // Filter the list of students by class & section or search
            const filteredStudents = primarySectionStudentsList.filter(student => {
              const matchesSearch = student.name.toLowerCase().includes(primSearch.toLowerCase()) || 
                                    student.registerNo.toLowerCase().includes(primSearch.toLowerCase());
              return matchesSearch;
            });

            // Pagination calculations
            const totalRows = filteredStudents.length;
            const totalPages = Math.ceil(totalRows / primRowsPerPage);
            const startIndex = (primCurrentPage - 1) * primRowsPerPage;
            const paginatedStudents = filteredStudents.slice(startIndex, startIndex + primRowsPerPage);

            const activeStudentId = primSelectedStudentId || 'STD-1001';
            const selectedStudent = primarySectionStudentsList.find(s => s.id === activeStudentId) || primarySectionStudentsList[0];
            const currentData = getOrInitStudentPrimData(selectedStudent.id);

            // Handle live score editing
            const handleScoreChange = (subjectIndex: number, field: 'mt' | 'se' | 'grace', value: number) => {
              setPrimStudentData(prev => {
                const updated = { ...prev };
                const studentData = { ...getOrInitStudentPrimData(selectedStudent.id), ...updated[selectedStudent.id] };
                const updatedSubjects = [...studentData.subjects];
                
                // Enforce constraints
                let cappedVal = Math.max(0, value);
                if (field === 'mt') cappedVal = Math.min(30, cappedVal);
                if (field === 'se') cappedVal = Math.min(70, cappedVal);
                if (field === 'grace') cappedVal = Math.min(10, cappedVal);

                updatedSubjects[subjectIndex] = {
                  ...updatedSubjects[subjectIndex],
                  [field]: cappedVal
                };

                studentData.subjects = updatedSubjects;
                updated[selectedStudent.id] = studentData;
                return updated;
              });
            };

            // Handle attendance change
            const handleAttendanceChange = (field: 'attendanceDays' | 'attendancePresent', value: number) => {
              setPrimStudentData(prev => {
                const updated = { ...prev };
                const studentData = { ...getOrInitStudentPrimData(selectedStudent.id), ...updated[selectedStudent.id] };
                
                let cappedVal = Math.max(0, value);
                if (field === 'attendancePresent') {
                  cappedVal = Math.min(studentData.attendanceDays, cappedVal);
                }

                studentData[field] = cappedVal;
                updated[selectedStudent.id] = studentData;
                return updated;
              });
            };

            // Handle remarks or other text edits
            const handleTextChange = (field: 'remarks' | 'moral', value: string) => {
              setPrimStudentData(prev => {
                const updated = { ...prev };
                const studentData = { ...getOrInitStudentPrimData(selectedStudent.id), ...updated[selectedStudent.id] };
                
                if (field === 'moral') {
                  studentData.moral = value as any;
                } else {
                  studentData.remarks = value;
                }
                
                updated[selectedStudent.id] = studentData;
                return updated;
              });
            };

            // Handle co-curricular activity change
            const handleCoCurricularChange = (activityKey: string, value: string) => {
              setPrimStudentData(prev => {
                const updated = { ...prev };
                const studentData = { ...getOrInitStudentPrimData(selectedStudent.id), ...updated[selectedStudent.id] };
                
                studentData.coCurricular = {
                  ...studentData.coCurricular,
                  [activityKey]: value
                };
                
                updated[selectedStudent.id] = studentData;
                return updated;
              });
            };

            // Calculate current stats
            const subjectsWithGrades = currentData.subjects.map(sub => {
              const total = Number(sub.mt || 0) + Number(sub.se || 0) + Number(sub.grace || 0);
              const { grade, point } = getGradeAndPoint(total);
              return {
                ...sub,
                total,
                grade,
                point
              };
            });

            const totalMarksEarned = subjectsWithGrades.reduce((sum, s) => sum + s.total, 0);
            const totalFullMarks = subjectsWithGrades.reduce((sum, s) => sum + s.fullMarks, 0);
            const hasFailedSubject = subjectsWithGrades.some(s => s.grade === 'F');
            const gpaRaw = subjectsWithGrades.reduce((sum, s) => sum + s.point, 0) / subjectsWithGrades.length;
            const calculatedGPA = hasFailedSubject ? 0.00 : Number(gpaRaw.toFixed(2));
            const isPassed = !hasFailedSubject && calculatedGPA >= 1.00;

            const t_dict = {
              EN: {
                reportTitle: 'PROGRESS REPORT',
                schoolName: 'Students Care Model School',
                address: 'Main Road, Dhaka, Bangladesh',
                studentName: 'Student Name',
                studentId: 'Student ID',
                rollNo: 'Roll No',
                className: 'Class',
                examName: 'Examination',
                year: 'Academic Year',
                section: 'Group / Section',
                shift: 'Shift',
                contact: 'Contact',
                issueDate: 'Issue Date',
                subject: 'NAME OF SUBJECT',
                fullMarks: 'FULL MARKS',
                highest: 'HIGHEST',
                mt: 'MT',
                se: 'SE',
                grace: 'GRACE',
                total: 'TOTAL',
                letterGrade: 'LETTER GRADE',
                gradePoint: 'GRADE POINT',
                resultSummary: 'FINAL RESULT SUMMARY',
                attendanceSummary: 'ATTENDANCE SUMMARY',
                moralBehavior: 'MORAL & BEHAVIOR',
                coCurricular: 'CO-CURRICULAR ACTIVITIES',
                remarks: "TEACHER'S REMARKS",
                verification: 'DIGITAL VERIFICATION',
                promoted: 'PROMOTED',
                failed: 'FAILED',
                passed: 'Passed',
                workingDays: 'Total Working Days',
                presentDays: 'Attendance (Present)',
                absentDays: 'Total Absent',
                attendanceRate: 'Attendance %',
                saveChanges: 'Save Changes',
                printReport: 'Print Report Card',
                downloadPdf: 'Download PDF',
                parentPhonePlaceholder: 'Parent phone (e.g. +8801XXXXXXX)',
                sendWhatsApp: 'Send via WhatsApp',
                sendSMS: 'Send via SMS',
              },
              BN: {
                reportTitle: 'অগ্রগতিপত্র',
                schoolName: 'স্টুডেন্টস কেয়ার মডেল স্কুল',
                address: 'প্রধান সড়ক, ঢাকা, বাংলাদেশ',
                studentName: 'শিক্ষার্থীর নাম',
                studentId: 'শিক্ষার্থী আইডি',
                rollNo: 'রোল নম্বর',
                className: 'শ্রেণী',
                examName: 'পরীক্ষা',
                year: 'শিক্ষাবর্ষ',
                section: 'বিভাগ / শাখা',
                shift: 'শিফট',
                contact: 'যোগাযোগ',
                issueDate: 'প্রকাশের তারিখ',
                subject: 'বিষয়ের নাম',
                fullMarks: 'পূর্ণমান',
                highest: 'সর্বোচ্চ নম্বর',
                mt: 'শ্রেণী পরীক্ষা (MT)',
                se: 'সাময়িক পরীক্ষা (SE)',
                grace: 'করুণা নম্বর',
                total: 'মোট নম্বর',
                letterGrade: 'লেটার গ্রেড',
                gradePoint: 'গ্রেড পয়েন্ট',
                resultSummary: 'চূড়ান্ত ফলাফল সারসংক্ষেপ',
                attendanceSummary: 'উপস্থিতির সারসংক্ষেপ',
                moralBehavior: 'নৈতিকতা ও আচরণ',
                coCurricular: 'সহ-পাঠ্যক্রমিক কার্যক্রম',
                remarks: 'শিক্ষকের মন্তব্য',
                verification: 'ডিজিটাল যাচাইকরণ',
                promoted: 'উত্তীর্ণ (PROMOTED)',
                failed: 'অনুত্তীর্ণ (RETAINED)',
                passed: 'কৃতকার্য',
                workingDays: 'মোট কর্মদিবস',
                presentDays: 'উপস্থিত দিন',
                absentDays: 'অনুপস্থিত দিন',
                attendanceRate: 'উপস্থিতির হার %',
                saveChanges: 'তথ্য সংরক্ষণ করুন',
                printReport: 'রিপোর্ট কার্ড প্রিন্ট করুন',
                downloadPdf: 'পিডিএফ ডাউনলোড',
                parentPhonePlaceholder: 'অভিভাবকের মোবাইল নম্বর',
                sendWhatsApp: 'হোয়াটসঅ্যাপে পাঠান',
                sendSMS: 'এসএমএস পাঠান',
              }
            };

            const dictionary = t_dict[reportLang];

            const handleSave = () => {
              addAuditLog(`Saved modified academic grades for student ${selectedStudent.name} (${selectedStudent.registerNo})`);
              showToast(`Result Card details for ${selectedStudent.name} saved successfully!`, 'success');
            };

            const handleWhatsAppSend = () => {
              addAuditLog(`Sent WhatsApp notification to ${parentPhone} for student ${selectedStudent.name}`);
              showToast(`Report card WhatsApp message sent to parent (${parentPhone})!`, 'success');
            };

            const handleSMSSend = () => {
              addAuditLog(`Sent SMS notification to ${parentPhone} for student ${selectedStudent.name}`);
              showToast(`Report card SMS notification sent to parent (${parentPhone})!`, 'success');
            };

            const handlePdfDownload = () => {
              addAuditLog(`Downloaded PDF report card for student ${selectedStudent.name}`);
              showToast(`Downloading high-resolution PDF for ${selectedStudent.name}...`, 'info');
              window.print();
            };

            const handlePrint = () => {
              addAuditLog(`Printed result report card for student ${selectedStudent.name}`);
              window.print();
            };

            return (
              <div className="space-y-6">
                {/* Dynamic Head Rule for Printing only the Report Card */}
                <style dangerouslySetInnerHTML={{__html: `
                  @media print {
                    body * {
                      visibility: hidden !important;
                    }
                    #printable-report-card, #printable-report-card * {
                      visibility: visible !important;
                    }
                    #printable-report-card {
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      width: 100% !important;
                      border: none !important;
                      box-shadow: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      background: white !important;
                    }
                  }
                `}} />

                {/* HEADER / CONTROLS PANEL */}
                <div className="p-6 bg-white border border-slate-150 rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-emerald-600" />
                        Primary Section Results
                      </h2>
                      <p className="text-slate-500 text-[11px] mt-1">4 Semester Result Card for Primary Section (Play to Class V)</p>
                    </div>
                    <div>
                      <button 
                        onClick={handlePrint}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Printer className="w-4 h-4" />
                        Generate & Print
                      </button>
                    </div>
                  </div>

                  {/* FILTERS CONTAINER */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Academic Year</label>
                      <select 
                        value={primYear} 
                        onChange={(e) => setPrimYear(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Exam</label>
                      <select 
                        value={primExam} 
                        onChange={(e) => setPrimExam(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Annual Examination">Annual Examination</option>
                        <option value="Half Yearly Examination">Half Yearly Examination</option>
                        <option value="First Term">First Term</option>
                        <option value="Second Term">Second Term</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Class</label>
                      <select 
                        value={primClass} 
                        onChange={(e) => setPrimClass(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Section</label>
                      <div className="flex gap-2">
                        <select 
                          value={primSection} 
                          onChange={(e) => setPrimSection(e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                        <button 
                          onClick={() => {
                            showToast(`Filtered report list to ${primClass} - Section ${primSection}`, 'success');
                          }}
                          className="px-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition flex items-center justify-center"
                        >
                          <Filter className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ADDITIONAL PRINT OPTION CHECKBOXES */}
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pt-1 font-bold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={primPrintAttendance}
                        onChange={(e) => setPrimPrintAttendance(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Print Attendance
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={primPrintGradeScale}
                        onChange={(e) => setPrimPrintGradeScale(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Print Grade Scale
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium text-[11px]">Print Date:</span>
                      <input 
                        type="date" 
                        value={primPrintDate}
                        onChange={(e) => setPrimPrintDate(e.target.value)}
                        className="border border-slate-200 rounded p-1 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* TABLE OF STUDENTS LIST */}
                <div className="p-6 bg-white border border-slate-150 rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Show</span>
                      <select 
                        value={primRowsPerPage}
                        onChange={(e) => {
                          setPrimRowsPerPage(Number(e.target.value));
                          setPrimCurrentPage(1);
                        }}
                        className="text-xs font-bold bg-slate-50 border border-slate-250 p-1.5 rounded-lg focus:outline-none"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      <span className="text-xs font-bold text-slate-400">rows per page</span>
                    </div>
                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search student..."
                        value={primSearch}
                        onChange={(e) => {
                          setPrimSearch(e.target.value);
                          setPrimCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-150">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150">
                          <th className="p-3 text-center w-10">
                            <input type="checkbox" readOnly checked className="rounded text-emerald-600" />
                          </th>
                          <th className="p-3 text-center w-12">SI</th>
                          <th className="p-3">STUDENT NAME</th>
                          <th className="p-3">CATEGORY</th>
                          <th className="p-3">REGISTER NO</th>
                          <th className="p-3">ROLL</th>
                          <th className="p-3">MOBILE NO</th>
                          <th className="p-3">REMARKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedStudents.map((st, idx) => {
                          const serial = startIndex + idx + 1;
                          const isSelected = activeStudentId === st.id;
                          return (
                            <tr 
                              key={st.id}
                              onClick={() => {
                                setPrimSelectedStudentId(st.id);
                                if (st.mobile !== '--') {
                                  setParentPhone(st.mobile);
                                }
                              }}
                              className={`border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition ${isSelected ? 'bg-emerald-50/50 hover:bg-emerald-50' : ''}`}
                            >
                              <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => {
                                    setPrimSelectedStudentId(st.id);
                                    if (st.mobile !== '--') {
                                      setParentPhone(st.mobile);
                                    }
                                  }}
                                  className="rounded text-emerald-600 focus:ring-emerald-500" 
                                />
                              </td>
                              <td className="p-3 text-center font-bold text-slate-400">{serial}</td>
                              <td className="p-3 font-extrabold text-slate-800">{st.name}</td>
                              <td className="p-3 text-slate-500 font-bold">{st.category}</td>
                              <td className="p-3 font-mono font-bold text-slate-600">{st.registerNo}</td>
                              <td className="p-3 font-mono font-bold text-slate-600">{st.roll}</td>
                              <td className="p-3 font-semibold text-slate-500">{st.mobile}</td>
                              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="text" 
                                  value={primStudentData[st.id]?.remarks || st.remarks} 
                                  onChange={(e) => handleTextChange('remarks', e.target.value)}
                                  placeholder="Type Remarks..."
                                  className="w-full text-xs font-semibold border border-slate-200 rounded p-1.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </td>
                            </tr>
                          );
                        })}
                        {paginatedStudents.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center font-bold text-slate-400">No students found matching your criteria.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-slate-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + primRowsPerPage, totalRows)} of {totalRows} entries
                      </span>
                      <div className="flex items-center gap-1">
                        <button 
                          disabled={primCurrentPage === 1}
                          onClick={() => setPrimCurrentPage(prev => Math.max(1, prev - 1))}
                          className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button 
                            key={i}
                            onClick={() => setPrimCurrentPage(i + 1)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${primCurrentPage === i + 1 ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button 
                          disabled={primCurrentPage === totalPages}
                          onClick={() => setPrimCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* PROGRESS REPORT CARD DESIGN CONTAINER */}
                <div className="space-y-4">
                  <div className="text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center justify-between px-1">
                    <span>Result Card Live Preview</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-black">Interactive Editing Allowed</span>
                  </div>

                  {/* THE REAL PROGRESS REPORT CARD */}
                  <div 
                    id="printable-report-card"
                    className="w-full max-w-[800px] mx-auto bg-white border border-slate-300 rounded-2xl shadow-xl p-8 relative overflow-hidden text-[11px] leading-relaxed text-slate-800"
                  >
                    {/* BLUE BORDER OUTLINE */}
                    <div className="absolute inset-4 border border-[#3b82f6]/40 pointer-events-none rounded-xl" />

                    {/* TOP DECORATIVE WAVE LINE */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-500" />

                    {/* MAIN CARD INNER GRID */}
                    <div className="space-y-6 relative z-10 p-2">
                      
                      {/* HEADER SECTION */}
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-4">
                        {/* SCHOOL LOGO & INFO */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center flex-shrink-0 shadow shadow-blue-900/30">
                            <GraduationCap className="w-7 h-7" />
                          </div>
                          <div>
                            <h1 className="text-base font-black text-[#1e3a8a] uppercase tracking-tight leading-none">{dictionary.schoolName}</h1>
                            <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{dictionary.address}</p>
                            <div className="inline-block bg-[#1e3a8a] text-white text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase mt-1.5 shadow-sm">
                              {dictionary.reportTitle}
                            </div>
                            <p className="text-[9px] text-slate-400 font-extrabold mt-1 uppercase tracking-widest">{primExam} ({primYear})</p>
                          </div>
                        </div>

                        {/* GRADE SCALE TABLE BOX */}
                        {primPrintGradeScale && (
                          <div className="w-40 border border-slate-200 rounded-lg p-1.5 text-[8px] bg-slate-50 font-semibold text-slate-500 flex-shrink-0">
                            <div className="grid grid-cols-3 border-b border-slate-200 pb-1 mb-1 font-bold text-slate-700">
                              <span>Marks</span>
                              <span className="text-center">Grade</span>
                              <span className="text-right">Point</span>
                            </div>
                            <div className="space-y-0.5">
                              <div className="grid grid-cols-3"><span>80-100</span><span className="text-center text-emerald-600 font-bold">A+</span><span className="text-right">5.00</span></div>
                              <div className="grid grid-cols-3"><span>70-79</span><span className="text-center text-emerald-600 font-bold">A</span><span className="text-right">4.00</span></div>
                              <div className="grid grid-cols-3"><span>60-69</span><span className="text-center text-[#1e3a8a] font-bold">A-</span><span className="text-right">3.50</span></div>
                              <div className="grid grid-cols-3"><span>50-59</span><span className="text-center">B</span><span className="text-right">3.00</span></div>
                              <div className="grid grid-cols-3"><span>40-49</span><span className="text-center">C</span><span className="text-right">2.00</span></div>
                              <div className="grid grid-cols-3"><span>33-39</span><span className="text-center">D</span><span className="text-right">1.00</span></div>
                              <div className="grid grid-cols-3 text-red-500"><span>0-32</span><span className="text-center font-bold">F</span><span className="text-right">0.00</span></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* STUDENT BIO INFORMATION */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        {/* PHOTO BLOCK */}
                        <div className="md:col-span-1 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-lg bg-white p-2 min-h-[95px] text-center">
                          <Users className="w-6 h-6 text-slate-300 mb-1" />
                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Passport Size Photo</span>
                        </div>

                        {/* INFO DETAILS GRID */}
                        <div className="md:col-span-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.studentName}</span>
                            <span className="font-extrabold text-slate-800 text-right">{selectedStudent.name}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.studentId}</span>
                            <span className="font-mono font-bold text-slate-700 text-right">{selectedStudent.registerNo}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">Father's Name</span>
                            <span className="font-bold text-slate-700 text-right">Rafiqul Islam</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.rollNo}</span>
                            <span className="font-mono font-bold text-slate-700 text-right">{selectedStudent.roll}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">Mother's Name</span>
                            <span className="font-bold text-slate-700 text-right">Ayesha Begum</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.className}</span>
                            <span className="font-extrabold text-[#1e3a8a] text-right">{primClass}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.examName}</span>
                            <span className="font-bold text-slate-700 text-right">{primExam}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.section}</span>
                            <span className="font-bold text-slate-700 text-right">General / {primSection}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">Shift / Group</span>
                            <span className="font-bold text-slate-700 text-right">Day / Gen</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.issueDate}</span>
                            <span className="font-mono font-bold text-slate-700 text-right">{primPrintDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* ACADEMIC SUBJECTS TABLE */}
                      <div className="overflow-hidden rounded-xl border border-slate-200">
                        <table className="w-full text-[9px] text-left border-collapse">
                          <thead>
                            <tr className="bg-[#1e3a8a] text-white font-extrabold text-[8px] tracking-wider uppercase">
                              <th className="p-2 border-r border-slate-700">Name of Subject</th>
                              <th className="p-2 text-center border-r border-slate-700 w-16">Full Marks</th>
                              <th className="p-2 text-center border-r border-slate-700 w-16">Highest</th>
                              <th className="p-2 text-center border-r border-slate-700 w-16">MT (30)</th>
                              <th className="p-2 text-center border-r border-slate-700 w-16">SE (70)</th>
                              <th className="p-2 text-center border-r border-slate-700 w-14">Grace</th>
                              <th className="p-2 text-center border-r border-slate-700 w-16">Total</th>
                              <th className="p-2 text-center border-r border-slate-700 w-24">Letter Grade</th>
                              <th className="p-2 text-right w-20">Grade Point</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjectsWithGrades.map((sub, sIdx) => {
                              return (
                                <tr key={sub.subject} className="border-b border-slate-200 font-semibold odd:bg-slate-50/50">
                                  <td className="p-2 border-r border-slate-200 font-extrabold text-[#1e3a8a]">{sub.subject}</td>
                                  <td className="p-2 text-center border-r border-slate-200 text-slate-400 font-mono font-bold">100</td>
                                  <td className="p-2 text-center border-r border-slate-200 font-mono text-slate-600">{sub.highest}</td>
                                  
                                  {/* MT INPUT */}
                                  <td className="p-1 border-r border-slate-200 text-center">
                                    <input 
                                      type="number" 
                                      value={sub.mt} 
                                      onChange={(e) => handleScoreChange(sIdx, 'mt', Number(e.target.value))}
                                      className="w-12 text-center font-bold bg-yellow-50 hover:bg-yellow-100/70 border border-yellow-200 focus:bg-white focus:border-emerald-500 rounded p-1 text-[9px] focus:outline-none transition"
                                      min={0}
                                      max={30}
                                    />
                                  </td>

                                  {/* SE INPUT */}
                                  <td className="p-1 border-r border-slate-200 text-center">
                                    <input 
                                      type="number" 
                                      value={sub.se} 
                                      onChange={(e) => handleScoreChange(sIdx, 'se', Number(e.target.value))}
                                      className="w-12 text-center font-bold bg-yellow-50 hover:bg-yellow-100/70 border border-yellow-200 focus:bg-white focus:border-emerald-500 rounded p-1 text-[9px] focus:outline-none transition"
                                      min={0}
                                      max={70}
                                    />
                                  </td>

                                  {/* GRACE INPUT */}
                                  <td className="p-1 border-r border-slate-200 text-center">
                                    <input 
                                      type="number" 
                                      value={sub.grace} 
                                      onChange={(e) => handleScoreChange(sIdx, 'grace', Number(e.target.value))}
                                      className="w-10 text-center font-bold bg-yellow-50 hover:bg-yellow-100/70 border border-yellow-200 focus:bg-white focus:border-emerald-500 rounded p-1 text-[9px] focus:outline-none transition"
                                      min={0}
                                      max={10}
                                    />
                                  </td>

                                  {/* TOTAL SCORE */}
                                  <td className="p-2 text-center border-r border-slate-200 font-extrabold text-slate-800 font-mono">{sub.total}</td>
                                  
                                  {/* LETTER GRADE */}
                                  <td className="p-2 text-center border-r border-slate-200">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                                      sub.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' : 
                                      sub.grade === 'A' ? 'bg-emerald-50 text-emerald-700' :
                                      sub.grade === 'F' ? 'bg-red-100 text-red-800 font-black' : 'bg-slate-100 text-slate-800'
                                    }`}>
                                      {sub.grade}
                                    </span>
                                  </td>

                                  {/* GRADE POINT */}
                                  <td className="p-2 text-right font-mono font-extrabold text-[#1e3a8a]">{sub.point.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                            
                            {/* TOTAL Row */}
                            <tr className="bg-slate-50 font-black text-slate-800 border-t-2 border-slate-300">
                              <td className="p-2 border-r border-slate-200 uppercase text-[#1e3a8a]">Total Summary</td>
                              <td className="p-2 text-center border-r border-slate-200 font-mono">{totalFullMarks}</td>
                              <td className="p-2 border-r border-slate-200" colSpan={4}></td>
                              <td className="p-2 text-center border-r border-slate-200 font-mono text-[#1e3a8a] text-[10px]">{totalMarksEarned}</td>
                              <td className="p-2 text-center border-r border-slate-200">GPA Average</td>
                              <td className="p-2 text-right font-mono text-[10px] text-emerald-700">{calculatedGPA.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* SUMMARY BLOCK IN LOWER REGION */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-4">
                        
                        {/* COLUMN 1: RESULT ANALYTICS & ATTENDANCE */}
                        <div className="space-y-3">
                          {/* RESULT BOX */}
                          <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                            <p className="font-extrabold text-[#1e3a8a] border-b border-slate-200 pb-1.5 text-[10px] uppercase tracking-wider">Result Summary</p>
                            <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-bold">
                              <span className="text-slate-400">Result Status:</span>
                              <span className={`text-right font-black ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                                {isPassed ? 'Passed' : 'Failed'}
                              </span>
                              <span className="text-slate-400">Position in Section:</span>
                              <span className="text-right text-slate-700">1st</span>
                              <span className="text-slate-400">GPA:</span>
                              <span className="text-right text-[#1e3a8a] font-black">{calculatedGPA.toFixed(2)}</span>
                              <span className="text-slate-400">Failed Subjects:</span>
                              <span className={`text-right ${hasFailedSubject ? 'text-red-500 font-black' : 'text-slate-400'}`}>
                                {hasFailedSubject ? '1 Subject' : '--'}
                              </span>
                            </div>
                          </div>

                          {/* ATTENDANCE SUMMARY BOX */}
                          {primPrintAttendance && (
                            <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                              <p className="font-extrabold text-[#1e3a8a] border-b border-slate-200 pb-1.5 text-[10px] uppercase tracking-wider">Attendance Summary</p>
                              <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-bold items-center">
                                <span className="text-slate-400">Working Days:</span>
                                <div className="text-right">
                                  <input 
                                    type="number" 
                                    value={currentData.attendanceDays}
                                    onChange={(e) => handleAttendanceChange('attendanceDays', Number(e.target.value))}
                                    className="w-12 text-center border border-slate-250 bg-yellow-50 rounded p-0.5 focus:bg-white text-[9px] font-bold focus:outline-none"
                                    min={1}
                                  />
                                </div>
                                <span className="text-slate-400">Present Days:</span>
                                <div className="text-right">
                                  <input 
                                    type="number" 
                                    value={currentData.attendancePresent}
                                    onChange={(e) => handleAttendanceChange('attendancePresent', Number(e.target.value))}
                                    className="w-12 text-center border border-slate-250 bg-yellow-50 rounded p-0.5 focus:bg-white text-[9px] font-bold focus:outline-none"
                                    min={0}
                                  />
                                </div>
                                <span className="text-slate-400">Total Absent:</span>
                                <span className="text-right text-slate-700 font-mono font-bold">
                                  {Math.max(0, currentData.attendanceDays - currentData.attendancePresent)}
                                </span>
                                <span className="text-slate-400">Percentage:</span>
                                <span className="text-right text-emerald-700 font-black">
                                  {Math.round((currentData.attendancePresent / (currentData.attendanceDays || 1)) * 100)}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* COLUMN 2: MORAL, CO-CURRICULAR & COMMENTS */}
                        <div className="space-y-3">
                          {/* MORAL & BEHAVIOR */}
                          <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                            <p className="font-extrabold text-[#1e3a8a] border-b border-slate-200 pb-1.5 text-[10px] uppercase tracking-wider">Moral & Behavior</p>
                            <div className="flex justify-between gap-1 text-[9px] font-bold">
                              {['Excellent', 'Good', 'Average', 'Poor'].map((level) => {
                                const isChecked = currentData.moral === level;
                                return (
                                  <label 
                                    key={level} 
                                    className={`flex items-center gap-1 cursor-pointer p-0.5 rounded transition ${isChecked ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-400'}`}
                                  >
                                    <input 
                                      type="checkbox" 
                                      checked={isChecked}
                                      onChange={() => handleTextChange('moral', level)}
                                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3 h-3"
                                    />
                                    {level}
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* CO-CURRICULAR */}
                          <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                            <p className="font-extrabold text-[#1e3a8a] border-b border-slate-200 pb-1.5 text-[10px] uppercase tracking-wider">Co-Curricular Activities</p>
                            <div className="space-y-1.5 text-[9px] font-bold text-slate-600">
                              {Object.entries(currentData.coCurricular).map(([key, val]) => {
                                return (
                                  <div key={key} className="flex justify-between items-center">
                                    <span className="capitalize">{key}:</span>
                                    <select 
                                      value={val}
                                      onChange={(e) => handleCoCurricularChange(key, e.target.value)}
                                      className="bg-white border border-slate-250 text-[9px] p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-extrabold text-slate-850"
                                    >
                                      <option value="Excellent">Excellent</option>
                                      <option value="Good">Good</option>
                                      <option value="Outstanding">Outstanding</option>
                                      <option value="Satisfactory">Satisfactory</option>
                                      <option value="Needs Improvement">Needs Improvement</option>
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* TEACHER'S REMARKS */}
                          <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                            <p className="font-extrabold text-[#1e3a8a] text-[10px] uppercase tracking-wider">Teacher's Remarks</p>
                            <textarea 
                              value={currentData.remarks}
                              onChange={(e) => handleTextChange('remarks', e.target.value)}
                              placeholder="Add your remarks here..."
                              rows={2}
                              className="w-full text-[9px] font-semibold border border-slate-250 rounded-xl p-2 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                            />
                          </div>
                        </div>

                        {/* COLUMN 3: DIGITAL VERIFICATION & PHYSICAL STAMP */}
                        <div className="space-y-3">
                          <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/40 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center space-y-3">
                            <p className="font-extrabold text-[#1e3a8a] text-[9px] uppercase tracking-wider">Digital Verification</p>
                            
                            {/* SVG QR CODE */}
                            <div className="w-16 h-16 bg-white border border-slate-200 p-1.5 rounded-xl flex items-center justify-center shadow-sm">
                              <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="6" height="6" />
                                <rect x="16" y="2" width="6" height="6" />
                                <rect x="2" y="16" width="6" height="6" />
                                <path d="M16 16h2v2h-2zm2 2h4v4h-4zm-4 2h2v2h-2zm6-4h2v2h-2zm-2-2h2v2h-2zm6 6v-2h-2v2z" />
                                <rect x="4" y="4" width="2" height="2" fill="currentColor" />
                                <rect x="18" y="4" width="2" height="2" fill="currentColor" />
                                <rect x="4" y="18" width="2" height="2" fill="currentColor" />
                              </svg>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-[8px] text-slate-500 font-bold leading-tight">Scan to verify authentic result ledger</p>
                              <p className="text-[7.5px] text-slate-400 font-mono mt-0.5">Ref: STD-{selectedStudent.id}-{primYear}</p>
                            </div>

                            {/* PHYSICAL INK BADGE/STAMP */}
                            <div className="pt-2">
                              <span className={`inline-block text-[11px] tracking-widest font-black border-3 px-4 py-1.5 rounded-xl uppercase rotate-[-8deg] shadow-sm transform transition duration-300 ${
                                isPassed 
                                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50/75' 
                                  : 'border-red-500 text-red-600 bg-red-50/75'
                              }`}>
                                {isPassed ? 'PROMOTED' : 'RETAINED'}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* BOTTOM DECORATIVE FOOTER */}
                      <div className="flex justify-between items-center text-[8px] font-black text-slate-400 pt-2 border-t border-slate-150">
                        <span>STUDENTS CARE MODEL SCHOOL • BANGLADESH</span>
                        <span>OFFICIAL ACADEMIC TRANSCRIPT • CONFIDENTIAL</span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM REPORT CARD ACTION BAR */}
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* LEFT CONTROLS */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Save className="w-4 h-4" />
                        {dictionary.saveChanges}
                      </button>
                      <button 
                        onClick={handlePrint}
                        className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Printer className="w-4 h-4" />
                        {dictionary.printReport}
                      </button>
                      <button 
                        onClick={handlePdfDownload}
                        className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Download className="w-4 h-4" />
                        {dictionary.downloadPdf}
                      </button>

                      {/* PAPER DROPDOWN */}
                      <select className="bg-white border border-slate-250 p-1.5 rounded-lg text-xs font-bold text-slate-600 focus:outline-none">
                        <option>A4 (210×297)</option>
                        <option>Letter (216×279)</option>
                      </select>

                      <label className="flex items-center gap-1.5 text-xs text-slate-600 font-bold ml-1 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600" />
                        Scale to Fit
                      </label>

                      {/* LANGUAGE TOGGLE BUTTONS */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden ml-2 shadow-sm">
                        <button 
                          onClick={() => setReportLang('EN')}
                          className={`px-3 py-1.5 text-xs font-black transition ${reportLang === 'EN' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                          EN
                        </button>
                        <button 
                          onClick={() => setReportLang('BN')}
                          className={`px-3 py-1.5 text-xs font-black transition ${reportLang === 'BN' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                          বাং
                        </button>
                      </div>
                    </div>

                    {/* RIGHT CONTACT SEND CONTROLS */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <input 
                        type="text" 
                        placeholder={dictionary.parentPhonePlaceholder}
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2 max-w-[160px] focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                      />
                      <button 
                        onClick={handleWhatsAppSend}
                        className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1 shadow-sm transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                        Send via WhatsApp
                      </button>
                      <button 
                        onClick={handleSMSSend}
                        className="px-3 py-2 text-xs font-bold text-[#3b82f6] bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1 shadow-sm transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send via SMS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'high_section' && (() => {
            const highSectionStudentsList = [
              { id: 'STD-1004', name: 'Zayan Chowdhury', category: 'Student', registerNo: 'STD 1004', roll: '01', mobile: '+880 1712 112233', remarks: 'Brilliant student' },
              { id: 'STD-1005', name: 'Nusrat Jahan', category: 'Student', registerNo: 'STD 1005', roll: '02', mobile: '+880 1713 445566', remarks: 'Very dedicated' },
              { id: 'STD-1006', name: 'Tahmid Rahman', category: 'Student', registerNo: 'STD 1006', roll: '03', mobile: '--', remarks: 'Excellent logical skills' },
              { id: 'STD-1007', name: 'Sadia Islam', category: 'Student', registerNo: 'STD 1007', roll: '04', mobile: '+880 1714 778899', remarks: 'Sincere and polite' },
              { id: 'STD-1008', name: 'Imran Hashmi', category: 'Student', registerNo: 'STD 1008', roll: '05', mobile: '--', remarks: 'Good in mathematics' },
              { id: 'STD-1009', name: 'Tasnim Ahmed', category: 'Student', registerNo: 'STD 1009', roll: '06', mobile: '+880 1715 123456', remarks: 'Outstanding performance' },
              { id: 'STD-1010', name: 'Fabiha Bushra', category: 'Student', registerNo: 'STD 1010', roll: '07', mobile: '+880 1716 654321', remarks: 'Consistently improves' },
              { id: 'STD-1011', name: 'Rifat Chowdhury', category: 'Student', registerNo: 'STD 1011', roll: '08', mobile: '--', remarks: 'Very energetic' }
            ];

            // Filter the list of students by search
            const filteredStudents = highSectionStudentsList.filter(student => {
              const matchesSearch = student.name.toLowerCase().includes(highSearch.toLowerCase()) || 
                                    student.registerNo.toLowerCase().includes(highSearch.toLowerCase());
              return matchesSearch;
            });

            // Pagination calculations
            const totalRows = filteredStudents.length;
            const totalPages = Math.ceil(totalRows / highRowsPerPage);
            const startIndex = (highCurrentPage - 1) * highRowsPerPage;
            const paginatedStudents = filteredStudents.slice(startIndex, startIndex + highRowsPerPage);

            const activeStudentId = highSelectedStudentId || 'STD-1004';
            const selectedStudent = highSectionStudentsList.find(s => s.id === activeStudentId) || highSectionStudentsList[0];
            const currentData = getOrInitStudentHighData(selectedStudent.id);

            // Handle live score editing
            const handleScoreChange = (subjectIndex: number, field: 'mt' | 'se' | 'grace', value: number) => {
              setHighStudentData(prev => {
                const updated = { ...prev };
                const studentData = { ...getOrInitStudentHighData(selectedStudent.id), ...updated[selectedStudent.id] };
                const updatedSubjects = [...studentData.subjects];
                
                // Enforce constraints
                let cappedVal = Math.max(0, value);
                if (field === 'mt') cappedVal = Math.min(30, cappedVal);
                if (field === 'se') cappedVal = Math.min(70, cappedVal);
                if (field === 'grace') cappedVal = Math.min(10, cappedVal);

                updatedSubjects[subjectIndex] = {
                  ...updatedSubjects[subjectIndex],
                  [field]: cappedVal
                };

                studentData.subjects = updatedSubjects;
                updated[selectedStudent.id] = studentData;
                return updated;
              });
            };

            // Handle attendance change
            const handleAttendanceChange = (field: 'attendanceDays' | 'attendancePresent', value: number) => {
              setHighStudentData(prev => {
                const updated = { ...prev };
                const studentData = { ...getOrInitStudentHighData(selectedStudent.id), ...updated[selectedStudent.id] };
                
                let cappedVal = Math.max(0, value);
                if (field === 'attendancePresent') {
                  cappedVal = Math.min(studentData.attendanceDays, cappedVal);
                }

                studentData[field] = cappedVal;
                updated[selectedStudent.id] = studentData;
                return updated;
              });
            };

            // Handle remarks or other text edits
            const handleTextChange = (field: 'remarks' | 'moral', value: string) => {
              setHighStudentData(prev => {
                const updated = { ...prev };
                const studentData = { ...getOrInitStudentHighData(selectedStudent.id), ...updated[selectedStudent.id] };
                
                if (field === 'moral') {
                  studentData.moral = value as any;
                } else {
                  studentData.remarks = value;
                }
                
                updated[selectedStudent.id] = studentData;
                return updated;
              });
            };

            // Handle co-curricular activity change
            const handleCoCurricularChange = (activityKey: string, value: string) => {
              setHighStudentData(prev => {
                const updated = { ...prev };
                const studentData = { ...getOrInitStudentHighData(selectedStudent.id), ...updated[selectedStudent.id] };
                
                studentData.coCurricular = {
                  ...studentData.coCurricular,
                  [activityKey]: value
                };
                
                updated[selectedStudent.id] = studentData;
                return updated;
              });
            };

            // Calculate current stats
            const subjectsWithGrades = currentData.subjects.map(sub => {
              const total = Number(sub.mt || 0) + Number(sub.se || 0) + Number(sub.grace || 0);
              const { grade, point } = getGradeAndPoint(total);
              return {
                ...sub,
                total,
                grade,
                point
              };
            });

            const totalMarksEarned = subjectsWithGrades.reduce((sum, s) => sum + s.total, 0);
            const totalFullMarks = subjectsWithGrades.reduce((sum, s) => sum + s.fullMarks, 0);
            const hasFailedSubject = subjectsWithGrades.some(s => s.grade === 'F');
            const gpaRaw = subjectsWithGrades.reduce((sum, s) => sum + s.point, 0) / subjectsWithGrades.length;
            const calculatedGPA = hasFailedSubject ? 0.00 : Number(gpaRaw.toFixed(2));
            const isPassed = !hasFailedSubject && calculatedGPA >= 1.00;

            const t_dict = {
              EN: {
                reportTitle: 'PROGRESS REPORT',
                schoolName: 'Students Care Model School',
                address: 'Main Road, Dhaka, Bangladesh',
                studentName: 'Student Name',
                studentId: 'Student ID',
                rollNo: 'Roll No',
                className: 'Class',
                examName: 'Examination',
                year: 'Academic Year',
                section: 'Group / Section',
                shift: 'Shift',
                contact: 'Contact',
                issueDate: 'Issue Date',
                subject: 'NAME OF SUBJECT',
                fullMarks: 'FULL MARKS',
                highest: 'HIGHEST',
                mt: 'MT',
                se: 'SE',
                grace: 'GRACE',
                total: 'TOTAL',
                letterGrade: 'LETTER GRADE',
                gradePoint: 'GRADE POINT',
                resultSummary: 'FINAL RESULT SUMMARY',
                attendanceSummary: 'ATTENDANCE SUMMARY',
                moralBehavior: 'MORAL & BEHAVIOR',
                coCurricular: 'CO-CURRICULAR ACTIVITIES',
                remarks: "TEACHER'S REMARKS",
                verification: 'DIGITAL VERIFICATION',
                promoted: 'PROMOTED',
                failed: 'FAILED',
                passed: 'Passed',
                workingDays: 'Total Working Days',
                presentDays: 'Attendance (Present)',
                absentDays: 'Total Absent',
                attendanceRate: 'Attendance %',
                saveChanges: 'Save Changes',
                printReport: 'Print Report Card',
                downloadPdf: 'Download PDF',
                parentPhonePlaceholder: 'Parent phone (e.g. +8801XXXXXXX)',
                sendWhatsApp: 'Send via WhatsApp',
                sendSMS: 'Send via SMS',
              },
              BN: {
                reportTitle: 'অগ্রগতিপত্র',
                schoolName: 'স্টুডেন্টস কেয়ার মডেল স্কুল',
                address: 'প্রধান সড়ক, ঢাকা, বাংলাদেশ',
                studentName: 'শিক্ষার্থীর নাম',
                studentId: 'শিক্ষার্থী আইডি',
                rollNo: 'রোল নম্বর',
                className: 'শ্রেণী',
                examName: 'পরীক্ষা',
                year: 'শিক্ষাবর্ষ',
                section: 'বিভাগ / শাখা',
                shift: 'শিফট',
                contact: 'যোগাযোগ',
                issueDate: 'প্রকাশের তারিখ',
                subject: 'বিষয়ের নাম',
                fullMarks: 'পূর্ণমান',
                highest: 'সর্বোচ্চ নম্বর',
                mt: 'শ্রেণী পরীক্ষা (MT)',
                se: 'সাময়িক পরীক্ষা (SE)',
                grace: 'করুণা নম্বর',
                total: 'মোট নম্বর',
                letterGrade: 'লেটার গ্রেড',
                gradePoint: 'গ্রেড পয়েন্ট',
                resultSummary: 'চূড়ান্ত ফলাফল সারসংক্ষেপ',
                attendanceSummary: 'উপস্থিতির সারসংক্ষেপ',
                moralBehavior: 'নৈতিকতা ও আচরণ',
                coCurricular: 'সহ-পাঠ্যক্রমিক কার্যক্রম',
                remarks: 'শিক্ষকের মন্তব্য',
                verification: 'ডিজিটাল যাচাইকরণ',
                promoted: 'উত্তীর্ণ (PROMOTED)',
                failed: 'অনুত্তীর্ণ (RETAINED)',
                passed: 'কৃতকার্য',
                workingDays: 'মোট কর্মদিবস',
                presentDays: 'উপস্থিত দিন',
                absentDays: 'অনুপস্থিত দিন',
                attendanceRate: 'উপস্থিতির হার %',
                saveChanges: 'তথ্য সংরক্ষণ করুন',
                printReport: 'রিপোর্ট কার্ড প্রিন্ট করুন',
                downloadPdf: 'পিডিএফ ডাউনলোড',
                parentPhonePlaceholder: 'অভিভাবকের মোবাইল নম্বর',
                sendWhatsApp: 'হোয়াটসঅ্যাপে পাঠান',
                sendSMS: 'এসএমএস পাঠান',
              }
            };

            const dictionary = t_dict[reportLang];

            const handleSave = () => {
              addAuditLog(`Saved modified academic grades for High Section student ${selectedStudent.name} (${selectedStudent.registerNo})`);
              showToast(`Result Card details for ${selectedStudent.name} saved successfully!`, 'success');
            };

            const handleWhatsAppSend = () => {
              addAuditLog(`Sent WhatsApp notification to ${parentPhone} for High Section student ${selectedStudent.name}`);
              showToast(`Report card WhatsApp message sent to parent (${parentPhone})!`, 'success');
            };

            const handleSMSSend = () => {
              addAuditLog(`Sent SMS notification to ${parentPhone} for High Section student ${selectedStudent.name}`);
              showToast(`Report card SMS notification sent to parent (${parentPhone})!`, 'success');
            };

            const handlePdfDownload = () => {
              addAuditLog(`Downloaded PDF report card for High Section student ${selectedStudent.name}`);
              showToast(`Downloading high-resolution PDF for ${selectedStudent.name}...`, 'info');
              window.print();
            };

            const handlePrint = () => {
              addAuditLog(`Printed High Section result report card for student ${selectedStudent.name}`);
              window.print();
            };

            return (
              <div className="space-y-6">
                {/* Dynamic Head Rule for Printing only the Report Card */}
                <style dangerouslySetInnerHTML={{__html: `
                  @media print {
                    body * {
                      visibility: hidden !important;
                    }
                    #printable-report-card, #printable-report-card * {
                      visibility: visible !important;
                    }
                    #printable-report-card {
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      width: 100% !important;
                      border: none !important;
                      box-shadow: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      background: white !important;
                    }
                  }
                `}} />

                {/* HEADER / CONTROLS PANEL */}
                <div className="p-6 bg-white border border-slate-150 rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[#005c53]" />
                        High School Section Results
                      </h2>
                      <p className="text-slate-500 text-[11px] mt-1">Terminal Examination Result Sheet & Progress Card (Grade 6 to 10)</p>
                    </div>
                    <div>
                      <button 
                        onClick={handlePrint}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#005c53] hover:bg-[#004d45] rounded-xl flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Printer className="w-4 h-4" />
                        Generate & Print
                      </button>
                    </div>
                  </div>

                  {/* FILTERS CONTAINER */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Academic Year</label>
                      <select 
                        value={highYear} 
                        onChange={(e) => setHighYear(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Exam</label>
                      <select 
                        value={highExam} 
                        onChange={(e) => setHighExam(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Annual Examination">Annual Examination</option>
                        <option value="Half Yearly Examination">Half Yearly Examination</option>
                        <option value="First Term">First Term</option>
                        <option value="Second Term">Second Term</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Class</label>
                      <select 
                        value={highClass} 
                        onChange={(e) => setHighClass(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Section</label>
                      <div className="flex gap-2">
                        <select 
                          value={highSection} 
                          onChange={(e) => setHighSection(e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                        <button 
                          onClick={() => {
                            showToast(`Filtered report list to ${highClass} - Section ${highSection}`, 'success');
                          }}
                          className="px-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition flex items-center justify-center"
                        >
                          <Filter className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ADDITIONAL PRINT OPTION CHECKBOXES */}
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pt-1 font-bold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={highPrintAttendance}
                        onChange={(e) => setHighPrintAttendance(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Print Attendance
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={highPrintGradeScale}
                        onChange={(e) => setHighPrintGradeScale(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Print Grade Scale
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium text-[11px]">Print Date:</span>
                      <input 
                        type="date" 
                        value={highPrintDate}
                        onChange={(e) => setHighPrintDate(e.target.value)}
                        className="border border-slate-200 rounded p-1 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* TABLE OF STUDENTS LIST */}
                <div className="p-6 bg-white border border-slate-150 rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Show</span>
                      <select 
                        value={highRowsPerPage}
                        onChange={(e) => {
                          setHighRowsPerPage(Number(e.target.value));
                          setHighCurrentPage(1);
                        }}
                        className="text-xs font-bold bg-slate-50 border border-slate-250 p-1.5 rounded-lg focus:outline-none"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                      <span className="text-xs font-bold text-slate-400">rows per page</span>
                    </div>
                    <div className="relative max-w-xs w-full">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search student..."
                        value={highSearch}
                        onChange={(e) => {
                          setHighSearch(e.target.value);
                          setHighCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-150">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150">
                          <th className="p-3 text-center w-10">
                            <input type="checkbox" readOnly checked className="rounded text-emerald-600" />
                          </th>
                          <th className="p-3 text-center w-12">SI</th>
                          <th className="p-3">STUDENT NAME</th>
                          <th className="p-3">CATEGORY</th>
                          <th className="p-3">REGISTER NO</th>
                          <th className="p-3">ROLL</th>
                          <th className="p-3">MOBILE NO</th>
                          <th className="p-3">REMARKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedStudents.map((st, idx) => {
                          const serial = startIndex + idx + 1;
                          const isSelected = activeStudentId === st.id;
                          return (
                            <tr 
                              key={st.id}
                              onClick={() => {
                                setHighSelectedStudentId(st.id);
                                if (st.mobile !== '--') {
                                  setParentPhone(st.mobile);
                                }
                              }}
                              className={`border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition ${isSelected ? 'bg-emerald-50/50 hover:bg-emerald-50' : ''}`}
                            >
                              <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => {
                                    setHighSelectedStudentId(st.id);
                                    if (st.mobile !== '--') {
                                      setParentPhone(st.mobile);
                                    }
                                  }}
                                  className="rounded text-emerald-600 focus:ring-emerald-500" 
                                />
                              </td>
                              <td className="p-3 text-center font-bold text-slate-400">{serial}</td>
                              <td className="p-3 font-extrabold text-slate-800">{st.name}</td>
                              <td className="p-3 text-slate-500 font-bold">{st.category}</td>
                              <td className="p-3 font-mono font-bold text-slate-600">{st.registerNo}</td>
                              <td className="p-3 font-mono font-bold text-slate-600">{st.roll}</td>
                              <td className="p-3 font-semibold text-slate-500">{st.mobile}</td>
                              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="text" 
                                  value={highStudentData[st.id]?.remarks || st.remarks} 
                                  onChange={(e) => handleTextChange('remarks', e.target.value)}
                                  placeholder="Type Remarks..."
                                  className="w-full text-xs font-semibold border border-slate-200 rounded p-1.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </td>
                            </tr>
                          );
                        })}
                        {paginatedStudents.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center font-bold text-slate-400">No students found matching your criteria.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-slate-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + highRowsPerPage, totalRows)} of {totalRows} entries
                      </span>
                      <div className="flex items-center gap-1">
                        <button 
                          disabled={highCurrentPage === 1}
                          onClick={() => setHighCurrentPage(prev => Math.max(1, prev - 1))}
                          className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button 
                            key={i}
                            onClick={() => setHighCurrentPage(i + 1)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${highCurrentPage === i + 1 ? 'bg-[#005c53] border-[#005c53] text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button 
                          disabled={highCurrentPage === totalPages}
                          onClick={() => setHighCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* PROGRESS REPORT CARD DESIGN CONTAINER */}
                <div className="space-y-4">
                  <div className="text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center justify-between px-1">
                    <span>Result Card Live Preview</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-black">Interactive Editing Allowed</span>
                  </div>

                  {/* THE REAL PROGRESS REPORT CARD */}
                  <div 
                    id="printable-report-card"
                    className="w-full max-w-[800px] mx-auto bg-white border border-slate-300 rounded-2xl shadow-xl p-8 relative overflow-hidden text-[11px] leading-relaxed text-slate-800"
                  >
                    {/* BLUE BORDER OUTLINE */}
                    <div className="absolute inset-4 border border-[#005c53]/40 pointer-events-none rounded-xl" />

                    {/* TOP DECORATIVE WAVE LINE */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#005c53] via-[#008073] to-emerald-500" />

                    {/* MAIN CARD INNER GRID */}
                    <div className="space-y-6 relative z-10 p-2">
                      
                      {/* HEADER SECTION */}
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-4">
                        {/* SCHOOL LOGO & INFO */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#005c53] text-white flex items-center justify-center flex-shrink-0 shadow shadow-emerald-900/30">
                            <GraduationCap className="w-7 h-7" />
                          </div>
                          <div>
                            <h1 className="text-base font-black text-[#005c53] uppercase tracking-tight leading-none">{dictionary.schoolName}</h1>
                            <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{dictionary.address}</p>
                            <div className="inline-block bg-[#005c53] text-white text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase mt-1.5 shadow-sm">
                              {dictionary.reportTitle}
                            </div>
                            <p className="text-[9px] text-slate-400 font-extrabold mt-1 uppercase tracking-widest">{highExam} ({highYear})</p>
                          </div>
                        </div>

                        {/* GRADE SCALE TABLE BOX */}
                        {highPrintGradeScale && (
                          <div className="w-40 border border-slate-200 rounded-lg p-1.5 text-[8px] bg-slate-50 font-semibold text-slate-500 flex-shrink-0">
                            <div className="grid grid-cols-3 border-b border-slate-200 pb-1 mb-1 font-bold text-slate-700">
                              <span>Marks</span>
                              <span className="text-center">Grade</span>
                              <span className="text-right">Point</span>
                            </div>
                            <div className="space-y-0.5">
                              <div className="grid grid-cols-3"><span>80-100</span><span className="text-center text-emerald-600 font-bold">A+</span><span className="text-right">5.00</span></div>
                              <div className="grid grid-cols-3"><span>70-79</span><span className="text-center text-emerald-600 font-bold">A</span><span className="text-right">4.00</span></div>
                              <div className="grid grid-cols-3"><span>60-69</span><span className="text-center text-[#005c53] font-bold">A-</span><span className="text-right">3.50</span></div>
                              <div className="grid grid-cols-3"><span>50-59</span><span className="text-center">B</span><span className="text-right">3.00</span></div>
                              <div className="grid grid-cols-3"><span>40-49</span><span className="text-center">C</span><span className="text-right">2.00</span></div>
                              <div className="grid grid-cols-3"><span>33-39</span><span className="text-center">D</span><span className="text-right">1.00</span></div>
                              <div className="grid grid-cols-3 text-red-500"><span>0-32</span><span className="text-center font-bold">F</span><span className="text-right">0.00</span></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* STUDENT BIO INFORMATION */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        {/* PHOTO BLOCK */}
                        <div className="md:col-span-1 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-lg bg-white p-2 min-h-[95px] text-center">
                          <Users className="w-6 h-6 text-slate-300 mb-1" />
                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Passport Size Photo</span>
                        </div>

                        {/* INFO DETAILS GRID */}
                        <div className="md:col-span-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.studentName}</span>
                            <span className="font-extrabold text-slate-800 text-right">{selectedStudent.name}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.studentId}</span>
                            <span className="font-mono font-bold text-slate-700 text-right">{selectedStudent.registerNo}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">Father\'s Name</span>
                            <span className="font-bold text-slate-700 text-right">Mizanur Rahman</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.rollNo}</span>
                            <span className="font-mono font-bold text-slate-700 text-right">{selectedStudent.roll}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">Mother\'s Name</span>
                            <span className="font-bold text-slate-700 text-right">Shahnaz Begum</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.className}</span>
                            <span className="font-extrabold text-[#005c53] text-right">{highClass}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.examName}</span>
                            <span className="font-bold text-slate-700 text-right">{highExam}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.year}</span>
                            <span className="font-mono font-bold text-slate-700 text-right">{highYear}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.section}</span>
                            <span className="font-bold text-slate-700 text-right">Science / {highSection}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.shift}</span>
                            <span className="font-bold text-slate-700 text-right">Day</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.contact}</span>
                            <span className="font-mono font-bold text-slate-700 text-right">{parentPhone}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-0.5">
                            <span className="text-slate-400 font-bold uppercase">{dictionary.issueDate}</span>
                            <span className="font-mono font-bold text-slate-700 text-right">{highPrintDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* GRADE TABLE */}
                      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                        <table className="w-full text-left text-[9px] border-collapse">
                          <thead>
                            <tr className="bg-[#005c53] text-white font-extrabold uppercase text-[8.5px] border-b border-slate-200">
                              <th className="p-2 w-1/4">{dictionary.subject}</th>
                              <th className="p-2 text-center">{dictionary.fullMarks}</th>
                              <th className="p-2 text-center">{dictionary.highest}</th>
                              <th className="p-2 text-center">{dictionary.mt} (30)</th>
                              <th className="p-2 text-center">{dictionary.se} (70)</th>
                              <th className="p-2 text-center">{dictionary.grace}</th>
                              <th className="p-2 text-center bg-[#004d45]">{dictionary.total}</th>
                              <th className="p-2 text-center">{dictionary.letterGrade}</th>
                              <th className="p-2 text-center">{dictionary.gradePoint}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 font-bold text-slate-700">
                            {subjectsWithGrades.map((sub, sIdx) => {
                              return (
                                <tr key={sIdx} className="hover:bg-slate-50/60">
                                  <td className="p-2 font-black text-slate-800">{reportLang === 'BN' && sIdx === 0 ? 'বাংলা' : reportLang === 'BN' && sIdx === 1 ? 'ইংরেজি' : reportLang === 'BN' && sIdx === 2 ? 'গণিত' : reportLang === 'BN' && sIdx === 3 ? 'বিজ্ঞান' : reportLang === 'BN' && sIdx === 4 ? 'বাংলাদেশ ও বিশ্ব পরিচয়' : reportLang === 'BN' && sIdx === 5 ? 'আইসিটি' : reportLang === 'BN' && sIdx === 6 ? 'ধর্ম' : sub.subject}</td>
                                  <td className="p-2 text-center font-mono text-slate-400">{sub.fullMarks}</td>
                                  <td className="p-2 text-center font-mono text-slate-500">{sub.highest}</td>
                                  <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="number" 
                                      value={sub.mt}
                                      onChange={(e) => handleScoreChange(sIdx, 'mt', Number(e.target.value))}
                                      className="w-10 text-center border border-slate-200 bg-yellow-50 rounded p-0.5 focus:bg-white text-[9px] font-black focus:outline-none"
                                      min={0}
                                      max={30}
                                    />
                                  </td>
                                  <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="number" 
                                      value={sub.se}
                                      onChange={(e) => handleScoreChange(sIdx, 'se', Number(e.target.value))}
                                      className="w-10 text-center border border-slate-200 bg-yellow-50 rounded p-0.5 focus:bg-white text-[9px] font-black focus:outline-none"
                                      min={0}
                                      max={70}
                                    />
                                  </td>
                                  <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="number" 
                                      value={sub.grace}
                                      onChange={(e) => handleScoreChange(sIdx, 'grace', Number(e.target.value))}
                                      className="w-8 text-center border border-slate-200 bg-yellow-50 rounded p-0.5 focus:bg-white text-[9px] font-black focus:outline-none"
                                      min={0}
                                      max={10}
                                    />
                                  </td>
                                  <td className="p-2 text-center bg-slate-50 font-black text-slate-900 font-mono">{sub.total}</td>
                                  <td className="p-2 text-center">
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                                      sub.grade === 'A+' ? 'bg-emerald-50 text-emerald-700' :
                                      sub.grade === 'A' ? 'bg-emerald-50 text-emerald-600' :
                                      sub.grade === 'A-' ? 'bg-blue-50 text-blue-700' :
                                      sub.grade === 'F' ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-slate-50 text-slate-600'
                                    }`}>
                                      {sub.grade}
                                    </span>
                                  </td>
                                  <td className="p-2 text-center font-mono font-extrabold">{sub.point.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                            
                            {/* TOTALS OVERVIEW ROW */}
                            <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                              <td className="p-2 uppercase tracking-wide">{dictionary.resultSummary}</td>
                              <td className="p-2 text-center font-mono text-slate-400">{totalFullMarks}</td>
                              <td className="p-2 text-center">--</td>
                              <td className="p-2 text-center" colSpan={3}></td>
                              <td className="p-2 text-center font-mono bg-slate-200 text-[#005c53] font-black">{totalMarksEarned} / {totalFullMarks}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-0.5 text-[8.5px] rounded-full uppercase tracking-wider ${
                                  isPassed ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
                                }`}>
                                  {isPassed ? dictionary.passed : 'F'}
                                </span>
                              </td>
                              <td className="p-2 text-center font-mono text-[#005c53] font-black text-[11px]">GPA {calculatedGPA.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* SUMMARY BLOCK IN LOWER REGION */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-4">
                        
                        {/* COLUMN 1: RESULT ANALYTICS & ATTENDANCE */}
                        <div className="space-y-3">
                          {/* RESULT BOX */}
                          <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                            <p className="font-extrabold text-[#005c53] border-b border-slate-200 pb-1.5 text-[10px] uppercase tracking-wider">Result Summary</p>
                            <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-bold">
                              <span className="text-slate-400">Result Status:</span>
                              <span className={`text-right font-black ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                                {isPassed ? 'Passed' : 'Failed'}
                              </span>
                              <span className="text-slate-400">Position in Section:</span>
                              <span className="text-right text-slate-700">1st</span>
                              <span className="text-slate-400">GPA:</span>
                              <span className="text-right text-[#005c53] font-black">{calculatedGPA.toFixed(2)}</span>
                              <span className="text-slate-400">Failed Subjects:</span>
                              <span className={`text-right ${hasFailedSubject ? 'text-red-500 font-black' : 'text-slate-400'}`}>
                                {hasFailedSubject ? '1 Subject' : '--'}
                              </span>
                            </div>
                          </div>

                          {/* ATTENDANCE SUMMARY BOX */}
                          {highPrintAttendance && (
                            <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                              <p className="font-extrabold text-[#005c53] border-b border-slate-200 pb-1.5 text-[10px] uppercase tracking-wider">Attendance Summary</p>
                              <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-bold items-center">
                                <span className="text-slate-400">Working Days:</span>
                                <div className="text-right">
                                  <input 
                                    type="number" 
                                    value={currentData.attendanceDays}
                                    onChange={(e) => handleAttendanceChange('attendanceDays', Number(e.target.value))}
                                    className="w-12 text-center border border-slate-250 bg-yellow-50 rounded p-0.5 focus:bg-white text-[9px] font-bold focus:outline-none"
                                    min={1}
                                  />
                                </div>
                                <span className="text-slate-400">Present Days:</span>
                                <div className="text-right">
                                  <input 
                                    type="number" 
                                    value={currentData.attendancePresent}
                                    onChange={(e) => handleAttendanceChange('attendancePresent', Number(e.target.value))}
                                    className="w-12 text-center border border-slate-250 bg-yellow-50 rounded p-0.5 focus:bg-white text-[9px] font-bold focus:outline-none"
                                    min={0}
                                  />
                                </div>
                                <span className="text-slate-400">Absent Days:</span>
                                <span className="text-right text-slate-700 font-mono font-bold">
                                  {Math.max(0, currentData.attendanceDays - currentData.attendancePresent)}
                                </span>
                                <span className="text-slate-400">Percentage:</span>
                                <span className="text-right text-emerald-700 font-black">
                                  {Math.round((currentData.attendancePresent / (currentData.attendanceDays || 1)) * 100)}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* COLUMN 2: MORAL, CO-CURRICULAR & COMMENTS */}
                        <div className="space-y-3">
                          {/* MORAL & BEHAVIOR */}
                          <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                            <p className="font-extrabold text-[#005c53] border-b border-slate-200 pb-1.5 text-[10px] uppercase tracking-wider">Moral & Behavior</p>
                            <div className="flex justify-between gap-1 text-[9px] font-bold">
                              {['Excellent', 'Good', 'Average', 'Poor'].map((level) => {
                                const isChecked = currentData.moral === level;
                                return (
                                  <label key={level} className="flex flex-col items-center gap-1 cursor-pointer">
                                    <input 
                                      type="radio" 
                                      name={`high-moral-${selectedStudent.id}`}
                                      checked={isChecked}
                                      onChange={() => handleTextChange('moral', level)}
                                      className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className={isChecked ? 'text-emerald-600' : 'text-slate-400'}>{level}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* CO-CURRICULAR */}
                          <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                            <p className="font-extrabold text-[#005c53] border-b border-slate-200 pb-1.5 text-[10px] uppercase tracking-wider">Co-Curricular Activities</p>
                            <div className="space-y-1.5 text-[9px] font-bold text-slate-600">
                              {Object.entries(currentData.coCurricular).map(([key, val]) => {
                                return (
                                  <div key={key} className="flex justify-between items-center">
                                    <span className="capitalize">{key}</span>
                                    <select 
                                      value={val}
                                      onChange={(e) => handleCoCurricularChange(key, e.target.value)}
                                      className="bg-white border border-slate-250 text-[9px] p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-extrabold text-slate-800"
                                    >
                                      <option value="Excellent">Excellent</option>
                                      <option value="Good">Good</option>
                                      <option value="Average">Average</option>
                                      <option value="Poor">Poor</option>
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* TEACHER'S REMARKS */}
                          <div className="p-3 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/40">
                            <p className="font-extrabold text-[#005c53] text-[10px] uppercase tracking-wider">Teacher\'s Remarks</p>
                            <textarea 
                              value={currentData.remarks}
                              onChange={(e) => handleTextChange('remarks', e.target.value)}
                              placeholder="Add your remarks here..."
                              rows={2}
                              className="w-full text-[9px] font-semibold border border-slate-250 rounded-xl p-2 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                            />
                          </div>
                        </div>

                        {/* COLUMN 3: DIGITAL VERIFICATION & PHYSICAL STAMP */}
                        <div className="space-y-3">
                          <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50/40 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center space-y-3">
                            <p className="font-extrabold text-[#005c53] text-[9px] uppercase tracking-wider">Digital Verification</p>
                            
                            {/* SVG QR CODE */}
                            <div className="w-16 h-16 bg-white border border-slate-200 p-1.5 rounded-xl flex items-center justify-center shadow-sm">
                              <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="6" height="6" />
                                <rect x="16" y="2" width="6" height="6" />
                                <rect x="2" y="16" width="6" height="6" />
                                <path d="M16 16h2v2h-2zm2 2h4v4h-4zm-4 2h2v2h-2zm6-4h2v2h-2zm-2-2h2v2h-2zm6 6v-2h-2v2z" />
                                <rect x="4" y="4" width="2" height="2" fill="currentColor" />
                                <rect x="18" y="4" width="2" height="2" fill="currentColor" />
                                <rect x="4" y="18" width="2" height="2" fill="currentColor" />
                              </svg>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-[8px] text-slate-500 font-bold leading-tight">Scan to verify authentic result ledger</p>
                              <p className="text-[7.5px] text-slate-400 font-mono mt-0.5">Ref: STD-{selectedStudent.id}-{highYear}</p>
                            </div>

                            {/* PHYSICAL INK BADGE/STAMP */}
                            <div className="pt-2">
                              <span className={`inline-block text-[11px] tracking-widest font-black border-3 px-4 py-1.5 rounded-xl uppercase rotate-[-8deg] shadow-sm transform transition duration-300 ${
                                isPassed 
                                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50/75' 
                                  : 'border-red-500 text-red-600 bg-red-50/75'
                              }`}>
                                {isPassed ? 'PROMOTED' : 'RETAINED'}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* BOTTOM DECORATIVE FOOTER */}
                      <div className="flex justify-between items-center text-[8px] font-black text-slate-400 pt-2 border-t border-slate-150">
                        <span>STUDENTS CARE MODEL SCHOOL • BANGLADESH</span>
                        <span>OFFICIAL ACADEMIC TRANSCRIPT • CONFIDENTIAL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM REPORT CARD ACTION BAR */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* LEFT CONTROLS */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#005c53] hover:bg-[#004d45] rounded-xl flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Save className="w-4 h-4" />
                      {dictionary.saveChanges}
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Printer className="w-4 h-4" />
                      {dictionary.printReport}
                    </button>
                    <button 
                      onClick={handlePdfDownload}
                      className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Download className="w-4 h-4" />
                      {dictionary.downloadPdf}
                    </button>

                    {/* PAPER DROPDOWN */}
                    <select className="bg-white border border-slate-250 p-1.5 rounded-lg text-xs font-bold text-slate-600 focus:outline-none">
                      <option>A4 (210×297)</option>
                      <option>Letter (216×279)</option>
                    </select>

                    <label className="flex items-center gap-1.5 text-xs text-slate-600 font-bold ml-1 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600" />
                      Scale to Fit
                    </label>

                    {/* LANGUAGE TOGGLE BUTTONS */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden ml-2 shadow-sm">
                      <button 
                        onClick={() => setReportLang('EN')}
                        className={`px-3 py-1.5 text-xs font-black transition ${reportLang === 'EN' ? 'bg-[#005c53] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        EN
                      </button>
                      <button 
                        onClick={() => setReportLang('BN')}
                        className={`px-3 py-1.5 text-xs font-black transition ${reportLang === 'BN' ? 'bg-[#005c53] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        বাং
                      </button>
                    </div>
                  </div>

                  {/* RIGHT CONTACT SEND CONTROLS */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder={dictionary.parentPhonePlaceholder}
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2 max-w-[160px] focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                    />
                    <button 
                      onClick={handleWhatsAppSend}
                      className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1 shadow-sm transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                      Send via WhatsApp
                    </button>
                    <button 
                      onClick={handleSMSSend}
                      className="px-3 py-2 text-xs font-bold text-[#3b82f6] bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1 shadow-sm transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send via SMS
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'merit_list' && (() => {
            return (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3 text-center">Overall Merit Rank</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3 text-center">Class Level</th>
                        <th className="p-3 text-center">Roll No</th>
                        <th className="p-3 text-right">Grand Total Marks</th>
                        <th className="p-3 text-center">Resulting GPA</th>
                        <th className="p-3 text-center">Honor Medal Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {meritListData.map(merit => (
                        <tr key={merit.rank} className="hover:bg-slate-50/50">
                          <td className="p-3 text-center">
                            <span className={`h-6 w-6 inline-flex items-center justify-center rounded-full font-black text-[10px] ${
                              merit.rank === 1 ? 'bg-amber-100 text-amber-800' :
                              merit.rank === 2 ? 'bg-slate-100 text-slate-800' :
                              merit.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-slate-50 text-slate-500'
                            }`}>
                              #{merit.rank}
                            </span>
                          </td>
                          <td className="p-3 text-[#025644] font-black">{merit.name}</td>
                          <td className="p-3 text-center">Class {merit.class}</td>
                          <td className="p-3 text-center">Roll {merit.roll}</td>
                          <td className="p-3 text-right font-black">{merit.marks} / 500</td>
                          <td className="p-3 text-center text-emerald-700 font-black">GPA {merit.gpa.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 bg-yellow-50 text-yellow-800 border border-yellow-100 rounded text-[9px] font-black">
                              {merit.medal}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeReportOption === 'tabulation_sheet' && (() => {
            return (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center justify-between text-xs">
                  <div className="text-left font-bold space-y-0.5">
                    <p className="text-[#025644] font-black">Selected Academic Cycle: 2026 First Terminal Examination</p>
                    <p className="text-slate-500">Currently showing tabulated subject-wise detailed scores ledger.</p>
                  </div>
                  <span className="bg-white border border-emerald-150 px-2.5 py-1 text-slate-600 font-extrabold rounded">
                    Class 8 - Section A
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 font-black text-slate-600">
                        <th className="p-3 text-center">Roll</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3 text-center">Bangla</th>
                        <th className="p-3 text-center">English</th>
                        <th className="p-3 text-center">Mathematics</th>
                        <th className="p-3 text-center">Science</th>
                        <th className="p-3 text-center">Social Studies</th>
                        <th className="p-3 text-right">Aggregate</th>
                        <th className="p-3 text-center">Earned GPA</th>
                        <th className="p-3 text-center">Exam Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {tabulationData.map(tab => (
                        <tr key={tab.roll} className="hover:bg-slate-50/50">
                          <td className="p-3 text-center font-mono text-slate-500">{tab.roll}</td>
                          <td className="p-3 text-slate-800 font-black">{tab.name}</td>
                          <td className="p-3 text-center">{tab.bangla}</td>
                          <td className="p-3 text-center">{tab.english}</td>
                          <td className="p-3 text-center text-[#025644] font-extrabold">{tab.math}</td>
                          <td className="p-3 text-center">{tab.science}</td>
                          <td className="p-3 text-center">{tab.social}</td>
                          <td className="p-3 text-right font-black text-slate-900">{tab.total} / 500</td>
                          <td className="p-3 text-center font-black text-emerald-700">GPA {tab.gpa.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-black">
                              {tab.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

        </div>

      </div>

    </div>
  );
};
