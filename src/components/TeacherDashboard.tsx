import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Calendar,
  Award,
  Users,
  BookOpen,
  Clock,
  LayoutDashboard,
  CheckSquare,
  FileText,
  ClipboardList,
  UserCheck,
  PlusCircle,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  FileSpreadsheet,
  Send,
  Sparkles,
  Search,
  Mic,
  MessageSquare,
  Zap,
  BookOpenCheck,
  UserMinus,
  Edit,
  Trash2,
  Plus,
  Share2,
  DollarSign,
  MessageCircle,
  Download,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TeacherDashboardProps {
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  onLogout: () => void;
}

export default function TeacherDashboard({ lang, setLang, onLogout }: TeacherDashboardProps) {
  const [activeMenu, setActiveMenu] = useState<string>('overview');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('scms-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('scms-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const [showNotification, setShowNotification] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Countdown Timer State (e.g. starts in 12 mins)
  const [timeLeft, setTimeLeft] = useState(720); // 12 minutes in seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 720));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Interactivity States
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Custom states for interactive widgets
  const [attendanceRegistry, setAttendanceRegistry] = useState([
    { roll: 1, name: 'Sumaiya Aktar', present: true, status: 'present', class: 'Class 8A' },
    { roll: 2, name: 'Tanvir Rahman', present: true, status: 'present', class: 'Class 8A' },
    { roll: 3, name: 'Mitu Khatun', present: false, status: 'absent', class: 'Class 8A' },
    { roll: 4, name: 'Rashed Hossain', present: true, status: 'present', class: 'Class 8A' },
    { roll: 5, name: 'Nayeem Islam', present: true, status: 'late', class: 'Class 8A' },
    { roll: 6, name: 'Fariha Jahan', present: true, status: 'present', class: 'Class 8A' },
    { roll: 7, name: 'Sajidul Islam', present: false, status: 'absent', class: 'Class 8A' }
  ]);

  // Master Student List State (Student Registry & Dues Management)
  const [studentsList, setStudentsList] = useState([
    { id: 'st-1', name: 'Sumaiya Aktar', roll: 1, class: 'Class 8A', section: 'A', guardianContact: '01712345678', feesPaid: true, feesDue: 0 },
    { id: 'st-2', name: 'Tanvir Rahman', roll: 2, class: 'Class 8A', section: 'A', guardianContact: '01812345679', feesPaid: true, feesDue: 0 },
    { id: 'st-3', name: 'Mitu Khatun', roll: 3, class: 'Class 8A', section: 'A', guardianContact: '01912345680', feesPaid: false, feesDue: 2000 },
    { id: 'st-4', name: 'Rashed Hossain', roll: 4, class: 'Class 8A', section: 'A', guardianContact: '01612345681', feesPaid: true, feesDue: 0 },
    { id: 'st-5', name: 'Nayeem Islam', roll: 5, class: 'Class 8A', section: 'A', guardianContact: '01512345682', feesPaid: false, feesDue: 1500 },
    { id: 'st-6', name: 'Fariha Jahan', roll: 6, class: 'Class 8A', section: 'A', guardianContact: '01798765432', feesPaid: true, feesDue: 0 },
    { id: 'st-7', name: 'Sajidul Islam', roll: 7, class: 'Class 8A', section: 'A', guardianContact: '01312345683', feesPaid: false, feesDue: 3500 },
    { id: 'st-8', name: 'Taskin Ahmed', roll: 8, class: 'Class 9A', section: 'B', guardianContact: '01412345684', feesPaid: true, feesDue: 0 },
    { id: 'st-9', name: 'Nusrat Jahan', roll: 9, class: 'Class 9A', section: 'B', guardianContact: '01698765431', feesPaid: false, feesDue: 2500 }
  ]);

  // Master Exam Grading Sheet Database State
  const [examGrades, setExamGrades] = useState<Array<{ studentId: string; studentName: string; class: string; section: string; examType: string; physics: number; chemistry: number; math: number; science: number }>>([
    { studentId: 'st-1', studentName: 'Sumaiya Aktar', class: 'Class 8A', section: 'A', examType: 'Midterm', physics: 88, chemistry: 92, math: 95, science: 89 },
    { studentId: 'st-2', studentName: 'Tanvir Rahman', class: 'Class 8A', section: 'A', examType: 'Midterm', physics: 76, chemistry: 80, math: 85, science: 78 },
    { studentId: 'st-3', studentName: 'Mitu Khatun', class: 'Class 8A', section: 'A', examType: 'Midterm', physics: 45, chemistry: 50, math: 55, science: 42 },
    { studentId: 'st-4', studentName: 'Rashed Hossain', class: 'Class 8A', section: 'A', examType: 'Midterm', physics: 90, chemistry: 95, math: 92, science: 94 },
    { studentId: 'st-5', studentName: 'Nayeem Islam', class: 'Class 8A', section: 'A', examType: 'Midterm', physics: 62, chemistry: 68, math: 70, science: 65 },
    { studentId: 'st-6', studentName: 'Fariha Jahan', class: 'Class 8A', section: 'A', examType: 'Midterm', physics: 85, chemistry: 88, math: 89, science: 87 },
    { studentId: 'st-7', studentName: 'Sajidul Islam', class: 'Class 8A', section: 'A', examType: 'Midterm', physics: 55, chemistry: 58, math: 60, science: 52 }
  ]);

  // Exam Selection states for input sheet
  const [examInputClass, setExamInputClass] = useState('Class 8A');
  const [examInputSection, setExamInputSection] = useState('A');
  const [examInputType, setExamInputType] = useState('Midterm');

  // Diary Logs State (Homework / Lesson diary updates)
  const [diaryLogsList, setDiaryLogsList] = useState([
    { id: 'dl-1', class: 'Class 8A', date: '2026-07-10', topic: 'Thermodynamics', homework: 'Complete Exercise 4.2 questions 1-5. Draw heat flow diagram in notebook.', synced: true },
    { id: 'dl-2', class: 'Class 9A', date: '2026-07-09', topic: 'Kinematics', homework: 'Solve Newton\'s Equations word problems on page 55.', synced: true }
  ]);

  // Modal Toggles & Editing States
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [studentForm, setStudentForm] = useState({ name: '', roll: '', class: 'Class 8A', section: 'A', guardianContact: '' });

  // Report Card Generation States
  const [showReportCard, setShowReportCard] = useState(false);
  const [selectedReportCardStudent, setSelectedReportCardStudent] = useState<any | null>(null);

  // WhatsApp Sync Group creation States
  const [showWhatsAppGroupModal, setShowWhatsAppGroupModal] = useState(false);
  const [whatsappClass, setWhatsappClass] = useState('Class 8A');
  const [whatsappSection, setWhatsappSection] = useState('A');
  const [whatsappCustomLink, setWhatsappCustomLink] = useState('https://chat.whatsapp.com/invite/SCMS_Class8A');

  const [leaveRequests, setLeaveRequests] = useState([
    { id: '1', student: 'Mitu Khatun', class: 'Class 8A', roll: 3, reason: lang === 'bn' ? 'শারীরিক অসুস্থতা (জ্বর)' : 'Fever & illness', duration: '2 days', date: 'July 10, 2026', status: 'pending', templateReply: '' },
    { id: '2', student: 'Sajidul Islam', class: 'Class 8A', roll: 7, reason: lang === 'bn' ? 'পারিবারিক অনুষ্ঠান' : 'Family ceremony', duration: '1 day', date: 'July 11, 2026', status: 'pending', templateReply: '' },
    { id: '3', student: 'Rashed Hossain', class: 'Class 8A', roll: 4, reason: lang === 'bn' ? 'ভাইয়ের বিয়ে' : 'Brother\'s wedding', duration: '3 days', date: 'July 15, 2026', status: 'approved', templateReply: 'Approved: Family comes first. 🏡' }
  ]);

  const [exams, setExams] = useState([
    { id: 'ex-101', title: lang === 'bn' ? 'পদার্থবিজ্ঞান সাপ্তাহিক এমসিকিউ' : 'Physics Weekly MCQ', class: 'Class 9A', subject: 'Physics', submissions: '38/40', status: 'pending', date: 'July 08, 2026' },
    { id: 'ex-102', title: lang === 'bn' ? 'উচ্চতর গণিত ৩য় অধ্যায়' : 'Higher Math Chapter 3', class: 'Class 10B', subject: 'Higher Math', submissions: '35/35', status: 'completed', date: 'July 05, 2026' },
    { id: 'ex-103', title: lang === 'bn' ? 'রসায়ন ল্যাব প্রাকটিক্যাল রিপোর্ট' : 'Chemistry Lab Practical Report', class: 'Class 9A', subject: 'Chemistry', submissions: '12/40', status: 'pending', date: 'July 09, 2026' },
    { id: 'ex-104', title: lang === 'bn' ? 'বিজ্ঞান মডেল টেস্ট ১' : 'Science Model Test 1', class: 'Class 8A', subject: 'General Science', submissions: '40/40', status: 'completed', date: 'July 01, 2026' }
  ]);

  const [assignments, setAssignments] = useState([
    { id: 'as-1', title: lang === 'bn' ? 'গতি ও বলের গাণিতিক সমস্যা' : 'Kinematics Problems Solving', class: 'Class 9A', subject: 'Physics', dueDate: '2026-07-15' },
    { id: 'as-2', title: lang === 'bn' ? 'পর্যায় সারণি চার্ট তৈরি' : 'Periodic Table Chart Creation', class: 'Class 9A', subject: 'Chemistry', dueDate: '2026-07-18' }
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 'an-1', content: lang === 'bn' ? 'আগামী সোমবার পদার্থবিজ্ঞান খাতা মূল্যায়ন শেষ করা হবে।' : 'Physics exam scripts valuation will be completed by next Monday.', date: 'July 10, 2026' },
    { id: 'an-2', content: lang === 'bn' ? 'আগামী ১৫ জুলাই অভিভাবক সভায় সকল শিক্ষককে উপস্থিত থাকার নির্দেশ দেওয়া হলো।' : 'All faculty members are requested to attend the parent meeting on July 15th.', date: 'July 09, 2026' }
  ]);

  // Modals Toggle
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showLeaveApplyModal, setShowLeaveApplyModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // New AI & Interactive UI Modal States
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<{ id: string; student: string; class: string; roll: number; alertType: string; suggestedMsg: string; suggestedMsgBn: string } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);

  // Voice recording simulation timer
  useEffect(() => {
    let interval: any;
    if (voiceRecording) {
      interval = setInterval(() => {
        setVoiceTimer(prev => prev + 1);
      }, 1000);
    } else {
      setVoiceTimer(0);
    }
    return () => clearInterval(interval);
  }, [voiceRecording]);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', questions: '10', class: 'Class 8A', duration: '15' });
  const [showSubModal, setShowSubModal] = useState(false);
  const [subForm, setSubForm] = useState({ period: 'Period 3 (11:00 AM)', reason: 'Attending district education board workshop', suggestedTeacher: 'Sajib Ahmed (Mathematics)' });

  // Co-Pilot Chat simulation State
  const [coPilotQuery, setCoPilotQuery] = useState('');
  const [coPilotHistory, setCoPilotHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; textBn: string }>>([
    {
      sender: 'ai',
      text: "Hello Imran! I am your SCMS AI Assistant. I have analyzed your classes today. Ask me to draft exam reminders, check student risk indicators, or plan today's science diary objectives!",
      textBn: "হ্যালো ইমরান ভাই! আমি আপনার SCMS এআই সহকারী। আমি আজ আপনার ক্লাস রুটিন বিশ্লেষণ করেছি। পরীক্ষা সম্পর্কে নোটিশ ড্রাফট করতে, শিক্ষার্থীদের ঝুঁকি বিশ্লেষণ করতে বা আজকের বিজ্ঞান ক্লাসের ডায়েরি অবজেক্টিভ লিখতে আমাকে বলুন!"
    }
  ]);
  const [coPilotLoading, setCoPilotLoading] = useState(false);

  // Diary logs state
  const [diaryLogs, setDiaryLogs] = useState([
    { id: 'd-1', class: 'Class 8A', topic: 'General Science', objectives: 'Understand Newton\'s Second Law, demonstrate with friction carts', teacherNotes: 'Class was very engaged. roll 3 & 7 were absent.', date: 'July 10, 2026' }
  ]);
  const [diaryForm, setDiaryForm] = useState({ class: 'Class 8A', topic: 'General Science', objectives: 'Understand Newton\'s laws of motion & gravity practicals', teacherNotes: 'Highlight practical experiment observations.' });

  // Form Inputs
  const [assignmentForm, setAssignmentForm] = useState({ title: '', class: 'Class 9A', subject: 'Physics', dueDate: '' });
  const [announcementForm, setAnnouncementForm] = useState({ content: '' });
  const [leaveApplyForm, setLeaveApplyForm] = useState({ reason: '', startDate: '', endDate: '', type: 'Casual' });
  const [gradeForm, setGradeForm] = useState({ studentId: '', class: 'Class 8A', subject: 'General Science', marks: '' });

  // Notifications List
  const notifications = [
    { id: 1, text: lang === 'bn' ? 'মুনতাহা রহমান তার ছুটির আবেদন জমা দিয়েছে।' : 'Muntaha Rahman submitted a leave application.', time: '5m ago' },
    { id: 2, text: lang === 'bn' ? 'প্রধান শিক্ষক নোটিশ বোর্ডে একটি নোটিশ প্রকাশ করেছেন।' : 'Principal published a notice on the Notice Board.', time: '1h ago' },
    { id: 3, text: lang === 'bn' ? '৮ম শ্রেণীর গণিত পরীক্ষার উত্তরপত্র আপলোড সম্পন্ন হয়েছে।' : 'Class 8 Math exam scripts upload finished.', time: '3h ago' }
  ];

  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Handlers
  const handleToggleAttendance = (roll: number) => {
    setAttendanceRegistry(prev =>
      prev.map(st => st.roll === roll ? { ...st, present: !st.present } : st)
    );
  };

  const handleApproveLeave = (id: string, name: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    triggerToast(
      lang === 'bn' 
        ? `${name}-এর ছুটির আবেদন মঞ্জুর করা হয়েছে!` 
        : `Leave application for ${name} approved successfully!`,
      'success'
    );
  };

  const handleRejectLeave = (id: string, name: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
    triggerToast(
      lang === 'bn' 
        ? `${name}-এর ছুটির আবেদন নামঞ্জুর করা হয়েছে!` 
        : `Leave application for ${name} rejected!`,
      'error'
    );
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentForm.title.trim() || !assignmentForm.dueDate) {
      triggerToast(lang === 'bn' ? 'দয়া করে সবগুলো ক্ষেত্র পূরণ করুন।' : 'Please fill all required fields.', 'error');
      return;
    }
    const newAs = {
      id: `as-${Date.now()}`,
      title: assignmentForm.title,
      class: assignmentForm.class,
      subject: assignmentForm.subject,
      dueDate: assignmentForm.dueDate
    };
    setAssignments([newAs, ...assignments]);
    setShowAssignmentModal(false);
    setAssignmentForm({ title: '', class: 'Class 9A', subject: 'Physics', dueDate: '' });
    triggerToast(
      lang === 'bn' 
        ? 'নতুন এসাইনমেন্ট সফলভাবে তৈরি হয়েছে!' 
        : 'New assignment created successfully!',
      'success'
    );
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.content.trim()) {
      triggerToast(lang === 'bn' ? 'ঘোষণা খালি হতে পারে না!' : 'Announcement cannot be empty!', 'error');
      return;
    }
    const newAn = {
      id: `an-${Date.now()}`,
      content: announcementForm.content,
      date: 'Today'
    };
    setAnnouncements([newAn, ...announcements]);
    setShowAnnouncementModal(false);
    setAnnouncementForm({ content: '' });
    triggerToast(
      lang === 'bn' 
        ? 'ঘোষণা সফলভাবে পোস্ট করা হয়েছে!' 
        : 'Announcement posted successfully!',
      'success'
    );
  };

  const handleApplyTeacherLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveApplyForm.reason.trim() || !leaveApplyForm.startDate) {
      triggerToast(lang === 'bn' ? 'সবগুলো ক্ষেত্র পূরণ করুন।' : 'Please fill in all fields.', 'error');
      return;
    }
    setShowLeaveApplyModal(false);
    setLeaveApplyForm({ reason: '', startDate: '', endDate: '', type: 'Casual' });
    triggerToast(
      lang === 'bn' 
        ? 'ছুটির আবেদন প্রধান শিক্ষকের নিকট পাঠানো হয়েছে!' 
        : 'Leave application submitted to Principal!',
      'success'
    );
  };

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeForm.studentId.trim() || !gradeForm.marks) {
      triggerToast(lang === 'bn' ? 'সব তথ্য প্রদান করুন।' : 'Please fill all inputs.', 'error');
      return;
    }
    setShowGradeModal(false);
    setGradeForm({ studentId: '', class: 'Class 8A', subject: 'General Science', marks: '' });
    triggerToast(
      lang === 'bn' 
        ? 'গ্রেড শীট সফলভাবে জমা নেওয়া হয়েছে!' 
        : 'Grades recorded and locked in portal successfully!',
      'success'
    );
  };

  const handleCoPilotMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coPilotQuery.trim()) return;
    const userMsg = coPilotQuery;
    setCoPilotHistory(prev => [...prev, { sender: 'user', text: userMsg, textBn: userMsg }]);
    setCoPilotQuery('');
    setCoPilotLoading(true);

    setTimeout(() => {
      let responseText = "Understood! I'm on it. Let me check the database records for Students Care Model School.";
      let responseTextBn = "বুঝতে পেরেছি! আমি কাজ করছি। আমি স্টুডেন্টস কেয়ার মডেল স্কুলের ডেটাবেজ রেকর্ডগুলো চেক করছি।";
      
      const queryLower = userMsg.toLowerCase();
      if (queryLower.includes('absent') || queryLower.includes('attendance') || queryLower.includes('হাজিরা') || queryLower.includes('অনুপস্থিত')) {
        responseText = "Class 8A currently has 3 absentees (Mitu Khatun, Sajidul Islam, Tanvir Rahman). I recommend broadcasting an SMS alert to parents immediately.";
        responseTextBn = "৮ম শ্রেণীর বর্তমানে ৩ জন অনুপস্থিত আছে (মিতু খাতুন, সাজিদুল ইসলাম, তানভীর রহমান)। আমি অভিভাবকদের অবিলম্বে এসএমএস সতর্কতা পাঠানোর পরামর্শ দিচ্ছি।";
      } else if (queryLower.includes('grade') || queryLower.includes('exam') || queryLower.includes('পরীক্ষা') || queryLower.includes('মার্কস')) {
        responseText = "The average grade for Class 8A in General Science has improved by 8% after implementing daily quizzes.";
        responseTextBn = "দৈনিক কুইজ চালুর পর ৮ম শ্রেণীর সাধারণ বিজ্ঞানের গড় গ্রেড ৮% বৃদ্ধি পেয়েছে।";
      }

      setCoPilotHistory(prev => [...prev, { sender: 'ai', text: responseText, textBn: responseTextBn }]);
      setCoPilotLoading(false);
      triggerToast(lang === 'bn' ? 'কো-পাইলট নতুন ইনসাইট তৈরি করেছে ✨' : 'Co-Pilot generated new insights ✨', 'success');
    }, 1500);
  };

  const handleVoiceTrigger = () => {
    setVoiceRecording(true);
    triggerToast(lang === 'bn' ? 'মাইক্রোফোন সক্রিয় হয়েছে... কথা বলুন' : 'Microphone active... speak now', 'info');
    
    setTimeout(() => {
      setVoiceRecording(false);
      setAssignmentForm({
        title: lang === 'bn' ? 'প্রথম ২০টি উপাদানের পর্যায় সারণী চার্ট তৈরি' : 'Periodic Table Chart of first 20 elements',
        class: 'Class 9A',
        subject: 'Physics',
        dueDate: '2026-07-15'
      });
      triggerToast(lang === 'bn' ? 'ভয়েস সফলভাবে ট্রান্সক্রাইব হয়েছে!' : 'Voice transcribed successfully!', 'success');
      setShowVoiceModal(false);
      setShowAssignmentModal(true); // Open the assignment modal with populated inputs!
    }, 3000);
  };

  const handleNotifyParentsSms = () => {
    setShowSmsModal(false);
    triggerToast(
      lang === 'bn'
        ? 'অনুপস্থিত শিক্ষার্থীদের অভিভাবকদের নিকট ৩টি অনুপস্থিতি সতর্কতা এসএমএস পাঠানো হয়েছে!'
        : 'Absence warning SMS alerts successfully broadcasted to parents of 3 students!',
      'success'
    );
  };

  const handleUpdateDiary = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      id: `d-${Date.now()}`,
      class: diaryForm.class,
      topic: diaryForm.topic,
      objectives: diaryForm.objectives,
      teacherNotes: diaryForm.teacherNotes,
      date: 'July 10, 2026'
    };
    setDiaryLogs([newLog, ...diaryLogs]);
    setShowDiaryModal(false);
    triggerToast(
      lang === 'bn'
        ? 'ডিজিটাল ক্লাস ডায়েরি এন্ট্রি সফলভাবে সম্পন্ন হয়েছে!'
        : 'Digital class diary entry logged and synced successfully!',
      'success'
    );
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFeedbackModal(false);
    triggerToast(
      lang === 'bn'
        ? `${feedbackTarget?.student}-এর অভিভাবকের নিকট সরাসরি এআই বার্তা পাঠানো হয়েছে!`
        : `AI-augmented direct message sent to parent of ${feedbackTarget?.student}!`,
      'success'
    );
  };

  const handleScheduleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowQuizModal(false);
    triggerToast(
      lang === 'bn'
        ? `কুইজ "${quizForm.title}" সফলভাবে শিডিউল ও প্রকাশ করা হয়েছে!`
        : `Quiz "${quizForm.title}" scheduled & live notification sent to students!`,
      'success'
    );
  };

  const handleRequestSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSubModal(false);
    triggerToast(
      lang === 'bn'
        ? `বদলি শিক্ষকের অনুরোধ পাঠানো হয়েছে। সাজিব আহমেদ এর নিকট নোটিফিকেশন পাঠানো হয়েছে!`
        : `Substitute request submitted. Sajib Ahmed has accepted and assigned!`,
      'success'
    );
  };

  const handleAttendanceSubmit = () => {
    setShowAttendanceModal(false);
    triggerToast(
      lang === 'bn' 
        ? 'আজকের উপস্থিতি খাতা ক্লাউড ডেটাবেজে সাবমিট করা হয়েছে!' 
        : 'Attendance registry uploaded and synced online!',
      'success'
    );
  };

  // Sidebar Menu Items
  const sidebarItems = [
    { id: 'overview', label: lang === 'bn' ? 'ওভারভিউ ড্যাশবোর্ড' : 'Overview Panel', icon: LayoutDashboard },
    { id: 'students', label: lang === 'bn' ? 'শিক্ষার্থী ডাটা এন্ট্রি' : 'Student Registry', icon: Users },
    { id: 'schedule', label: lang === 'bn' ? 'আমার ক্লাস রুটিন' : 'Class Schedule', icon: Calendar },
    { id: 'attendance', label: lang === 'bn' ? 'ডিজিটাল হাজিরা খাতা' : 'Attendance Registry', icon: CheckSquare },
    { id: 'exams', label: lang === 'bn' ? 'পরীক্ষা ও মূল্যায়ন' : 'Exams & Grading', icon: Award },
    { id: 'assignments', label: lang === 'bn' ? 'এসাইনমেন্ট ট্র্যাকার' : 'Assignments List', icon: ClipboardList },
    { id: 'leave', label: lang === 'bn' ? 'ছুটি ও আবেদন' : 'Student Leaves', icon: UserCheck }
  ];

  return (
    <div className={`min-h-screen bg-theme-primary text-theme-primary flex font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      
      {/* 1. LEFT SIDEBAR (Existing Portal Shell Design) */}
      <aside className="w-64 bg-[#004D40] text-teal-50 shrink-0 flex flex-col justify-between hidden md:flex border-r border-teal-850 shadow-lg">
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-teal-900/60 flex items-center gap-3">
            <div className="h-9 w-9 bg-teal-800 text-teal-300 rounded-xl flex items-center justify-center border border-teal-700/50 shadow-inner">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <div className="text-left min-w-0">
              <h4 className="font-extrabold text-white text-xs tracking-tight leading-snug uppercase">
                {lang === 'bn' ? 'স্টুডেন্টস কেয়ার মডেল স্কুল' : 'Students Care Model School'}
              </h4>
              <p className="text-[10px] text-teal-300 font-bold tracking-wider uppercase mt-0.5">
                {lang === 'bn' ? 'শিক্ষক পোর্টাল' : 'Teacher Portal'}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-250 ease-out cursor-pointer ${
                    isActive
                      ? 'bg-teal-900 text-white shadow-md border-l-4 border-emerald-400 font-black scale-[1.02]'
                      : 'text-teal-100 hover:bg-teal-900/30 hover:text-white hover:translate-x-1 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-transform duration-200 ${isActive ? 'text-emerald-400 scale-110' : 'text-teal-300 group-hover:scale-110'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-teal-900">
          <div className="bg-teal-950/40 p-3.5 rounded-xl border border-teal-900 mb-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 bg-teal-800 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase border border-teal-700">
                IH
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-extrabold truncate">
                  {lang === 'bn' ? 'ইমরান হোসেন' : 'Imran Hosen'}
                </p>
                <p className="text-[9px] text-teal-300 font-bold truncate">
                  {lang === 'bn' ? 'সিনিয়র শিক্ষক' : 'Senior Teacher'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-teal-900 hover:bg-teal-950 text-teal-100 hover:text-rose-400 font-bold text-xs rounded-xl transition-all cursor-pointer border border-teal-950/50"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span>{lang === 'bn' ? 'লগআউট করুন' : 'Logout Portal'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* 2. TOP NAV HEADER */}
        <header className="bg-theme-card border-b border-theme h-16 px-6 flex items-center justify-between gap-4 shrink-0 transition-colors">
          
          {/* Dashboard Title & Quick Search */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Header indicator */}
            <div className="md:hidden flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-teal-800" />
              <span className="font-extrabold text-sm text-teal-900 tracking-tight">Students Care Model School</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-theme-primary border border-theme p-2 rounded-xl w-64 max-w-sm transition-colors">
              <Search className="h-4 w-4 text-theme-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'bn' ? "শিক্ষার্থী বা নোটিশ খুঁজুন..." : "Search students, exams..."}
                className="bg-transparent border-none text-xs focus:outline-none w-full text-theme-primary font-bold"
              />
            </div>
          </div>

          {/* Controls: Notification, Lang Switcher, Profile */}
          <div className="flex items-center gap-4">
            
            {/* Language Selection */}
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-xl flex items-center shadow-3xs">
              <button
                onClick={() => setLang('bn')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'bn' 
                    ? 'bg-teal-800 text-white shadow-3xs' 
                    : 'text-slate-500 hover:text-teal-800'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-teal-800 text-white shadow-3xs' 
                    : 'text-slate-500 hover:text-teal-800'
                }`}
              >
                EN
              </button>
            </div>

            {/* Premium Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
              title={lang === 'bn' ? 'থিম পরিবর্তন' : 'Toggle Theme'}
            >
              {isDarkMode ? (
                <Sun className="h-4.5 w-4.5 text-amber-500" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-600" />
              )}
            </button>

            {/* Notification Dropdown Button */}
            <div className="relative">
              <button 
                onClick={() => setShowNotification(!showNotification)}
                className="h-9 w-9 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center relative cursor-pointer"
              >
                <Bell className="h-4 w-4 text-slate-600" />
                <span className="h-2 w-2 bg-rose-500 rounded-full absolute top-2 right-2 animate-pulse" />
              </button>
              
              <AnimatePresence>
                {showNotification && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 text-left"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 mb-2.5">
                      <span className="font-extrabold text-xs text-slate-900">{lang === 'bn' ? 'সাম্প্রতিক বিজ্ঞপ্তি' : 'Live Updates'}</span>
                      <button 
                        onClick={() => setShowNotification(false)}
                        className="text-[10px] text-teal-700 hover:underline font-extrabold"
                      >
                        {lang === 'bn' ? 'সব বন্ধ করুন' : 'Clear'}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2 bg-slate-50/60 hover:bg-slate-50 border border-slate-100 rounded-xl text-[11px] leading-relaxed">
                          <p className="text-slate-800 font-bold">{n.text}</p>
                          <span className="text-[9px] text-slate-400 font-bold mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Logout Button */}
            <button
              onClick={onLogout}
              className="md:hidden p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 rounded-xl cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>

            {/* User Profile avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="h-9 w-9 bg-teal-800 text-white rounded-xl flex items-center justify-center font-bold text-xs uppercase border border-teal-700">
                IH
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-extrabold text-slate-900 leading-none">
                  {lang === 'bn' ? 'মো. ইমরান হোসেন' : 'Md. Imran Hosen'}
                </p>
                <p className="text-[9px] font-bold text-[#475569] mt-0.5">
                  {lang === 'bn' ? 'সিনিয়র শিক্ষক' : 'Senior Teacher'}
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* Real-time Dynamic Toast */}
        <AnimatePresence>
          {toastMsg && (
            <div className="fixed top-20 right-6 z-50">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white ${
                  toastMsg.type === 'success' ? 'bg-emerald-600 border border-emerald-500' :
                  toastMsg.type === 'error' ? 'bg-rose-600 border border-rose-500' : 'bg-blue-600 border border-blue-500'
                }`}
              >
                {toastMsg.type === 'success' ? <UserCheck className="h-4.5 w-4.5" /> : <AlertCircle className="h-4.5 w-4.5" />}
                <span>{toastMsg.text}</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dashboard Panels Scrollable Body */}
        <div className="p-6 space-y-6 flex-1 bg-theme-primary">
          
          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW PANEL                                    */}
          {/* ======================================================== */}
          {activeMenu === 'overview' && (
            <div className="space-y-6">
              
              {/* 1. PREDICTIVE & AI-DRIVEN HERO BANNER */}
              <div className={`rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-350 shadow-theme border border-transparent ${
                isDarkMode 
                  ? 'glass-pilot text-teal-100' 
                  : 'bg-gradient-to-r from-[#004D40] to-[#016854] text-white shadow-lg'
              }`}>
                <div className="space-y-3 text-left z-10 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-extrabold text-[9px] tracking-widest px-3 py-1 rounded-full uppercase flex items-center gap-1 border ${
                      isDarkMode 
                        ? 'bg-teal-950/60 text-emerald-300 border-teal-700/50' 
                        : 'bg-teal-950/60 text-emerald-300 border-teal-700/50'
                    }`}>
                      <Sparkles className="h-3 w-3 animate-spin" />
                      <span>{lang === 'bn' ? 'এআই চালিত ড্যাশবোর্ড' : 'AI-AUGMENTED WORKSPACE'}</span>
                    </span>
                    <span className="bg-emerald-500 text-teal-950 text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md">
                      ACTIVE CO-PILOT
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 leading-tight text-white">
                    {lang === 'bn' ? 'শুভ সকাল, মো. ইমরান হোসেন ভাই! ✨' : 'Welcome back, Imran Hosen! ✨'}
                  </h1>
                  
                  {/* Automated AI status snapshot */}
                  <div className="bg-teal-950/45 border border-teal-800/40 rounded-xl p-4 mt-2 backdrop-blur-xs space-y-2">
                    <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-semibold">
                      {lang === 'bn' 
                        ? 'আজকে আপনার ৪টি রুটিন ক্লাস রয়েছে। মিতু খাতুন ও সাজিদুল ইসলাম আজ ছুটির আবেদন করেছেন। ৮ম শ্রেণীর সাধারণ বিজ্ঞানের গড় পরীক্ষা স্কোর ৮% বৃদ্ধি পেয়েছে!' 
                        : 'You have 4 classes scheduled today. 2 students submitted late leave requests, and Class 8A\'s average quiz score went up by 8.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-teal-800/50">
                      <span className="text-[10px] text-emerald-300 font-black uppercase tracking-wider">
                        {lang === 'bn' ? 'স্মার্ট টিপস:' : 'AI Suggestion:'}
                      </span>
                      <span className="text-[10.5px] text-teal-200">
                        {lang === 'bn' 
                          ? 'অনুপস্থিত ৩ জন শিক্ষার্থীর অভিভাবকদের এসএমএস সতর্কতা পাঠিয়ে দিন।' 
                          : 'Send immediate attendance warnings to parent of Mitu Khatun (absent 3 days).'}
                      </span>
                      <button 
                        onClick={() => {
                          const target = {
                            id: 'st-3',
                            student: 'Mitu Khatun',
                            class: 'Class 8A',
                            roll: 3,
                            alertType: 'Chronic Absence Warning',
                            suggestedMsg: "Dear Guardian, Mitu has been absent for 3 consecutive days in General Science class. Please check.",
                            suggestedMsgBn: "শ্রদ্ধেয় অভিভাবক, মিতু বিগত ৩ দিন ধরে সাধারণ বিজ্ঞান ক্লাসে অনুপস্থিত রয়েছে। দয়া করে বিষয়টি নিশ্চিত করুন।"
                          };
                          setFeedbackTarget(target);
                          setFeedbackText(lang === 'bn' ? target.suggestedMsgBn : target.suggestedMsg);
                          setShowFeedbackModal(true);
                        }}
                        className="text-[10px] bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black px-2.5 py-1 rounded-md transition-colors cursor-pointer ml-auto"
                      >
                        {lang === 'bn' ? 'যোগাযোগ করুন' : 'Message Guardian'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtle school-themed vector art layout decoration */}
                <div className="absolute right-0 bottom-0 top-0 w-1/4 opacity-10 pointer-events-none flex items-center justify-end pr-6">
                  <GraduationCap className="h-44 w-44 text-teal-200 stroke-[1]" />
                </div>
              </div>

              {/* 2. ADVANCED KPI SMART CARDS (With Micro-Charts) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* KPI 1: Today's Schedule + Live Countdown */}
                <div className="bg-theme-card border border-theme/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-theme hover:scale-[1.01] transition-all relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-theme-secondary font-black uppercase tracking-wider block">
                        {lang === 'bn' ? "পরবর্তী ক্লাস কাউন্টডাউন" : "Next Class Countdown"}
                      </span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block mt-0.5 font-mono">
                        {formatCountdown(timeLeft)} mins
                      </span>
                    </div>
                    <div className="h-9 w-9 bg-teal-50 dark:bg-teal-950/40 text-teal-850 dark:text-teal-300 rounded-xl flex items-center justify-center border border-teal-100 dark:border-teal-900/40">
                      <Clock className="h-4.5 w-4.5 animate-pulse" />
                    </div>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-theme-secondary font-extrabold">
                      {lang === 'bn' ? "৮ম শ্রেণী (ক) বিজ্ঞান" : "Science (8A) starts soon"}
                    </span>
                    <button 
                      onClick={() => triggerToast(lang === 'bn' ? 'থার্মোডাইনামিক্স লেসন প্ল্যান সক্রিয়!' : 'Thermodynamics lesson plan is loaded!', 'info')}
                      className="text-[9px] text-teal-700 dark:text-teal-400 font-black hover:underline uppercase cursor-pointer"
                    >
                      {lang === 'bn' ? "প্ল্যান দেখুন" : "View Lesson"}
                    </button>
                  </div>
                </div>

                {/* KPI 2: Actionable Attendance with parent SMS shortcut */}
                <div className="bg-theme-card border border-theme/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-theme hover:scale-[1.01] transition-all relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-theme-secondary font-black uppercase tracking-wider block">
                        {lang === 'bn' ? "আজকের উপস্থিতি হার" : "Active Attendance"}
                      </span>
                      <span className="text-xl font-black text-theme-primary block mt-0.5">
                        94% Present
                      </span>
                    </div>
                    <div className="h-9 w-9 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                      <UserCheck className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-2 text-left">
                    <button 
                      onClick={() => setShowSmsModal(true)}
                      className="w-full text-center py-1.5 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/45 border border-rose-150 dark:border-rose-900/30 rounded-lg text-[10px] text-rose-700 dark:text-rose-400 font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <UserMinus className="h-3 w-3" />
                      <span>{lang === 'bn' ? "৩ জন অনুপস্থিত - অভিভাবকদের জানান" : "3 Absent - SMS parents"}</span>
                    </button>
                  </div>
                </div>

                {/* KPI 3: Grading Queue with AI Estimated Workload */}
                <div className="bg-theme-card border border-theme/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-theme hover:scale-[1.01] transition-all relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-theme-secondary font-black uppercase tracking-wider block">
                        {lang === 'bn' ? "মূল্যায়ন পেন্ডিং কিউ" : "Grading Queue"}
                      </span>
                      <span className="text-xl font-black text-theme-primary block mt-0.5">
                        15 Scripts Left
                      </span>
                    </div>
                    <div className="h-9 w-9 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-xl flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px]">
                    <span className="text-amber-800 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                      AI Est: ~20 mins
                    </span>
                    <button 
                      onClick={() => {
                        setGradeForm({ studentId: '3', class: 'Class 9A', subject: 'Physics', marks: '' });
                        setShowGradeModal(true);
                      }}
                      className="text-teal-700 dark:text-teal-400 font-black hover:underline uppercase cursor-pointer"
                    >
                      {lang === 'bn' ? "খাতা দেখুন" : "Mark Scripts"}
                    </button>
                  </div>
                </div>

                {/* KPI 4: Class Engagement micro-chart */}
                <div className="bg-theme-card border border-theme/60 p-4.5 rounded-2xl flex flex-col justify-between shadow-theme hover:scale-[1.01] transition-all relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-theme-secondary font-black uppercase tracking-wider block">
                        {lang === 'bn' ? "সাপ্তাহিক এনগেজমেন্ট স্কোর" : "Engagement Index"}
                      </span>
                      <span className="text-xl font-black text-theme-primary block mt-0.5">
                        96% Avg.
                      </span>
                    </div>
                    <div className="h-9 w-9 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  {/* Micro sparkline charts */}
                  <div className="flex gap-1 items-end h-5 mt-2 justify-start pl-1">
                    <span className="h-2 w-2.5 bg-teal-800/40 rounded-xs" />
                    <span className="h-3.5 w-2.5 bg-teal-800/60 rounded-xs" />
                    <span className="h-2.5 w-2.5 bg-teal-800/50 rounded-xs" />
                    <span className="h-4 w-2.5 bg-teal-800/80 rounded-xs" />
                    <span className="h-4.5 w-2.5 bg-teal-800 rounded-xs animate-pulse" />
                  </div>
                </div>

              </div>

              {/* 3. CORE INTELLIGENT GRID (2-Column Layout) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Column 1 (Academic Management & Dynamic Timeline) - span 7 */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Today's Routemap with quick action portals */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-[#004D40]" />
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {lang === 'bn' ? "আজকের রুট ম্যাপ ও রিয়েল-টাইম ক্লাস রুটিন" : "Today's Interactive Routemap"}
                        </h4>
                      </div>
                      <span className="text-[9px] bg-teal-50 text-[#004D40] font-black px-2.5 py-1 rounded-md border border-teal-150 uppercase tracking-wider">
                        {lang === 'bn' ? "লাইভ ট্র্যাকার" : "Live Tracker"}
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { time: '09:00 AM - 09:45 AM', grade: 'Class 9A', subject: 'Physics', room: 'Room 302', active: false, done: true },
                        { time: '10:00 AM - 10:45 AM', grade: 'Class 8A', subject: 'General Science', room: 'Room 401', active: true, done: false },
                        { time: '11:00 AM - 11:45 AM', grade: 'Class 10B', subject: 'Chemistry', room: 'Room 503', active: false, done: false },
                        { time: '01:15 PM - 02:00 PM', grade: 'Class 9A', subject: 'Higher Mathematics', room: 'Room 302', active: false, done: false }
                      ].map((cl, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3.5 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                            cl.active 
                              ? 'bg-teal-50/30 border-teal-200/85 shadow-3xs relative' 
                              : cl.done 
                                ? 'bg-slate-50/45 border-slate-100/60 opacity-65'
                                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          {cl.active && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#004D40] rounded-l-xl" />
                          )}
                          <div className="flex gap-3 items-start text-left">
                            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${cl.active ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{cl.grade}</span>
                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="text-[10px] text-[#475569] font-black uppercase tracking-wider">{cl.subject}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-[#475569] font-semibold">{cl.time}</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-[10px] text-[#475569] font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-150">{cl.room}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                            {cl.active ? (
                              <>
                                <button 
                                  onClick={() => setShowAttendanceModal(true)}
                                  className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1"
                                >
                                  <UserCheck className="h-3 w-3" />
                                  <span>{lang === 'bn' ? "হাজিরা নিন" : "Take Attendance"}</span>
                                </button>
                                <button 
                                  onClick={() => setShowDiaryModal(true)}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1"
                                >
                                  <BookOpenCheck className="h-3 w-3" />
                                  <span>{lang === 'bn' ? "ক্লাস ডায়েরি" : "Class Diary"}</span>
                                </button>
                              </>
                            ) : cl.done ? (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
                                <Check className="h-3.5 w-3.5" />
                                <span>{lang === 'bn' ? "সম্পন্ন" : "Completed"}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
                                {lang === 'bn' ? "আসন্ন" : "Upcoming"}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Performance Risks and Direct Warning Letter Portal */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4.5 w-4.5 text-rose-600" />
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {lang === 'bn' ? "ঝুঁকিপূর্ণ শিক্ষার্থী ও অভিভাবক সতর্কীকরণ" : "Student Performance & Risk Watch"}
                        </h4>
                      </div>
                      <span className="text-[9px] bg-rose-50 text-rose-700 font-black px-2.5 py-1 rounded-md border border-rose-100 uppercase tracking-wider">
                        {lang === 'bn' ? "৩টি এলার্ট সক্রিয়" : "3 High Risk Alerts"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: 'st-3', student: 'Mitu Khatun', class: 'Class 8A', roll: 3, alertType: lang === 'bn' ? 'অনুপস্থিতি ঝুঁকি (৩ দিন অনুপস্থিত)' : 'Consecutive Absences (3 Days Missing)', suggestedMsg: "Dear Parent, Mitu Khatun has missed 3 consecutive General Science classes. Please submit a leave request if she is unwell, or contact us.", suggestedMsgBn: "শ্রদ্ধেয় অভিভাবক, মিতু খাতুন বিজ্ঞান ক্লাসে টানা ৩ দিন অনুপস্থিত রয়েছে। দয়া করে ছুটির আবেদনপত্র প্রদান করুন অথবা আমাদের সাথে যোগাযোগ করুন।" },
                        { id: 'st-7', student: 'Sajidul Islam', class: 'Class 8A', roll: 7, alertType: lang === 'bn' ? 'গ্রেড ড্রপ ঝুঁকি (পদার্থবিজ্ঞান -২২%)' : 'Grade Drop Alert (Physics average dropped by 22%)', suggestedMsg: "Dear Guardian, Sajidul has scored low in Physics Chapter 3 Quiz. We suggest home attention on thermodynamics.", suggestedMsgBn: "সম্মানিত অভিভাবক, সাজিদুল পদার্থবিজ্ঞানের ৩য় অধ্যায়ের পরীক্ষায় আশানুরূপ করতে পারেনি। বাসা থেকে নিয়মিত নজর দেওয়ার অনুরোধ রইলো।" }
                      ].map((risk, index) => (
                        <div key={risk.id} className="p-3.5 bg-rose-50/20 border border-rose-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="text-left space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 bg-rose-500 rounded-full animate-ping" />
                              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{risk.student}</span>
                              <span className="text-[10px] text-slate-500 font-bold">({risk.class} &bull; Roll {risk.roll})</span>
                            </div>
                            <p className="text-[10.5px] text-rose-700 font-extrabold uppercase tracking-wide">
                              {risk.alertType}
                            </p>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setFeedbackTarget(risk);
                              setFeedbackText(lang === 'bn' ? risk.suggestedMsgBn : risk.suggestedMsg);
                              setShowFeedbackModal(true);
                            }}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black text-[10px] rounded-lg tracking-wider transition-all cursor-pointer flex items-center gap-1 uppercase"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>{lang === 'bn' ? "অভিভাবককে লিখুন" : "Message Guardian"}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Column 2 (AI Assistant Co-Pilot Terminal & Efficiency hub) - span 5 */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* SCMS AI Assistant Co-Pilot Simulator Terminal with Premium Theme-adaptive Glassmorphic Effect */}
                  <div className={`rounded-2xl p-4 shadow-xl border flex flex-col justify-between h-[420px] transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-950/45 text-slate-100 border-white/10 backdrop-blur-xl shadow-slate-950/40' 
                      : 'bg-white/45 text-slate-900 border-teal-500/15 backdrop-blur-xl shadow-teal-950/5'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-3 ${
                      isDarkMode ? 'border-white/10' : 'border-teal-500/10'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-extrabold text-xs tracking-wider uppercase text-emerald-500">
                          SCMS AI Co-Pilot
                        </span>
                      </div>
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-md font-mono border ${
                        isDarkMode 
                          ? 'bg-slate-800 text-slate-400 border-slate-700/50' 
                          : 'bg-teal-50 text-teal-700 border-teal-100'
                      }`}>
                        v2.4-Model
                      </span>
                    </div>

                    {/* Chat Messages Log */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 my-3.5 pr-1 text-left custom-scrollbar">
                      {coPilotHistory.map((item, index) => (
                        <div key={index} className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                            item.sender === 'user' 
                              ? (isDarkMode ? 'bg-teal-950/90 text-teal-50 rounded-tr-xs border border-teal-850' : 'bg-teal-600 text-white rounded-tr-xs')
                              : (isDarkMode ? 'bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700' : 'bg-teal-50/70 text-slate-800 rounded-tl-xs border border-teal-100/50')
                          }`}>
                            <p className="font-semibold">{lang === 'bn' ? item.textBn : item.text}</p>
                          </div>
                          <span className={`text-[8px] font-bold mt-1 px-1 ${
                            isDarkMode ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {item.sender === 'user' ? (lang === 'bn' ? 'আপনি' : 'You') : 'SCMS AI'}
                          </span>
                        </div>
                      ))}

                      {coPilotLoading && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs italic">
                          <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce" />
                          <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          <span className="text-[10px] font-mono ml-1">AI Agent compiling insights...</span>
                        </div>
                      )}
                    </div>

                    {/* Suggestion Chips */}
                    <div className={`flex gap-1.5 overflow-x-auto pb-2 border-t pt-2 scrollbar-none ${
                      isDarkMode ? 'border-white/10 text-slate-400' : 'border-teal-500/10 text-slate-500'
                    }`}>
                      {[
                        { label: lang === 'bn' ? 'অনুপস্থিতি রিপোর্ট' : 'Absent report', query: 'List today\'s absent students in Class 8A' },
                        { label: lang === 'bn' ? 'বিজ্ঞানের লেসন অবজেক্টিভ' : 'Science Objectives', query: 'Suggest Thermodynamics lesson objectives for general science' },
                        { label: lang === 'bn' ? 'কুইজ এলার্ট ড্রাফট' : 'Draft Quiz Notice', query: 'Draft an announcement reminder for Class 9B physics exam next Monday.' }
                      ].map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => {
                            setCoPilotQuery(chip.query);
                          }}
                          className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full shrink-0 border transition-all duration-200 cursor-pointer ${
                            isDarkMode 
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/80 hover:border-slate-650' 
                              : 'bg-teal-50 hover:bg-teal-100/80 text-teal-800 border-teal-100/60 hover:border-teal-200'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                    {/* Chat form */}
                    <form onSubmit={handleCoPilotMessage} className="flex gap-2 items-center mt-2">
                      <input 
                        type="text"
                        value={coPilotQuery}
                        onChange={(e) => setCoPilotQuery(e.target.value)}
                        placeholder={lang === 'bn' ? 'কো-পাইলটকে জিজ্ঞাসা করুন...' : 'Ask your AI Co-Pilot anything...'}
                        className={`flex-1 text-xs px-3.5 py-2 rounded-xl focus:outline-none border font-semibold focus:ring-1 transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-slate-800/80 text-white border-slate-700 focus:border-emerald-500 focus:ring-emerald-500' 
                            : 'bg-white/80 text-slate-900 border-teal-100 focus:border-teal-500 focus:ring-teal-500 shadow-inner'
                        }`}
                      />
                      <button 
                        type="submit"
                        className="h-8.5 w-8.5 bg-[#004D40] hover:bg-teal-750 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  {/* Smart Approval Queue for Leave Requests */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4.5 w-4.5 text-[#004D40]" />
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {lang === 'bn' ? 'ছুটি ও স্মার্ট এপ্রুভাল কিউ' : 'Smart Leave Approvals'}
                        </h4>
                      </div>
                      <span className="text-[10px] bg-amber-50 text-amber-800 font-black px-2 py-0.5 rounded-full border border-amber-100">
                        {leaveRequests.filter(l => l.status === 'pending').length} {lang === 'bn' ? "অপেক্ষমান" : "Pending"}
                      </span>
                    </div>

                    <div className="space-y-3.5 text-left">
                      {leaveRequests.map((req) => (
                        <div key={req.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex flex-col gap-2.5 transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-black text-xs text-slate-900">{req.student}</p>
                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="text-[10px] text-slate-500 font-bold">{req.class} (Roll: {req.roll})</span>
                              </div>
                              <p className="text-[10.5px] text-[#475569] font-semibold mt-1">
                                {lang === 'bn' ? 'আবেদনের কারণ' : 'Reason'}: <strong className="text-slate-800">{req.reason}</strong>
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-bold">
                                <span>{req.duration} &bull; {req.date}</span>
                              </div>
                            </div>

                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              req.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {req.status === 'approved' ? (lang === 'bn' ? 'মঞ্জুরকৃত' : 'Approved') :
                               req.status === 'rejected' ? (lang === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected') :
                               (lang === 'bn' ? 'অপেক্ষমান' : 'Pending')}
                            </span>
                          </div>

                          {/* Instant Preset Reply selection list */}
                          {req.status === 'pending' && (
                            <div className="space-y-2 border-t border-slate-200/60 pt-2.5">
                              <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">
                                {lang === 'bn' ? 'স্মার্ট এপ্রুভালের উত্তর নির্বাচন করুন:' : 'Select AI Reply Preset:'}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  { label: '🏡 Family ceremony', reply: 'Approved: Family ceremony. Catch up with study notes! 🏡' },
                                  { label: '🤒 Recover soon', reply: 'Approved: Take complete rest and recover soon! 🤒' },
                                  { label: '📚 Study MCQ', reply: 'Approved: catch up with Physics MCQ chapter 3!' }
                                ].map((preset, pIdx) => (
                                  <button
                                    key={pIdx}
                                    onClick={() => {
                                      setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, templateReply: preset.reply } : r));
                                      triggerToast(lang === 'bn' ? 'স্মার্ট উত্তর সেট করা হয়েছে!' : 'AI preset reply loaded!', 'info');
                                    }}
                                    className={`text-[9px] font-bold px-2 py-1 rounded-md border cursor-pointer transition-all ${
                                      req.templateReply === preset.reply
                                        ? 'bg-teal-800 text-teal-50 border-teal-700'
                                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>

                              <div className="flex gap-2 pt-1">
                                <button 
                                  onClick={() => {
                                    setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
                                    triggerToast(
                                      lang === 'bn' 
                                        ? `${req.student}-এর আবেদন স্মার্টভাবে মঞ্জুর করা হয়েছে!` 
                                        : `Leave application for ${req.student} approved with selected AI reply: "${req.templateReply || 'Approved successfully'}"`,
                                      'success'
                                    );
                                  }}
                                  className="flex-1 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer uppercase"
                                >
                                  <Check className="h-3 w-3" />
                                  <span>{lang === 'bn' ? 'অনুমোদন দিন' : 'Approve'}</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
                                    triggerToast(lang === 'bn' ? 'আবেদন প্রত্যাখ্যান করা হয়েছে।' : 'Leave rejected.', 'error');
                                  }}
                                  className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-[10px] rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}

                          {req.status === 'approved' && req.templateReply && (
                            <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-[10.5px] text-emerald-800 italic mt-1 font-semibold">
                              &ldquo;{req.templateReply}&rdquo;
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fast Action Shortcuts Panel */}
                  <div className="bg-white border border-slate-150 rounded-2xl p-5.5 shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                      <Zap className="h-4.5 w-4.5 text-amber-500" />
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {lang === 'bn' ? "স্মার্ট ক্লাস ও কুইক অ্যাকশন" : "Efficiency & Automation Hub"}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setShowQuizModal(true)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-xl flex flex-col items-center gap-1.5 transition-all group text-center cursor-pointer"
                      >
                        <div className="h-8.5 w-8.5 bg-teal-50 text-[#004D40] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-teal-100/50">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 leading-tight">
                          {lang === 'bn' ? "এআই কুইজ শিডিউল" : "Schedule AI Quiz"}
                        </span>
                      </button>

                      <button 
                        onClick={() => setShowSubModal(true)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-xl flex flex-col items-center gap-1.5 transition-all group text-center cursor-pointer"
                      >
                        <div className="h-8.5 w-8.5 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-100/50">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 leading-tight">
                          {lang === 'bn' ? "বদলি শিক্ষক অনুরোধ" : "Request Substitute"}
                        </span>
                      </button>

                      <button 
                        onClick={() => setShowVoiceModal(true)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-xl flex flex-col items-center gap-1.5 transition-all group text-center cursor-pointer"
                      >
                        <div className="h-8.5 w-8.5 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-100/50">
                          <Mic className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 leading-tight">
                          {lang === 'bn' ? "ভয়েস দিয়ে হোমওয়ার্ক" : "Voice Homework"}
                        </span>
                      </button>

                      <button 
                        onClick={() => {
                          setGradeForm({ studentId: '', class: 'Class 8A', subject: 'General Science', marks: '' });
                          setShowGradeModal(true);
                        }}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-xl flex flex-col items-center gap-1.5 transition-all group text-center cursor-pointer"
                      >
                        <div className="h-8.5 w-8.5 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-100/50">
                          <Award className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-700 leading-tight">
                          {lang === 'bn' ? "দ্রুত গ্রেড প্রদান" : "Express Grading"}
                        </span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: STUDENT REGISTRY & DATA ENTRY                       */}
          {/* ======================================================== */}
          {activeMenu === 'students' && (
            <div className="space-y-6 text-left">
              <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">
                    {lang === 'bn' ? 'শিক্ষার্থী ডাটা এন্ট্রি ও ব্যবস্থাপনা পোর্টাল' : 'Student Data Entry & Management Registry'}
                  </h3>
                  <p className="text-xs text-[#475569] font-semibold">
                    {lang === 'bn' 
                      ? 'স্টুডেন্টস কেয়ার মডেল স্কুলের নতুন শিক্ষার্থী নিবন্ধন করুন অথবা বিদ্যমান তথ্য সম্পাদনা করুন।' 
                      : 'Input and edit student profiles, roll numbers, sections, and guardian contact details.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-teal-50 text-teal-800 border border-teal-150 px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>
                      {lang === 'bn' ? 'মোট শিক্ষার্থী:' : 'Total Registered:'} {studentsList.length}
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 1. DATA ENTRY FORM */}
                <div className="lg:col-span-4 bg-white border border-slate-150 rounded-2xl p-6 shadow-theme space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <PlusCircle className="h-5 w-5 text-[#004D40]" />
                      <span>
                        {editingStudent 
                          ? (lang === 'bn' ? 'শিক্ষার্থী তথ্য সম্পাদনা' : 'Edit Student Details')
                          : (lang === 'bn' ? 'নতুন শিক্ষার্থী ডাটা এন্ট্রি' : 'New Student Registration')}
                      </span>
                    </h4>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Validation
                      if (!studentForm.name.trim()) {
                        triggerToast(lang === 'bn' ? 'শিক্ষার্থীর নাম লিখুন!' : 'Student name is required!', 'error');
                        return;
                      }
                      if (!studentForm.roll || parseInt(studentForm.roll, 10) <= 0) {
                        triggerToast(lang === 'bn' ? 'সঠিক রোল নম্বর লিখুন!' : 'Please enter a valid roll number!', 'error');
                        return;
                      }
                      if (!studentForm.guardianContact.trim() || studentForm.guardianContact.length < 11) {
                        triggerToast(lang === 'bn' ? 'সঠিক ১১ সংখ্যার অভিভাবকের মোবাইল নম্বর লিখুন!' : 'Please enter a valid guardian contact number!', 'error');
                        return;
                      }

                      if (editingStudent) {
                        // Update
                        setStudentsList(prev => prev.map(s => s.id === editingStudent.id ? {
                          ...s,
                          name: studentForm.name,
                          roll: parseInt(studentForm.roll, 10),
                          class: studentForm.class,
                          section: studentForm.section,
                          guardianContact: studentForm.guardianContact
                        } : s));
                        triggerToast(
                          lang === 'bn' 
                            ? 'শিক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে!' 
                            : 'Student profile updated successfully!',
                          'success'
                        );
                        setEditingStudent(null);
                      } else {
                        // Create
                        const rollNum = parseInt(studentForm.roll, 10);
                        // Check if roll already exists in the same class/section
                        const rollExists = studentsList.some(s => s.class === studentForm.class && s.section === studentForm.section && s.roll === rollNum);
                        if (rollExists) {
                          triggerToast(
                            lang === 'bn' 
                              ? 'এই ক্লাসে এই রোল নম্বরটি ইতিমধ্যে নিবন্ধিত রয়েছে!' 
                              : 'This roll number is already registered for this class & section!',
                            'error'
                          );
                          return;
                        }

                        const newStudent = {
                          id: `st-${Date.now()}`,
                          name: studentForm.name,
                          roll: rollNum,
                          class: studentForm.class,
                          section: studentForm.section,
                          guardianContact: studentForm.guardianContact,
                          feesPaid: true,
                          feesDue: 0
                        };
                        setStudentsList(prev => [...prev, newStudent]);
                        triggerToast(
                          lang === 'bn' 
                            ? 'নতুন শিক্ষার্থী সফলভাবে নিবন্ধিত হয়েছে!' 
                            : 'New student added to database registry!',
                          'success'
                        );
                      }

                      // Clear form
                      setStudentForm({ name: '', roll: '', class: 'Class 8A', section: 'A', guardianContact: '' });
                    }}
                    className="space-y-4"
                  >
                    {/* Name input */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {lang === 'bn' ? 'শিক্ষার্থীর পূর্ণ নাম' : 'Full Student Name'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={lang === 'bn' ? 'যেমন: সুমাইয়া আক্তার' : 'e.g. Sumaiya Aktar'}
                        value={studentForm.name}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none transition-all shadow-3xs"
                      />
                    </div>

                    {/* Roll Input */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {lang === 'bn' ? 'রোল নম্বর' : 'Roll Number'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder={lang === 'bn' ? 'যেমন: ৪' : 'e.g. 4'}
                        value={studentForm.roll}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, roll: e.target.value }))}
                        className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none transition-all shadow-3xs font-mono"
                      />
                    </div>

                    {/* Class & Section select fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          {lang === 'bn' ? 'শ্রেণী' : 'Class'}
                        </label>
                        <select
                          value={studentForm.class}
                          onChange={(e) => setStudentForm(prev => ({ ...prev, class: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none cursor-pointer shadow-3xs"
                        >
                          <option value="Class 8A">Class 8A</option>
                          <option value="Class 9A">Class 9A</option>
                          <option value="Class 10A">Class 10A</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          {lang === 'bn' ? 'সেকশন' : 'Section'}
                        </label>
                        <select
                          value={studentForm.section}
                          onChange={(e) => setStudentForm(prev => ({ ...prev, section: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none cursor-pointer shadow-3xs"
                        >
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                        </select>
                      </div>
                    </div>

                    {/* Guardian Contact Input */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {lang === 'bn' ? 'অভিভাবকের মোবাইল নম্বর' : 'Guardian Contact Mobile'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 01712345678"
                        value={studentForm.guardianContact}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, guardianContact: e.target.value }))}
                        className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none transition-all shadow-3xs font-mono"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                      >
                        <Check className="h-4.5 w-4.5" />
                        <span>{editingStudent ? (lang === 'bn' ? 'তথ্য আপডেট করুন' : 'Update') : (lang === 'bn' ? 'যোগ করুন' : 'Register')}</span>
                      </button>

                      {editingStudent && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStudent(null);
                            setStudentForm({ name: '', roll: '', class: 'Class 8A', section: 'A', guardianContact: '' });
                            triggerToast(lang === 'bn' ? 'সম্পাদনা বাতিল করা হয়েছে' : 'Editing cancelled', 'info');
                          }}
                          className="py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-600 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* 2. DATA TABLE & SEARCH */}
                <div className="lg:col-span-8 bg-white border border-slate-150 rounded-2xl p-6 shadow-theme space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 text-left">
                      <Users className="h-5 w-5 text-[#004D40]" />
                      <span>{lang === 'bn' ? 'নিবন্ধিত শিক্ষার্থীদের ডাটা তালিকা' : 'Registered Students Data Table'}</span>
                    </h4>

                    {/* Quick Registry search */}
                    <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-3 py-2 rounded-xl w-full sm:w-64">
                      <Search className="h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={lang === 'bn' ? "নাম, ক্লাস বা মোবাইল খুঁজুন..." : "Filter by name, class, contact..."}
                        className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-800 font-bold"
                      />
                    </div>
                  </div>

                  {/* Table view */}
                  <div className="overflow-x-auto rounded-xl border border-slate-150 shadow-3xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[#475569] font-extrabold border-b border-slate-150 uppercase tracking-wider">
                          <th className="p-3.5 pl-4">{lang === 'bn' ? 'রোল' : 'Roll'}</th>
                          <th className="p-3.5">{lang === 'bn' ? 'নাম' : 'Name'}</th>
                          <th className="p-3.5">{lang === 'bn' ? 'শ্রেণী' : 'Class'}</th>
                          <th className="p-3.5">{lang === 'bn' ? 'সেকশন' : 'Section'}</th>
                          <th className="p-3.5">{lang === 'bn' ? 'অভিভাবকের নম্বর' : 'Guardian Contact'}</th>
                          <th className="p-3.5 text-center">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentsList
                          .filter(s => {
                            const query = searchTerm.toLowerCase();
                            return (
                              s.name.toLowerCase().includes(query) ||
                              s.class.toLowerCase().includes(query) ||
                              s.guardianContact.includes(query) ||
                              s.roll.toString().includes(query)
                            );
                          })
                          .map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors font-bold text-slate-700">
                              <td className="p-3.5 pl-4 font-mono text-[#004D40]">{student.roll}</td>
                              <td className="p-3.5 text-slate-900 font-black">{student.name}</td>
                              <td className="p-3.5">{student.class}</td>
                              <td className="p-3.5">
                                <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-md font-extrabold">
                                  {student.section}
                                </span>
                              </td>
                              <td className="p-3.5 font-mono text-[#475569]">{student.guardianContact}</td>
                              <td className="p-3.5">
                                <div className="flex items-center justify-center gap-1.5 font-sans">
                                  <button
                                    onClick={() => {
                                      setEditingStudent(student);
                                      setStudentForm({
                                        name: student.name,
                                        roll: student.roll.toString(),
                                        class: student.class,
                                        section: student.section,
                                        guardianContact: student.guardianContact
                                      });
                                      triggerToast(
                                        lang === 'bn' 
                                          ? `${student.name}-এর ডাটা ফরম লোড করা হয়েছে!` 
                                          : `Loaded details of ${student.name} for editing`,
                                        'info'
                                      );
                                    }}
                                    className="p-1.5 hover:bg-teal-50 text-teal-800 hover:text-teal-900 border border-transparent hover:border-teal-200 rounded-lg transition-all cursor-pointer"
                                    title={lang === 'bn' ? '정보 수정' : 'Edit Profile'}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(lang === 'bn' ? `আপনি কি নিশ্চিতভাবে ${student.name}-কে ডাটাবেজ থেকে মুছে ফেলতে চান?` : `Are you sure you want to remove ${student.name} from registry?`)) {
                                        setStudentsList(prev => prev.filter(s => s.id !== student.id));
                                        triggerToast(
                                          lang === 'bn' 
                                            ? `${student.name}-কে সফলভাবে মুছে ফেলা হয়েছে` 
                                            : `${student.name} removed from student registry`,
                                          'error'
                                        );
                                        if (editingStudent?.id === student.id) {
                                          setEditingStudent(null);
                                          setStudentForm({ name: '', roll: '', class: 'Class 8A', section: 'A', guardianContact: '' });
                                        }
                                      }
                                    }}
                                    className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-transparent hover:border-rose-200 rounded-lg transition-all cursor-pointer"
                                    title={lang === 'bn' ? '데이터 삭제' : 'Delete Student'}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {studentsList.filter(s => {
                          const query = searchTerm.toLowerCase();
                          return (
                            s.name.toLowerCase().includes(query) ||
                            s.class.toLowerCase().includes(query) ||
                            s.guardianContact.includes(query) ||
                            s.roll.toString().includes(query)
                          );
                        }).length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 font-extrabold">
                              {lang === 'bn' ? 'কোনো শিক্ষার্থী পাওয়া যায়নি!' : 'No registered students match your search criteria!'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CLASS SCHEDULE                                    */}
          {/* ======================================================== */}
          {activeMenu === 'schedule' && (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 text-left space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="text-xl font-black text-slate-900">{lang === 'bn' ? 'আমার ক্লাস রুটিন ও রুট ম্যাপ' : 'Weekly Class Schedule & Routemap'}</h3>
                <p className="text-xs text-[#475569] font-semibold mt-1">
                  {lang === 'bn' 
                    ? 'স্টুডেন্টস কেয়ার মডেল স্কুলের চলতি সেশনের জন্য আপনার নির্ধারিত সাপ্তাহিক ক্লাস শিডিউল।' 
                    : 'Your structured teaching routine and mapped classes at Students Care Model School.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day, dIdx) => (
                  <div key={day} className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3">
                    <span className="font-extrabold text-xs text-teal-800 uppercase tracking-wider block border-b border-slate-200 pb-2 mb-1">
                      {lang === 'bn' ? ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার'][dIdx] : day}
                    </span>
                    
                    <div className="space-y-2">
                      {[
                        { time: '09:00 AM', subject: 'Physics', room: 'R-302', class: 'Class 9A' },
                        { time: '11:00 AM', subject: 'Chemistry', room: 'R-503', class: 'Class 10B' }
                      ].map((cl, cIdx) => (
                        <div key={cIdx} className="bg-white border border-slate-150 p-2.5 rounded-lg text-xs space-y-1 shadow-3xs hover:border-teal-300 transition-colors">
                          <p className="font-black text-slate-800">{cl.class}</p>
                          <p className="text-[10px] text-[#475569] font-bold uppercase">{cl.subject}</p>
                          <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold pt-1">
                            <span>{cl.time}</span>
                            <span className="bg-slate-100 px-1 py-0.5 rounded-sm border border-slate-200">{cl.room}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ATTENDANCE REGISTRY                               */}
          {/* ======================================================== */}
          {activeMenu === 'attendance' && (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 text-left space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-150 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{lang === 'bn' ? 'ডিজিটাল হাজিরা খাতা' : 'Digital Attendance Registry'}</h3>
                  <p className="text-xs text-[#475569] font-semibold mt-1">
                    {lang === 'bn' ? '৮ম শ্রেণী - বিজ্ঞান ক শাখার নিয়মিত অনলাইন হাজিরা নিয়ন্ত্রণ প্যানেল।' : 'Manage, toggle, and upload active daily attendance registers directly to server.'}
                  </p>
                </div>
                <button
                  onClick={handleAttendanceSubmit}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'হাজিরা সাবমিট করুন' : 'Submit and Upload Registry'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceRegistry.map((st) => (
                  <div key={st.roll} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between shadow-3xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 bg-teal-800 text-teal-100 text-xs font-black rounded-full flex items-center justify-center font-mono shadow-xs">
                        {st.roll}
                      </span>
                      <div className="text-left">
                        <p className="font-extrabold text-xs text-slate-900 leading-tight">{st.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{st.class}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleAttendance(st.roll)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        st.present 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {st.present ? (lang === 'bn' ? 'উপস্থিত' : 'PRESENT') : (lang === 'bn' ? 'অনুপস্থিত' : 'ABSENT')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: EXAMS & GRADING                                    */}
          {/* ======================================================== */}
          {activeMenu === 'exams' && (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 text-left space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="text-xl font-black text-slate-900">{lang === 'bn' ? 'পরীক্ষা নম্বর ও মূল্যায়ন কার্যক্ষেত্র' : 'Exams Assessment & Gradebook'}</h3>
                <p className="text-xs text-[#475569] font-semibold mt-1">
                  {lang === 'bn' 
                    ? 'পরীক্ষার নম্বর বা গ্রেড শীট আপলোড করুন ও সাবমিট করুন।' 
                    : 'Submit grades, check statistics and mark pending test and practical exams.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Submit New Grades Form */}
                <div className="lg:col-span-4 bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4">
                  <span className="text-[10px] bg-teal-800 text-teal-100 font-black px-2.5 py-1 rounded-md border border-teal-700 uppercase tracking-widest block w-max">
                    {lang === 'bn' ? "নতুন গ্রেড সাবমিশন" : "Input New Grades"}
                  </span>
                  
                  <form onSubmit={handleSubmitGrade} className="space-y-4 text-xs font-semibold text-[#475569]">
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'শিক্ষার্থী আইডি' : 'Student ID'}</label>
                      <input
                        type="text"
                        value={gradeForm.studentId}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, studentId: e.target.value }))}
                        placeholder="e.g. 2026103"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'পরীক্ষার বিষয়' : 'Subject Course'}</label>
                      <select
                        value={gradeForm.subject}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 font-bold"
                      >
                        <option value="Physics">{lang === 'bn' ? 'পদার্থবিজ্ঞান' : 'Physics'}</option>
                        <option value="Chemistry">{lang === 'bn' ? 'রসায়ন' : 'Chemistry'}</option>
                        <option value="General Science">{lang === 'bn' ? 'সাধারণ বিজ্ঞান' : 'General Science'}</option>
                        <option value="Higher Math">{lang === 'bn' ? 'উচ্চতর গণিত' : 'Higher Math'}</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'প্রাপ্ত নম্বর' : 'Obtained Marks'}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradeForm.marks}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, marks: e.target.value }))}
                        placeholder="e.g. 85"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 font-bold"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {lang === 'bn' ? 'নম্বর সংরক্ষণ করুন' : 'Submit and Sync Grade'}
                    </button>
                  </form>
                </div>

                {/* Exam Performance List */}
                <div className="lg:col-span-8 space-y-4">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    {lang === 'bn' ? 'চলতি পরীক্ষার মূল্যায়ন রেকর্ডস' : 'Active Assessment Performance Lists'}
                  </span>

                  <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-3xs">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[#475569] font-black uppercase tracking-wider">
                          <th className="p-4">{lang === 'bn' ? 'পরীক্ষার নাম ও কোড' : 'Examination Title'}</th>
                          <th className="p-4 text-center">{lang === 'bn' ? 'ক্লাস ও ব্যাচ' : 'Class Cohort'}</th>
                          <th className="p-4 text-center">{lang === 'bn' ? 'জমা তথ্য' : 'Submission Progress'}</th>
                          <th className="p-4 text-right">{lang === 'bn' ? 'স্ট্যাটাস' : 'Marks Verification'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {exams.map((ex) => (
                          <tr key={ex.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4">
                              <p className="font-extrabold text-slate-800">{ex.title}</p>
                              <span className="text-[10px] text-slate-400 font-bold">{ex.date}</span>
                            </td>
                            <td className="p-4 text-center font-bold text-slate-700">{ex.class}</td>
                            <td className="p-4 text-center font-mono font-black text-[#004D40]">{ex.submissions}</td>
                            <td className="p-4 text-right">
                              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                                ex.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {ex.status === 'completed' ? (lang === 'bn' ? 'মূল্যায়ন সম্পন্ন' : 'Graded') : (lang === 'bn' ? 'মূল্যায়ন বাকি' : 'Pending')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: ASSIGNMENT LIST                                   */}
          {/* ======================================================== */}
          {activeMenu === 'assignments' && (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 text-left space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-150 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{lang === 'bn' ? 'এসাইনমেন্ট ট্র্যাকার' : 'Active Assignments List'}</h3>
                  <p className="text-xs text-[#475569] font-semibold mt-1">
                    {lang === 'bn' ? 'শিক্ষার্থীদের জন্য আপনার তৈরি এসাইনমেন্ট ও বাড়ির কাজের রিয়েল-টাইম তথ্য।' : 'Track and manage assignments posted for various classes.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowAssignmentModal(true)}
                  className="px-5 py-2 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'এসাইনমেন্ট তৈরি করুন' : 'Create Assignment'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((as) => (
                  <div key={as.id} className="bg-slate-50 border border-slate-150 p-5 rounded-xl space-y-3 relative hover:shadow-xs transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-teal-800 text-teal-100 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {as.subject}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-1">{as.title}</h4>
                        <p className="text-[11px] text-[#475569] font-semibold">
                          {lang === 'bn' ? 'শ্রেণী' : 'Class'}: <strong className="text-slate-800">{as.class}</strong>
                        </p>
                      </div>
                      <span className="text-[10px] text-rose-600 font-extrabold bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md uppercase">
                        {lang === 'bn' ? 'শেষ তারিখ' : 'Due'}: {as.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: LEAVE REQUESTS                                    */}
          {/* ======================================================== */}
          {activeMenu === 'leave' && (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 text-left space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="text-xl font-black text-slate-900">{lang === 'bn' ? 'শিক্ষার্থীদের ছুটির আবেদন ড্যাশবোর্ড' : 'Students Leave Management'}</h3>
                <p className="text-xs text-[#475569] font-semibold mt-1">
                  {lang === 'bn' ? 'শিক্ষার্থীদের ছুটির আবেদনপত্র যাচাই করুন ও অনলাইন অনুমোদন বা প্রত্যাখ্যান সম্পন্ন করুন।' : 'Review and take actions on leave requests submitted by parents and guardians.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leaveRequests.map((req) => (
                  <div key={req.id} className="bg-slate-50 border border-slate-150 p-5 rounded-2xl flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{req.student}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{req.class} &bull; Roll {req.roll}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-wider ${
                          req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          req.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {req.status === 'approved' ? (lang === 'bn' ? 'অনুমোদিত' : 'Approved') :
                           req.status === 'rejected' ? (lang === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected') :
                           (lang === 'bn' ? 'অপেক্ষমান' : 'Pending')}
                        </span>
                      </div>
                      
                      <div className="text-xs bg-white border border-slate-150 p-3 rounded-xl">
                        <p className="text-[#475569] font-semibold leading-relaxed">
                          {lang === 'bn' ? 'ছুটির কারণ' : 'Reason'}: <strong className="text-slate-800 font-bold">{req.reason}</strong>
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2">
                          {lang === 'bn' ? 'মেয়াদ' : 'Duration'}: <strong className="text-[#475569]">{req.duration} ({req.date})</strong>
                        </p>
                      </div>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex gap-2 border-t border-slate-200/60 pt-3">
                        <button 
                          onClick={() => handleApproveLeave(req.id, req.student)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{lang === 'bn' ? 'অনুমোদন করুন' : 'Approve Leave'}</span>
                        </button>
                        <button 
                          onClick={() => handleRejectLeave(req.id, req.student)}
                          className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>{lang === 'bn' ? 'প্রত্যাখ্যান' : 'Reject Request'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 4. SOFTWARE MAINTENANCE FOOTER (As Requested) */}
        <footer className="bg-slate-900 border-t border-slate-800 text-white h-10 flex items-center shrink-0 overflow-hidden relative z-10 shadow-lg">
          <div className="bg-[#004D40] px-4 h-full flex items-center text-[10px] font-black shrink-0 relative z-20 text-white uppercase tracking-wider gap-1.5 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
            <span className="h-2 w-2 bg-emerald-400 rounded-full animate-ping" />
            <span>{lang === 'bn' ? 'সফটওয়্যার রক্ষণাবেক্ষণ' : 'Software Maintenance'}</span>
          </div>
          <div className="w-full overflow-hidden relative h-5 flex items-center z-10">
            <span className="animate-marquee absolute whitespace-nowrap text-xs font-semibold text-slate-300">
              সফটওয়্যার তৈরি ও রক্ষণাবেক্ষণে: মো. ইমরান হোসেন, সিনিয়র শিক্ষক, স্টুডেন্টস কেয়ার মডেল স্কুল (01814913049) &nbsp;&nbsp;&bull;&nbsp;&nbsp; Software Development & Maintenance: Md. Imran Hosen, Senior Teacher, Students Care Model School (01814913049)
            </span>
          </div>
        </footer>

      </main>

      {/* ======================================================== */}
      {/* MODAL 1: CREATE ASSIGNMENT MODAL                          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAssignmentModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-left"
            >
              <div className="p-5.5 bg-[#004D40] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-emerald-300" />
                  <h4 className="font-extrabold text-sm sm:text-base">{lang === 'bn' ? 'নতুন এসাইনমেন্ট তৈরি করুন' : 'Create New Assignment'}</h4>
                </div>
                <button 
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-white hover:text-rose-400 p-1 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="p-5.5 space-y-4 text-xs font-semibold text-[#475569]">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'এসাইনমেন্টের শিরোনাম' : 'Assignment Title'}</label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Kinematics Mathematical Problems"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'শ্রেণী' : 'Class'}</label>
                    <select
                      value={assignmentForm.class}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, class: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold"
                    >
                      <option value="Class 8A">Class 8A</option>
                      <option value="Class 9A">Class 9A</option>
                      <option value="Class 10B">Class 10B</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'বিষয়' : 'Subject'}</label>
                    <select
                      value={assignmentForm.subject}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="General Science">General Science</option>
                      <option value="Higher Math">Higher Math</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'জমাদানের শেষ তারিখ' : 'Due Date'}</label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold cursor-pointer"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {lang === 'bn' ? 'এসাইনমেন্ট রিলিজ করুন' : 'Release Assignment'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: POST ANNOUNCEMENT MODAL                         */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-left"
            >
              <div className="p-5.5 bg-blue-700 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-200" />
                  <h4 className="font-extrabold text-sm sm:text-base">{lang === 'bn' ? 'নতুন ঘোষণা পোস্ট করুন' : 'Post Live Announcement'}</h4>
                </div>
                <button 
                  onClick={() => setShowAnnouncementModal(false)}
                  className="text-white hover:text-rose-400 p-1 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePostAnnouncement} className="p-5.5 space-y-4 text-xs font-semibold text-[#475569]">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'ঘোষণার বিষয়বস্তু' : 'Announcement Content'}</label>
                  <textarea
                    rows={4}
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder={lang === 'bn' ? "বিজ্ঞপ্তি লিখুন..." : "Type live announcement broadcast content here..."}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 font-bold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {lang === 'bn' ? 'ব্রডকাস্ট করুন' : 'Broadcast Announcement'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: APPLY TEACHER LEAVE MODAL                      */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showLeaveApplyModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-left"
            >
              <div className="p-5.5 bg-[#004D40] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-300" />
                  <h4 className="font-extrabold text-sm sm:text-base">{lang === 'bn' ? 'ছুটির আবেদন ফরম' : 'Teacher Leave Application'}</h4>
                </div>
                <button 
                  onClick={() => setShowLeaveApplyModal(false)}
                  className="text-white hover:text-rose-400 p-1 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleApplyTeacherLeave} className="p-5.5 space-y-4 text-xs font-semibold text-[#475569]">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'ছুটির ধরণ' : 'Leave Type'}</label>
                  <select
                    value={leaveApplyForm.type}
                    onChange={(e) => setLeaveApplyForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold"
                  >
                    <option value="Casual">Casual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Earned">Earned Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'শুরুর তারিখ' : 'Start Date'}</label>
                    <input
                      type="date"
                      value={leaveApplyForm.startDate}
                      onChange={(e) => setLeaveApplyForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold cursor-pointer"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'শেষের তারিখ' : 'End Date'}</label>
                    <input
                      type="date"
                      value={leaveApplyForm.endDate}
                      onChange={(e) => setLeaveApplyForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'ছুটির সুনির্দিষ্ট কারণ' : 'Specific Reason for Leave'}</label>
                  <textarea
                    rows={3}
                    value={leaveApplyForm.reason}
                    onChange={(e) => setLeaveApplyForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder={lang === 'bn' ? "কারণ উল্লেখ করুন..." : "Specify illness or event particulars..."}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {lang === 'bn' ? 'আবেদন জমা দিন' : 'Submit Leave Application'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 4: MARK NOW GRADING MODAL                          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showGradeModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-left"
            >
              <div className="p-5.5 bg-teal-800 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-teal-300" />
                  <h4 className="font-extrabold text-sm sm:text-base">{lang === 'bn' ? 'শিক্ষার্থী মার্ক ইনপুট করুন' : 'Input Exam Grade Sheet'}</h4>
                </div>
                <button 
                  onClick={() => setShowGradeModal(false)}
                  className="text-white hover:text-rose-400 p-1 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitGrade} className="p-5.5 space-y-4 text-xs font-semibold text-[#475569]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1">{lang === 'bn' ? 'নির্ধারিত ক্লাস' : 'Cohort'}</label>
                    <input
                      type="text"
                      value={gradeForm.class}
                      disabled
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1">{lang === 'bn' ? 'পরীক্ষার বিষয়' : 'Course'}</label>
                    <input
                      type="text"
                      value={gradeForm.subject}
                      disabled
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'শিক্ষার্থী আইডি (ID)' : 'Student ID'}</label>
                  <input
                    type="text"
                    value={gradeForm.studentId}
                    onChange={(e) => setGradeForm(prev => ({ ...prev, studentId: e.target.value }))}
                    placeholder="e.g. 2026105"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider">{lang === 'bn' ? 'প্রাপ্ত নম্বর (১০০ এর মধ্যে)' : 'Marks (Out of 100)'}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeForm.marks}
                    onChange={(e) => setGradeForm(prev => ({ ...prev, marks: e.target.value }))}
                    placeholder="0-100"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-800 text-slate-800 font-bold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {lang === 'bn' ? 'প্রাপ্ত নম্বর সংরক্ষণ করুন' : 'Confirm & Log Obtained Marks'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 5: ATTENDANCE CONFIRMATION MODAL                   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAttendanceModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-left"
            >
              <div className="p-5 bg-teal-800 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-emerald-300" />
                  <h4 className="font-extrabold text-sm sm:text-base">{lang === 'bn' ? 'ডিজিটাল হাজিরা সিঙ্ক' : 'Class Attendance Verification'}</h4>
                </div>
                <button 
                  onClick={() => setShowAttendanceModal(false)}
                  className="text-white hover:text-rose-400 p-1 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500 font-semibold">
                  {lang === 'bn' 
                    ? 'আপনি কি নিম্নলিখিত শিক্ষার্থীদের হাজিরা রেকর্ড সাবমিট করতে চান?' 
                    : 'Please review the attendance state of Class 8A before uploading to the portal database.'}
                </p>

                <div className="border border-slate-150 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[#475569] font-bold uppercase tracking-wider">
                        <th className="p-2.5 pl-4">Roll</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5 text-right pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceRegistry.map((st) => (
                        <tr key={st.roll} className="hover:bg-slate-50/50">
                          <td className="p-2.5 pl-4 font-mono font-bold text-slate-500">{st.roll}</td>
                          <td className="p-2.5 font-bold text-slate-800">{st.name}</td>
                          <td className="p-2.5 text-right pr-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${
                              st.present ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                              {st.present ? (lang === 'bn' ? 'উপস্থিত' : 'Present') : (lang === 'bn' ? 'অনুপস্থিত' : 'Absent')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    onClick={handleAttendanceSubmit}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
                  >
                    {lang === 'bn' ? 'হ্যাঁ, সাবমিট করুন' : 'Confirm & Upload Registry'}
                  </button>
                  <button 
                    onClick={() => setShowAttendanceModal(false)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center"
                  >
                    {lang === 'bn' ? 'ফিরে যান' : 'Go Back & Edit'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
