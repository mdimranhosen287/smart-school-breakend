import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  Award, 
  Wallet, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  BookOpen, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  MessageSquare, 
  Phone, 
  X, 
  Check, 
  ChevronRight, 
  Download, 
  Plus, 
  TrendingUp, 
  CalendarCheck,
  User,
  ShieldCheck,
  CreditCard,
  FileText,
  Eye,
  Sun,
  Moon,
  Mail,
  Briefcase,
  MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface GuardianDashboardProps {
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  onLogout: () => void;
}

export default function GuardianDashboard({ lang, setLang, onLogout }: GuardianDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Notice Modal
  const [activeNotice, setActiveNotice] = useState<any | null>(null);

  // Fee payment simulation states
  const [feeStatus, setFeeStatus] = useState<'unpaid' | 'paid'>('unpaid');
  const [feesDueAmount, setFeesDueAmount] = useState('2,500');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'otp' | 'success'>('select');
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');
  const [paymentPhone, setPaymentPhone] = useState('01712-345678');
  const [paymentPin, setPaymentPin] = useState('');
  const [paymentOtp, setPaymentOtp] = useState('');
  const [isPaymentSimulating, setIsPaymentSimulating] = useState(false);

  // Class Teacher Contact Modal
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState('');
  const [teacherMsgStatus, setTeacherMsgStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Attendance and Leave Application states
  const [selectedMonth, setSelectedMonth] = useState('May 2026');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('sick');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitStatus, setLeaveSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Fees invoice and filtering states
  const [feesFilter, setFeesFilter] = useState('all');
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [previewedInvoice, setPreviewedInvoice] = useState<any | null>(null);

  // Results academic year and term states
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2026');
  const [selectedExamTerm, setSelectedExamTerm] = useState('half-yearly');

  // Notice filtering, search and pagination states
  const [noticeSearchQuery, setNoticeSearchQuery] = useState('');
  const [selectedNoticeCategory, setSelectedNoticeCategory] = useState('all');
  const [noticePage, setNoticePage] = useState(1);

  // Settings states: Appearance, Guardian Profile & Extended Notification Preferences
  const [appTheme, setAppTheme] = useState<'light' | 'dark'>('light');
  const [guardianEmail, setGuardianEmail] = useState('karim.guardian@gmail.com');
  const [guardianNid, setGuardianNid] = useState('1990261456789');
  const [guardianOccupation, setGuardianOccupation] = useState(lang === 'bn' ? 'ব্যবসায়ী' : 'Business Owner');
  const [guardianAddress, setGuardianAddress] = useState(lang === 'bn' ? 'বাসা ৪২, রোড ১১, ধানমন্ডি, ঢাকা' : 'House 42, Road 11, Dhanmondi, Dhaka');
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // GPA Chart Data
  const gpaTrendData = [
    { semester: 'Summer 24', gpa: 4.25, bnSemester: 'গ্রীষ্ম ২৪' },
    { semester: 'Winter 24', gpa: 4.50, bnSemester: 'শীত ২৪' },
    { semester: 'Summer 25', gpa: 4.75, bnSemester: 'গ্রীষ্ম ২৫' },
    { semester: 'Winter 25', gpa: 4.85, bnSemester: 'শীত ২৫' },
    { semester: 'Summer 26', gpa: 5.00, bnSemester: 'গ্রীষ্ম ২৬' },
  ];

  // Notice List
  const notices = [
    {
      id: 'gn-pinned-1',
      title: lang === 'bn' ? 'জরুরি বিজ্ঞপ্তি: অর্ধ-বার্ষিক পরীক্ষার খাতা পুনঃমূল্যায়ন' : 'URGENT: Mid-Term Answer Script Re-evaluation Request',
      desc: lang === 'bn' ? 'যদি কোনো শিক্ষার্থী অর্ধ-বার্ষিক পরীক্ষার নম্বর পুনঃমূল্যায়ন করতে চায়, তবে ২৫ মে এর মধ্যে আবেদন করতে হবে।' : 'Students wishing to apply for answer script re-evaluation must submit their applications by May 25th.',
      date: '14 May, 2026',
      category: 'exam',
      isPinned: true,
      hasAttachment: true,
      attachmentName: lang === 'bn' ? 'পুনঃমূল্যায়ন আবেদন ফরম.pdf' : 'Re-evaluation_Form.pdf',
      content: lang === 'bn'
        ? 'সকল অভিভাবক ও শিক্ষার্থীদের দৃষ্টি আকর্ষণ করা যাচ্ছে যে, অর্ধ-বার্ষিক পরীক্ষার যেকোনো বিষয়ের খাতা পুনঃমূল্যায়ন বা রি-স্ক্রুটিনির জন্য আগামী ২৫ মে ২০২৬ তারিখের মধ্যে আবেদন করতে হবে। নির্ধারিত ফি পরিশোধ করে প্রশাসনিক কার্যালয় থেকে অথবা নিচে সংযুক্ত পিডিএফ ফরম ডাউনলোড করে আবেদনপত্র জমা দেওয়া যাবে।'
        : 'This is an urgent announcement for all students and guardians regarding the Mid-Term Examination. The deadline to apply for exam paper re-evaluation or scrutiny is May 25th, 2026. Application forms are available at the main administrative office or can be downloaded via the attached PDF below. A standard re-evaluation fee will apply per subject.'
    },
    {
      id: 'gn-1',
      title: lang === 'bn' ? 'গ্রীষ্মকালীন ছুটি ঘোষণা' : 'Summer vacation announcement',
      desc: lang === 'bn' ? '১ জুন থেকে ১৫ জুন পর্যন্ত গ্রীষ্মকালীন ছুটির জন্য স্কুল বন্ধ থাকবে।' : 'School will remain closed from 1 June to 15 June for summer vacation.',
      date: '20 May, 2026',
      category: 'holiday',
      hasAttachment: true,
      attachmentName: lang === 'bn' ? 'গ্রীষ্মকালীন ছুটির বাড়ির কাজ.pdf' : 'Summer_Vacation_Homework.pdf',
      content: lang === 'bn' 
        ? 'সব অভিভাবক ও শিক্ষার্থীদের জানানো যাচ্ছে যে, ১ জুন থেকে ১৫ জুন ২০২৬ পর্যন্ত গ্রীষ্মকালীন ছুটির কারণে স্কুলের সকল ক্লাস ও দাপ্তরিক কার্যক্রম বন্ধ থাকবে। ১৬ জুন ২০২৬ থেকে ক্লাস যথারীতি শুরু হবে। ছুটির সময়ে শিক্ষার্থীদের বাড়ির কাজ সম্পন্ন করার জন্য অনুরোধ করা হলো।' 
        : 'All parents and students are hereby notified that the school will remain closed from June 1st to June 15th, 2026 for summer vacation. Regular classes will resume on June 16th, 2026. Students are encouraged to complete their assigned homework during the vacation.'
    },
    {
      id: 'gn-2',
      title: lang === 'bn' ? 'অর্ধ-বার্ষিক পরীক্ষার ফলাফল প্রকাশিত' : 'Mid Term Exam result published',
      desc: lang === 'bn' ? 'অর্ধ-বার্ষিক পরীক্ষার ফলাফল এখন রেজাল্ট সেকশনে পাওয়া যাচ্ছে।' : 'Mid term examination results are now available in the results section.',
      date: '12 May, 2026',
      category: 'exam',
      hasAttachment: true,
      attachmentName: lang === 'bn' ? 'ফলাফল ও মেধা তালিকা.pdf' : 'Result_and_Merit_List.pdf',
      content: lang === 'bn' 
        ? 'অর্ধ-বার্ষিক পরীক্ষার পূর্ণাঙ্গ ফলাফল ও মার্কশিট আজ প্রকাশ করা হয়েছে। অভিভাবকগণ তাদের ড্যাশবোর্ডের রেজাল্ট সেকশন থেকে মার্কশিট দেখতে এবং ডাউনলোড করতে পারবেন। কোনো অসঙ্গতি থাকলে আগামী ৩ দিনের মধ্যে শ্রেণী শিক্ষকের সাথে যোগাযোগ করুন।' 
        : 'The complete results and marksheet of the Mid-Term Examination have been published today. Guardians can view and download the marksheet from the Results section of the portal. For any discrepancy, please contact the class teacher within 3 days.'
    },
    {
      id: 'gn-3',
      title: lang === 'bn' ? 'অভিভাবক সভা নির্ধারণ' : 'Parents meeting scheduled',
      desc: lang === 'bn' ? 'সকল অভিভাবকদের আগামী ১৮ মে সকাল ১০ টায় মিটিংয়ে উপস্থিত থাকার জন্য অনুরোধ করা হলো।' : 'All guardians are requested to attend the meeting on 18 May at 10 AM.',
      date: '08 May, 2026',
      category: 'meeting',
      content: lang === 'bn' 
        ? 'শিক্ষार्थियों একাডেমিক অগ্রগতি, শৃঙ্খলা এবং বার্ষিক বার্ষিক প্রতিযোগিতা নিয়ে আলোচনার জন্য আগামী ১৮ মে ২০২৬ সকাল ১০:০০ ঘটিকায় স্কুল অডিটোরিয়ামে অভিভাবক সভা আহ্বান করা হয়েছে। সকল অভিভাবকের উপস্থিতি একান্ত কাম্য।' 
        : 'A Parent-Teacher meeting is scheduled for May 18th, 2026 at 10:00 AM in the school auditorium to discuss academic progress, discipline, and the upcoming sports event. Your presence is highly appreciated.'
    },
    {
      id: 'gn-pinned-2',
      title: lang === 'bn' ? 'গুরুত্বপূর্ণ বিজ্ঞপ্তি: বার্ষিক ক্রীড়ার চূড়ান্ত সময়সূচী' : 'IMPORTANT: Annual Sports Day Track Schedule',
      desc: lang === 'bn' ? 'বার্ষিক ক্রীড়া প্রতিযোগিতার চূড়ান্ত সময়সূচী এবং ইভেন্ট তালিকা প্রকাশিত হয়েছে।' : 'The comprehensive track and field event schedule for Annual Sports Day has been released.',
      date: '05 May, 2026',
      category: 'sports',
      isPinned: true,
      hasAttachment: true,
      attachmentName: lang === 'bn' ? 'বার্ষিক ক্রীড়া ইভেন্ট তালিকা.pdf' : 'Sports_Event_Schedule.pdf',
      content: lang === 'bn'
        ? 'আগামী ২৫ মে অনুষ্ঠিতব্য বার্ষিক ক্রীড়া প্রতিযোগিতার বিভিন্ন ইভেন্টের চূড়ান্ত সময়সূচী এবং নিয়মাবলী প্রকাশ করা হলো। অংশগ্রহণকারী শিক্ষার্থীদের নির্ধারিত পোশাক পরিধান করে সময়মত মাঠে উপস্থিত থাকার অনুরোধ করা হলো।'
        : 'The definitive timeline and list of events for the upcoming Annual Sports Competition on May 25th has been finalized. Participating students must report to the sports complex wearing official house uniforms by 8:30 AM.'
    },
    {
      id: 'gn-4',
      title: lang === 'bn' ? 'বার্ষিক ক্রীড়া প্রতিযোগিতা' : 'Annual sports day',
      desc: lang === 'bn' ? 'বার্ষিক ক্রীড়া প্রতিযোগিতা ২৫ মে অনুষ্ঠিত হবে। শ্রেণী শিক্ষকের সাথে যোগাযোগ করে নাম নিবন্ধন করুন।' : 'Annual sports day will be held on 25 May. Register with class teacher.',
      date: '01 May, 2026',
      category: 'sports',
      content: lang === 'bn' 
        ? 'স্টুডেন্টস কেয়ার মডেল স্কুলের বার্ষিক ক্রীড়া প্রতিযোগিতা আগামী ২৫ মে ২০২৬ অনুষ্ঠিত হবে। বিভিন্ন খেলায় অংশগ্রহণে ইচ্ছুক শিক্ষার্থীদের আগামী ১০ মে এর মধ্যে নিজ নিজ শ্রেণী শিক্ষকের কাছে নাম তালিকাভুক্ত করার জন্য বলা হলো।' 
        : 'The Annual Sports Competition of Students Care Model School will take place on May 25th, 2026. Students interested in participating are requested to register their names with their class teachers by May 10th.'
    },
    {
      id: 'gn-5',
      title: lang === 'bn' ? 'ঈদ-উল-ফিতরের ছুটি ঘোষণা' : 'Eid-ul-Fitr Holiday Announcement',
      desc: lang === 'bn' ? 'ঈদ-উল-ফিতর উপলক্ষে আগামী ৫ এপ্রিল থেকে ১২ এপ্রিল পর্যন্ত স্কুল বন্ধ থাকবে।' : 'The school will remain closed from April 5th to April 12th in observance of Eid-ul-Fitr.',
      date: '25 March, 2026',
      category: 'holiday',
      content: lang === 'bn'
        ? 'পবিত্র ঈদ-উল-ফিতর উপলক্ষে আগামী ৫ এপ্রিল থেকে ১২ এপ্রিল ২০২৬ পর্যন্ত স্কুলের সকল ক্লাস ও প্রশাসনিক কার্যক্রম বন্ধ থাকবে। ১৩ এপ্রিল ২০২৬ সোমবার থেকে স্কুলের সকল কার্যক্রম পূর্বের ন্যায় সচল হবে।'
        : 'The school will observe Eid-ul-Fitr holidays from April 5th to April 12th, 2026. Regular classes and office hours will resume on Monday, April 13th, 2026. Wishing you a blessed Eid.'
    },
    {
      id: 'gn-6',
      title: lang === 'bn' ? '১ম সাময়িক পরীক্ষার সিলেবাস' : 'First Term Syllabus & Routine',
      desc: lang === 'bn' ? 'সকল শ্রেণীর ১ম সাময়িক পরীক্ষার সিলেবাস এবং রুটিন প্রকাশিত হয়েছে।' : 'Syllabus and exam routine for the First Term Examination are now available.',
      date: '10 March, 2026',
      category: 'exam',
      hasAttachment: true,
      attachmentName: lang === 'bn' ? 'পরীক্ষার সিলেবাস ও রুটিন.pdf' : 'First_Term_Syllabus.pdf',
      content: lang === 'bn'
        ? 'সকল শ্রেণীর ১ম সাময়িক পরীক্ষার পূর্ণাঙ্গ সিলেবাস এবং রুটিন আজ প্রকাশ করা হয়েছে। শিক্ষার্থীরা নিচে সংযুক্ত পিডিএফ লিংক থেকে সিলেবাসটি ডাউনলোড করে নিতে পারবে। পরীক্ষা আগামী ১ মে ২০২৬ থেকে শুরু হবে।'
        : 'The detailed syllabus and exam routine for the upcoming First Term Examination has been officially published today. Guardians can download the syllabus copy using the attached PDF below.'
    }
  ];

  // May 2026 Attendance Heatmap Data
  const calendarDays = [
    { day: 1, status: 'holiday', density: 0, label: lang === 'bn' ? '১ মে (মে দিবস)' : 'May 1 (May Day)' },
    { day: 2, status: 'weekend', density: 0, label: lang === 'bn' ? '২ মে (শুক্রবার)' : 'May 2 (Friday)' },
    { day: 3, status: 'present', density: 4, label: lang === 'bn' ? '৩ মে (১০০% উপস্থিতি)' : 'May 3 (100% Attendance)' },
    { day: 4, status: 'present', density: 4, label: lang === 'bn' ? '৪ মে (১০০% উপস্থিতি)' : 'May 4 (100% Attendance)' },
    { day: 5, status: 'present', density: 3, label: lang === 'bn' ? '৫ মে (৯৪% উপস্থিতি)' : 'May 5 (94% Attendance)' },
    { day: 6, status: 'present', density: 4, label: lang === 'bn' ? '৬ মে (১০০% উপস্থিতি)' : 'May 6 (100% Attendance)' },
    { day: 7, status: 'present', density: 3, label: lang === 'bn' ? '৭ মে (৯২% উপস্থিতি)' : 'May 7 (92% Attendance)' },
    { day: 8, status: 'present', density: 4, label: lang === 'bn' ? '৮ মে (১০০% উপস্থিতি)' : 'May 8 (100% Attendance)' },
    { day: 9, status: 'weekend', density: 0, label: lang === 'bn' ? '৯ মে (শুক্রবার)' : 'May 9 (Friday)' },
    { day: 10, status: 'present', density: 4, label: lang === 'bn' ? '১০ মে (১০০% উপস্থিতি)' : 'May 10 (100% Attendance)' },
    { day: 11, status: 'present', density: 4, label: lang === 'bn' ? '১১ মে (১০০% উপস্থিতি)' : 'May 11 (100% Attendance)' },
    { day: 12, status: 'present', density: 2, label: lang === 'bn' ? '১২ মে (৭৫% উপস্থিতি)' : 'May 12 (75% Attendance)' },
    { day: 13, status: 'present', density: 4, label: lang === 'bn' ? '১৩ মে (১০০% উপস্থিতি)' : 'May 13 (100% Attendance)' },
    { day: 14, status: 'present', density: 3, label: lang === 'bn' ? '১৪ মে (৯১% উপস্থিতি)' : 'May 14 (91% Attendance)' },
    { day: 15, status: 'present', density: 4, label: lang === 'bn' ? '১৫ মে (১০০% উপস্থিতি)' : 'May 15 (100% Attendance)' },
    { day: 16, status: 'weekend', density: 0, label: lang === 'bn' ? '১৬ মে (শুক্রবার)' : 'May 16 (Friday)' },
    { day: 17, status: 'late', density: 1, label: lang === 'bn' ? '১৭ মে (বিলম্ব আগমন)' : 'May 17 (Late Arrival)' },
    { day: 18, status: 'present', density: 4, label: lang === 'bn' ? '১৮ মে (১০০% উপস্থিতি)' : 'May 18 (100% Attendance)' },
    { day: 19, status: 'present', density: 4, label: lang === 'bn' ? '১৯ মে (১০০% উপস্থিতি)' : 'May 19 (100% Attendance)' },
    { day: 20, status: 'present', density: 3, label: lang === 'bn' ? '২০ মে (৯৫% উপস্থিতি)' : 'May 20 (95% Attendance)' },
    { day: 21, status: 'absent', density: 0, label: lang === 'bn' ? '২১ মে (অনুপস্থিত)' : 'May 21 (Absent)' },
    { day: 22, status: 'present', density: 4, label: lang === 'bn' ? '২২ মে (১০০% উপস্থিতি)' : 'May 22 (100% Attendance)' },
    { day: 23, status: 'weekend', density: 0, label: lang === 'bn' ? '২৩ মে (শুক্রবার)' : 'May 23 (Friday)' },
    { day: 24, status: 'present', density: 4, label: lang === 'bn' ? '২৪ মে (১০০% উপস্থিতি)' : 'May 24 (100% Attendance)' },
    { day: 25, status: 'present', density: 4, label: lang === 'bn' ? '২৫ মে (১০০% উপস্থিতি)' : 'May 25 (100% Attendance)' },
    { day: 26, status: 'present', density: 3, label: lang === 'bn' ? '২৬ মে (৯২% উপস্থিতি)' : 'May 26 (92% Attendance)' },
    { day: 27, status: 'present', density: 4, label: lang === 'bn' ? '২৭ মে (১০০% উপস্থিতি)' : 'May 27 (100% Attendance)' },
    { day: 28, status: 'present', density: 4, label: lang === 'bn' ? '২৮ মে (১০০% উপস্থিতি)' : 'May 28 (100% Attendance)' },
    { day: 29, status: 'present', density: 4, label: lang === 'bn' ? '২৯ মে (১০০% উপস্থিতি)' : 'May 29 (100% Attendance)' },
    { day: 30, status: 'weekend', density: 0, label: lang === 'bn' ? '৩০ মে (শুক্রবার)' : 'May 30 (Friday)' },
    { day: 31, status: 'present', density: 4, label: lang === 'bn' ? '৩১ মে (১০০% উপস্থিতি)' : 'May 31 (100% Attendance)' },
  ];

  const getMonthlyAttendance = (month: string) => {
    switch (month) {
      case 'June 2026':
        return {
          totalDays: 21,
          presentDays: 19,
          absentDays: 1,
          lateDays: 1,
          offset: 1,
          daysCount: 30,
          days: Array.from({ length: 30 }, (_, i) => {
            const d = i + 1;
            if ([5, 12, 19, 26].includes(d)) {
              return { day: d, status: 'weekend', density: 0, label: lang === 'bn' ? `${d} জুন (শুক্রবার)` : `June ${d} (Friday)` };
            }
            if (d === 10) {
              return { day: d, status: 'late', density: 1, label: lang === 'bn' ? `${d} জুন (বিলম্ব আগমন)` : `June ${d} (Late Arrival)` };
            }
            if (d === 18) {
              return { day: d, status: 'absent', density: 0, label: lang === 'bn' ? `${d} জুন (অনুপস্থিত)` : `June ${d} (Absent)` };
            }
            const density = d % 3 === 0 ? 3 : (d % 4 === 0 ? 2 : 4);
            return { day: d, status: 'present', density, label: lang === 'bn' ? `${d} জুন (${density * 25}% উপস্থিতি)` : `June ${d} (${density * 25}% Attendance)` };
          }),
          logs: [
            { date: '29 June, 2026', weekday: 'Monday', status: 'Present', checkIn: '08:15 AM', checkOut: '01:55 PM', remarks: 'Regular Arrival', remarksBn: 'নিয়মিত আগমন' },
            { date: '25 June, 2026', weekday: 'Thursday', status: 'Present', checkIn: '08:20 AM', checkOut: '02:00 PM', remarks: 'Regular Arrival', remarksBn: 'নিয়মিত আগমন' },
            { date: '18 June, 2026', weekday: 'Thursday', status: 'Absent', checkIn: '--', checkOut: '--', remarks: 'Casual Leave Approved', remarksBn: 'নৈমিত্তিক ছুটি অনুমোদিত' },
            { date: '10 June, 2026', weekday: 'Wednesday', status: 'Late', checkIn: '08:42 AM', checkOut: '01:50 PM', remarks: 'Late by 12 Minutes', remarksBn: '১২ মিনিট বিলম্ব' }
          ]
        };
      case 'April 2026':
        return {
          totalDays: 22,
          presentDays: 19,
          absentDays: 2,
          lateDays: 1,
          offset: 3,
          daysCount: 30,
          days: Array.from({ length: 30 }, (_, i) => {
            const d = i + 1;
            if ([3, 10, 17, 24].includes(d)) {
              return { day: d, status: 'weekend', density: 0, label: lang === 'bn' ? `${d} এপ্রিল (শুক্রবার)` : `April ${d} (Friday)` };
            }
            if (d === 8) {
              return { day: d, status: 'late', density: 1, label: lang === 'bn' ? `${d} এপ্রিল (বিলম্ব আগমন)` : `April ${d} (Late Arrival)` };
            }
            if ([14, 22].includes(d)) {
              return { day: d, status: 'absent', density: 0, label: lang === 'bn' ? `${d} এপ্রিল (অনুপস্থিত)` : `April ${d} (Absent)` };
            }
            const density = d % 3 === 0 ? 3 : (d % 5 === 0 ? 2 : 4);
            return { day: d, status: 'present', density, label: lang === 'bn' ? `${d} এপ্রিল (${density * 25}% উপস্থিতি)` : `April ${d} (${density * 25}% Attendance)` };
          }),
          logs: [
            { date: '28 April, 2026', weekday: 'Tuesday', status: 'Present', checkIn: '08:12 AM', checkOut: '02:02 PM', remarks: 'Regular Arrival', remarksBn: 'নিয়মিত আগমন' },
            { date: '22 April, 2026', weekday: 'Wednesday', status: 'Absent', checkIn: '--', checkOut: '--', remarks: 'Uninformed Absence', remarksBn: 'বিনা নোটিশে অনুপস্থিত' },
            { date: '14 April, 2026', weekday: 'Tuesday', status: 'Absent', checkIn: '--', checkOut: '--', remarks: 'Sick Leave Approved', remarksBn: 'অসুস্থতাজনিত ছুটি অনুমোদিত' },
            { date: '08 April, 2026', weekday: 'Wednesday', status: 'Late', checkIn: '08:38 AM', checkOut: '01:58 PM', remarks: 'Late by 8 Minutes', remarksBn: '৮ মিনিট বিলম্ব' }
          ]
        };
      case 'March 2026':
        return {
          totalDays: 23,
          presentDays: 21,
          absentDays: 1,
          lateDays: 1,
          offset: 0,
          daysCount: 31,
          days: Array.from({ length: 31 }, (_, i) => {
            const d = i + 1;
            if ([6, 13, 20, 27].includes(d)) {
              return { day: d, status: 'weekend', density: 0, label: lang === 'bn' ? `${d} মার্চ (শুক্রবার)` : `March ${d} (Friday)` };
            }
            if (d === 12) {
              return { day: d, status: 'late', density: 1, label: lang === 'bn' ? `${d} মার্চ (বিলম্ব আগমন)` : `March ${d} (Late Arrival)` };
            }
            if (d === 24) {
              return { day: d, status: 'absent', density: 0, label: lang === 'bn' ? `${d} মার্চ (অনুপস্থিত)` : `March ${d} (Absent)` };
            }
            const density = d % 3 === 0 ? 3 : (d % 4 === 0 ? 2 : 4);
            return { day: d, status: 'present', density, label: lang === 'bn' ? `${d} মার্চ (${density * 25}% উপস্থিতি)` : `March ${d} (${density * 25}% Attendance)` };
          }),
          logs: [
            { date: '30 March, 2026', weekday: 'Monday', status: 'Present', checkIn: '08:18 AM', checkOut: '01:52 PM', remarks: 'Regular Arrival', remarksBn: 'নিয়মিত আগমন' },
            { date: '24 March, 2026', weekday: 'Tuesday', status: 'Absent', checkIn: '--', checkOut: '--', remarks: 'Sick Leave Approved', remarksBn: 'অসুস্থতাজনিত ছুটি অনুমোদিত' },
            { date: '12 March, 2026', weekday: 'Thursday', status: 'Late', checkIn: '08:45 AM', checkOut: '02:05 PM', remarks: 'Late by 15 Minutes', remarksBn: '১৫ মিনিট বিলম্ব' }
          ]
        };
      case 'May 2026':
      default:
        return {
          totalDays: 24,
          presentDays: 22,
          absentDays: 1,
          lateDays: 1,
          offset: 5,
          daysCount: 31,
          days: calendarDays,
          logs: [
            { date: '31 May, 2026', weekday: 'Sunday', status: 'Present', checkIn: '08:10 AM', checkOut: '01:58 PM', remarks: 'Regular Arrival', remarksBn: 'নিয়মিত আগমন' },
            { date: '28 May, 2026', weekday: 'Thursday', status: 'Present', checkIn: '08:15 AM', checkOut: '02:00 PM', remarks: 'Regular Arrival', remarksBn: 'নিয়মিত আগমন' },
            { date: '21 May, 2026', weekday: 'Thursday', status: 'Absent', checkIn: '--', checkOut: '--', remarks: 'Sick Leave Approved', remarksBn: 'অসুস্থতাজনিত ছুটি অনুমোদিত' },
            { date: '17 May, 2026', weekday: 'Sunday', status: 'Late', checkIn: '08:42 AM', checkOut: '01:55 PM', remarks: 'Late by 12 Minutes', remarksBn: '১২ মিনিট বিলম্ব' }
          ]
        };
    }
  };

  const handleTeacherMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherMessage.trim()) return;
    setTeacherMsgStatus('sending');
    setTimeout(() => {
      setTeacherMsgStatus('success');
      setTimeout(() => {
        setTeacherMsgStatus('idle');
        setTeacherMessage('');
        setIsTeacherModalOpen(false);
      }, 2000);
    }, 1500);
  };

  const handlePaymentSimulation = () => {
    if (paymentStep === 'select') {
      if (!paymentPhone) return;
      setIsPaymentSimulating(true);
      setTimeout(() => {
        setIsPaymentSimulating(false);
        setPaymentStep('otp');
      }, 1500);
    } else if (paymentStep === 'otp') {
      if (!paymentOtp) return;
      setIsPaymentSimulating(true);
      setTimeout(() => {
        setIsPaymentSimulating(false);
        setPaymentStep('success');
        setFeeStatus('paid');
        setFeesDueAmount('0');
      }, 2000);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: lang === 'bn' ? 'সংক্ষিপ্ত তথ্য' : 'Overview', icon: GraduationCap },
    { id: 'attendance', label: lang === 'bn' ? 'উপস্থিতি খাতা' : 'Attendance', icon: CalendarCheck },
    { id: 'fees', label: lang === 'bn' ? 'আমার ফি কালেকশন' : 'My Fees', icon: Wallet },
    { id: 'results', label: lang === 'bn' ? 'পরীক্ষার ফলাফল' : 'Results', icon: Award },
    { id: 'notices', label: lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notices', icon: Bell },
    { id: 'settings', label: lang === 'bn' ? 'সেটিংস' : 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* MOBILE HEADER BAR */}
      <header className="md:hidden bg-[#025644] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-emerald-400" />
          <span className="font-black text-xs tracking-wide">
            {lang === 'bn' ? 'স্টুডেন্টস কেয়ার মডেল স্কুল' : 'Students Care Model School'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-2 py-1 rounded-lg font-bold"
          >
            {lang === 'en' ? 'বাংলা' : 'EN'}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-white/10 rounded-lg"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* LEFT SIDEBAR - Desktop view & Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 bg-[#025644] text-white w-64 z-50 transform transition-transform duration-300 md:translate-x-0 md:static shrink-0 flex flex-col justify-between ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col grow">
          {/* Brand/Logo block */}
          <div className="p-6 border-b border-teal-900/60 flex items-center gap-3">
            <div className="h-10 w-10 bg-white/10 text-emerald-400 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
              <GraduationCap className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="text-left min-w-0">
              <h4 className="font-extrabold text-white text-xs tracking-tight leading-snug">
                {lang === 'bn' ? 'স্টুডেন্টস কেয়ার মডেল স্কুল' : 'Students Care Model School'}
              </h4>
              <p className="text-[10px] text-teal-300 font-bold tracking-wider uppercase mt-0.5">
                {lang === 'bn' ? 'অভিভাবক পোর্টাল' : 'Guardian Portal'}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 grow">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                    isActive 
                      ? 'bg-teal-700/55 text-white border-l-4 border-emerald-400 shadow-md' 
                      : 'text-teal-100/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-300' : 'text-teal-200/80'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-teal-900/60">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:text-white hover:bg-rose-900/20 rounded-xl text-sm font-bold cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP NAVBAR HEADER */}
        <header className="hidden md:flex bg-white border-b border-gray-150 h-20 items-center justify-between px-8 shrink-0">
          {/* Search bar */}
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text"
              placeholder={lang === 'bn' ? 'সার্চ করুন...' : 'Search portal documents...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#025644] focus:border-transparent bg-[#F8FAFC]"
            />
          </div>

          {/* Scrolling Update Notice */}
          <div className="hidden lg:flex flex-1 mx-6 overflow-hidden relative h-10 border border-amber-100 bg-amber-50/40 rounded-xl items-center px-3.5 gap-2.5 max-w-md xl:max-w-lg">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 shadow-3xs animate-pulse">
              <span className="h-1.5 w-1.5 bg-white rounded-full" />
              <span>{lang === 'bn' ? 'জরুরি নোটিশ' : 'Urgent Notice'}</span>
            </span>
            <div className="w-full overflow-hidden relative h-5 flex items-center">
              <span className="animate-marquee absolute whitespace-nowrap text-xs font-bold text-slate-700">
                📢 {lang === 'bn' 
                  ? 'স্টুডেন্টস কেয়ার মডেল স্কুল: ২০২৬ সালের অর্ধবার্ষিক পরীক্ষার ফলাফল প্রকাশিত হয়েছে। আগামী ১৫ জুলাই অভিভাবক সভা অনুষ্ঠিত হবে।' 
                  : 'Students Care Model School: Half-Yearly Exam Results 2026 are published. Parent-Teacher meeting is scheduled for July 15th.'}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                📢 {lang === 'bn' 
                  ? 'জরুরি নোটিশ: আগামী ২০ মে থেকে ১৫ জুন পর্যন্ত গ্রীষ্মকালীন ছুটি উপলক্ষে বিদ্যালয় বন্ধ থাকবে।' 
                  : 'Urgent Notice: The school will remain closed from May 20th to June 15th for summer vacation.'}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                📢 {lang === 'bn' 
                  ? 'ভর্তি বিজ্ঞপ্তি: স্টুডেন্টস কেয়ার মডেল স্কুলে নতুন সেশনে সীমিত আসনে ভর্তি চলছে।' 
                  : 'Admission Alert: Limited seats available for admission in the upcoming session at Students Care Model School.'}
              </span>
            </div>
          </div>

          {/* Controls & Profile */}
          <div className="flex items-center gap-6">
            
            {/* Language Switcher pill in Top Header */}
            <div className="bg-slate-100 border border-slate-200 p-0.5 rounded-xl flex items-center shadow-3xs">
              <button
                onClick={() => setLang('bn')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'bn' 
                    ? 'bg-[#025644] text-white shadow-sm' 
                    : 'text-slate-500 hover:text-[#025644]'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-[#025644] text-white shadow-sm' 
                    : 'text-slate-500 hover:text-[#025644]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Notification bell */}
            <div className="relative p-2 text-slate-500 hover:text-slate-800 cursor-pointer hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </div>

            {/* Profile Avatar & Info Card */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 text-left">
              <div className="h-10 w-10 bg-emerald-50 text-[#025644] border border-emerald-150 rounded-xl flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                M
              </div>
              <div>
                <h5 className="font-extrabold text-slate-800 text-sm leading-tight">
                  {lang === 'bn' ? 'জনাব করিম' : 'Mr. Karim'}
                </h5>
                <p className="text-xs text-slate-500 font-semibold">
                  {lang === 'bn' ? 'অভিভাবক পোর্টাল' : 'Guardian'}
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* VIEW PORT CONTENT WINDOW */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]">
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                key="guardian-overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
              >
                
                {/* WELCOME BANNER COMPONENT */}
                <div className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#10B981] text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-md">
                  <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.75))]" />
                  <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 text-white font-black text-2xl shadow-lg shrink-0">
                      R
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-widest text-emerald-100 uppercase block mb-1">
                        {lang === 'bn' ? 'স্বাগতম ব্যাক' : 'WELCOME BACK'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {lang === 'bn' ? 'রাহিম আহমেদ' : 'Rahim Ahmed'}
                      </h2>
                      <p className="text-sm text-teal-50 font-bold mt-1.5">
                        {lang === 'bn' 
                          ? '৮ম শ্রেণী - শাখা এ • আইডি: ২১২৪০০১ • রোল #০৭' 
                          : 'Class 8 - Section A • Student ID: 2124001 • Roll #07'}
                      </p>
                    </div>
                  </div>
                  {/* Premium Abstract School / Educational SVG illustration */}
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:flex items-center justify-end pr-8 pointer-events-none select-none opacity-20 lg:opacity-30">
                    <svg className="w-48 h-48 text-white" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                      <path d="M60 90 L100 60 L140 90 L100 120 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />
                      <path d="M60 110 L100 140 L140 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <path d="M100 120 V170" stroke="currentColor" strokeWidth="3" />
                      <circle cx="100" cy="60" r="8" fill="currentColor" />
                      <circle cx="60" cy="90" r="6" fill="currentColor" />
                      <circle cx="140" cy="90" r="6" fill="currentColor" />
                      <path d="M150 50 L153 55 L158 56 L154 60 L155 65 L150 62 L145 65 L146 60 L142 56 L147 55 Z" fill="currentColor" fillOpacity="0.5" />
                      <path d="M40 130 L42 133 L47 134 L43 137 L44 141 L40 139 L36 141 L37 137 L33 134 L38 133 Z" fill="currentColor" fillOpacity="0.5" />
                    </svg>
                  </div>
                </div>

                {/* FOUR STAT CARDS SUMMARY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1: Attendance */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-shadow">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <CalendarCheck className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-700 font-extrabold uppercase tracking-wide">
                        {lang === 'bn' ? 'মোট উপস্থিতি' : 'Total Attendance'}
                      </p>
                      <h4 className="text-2xl font-black text-slate-800 mt-1">92%</h4>
                      <p className="text-[10px] text-emerald-900 bg-emerald-100/60 border border-emerald-200 px-2 py-0.5 rounded-md mt-1 w-fit font-black">
                        {lang === 'bn' ? 'চলতি মাস' : 'This Month'}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Position */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-shadow">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-700 font-extrabold uppercase tracking-wide">
                        {lang === 'bn' ? 'শ্রেণীতে অবস্থান' : 'Class Position'}
                      </p>
                      <h4 className="text-2xl font-black text-slate-800 mt-1">5th</h4>
                      <p className="text-[10px] text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-md mt-1 w-fit font-extrabold">
                        {lang === 'bn' ? 'মোট ৪০ জনের মধ্যে' : 'Out of 40'}
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Due Fees */}
                  <div className={`bg-white border p-5 rounded-2xl flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-all ${feeStatus === 'unpaid' ? 'border-rose-200 bg-rose-50/10' : 'border-gray-150'}`}>
                    <div className={`h-12 w-12 ${feeStatus === 'unpaid' ? 'bg-rose-100 text-rose-600 border border-rose-200 animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'} rounded-xl flex items-center justify-center shrink-0`}>
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-700 font-extrabold uppercase tracking-wide">
                        {lang === 'bn' ? 'মোট বকেয়া ফি' : 'Total Fees Due'}
                      </p>
                      <h4 className={`text-2xl font-black ${feeStatus === 'unpaid' ? 'text-rose-800' : 'text-emerald-700'} mt-1`}>
                        ৳ {feesDueAmount}
                      </h4>
                      <span className={`text-[10px] font-black border px-2 py-0.5 rounded-md mt-1 inline-block ${
                        feeStatus === 'unpaid' 
                          ? 'bg-rose-100 text-rose-950 border-rose-200' 
                          : 'bg-emerald-100/60 text-emerald-950 border-emerald-200'
                      }`}>
                        {feeStatus === 'unpaid' 
                          ? (lang === 'bn' ? '৩১ মে এর পূর্বে পরিশোধ করুন' : 'Pay Before 31 May')
                          : (lang === 'bn' ? 'পরিশোধিত' : 'Paid')
                        }
                      </span>
                    </div>
                  </div>

                  {/* Card 4: GPA */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl flex items-center gap-4 shadow-3xs hover:shadow-2xs transition-shadow">
                    <div className="h-12 w-12 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <Award className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-700 font-extrabold uppercase tracking-wide">
                        {lang === 'bn' ? 'সর্বমোট জিপিএ' : 'Overall GPA'}
                      </p>
                      <h4 className="text-2xl font-black text-slate-800 mt-1">4.25</h4>
                      <p className="text-[10px] text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md mt-1 w-fit font-black">
                        {lang === 'bn' ? '৫.০০ এর মধ্যে' : 'Out of 5.00'}
                      </p>
                    </div>
                  </div>

                </div>

                {/* TWO COLUMN GRID: NOTICE BOARD & RECENT PAYMENTS | SUBJECTS & TEACHER */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* LEFT DETAILS COLUMN */}
                  <div className="lg:col-span-8 space-y-6">

                    {/* LATEST NOTICE BOARD & PENDING HOMEWORK */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* LATEST NOTICE BOARD */}
                      <div className="md:col-span-7 bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs text-left flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-base">
                                {lang === 'bn' ? 'নোটিশ বোর্ড ও স্কুল সার্কুলার' : 'Latest School Notice Board'}
                              </h4>
                              <p className="text-[10px] text-slate-600 font-bold">
                                {lang === 'bn' ? 'জরুরী নোটিশ ও শ্রেণীভিত্তিক ঘোষণা সমূহ' : 'Critical notices and institutional communications'}
                              </p>
                            </div>
                            <span className="text-[10px] bg-teal-50 border border-teal-150 text-teal-800 font-black rounded-lg px-2 py-1 shrink-0">
                              {lang === 'bn' ? '৪টি সক্রিয়' : '4 Active'}
                            </span>
                          </div>

                          <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                            {notices.map((n) => (
                              <div 
                                key={n.id}
                                onClick={() => setActiveNotice(n)}
                                className="p-3 bg-[#F8FAFC] border border-gray-200/50 hover:border-[#025644]/40 hover:bg-white rounded-xl cursor-pointer transition-all flex items-start justify-between group"
                              >
                                <div className="space-y-1 pr-3">
                                  <span className="text-[9px] bg-teal-50 border border-teal-100 text-teal-800 font-black rounded-md px-1.5 py-0.5">
                                    {n.category.toUpperCase()}
                                  </span>
                                  <h5 className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-[#025644] transition-colors mt-1">
                                    {n.title}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 font-semibold leading-relaxed">
                                    {n.desc}
                                  </p>
                                </div>
                                <span className="text-[9px] text-slate-400 font-extrabold shrink-0 pt-1">
                                  {n.date}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* PENDING HOMEWORK */}
                      <div className="md:col-span-5 bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs text-left flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-base">
                                {lang === 'bn' ? 'বাড়ির কাজ' : 'Pending Homework'}
                              </h4>
                              <p className="text-[10px] text-slate-600 font-bold">
                                {lang === 'bn' ? 'চলতি এসাইনমেন্ট ও বাড়ির কাজ' : 'Active assignments and tasks'}
                              </p>
                            </div>
                            <span className="text-[10px] bg-rose-50 border border-rose-150 text-rose-800 font-black rounded-lg px-2 py-1 shrink-0 flex items-center gap-1 animate-pulse">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                              {lang === 'bn' ? '৩টি বাকি' : '3 Pending'}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {[
                              {
                                id: 'hw-1',
                                subject: lang === 'bn' ? 'গণিত' : 'Mathematics',
                                title: lang === 'bn' ? 'অনুশীলনী ৪.২ (প্রশ্ন ১-১০)' : 'Exercise 4.2 (Q1-10)',
                                dueDate: lang === 'bn' ? 'আগামীকাল' : 'Tomorrow',
                                isUrgent: true,
                              },
                              {
                                id: 'hw-2',
                                subject: lang === 'bn' ? 'ইংরেজি' : 'English Writing',
                                title: lang === 'bn' ? 'রচনা: "আমার শৈশব"' : 'Essay: "My Childhood"',
                                dueDate: lang === 'bn' ? '১৪ জুলাই' : '14 July',
                                isUrgent: false,
                              },
                              {
                                id: 'hw-3',
                                subject: lang === 'bn' ? 'বিজ্ঞান' : 'Science Lab',
                                title: lang === 'bn' ? 'পরিপাকতন্ত্রের চিত্রাঙ্কন' : 'Digestive system diagram',
                                dueDate: lang === 'bn' ? '১৬ জুলাই' : '16 July',
                                isUrgent: false,
                              }
                            ].map((hw) => (
                              <div key={hw.id} className="p-3 bg-[#F8FAFC] border border-gray-150/80 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-[#025644] bg-emerald-50 border border-emerald-150 font-extrabold rounded-md px-1.5 py-0.5">
                                    {hw.subject}
                                  </span>
                                  <span className={`text-[10px] font-black flex items-center gap-1 ${hw.isUrgent ? 'text-rose-700' : 'text-slate-500'}`}>
                                    {hw.isUrgent && <span className="h-1 w-1 rounded-full bg-rose-600"></span>}
                                    {lang === 'bn' ? 'শেষ তারিখ: ' : 'Due: '}{hw.dueDate}
                                  </span>
                                </div>
                                <h5 className="font-bold text-slate-800 text-xs mt-2 line-clamp-1">
                                  {hw.title}
                                </h5>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RECENT PAYMENT HISTORY */}
                    <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs text-left">
                      <div className="mb-4">
                        <h4 className="font-extrabold text-slate-800 text-lg">
                          {lang === 'bn' ? 'সাম্প্রতিক পেমেন্ট ইতিহাস' : 'Recent Payment History'}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold">
                          {lang === 'bn' ? 'সর্বশেষ ৩টি সফল অনলাইন পেমেন্ট ট্রানজেকশন' : 'Last 3 successful payments made through the portal'}
                        </p>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-gray-150/80">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-gray-150 text-slate-600 font-bold bg-[#F8FAFC]">
                              <th className="py-2.5 px-3 font-extrabold">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                              <th className="py-2.5 px-3 font-extrabold">{lang === 'bn' ? 'মাস' : 'Month'}</th>
                              <th className="py-2.5 px-3 font-extrabold">{lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Method'}</th>
                              <th className="py-2.5 px-3 font-extrabold">{lang === 'bn' ? 'ট্রানজেকশন আইডি' : 'Reference'}</th>
                              <th className="py-2.5 px-3 text-right font-extrabold">{lang === 'bn' ? 'টাকার পরিমাণ' : 'Amount'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-slate-700 font-semibold">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2.5 px-3">02 May, 2026</td>
                              <td className="py-2.5 px-3">{lang === 'bn' ? 'এপ্রিল' : 'April'}</td>
                              <td className="py-2.5 px-3">
                                <span className="bg-emerald-50 border border-emerald-150 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-black">bKash</span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-500">TXN-A1B2C3</td>
                              <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-extrabold">৳ 3,000</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2.5 px-3">04 Apr, 2026</td>
                              <td className="py-2.5 px-3">{lang === 'bn' ? 'মার্চ' : 'March'}</td>
                              <td className="py-2.5 px-3">
                                <span className="bg-teal-50 border border-teal-150 text-teal-850 px-2 py-0.5 rounded-md text-[10px] font-black">Bank</span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-500">TXN-D4E5F6</td>
                              <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-extrabold">৳ 3,000</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2.5 px-3">03 Mar, 2026</td>
                              <td className="py-2.5 px-3">{lang === 'bn' ? 'ফেব্রুয়ারি' : 'February'}</td>
                              <td className="py-2.5 px-3">
                                <span className="bg-amber-50 border border-amber-150 text-amber-805 px-2 py-0.5 rounded-md text-[10px] font-black">Card</span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-500">TXN-G7H8I9</td>
                              <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-extrabold">৳ 3,000</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT DETAILS COLUMN */}
                  <div className="lg:col-span-4 space-y-6">

                    {/* MY SUBJECTS LIST PROGRESS BAR */}
                    <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs text-left">
                      <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-base">
                            {lang === 'bn' ? 'আমার বিষয়সমূহ' : 'My Subjects'}
                          </h4>
                          <p className="text-[10px] text-slate-600 font-bold">
                            {lang === 'bn' ? 'চলতি সেমিস্টারের প্রাপ্ত নম্বর ও মূল্যায়ন' : 'Academic course performance'}
                          </p>
                        </div>
                        <span className="text-[10px] bg-emerald-50 border border-emerald-150 text-emerald-800 font-black rounded-lg px-2 py-1">
                          {lang === 'bn' ? 'গড় ৮৮.৩%' : 'Avg 88.3%'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {[
                          { sub: lang === 'bn' ? 'বাংলা' : 'Bangla', score: 85 },
                          { sub: lang === 'bn' ? 'ইংরেজি' : 'English', score: 90 },
                          { sub: lang === 'bn' ? 'গণিত' : 'Mathematics', score: 82 },
                          { sub: lang === 'bn' ? 'বিজ্ঞান' : 'Science', score: 92 },
                          { sub: lang === 'bn' ? 'ধর্ম শিক্ষা' : 'Islam & Moral', score: 80 },
                          { sub: lang === 'bn' ? 'আইসিটি' : 'ICT & Coding', score: 95 },
                        ].map((s, idx) => {
                          const barColor = s.score >= 90 ? 'bg-emerald-500' : s.score >= 80 ? 'bg-teal-500' : 'bg-indigo-500';
                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-850">{s.sub}</span>
                                <span className="font-mono text-slate-800">{s.score}/100</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-gray-200/50">
                                <div 
                                  className={`${barColor} h-full rounded-full transition-all duration-1000`}
                                  style={{ width: `${s.score}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* PERFORMANCE TREND CHART */}
                    <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs text-left">
                      <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-base">
                            {lang === 'bn' ? 'ফলাফল ইমপ্রুভমেন্ট গ্রাফ' : 'Performance Trend'}
                          </h4>
                          <p className="text-[10px] text-slate-600 font-bold">
                            {lang === 'bn' ? '১ম, অর্ধ-বার্ষিক ও ২য় সাময়িক পরীক্ষার জিপিএ' : 'GPA progress across 1st, Mid, and 2nd term'}
                          </p>
                        </div>
                        <span className="text-[10px] bg-emerald-50 border border-emerald-150 text-emerald-800 font-black rounded-lg px-2 py-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {lang === 'bn' ? 'উন্নত হচ্ছে' : 'Improving'}
                        </span>
                      </div>

                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart 
                            data={[
                              { term: '1st Term', bnTerm: '১ম সাময়িক', gpa: 4.50 },
                              { term: 'Mid Term', bnTerm: 'অর্ধ-বার্ষিক', gpa: 4.75 },
                              { term: '2nd Term', bnTerm: '২য় সাময়িক', gpa: 4.90 }
                            ]} 
                            margin={{ left: -30, right: 10, top: 10, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey={lang === 'bn' ? 'bnTerm' : 'term'} 
                              tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              domain={[4.0, 5.0]} 
                              ticks={[4.0, 4.5, 5.0]}
                              tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip 
                              content={({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-slate-900 text-white p-2.5 rounded-lg text-[11px] font-bold shadow-md border border-slate-800 text-left">
                                      <p>{payload[0].payload[lang === 'bn' ? 'bnTerm' : 'term']}</p>
                                      <p className="text-emerald-400 mt-0.5">GPA: {payload[0].value.toFixed(2)}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="gpa" 
                              stroke="#10B981" 
                              strokeWidth={3} 
                              fillOpacity={1} 
                              fill="url(#gpaGradient)"
                              dot={{ r: 4, strokeWidth: 1, fill: '#10B981', stroke: '#fff' }}
                              activeDot={{ r: 6 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* TODAY'S SCHEDULE WIDGET */}
                    <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-3xs text-left">
                      <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-base">
                            {lang === 'bn' ? 'আজকের ক্লাস রুটিন' : "Today's Class Schedule"}
                          </h4>
                          <p className="text-[10px] text-slate-600 font-bold">
                            {lang === 'bn' ? 'দৈনিক ক্লাস ও সময়সূচী' : "Today's subjects and timing"}
                          </p>
                        </div>
                        <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-800 font-black rounded-lg px-2 py-1 flex items-center gap-1 shrink-0">
                          <Clock className="h-3 w-3" />
                          {lang === 'bn' ? '৫টি সেশন' : '5 Sessions'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            time: '08:30 AM - 09:15 AM',
                            sub: lang === 'bn' ? 'গণিত' : 'Mathematics',
                            teacher: lang === 'bn' ? 'জনাব করিম উদ্দিন' : 'Mr. Karim Uddin',
                            room: 'Room 402',
                            isCurrent: false,
                          },
                          {
                            time: '09:15 AM - 10:00 AM',
                            sub: lang === 'bn' ? 'ইংরেজি' : 'English Literature',
                            teacher: lang === 'bn' ? 'মিসেস আক্তার' : 'Mrs. Akhter',
                            room: 'Room 201',
                            isCurrent: false,
                          },
                          {
                            time: '10:00 AM - 10:45 AM',
                            sub: lang === 'bn' ? 'সাধারণ বিজ্ঞান' : 'General Science',
                            teacher: lang === 'bn' ? 'জনাব রহমান' : 'Mr. Rahman',
                            room: 'Room 303',
                            isCurrent: false,
                          },
                          {
                            time: '10:45 AM - 11:15 AM',
                            sub: lang === 'bn' ? 'টিফিন ব্রেক' : 'Tiffin Break',
                            teacher: lang === 'bn' ? 'স্কুল প্লে-গ্রাউন্ড' : 'School Playground',
                            room: 'Break',
                            isBreak: true,
                          },
                          {
                            time: '11:15 AM - 12:00 PM',
                            sub: lang === 'bn' ? 'আইসিটি ও কোডিং' : 'ICT & Coding',
                            teacher: lang === 'bn' ? 'জনাব রাসেল' : 'Mr. Russel',
                            room: 'Lab 1',
                            isCurrent: true,
                          },
                        ].map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                              item.isCurrent 
                                ? 'bg-[#025644]/5 border-[#025644]/30 shadow-2xs' 
                                : item.isBreak 
                                  ? 'bg-amber-50/40 border-amber-200/60' 
                                  : 'bg-[#F8FAFC] border-gray-150 hover:border-slate-300'
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">
                              {item.isBreak ? (
                                <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center text-xs font-black">
                                  ☕
                                </div>
                              ) : (
                                <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${
                                  item.isCurrent 
                                    ? 'bg-[#025644] text-white border-transparent animate-pulse' 
                                    : 'bg-emerald-50 text-[#025644] border-emerald-150'
                                }`}>
                                  {idx + 1}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <h5 className={`text-xs font-black truncate ${item.isCurrent ? 'text-[#025644]' : 'text-slate-800'}`}>
                                  {item.sub}
                                </h5>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border shrink-0 ${
                                  item.isCurrent 
                                    ? 'bg-[#025644] text-white border-transparent' 
                                    : item.isBreak 
                                      ? 'bg-amber-100 text-amber-900 border-amber-200'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                  {item.room}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                {item.time}
                              </p>
                              <p className="text-[10px] text-slate-600 font-bold mt-1">
                                {item.teacher}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CLASS TEACHER PROFILE CARD */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs text-left">
                      <div className="border-b border-gray-150 pb-3 mb-4">
                        <h4 className="font-extrabold text-slate-800 text-base">
                          {lang === 'bn' ? 'শ্রেণী শিক্ষক' : 'Class Teacher'}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          {lang === 'bn' ? 'সরাসরি দ্রুত যোগাযোগ ও সহায়তার মাধ্যম' : 'Direct line for quick support'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-emerald-50 text-[#025644] border border-emerald-150 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-3xs">
                          KU
                        </div>
                        <div>
                          <h5 className="font-extrabold text-slate-800 text-sm leading-tight">
                            {lang === 'bn' ? 'জনাব করিম উদ্দিন' : 'Mr. Karim Uddin'}
                          </h5>
                          <p className="text-xs text-slate-500 font-semibold">
                            {lang === 'bn' ? '৮ম শ্রেণী-এ • গণিত শিক্ষক' : 'Class 8-A • Mathematics'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 font-semibold mb-4 bg-slate-50 p-3.5 rounded-xl border border-gray-150">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-[#025644]" />
                          <span>+880 1711-554433</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-[#025644]" />
                          <span>{lang === 'bn' ? 'অফিস সময়: সকাল ৯:০০ - দুপুর ২:০০' : 'Office hours: 9 AM - 2 PM'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsTeacherModalOpen(true)}
                        className="w-full py-2.5 bg-[#025644] hover:bg-[#01352a] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Class Teacher'}</span>
                      </button>
                    </div>

                  </div>

                </div>

              </motion.div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'attendance' && (() => {
              const currentAttendance = getMonthlyAttendance(selectedMonth);
              return (
                <motion.div
                  key="guardian-attendance"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6 text-left"
                >
                  {/* Overview Header with Leave Action Button */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-lg">
                        {lang === 'bn' ? 'উপস্থিতি খাতা ও পারফরম্যান্স' : 'Attendance Overview'}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {lang === 'bn' ? '২০২৬ শিক্ষাবর্ষের উপস্থিতির সম্পূর্ণ খতিয়ান' : 'Complete student presence log and stats tracker for 2026 session'}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setLeaveStartDate('');
                        setLeaveEndDate('');
                        setLeaveReason('');
                        setLeaveSubmitStatus('idle');
                        setIsLeaveModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-[#025644] hover:bg-[#01352a] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{lang === 'bn' ? 'ছুটির আবেদন করুন' : 'Apply for Leave'}</span>
                    </button>
                  </div>

                  {/* Grid stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-3xs">
                      <p className="text-xs text-slate-400 font-bold">{lang === 'bn' ? 'কার্যদিবস' : 'Total Days'}</p>
                      <h4 className="text-2xl font-black text-slate-800 mt-1">{currentAttendance.totalDays} {lang === 'bn' ? 'দিন' : 'Days'}</h4>
                    </div>
                    <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-3xs">
                      <p className="text-xs text-slate-400 font-bold">{lang === 'bn' ? 'উপস্থিত দিন' : 'Present Days'}</p>
                      <h4 className="text-2xl font-black text-emerald-700 mt-1">{currentAttendance.presentDays} {lang === 'bn' ? 'দিন' : 'Days'}</h4>
                    </div>
                    <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-3xs">
                      <p className="text-xs text-slate-400 font-bold">{lang === 'bn' ? 'অনুপস্থিত দিন' : 'Absent Days'}</p>
                      <h4 className="text-2xl font-black text-rose-600 mt-1">{currentAttendance.absentDays} {lang === 'bn' ? 'দিন' : 'Days'}</h4>
                    </div>
                    <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-3xs">
                      <p className="text-xs text-slate-400 font-bold">{lang === 'bn' ? 'বিলম্ব দিন' : 'Late Days'}</p>
                      <h4 className="text-2xl font-black text-amber-600 mt-1">{currentAttendance.lateDays} {lang === 'bn' ? 'দিন' : 'Days'}</h4>
                    </div>
                  </div>

                  {/* Calendar & Donut analysis card */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs">
                    
                    {/* Header with Month/Year select dropdown */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 pb-5 mb-6 gap-4">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-[#025644]" />
                          <span>
                            {lang === 'bn' 
                              ? `${selectedMonth === 'May 2026' ? 'মে ২০২৬' : selectedMonth === 'June 2026' ? 'জুন ২০২৬' : selectedMonth === 'April 2026' ? 'এপ্রিল ২০২৬' : 'মার্চ ২০২৬'} হাজিরা ক্যালেন্ডার`
                              : `${selectedMonth} Attendance Calendar`
                            }
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold mt-1">
                          {lang === 'bn' ? 'মনোক্রোম্যাটিক টিল স্কেলের সাহায্যে উপস্থিতি ঘনত্ব ট্র্যাকিং' : 'Monochromatic teal scale tracks daily class presence rates'}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-600 shrink-0">
                            {lang === 'bn' ? 'মাস ও বছর:' : 'Month & Year:'}
                          </span>
                          <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-white border border-gray-250 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all cursor-pointer shadow-3xs"
                          >
                            <option value="May 2026">{lang === 'bn' ? 'মে ২০২৬' : 'May 2026'}</option>
                            <option value="June 2026">{lang === 'bn' ? 'জুন ২০২৬' : 'June 2026'}</option>
                            <option value="April 2026">{lang === 'bn' ? 'এপ্রিল ২০২৬' : 'April 2026'}</option>
                            <option value="March 2026">{lang === 'bn' ? 'মার্চ ২০২৬' : 'March 2026'}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Upgraded Calendar Legend with Late (Amber) & Absent (Red) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border border-gray-150 p-3 rounded-xl mb-6 gap-3">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        {lang === 'bn' ? 'ক্যালেন্ডার কালার কোড:' : 'Calendar Color Codes:'}
                      </span>
                      <div className="flex items-center gap-3.5 flex-wrap text-[10px] font-black text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <div className="h-3.5 w-3.5 bg-gray-100 border border-gray-200 rounded-md" />
                          <span>{lang === 'bn' ? 'ছুটি / বন্ধ' : 'Weekend'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3.5 w-3.5 bg-teal-200 rounded-md" />
                          <div className="h-3.5 w-3.5 bg-teal-400 rounded-md" />
                          <div className="h-3.5 w-3.5 bg-teal-600 rounded-md" />
                          <div className="h-3.5 w-3.5 bg-[#025644] rounded-md" />
                          <span>{lang === 'bn' ? 'উপস্থিতি (ঘনত্ব স্কেল)' : 'Present (Density Scale)'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3.5 w-3.5 bg-amber-300 border border-amber-400 rounded-md" />
                          <span>{lang === 'bn' ? 'বিলম্ব (Amber)' : 'Late (Amber)'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3.5 w-3.5 bg-rose-500 rounded-md" />
                          <span>{lang === 'bn' ? 'অনুপস্থিত (Red)' : 'Absent (Red)'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Grid: Left Calendar Grid, Right Donut Analysis Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left Side: Calendar Heatmap */}
                      <div className="lg:col-span-7">
                        <div className="grid grid-cols-7 gap-2.5 max-w-lg mx-auto lg:mx-0">
                          {/* Weekly initials */}
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((val, idx) => (
                            <span key={idx} className="text-center text-xs font-black text-slate-400 py-1">{val}</span>
                          ))}

                          {/* Pre-fill for offset */}
                          {Array.from({ length: currentAttendance.offset }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="aspect-square bg-transparent" />
                          ))}

                          {currentAttendance.days.map((day) => {
                            let bgClass = 'bg-gray-100 border border-gray-200/50';
                            if (day.status === 'present') {
                              if (day.density === 4) bgClass = 'bg-[#025644] text-white shadow-xs';
                              else if (day.density === 3) bgClass = 'bg-teal-600 text-white';
                              else if (day.density === 2) bgClass = 'bg-teal-400 text-slate-900';
                              else bgClass = 'bg-teal-200 text-slate-900';
                            } else if (day.status === 'late') {
                              bgClass = 'bg-amber-300 border border-amber-400 text-slate-800';
                            } else if (day.status === 'absent') {
                              bgClass = 'bg-rose-500 text-white shadow-xs';
                            }

                            return (
                              <div
                                key={day.day}
                                title={day.label}
                                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black cursor-pointer transition-all hover:scale-110 ${bgClass}`}
                              >
                                {day.day}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Side: Recharts Donut Chart */}
                      <div className="lg:col-span-5">
                        <div className="flex flex-col items-center justify-center p-5 bg-[#F8FAFC] border border-gray-150 rounded-2xl h-full">
                          <div className="text-center mb-2">
                            <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                              {lang === 'bn' ? 'উপস্থিতির অনুপাত বিশ্লেষণ' : 'Attendance Ratio Analysis'}
                            </h5>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                              {lang === 'bn' ? 'উপস্থিতি বনাম অনুপস্থিতি অনুপাত গ্রাফ' : 'Ratio of Present vs. Absent vs. Late'}
                            </p>
                          </div>

                          <div className="h-44 w-full relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: lang === 'bn' ? 'উপস্থিতি' : 'Present', value: currentAttendance.presentDays, color: '#025644' },
                                    { name: lang === 'bn' ? 'অনুপস্থিত' : 'Absent', value: currentAttendance.absentDays, color: '#EF4444' },
                                    { name: lang === 'bn' ? 'বিলম্ব' : 'Late', value: currentAttendance.lateDays, color: '#F59E0B' }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={65}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {[
                                    { color: '#025644' }, // Present
                                    { color: '#EF4444' }, // Absent
                                    { color: '#F59E0B' }  // Late
                                  ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} ${lang === 'bn' ? 'দিন' : 'Days'}`]} />
                              </PieChart>
                            </ResponsiveContainer>
                            {/* Absolute centered percentage */}
                            <div className="absolute text-center">
                              <span className="text-xl font-black text-slate-800">
                                {Math.round((currentAttendance.presentDays / currentAttendance.totalDays) * 100)}%
                              </span>
                              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                                {lang === 'bn' ? 'উপস্থিতির হার' : 'Presence Rate'}
                              </p>
                            </div>
                          </div>

                          {/* Custom Legend */}
                          <div className="grid grid-cols-3 gap-3 w-full mt-2 border-t border-gray-150 pt-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#025644] shrink-0" />
                                <span className="text-[9px] text-slate-500 font-black">{lang === 'bn' ? 'উপস্থিতি' : 'Present'}</span>
                              </div>
                              <p className="text-sm font-black text-emerald-800 mt-1">{currentAttendance.presentDays}d</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                                <span className="text-[9px] text-slate-500 font-black">{lang === 'bn' ? 'বিলম্ব' : 'Late'}</span>
                              </div>
                              <p className="text-sm font-black text-amber-700 mt-1">{currentAttendance.lateDays}d</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
                                <span className="text-[9px] text-slate-500 font-black">{lang === 'bn' ? 'অনুপস্থিত' : 'Absent'}</span>
                              </div>
                              <p className="text-sm font-black text-rose-700 mt-1">{currentAttendance.absentDays}d</p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Upgraded Recent Presence Logs table */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs">
                    <h4 className="font-extrabold text-slate-800 text-base mb-4">
                      {lang === 'bn' ? 'সাম্প্রতিক উপস্থিতি লগ' : 'Recent Presence Logs'}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 pb-2 text-slate-400 font-extrabold">
                            <th className="pb-3 font-semibold">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                            <th className="pb-3 font-semibold">{lang === 'bn' ? 'বার' : 'Weekday'}</th>
                            <th className="pb-3 text-center font-semibold">{lang === 'bn' ? 'প্রবেশের সময়' : 'Check-in'}</th>
                            <th className="pb-3 text-center font-semibold">{lang === 'bn' ? 'প্রস্থানের সময়' : 'Check-out'}</th>
                            <th className="pb-3 text-center font-semibold">{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
                            <th className="pb-3 text-right font-semibold">{lang === 'bn' ? 'মন্তব্য' : 'Remarks'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-slate-700 font-semibold">
                          {currentAttendance.logs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3">{log.date}</td>
                              <td className="py-3">{log.weekday}</td>
                              <td className="py-3 text-center font-mono text-slate-600">{log.checkIn}</td>
                              <td className="py-3 text-center font-mono text-slate-600">{log.checkOut}</td>
                              <td className="py-3 text-center">
                                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                                  log.status === 'Present' 
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                                    : log.status === 'Absent'
                                      ? 'bg-rose-50 border-rose-100 text-rose-800'
                                      : 'bg-amber-50 border-amber-100 text-amber-800'
                                }`}>
                                  {lang === 'bn' 
                                    ? (log.status === 'Present' ? 'উপস্থিত' : log.status === 'Absent' ? 'অনুপস্থিত' : 'বিলম্ব')
                                    : log.status
                                  }
                                </span>
                              </td>
                              <td className={`py-3 text-right ${
                                log.status === 'Absent' 
                                  ? 'text-rose-600' 
                                  : log.status === 'Late' 
                                    ? 'text-amber-600' 
                                    : 'text-slate-400'
                              }`}>
                                {lang === 'bn' ? log.remarksBn : log.remarks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </motion.div>
              );
            })()}

            {/* MY FEES TAB */}
            {activeTab === 'fees' && (
              <motion.div
                key="guardian-fees"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6 text-left"
              >
                
                {/* Due Invoice Header card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg">
                      {lang === 'bn' ? 'ফি কালেকশন ও অনলাইন পেমেন্ট' : 'School Fees & Dues Ledger'}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {lang === 'bn' ? 'অনলাইনে নিরাপদ পেমেন্ট সম্পন্ন করুন এবং মানি রিসিট ডাউনলোড করুন' : 'Clear pending academic dues instantly using secure mobile billing'}
                    </p>
                  </div>
                  {feeStatus === 'unpaid' && (
                    <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setPaymentStep('select');
                          setIsPayModalOpen(true);
                        }}
                        className="px-6 py-3 bg-[#025644] hover:bg-[#01352a] text-white font-extrabold text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>{lang === 'bn' ? 'বকেয়া ফি পরিশোধ করুন' : 'Pay Pending Fees'}</span>
                      </button>
                      
                      {/* Payment partner badges for trust and UX */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                          {lang === 'bn' ? 'পেমেন্ট চ্যানেল:' : 'Payment Partners:'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 font-extrabold rounded bg-pink-50 border border-pink-200 text-pink-700">bKash</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-extrabold rounded bg-orange-50 border border-orange-200 text-orange-700">Nagad</span>
                        <span className="text-[9px] px-1.5 py-0.5 font-extrabold rounded bg-blue-50 border border-blue-200 text-blue-700">Visa</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Ledger Breakdown */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs">
                      <h4 className="font-extrabold text-slate-800 text-base mb-4">
                        {lang === 'bn' ? 'চলতি বকেয়া রসিদ' : 'Pending Invoice Details'}
                      </h4>

                      {feeStatus === 'unpaid' ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between animate-pulse">
                            <div className="space-y-0.5">
                              <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200 font-black px-2 py-0.5 rounded-md uppercase">Pending</span>
                              <h5 className="font-extrabold text-slate-800 text-sm mt-1.5">{lang === 'bn' ? 'মে ২০২৬ বেতন' : 'May 2026 Tuition Fee'}</h5>
                              <p className="text-xs text-slate-400 font-bold">INV-2026-005 • Due: 31 May, 2026</p>
                            </div>
                            <span className="font-mono font-black text-rose-700 text-lg">৳ 2,500</span>
                          </div>

                          {/* Itemized fee breakdown table grid */}
                          <div className="border border-gray-150 rounded-xl overflow-hidden mt-4">
                            <table className="w-full text-left text-xs text-slate-600">
                              <thead>
                                <tr className="bg-slate-50 border-b border-gray-150 text-slate-500 font-extrabold">
                                  <th className="p-3 font-bold">{lang === 'bn' ? 'ফি বিবরণ' : 'Fee Item Description'}</th>
                                  <th className="p-3 text-right font-bold">{lang === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 font-semibold">
                                <tr className="hover:bg-slate-50/40 transition-colors">
                                  <td className="p-3">{lang === 'bn' ? 'মাসিক টিউশন ফি' : 'Monthly Tuition Fee'}</td>
                                  <td className="p-3 text-right font-mono">৳ 2,000</td>
                                </tr>
                                <tr className="hover:bg-slate-50/40 transition-colors">
                                  <td className="p-3">{lang === 'bn' ? 'আইসিটি ল্যাব চার্জ' : 'ICT Lab Usage Charge'}</td>
                                  <td className="p-3 text-right font-mono">৳ 300</td>
                                </tr>
                                <tr className="hover:bg-slate-50/40 transition-colors">
                                  <td className="p-3">{lang === 'bn' ? 'পরীক্ষার খাতা ও স্টেশনারি' : 'Exam Sheet & Stationery'}</td>
                                  <td className="p-3 text-right font-mono">৳ 200</td>
                                </tr>
                              </tbody>
                              <tfoot>
                                <tr className="bg-[#025644]/5 font-black text-slate-800 text-sm border-t border-gray-150">
                                  <td className="p-3 font-black text-[#025644]">
                                    {lang === 'bn' ? 'সর্বমোট প্রদেয়' : 'Total Payable'}
                                  </td>
                                  <td className="p-3 text-right font-mono font-black text-[#025644] text-base">
                                    ৳ 2,500
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center space-y-3">
                          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-xs">
                            <Check className="h-6 w-6" />
                          </div>
                          <div>
                            <h5 className="font-extrabold text-slate-800 text-base">{lang === 'bn' ? 'কোনো বকেয়া পাওনা নেই!' : 'No Pending Invoices!'}</h5>
                            <p className="text-xs text-slate-500 font-semibold">{lang === 'bn' ? 'চলতি মাসের সকল ফি সফলভাবে পরিশোধিত হয়েছে।' : 'All academic and monthly tuition fees have been successfully paid.'}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Paid Ledger History */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs">
                      
                      {/* Flex container for header and Year/Status filter */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 mb-4 gap-3">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-base">
                            {lang === 'bn' ? 'পরিশোধিত রসিদ খাতা' : 'Cleared Invoices History'}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                            {lang === 'bn' ? 'পুরাতন ফি এবং পরিশোধিত চালানের তালিকা' : 'View or download older receipts and cleared transaction slips'}
                          </p>
                        </div>
                        
                        {/* Year/Status filter dropdown right above list */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                            {lang === 'bn' ? 'ফিল্টার:' : 'Filter:'}
                          </span>
                          <select
                            value={feesFilter}
                            onChange={(e) => setFeesFilter(e.target.value)}
                            className="bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 text-xs font-black rounded-lg px-2.5 py-1.5 outline-none focus:border-[#025644] cursor-pointer transition-all shadow-3xs"
                          >
                            <option value="all">{lang === 'bn' ? 'সকল চালন (All)' : 'All Invoices'}</option>
                            <option value="2026">{lang === 'bn' ? '২০২৬ সাল (Year 2026)' : 'Year 2026'}</option>
                            <option value="2025">{lang === 'bn' ? '২০২৫ সাল (Year 2025)' : 'Year 2025'}</option>
                            <option value="bkash">{lang === 'bn' ? 'বিকাশ পেমেন্ট (bKash)' : 'bKash Payments'}</option>
                            <option value="card">{lang === 'bn' ? 'কার্ড পেমেন্ট (Card)' : 'Card Payments'}</option>
                            <option value="bank">{lang === 'bn' ? 'ব্যাংক ট্রান্সফার (Bank)' : 'Bank Transfer'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(() => {
                          const clearedInvoices = [
                            { id: 'INV-2026-004', purpose: lang === 'bn' ? 'এপ্রিল ২০২৬ বেতন' : 'April 2026 Tuition Fee', amount: '৳ 3,000', date: '02 May, 2026', method: 'bKash', year: '2026', items: [
                              { item: lang === 'bn' ? 'মাসিক টিউশন ফি' : 'Monthly Tuition Fee', price: '৳ 2,000' },
                              { item: lang === 'bn' ? 'আইসিটি ল্যাব চার্জ' : 'ICT Lab Usage Charge', price: '৳ 300' },
                              { item: lang === 'bn' ? 'পরীক্ষার খাতা ও স্টেশনারি' : 'Exam Sheet & Stationery', price: '৳ 200' },
                              { item: lang === 'bn' ? 'ক্রীড়া ও সাংস্কৃতিক ফি' : 'Sports & Cultural Fee', price: '৳ 500' }
                            ]},
                            { id: 'INV-2026-003', purpose: lang === 'bn' ? 'মার্চ ২০২৬ বেতন' : 'March 2026 Tuition Fee', amount: '৳ 3,000', date: '04 Apr, 2026', method: 'Bank', year: '2026', items: [
                              { item: lang === 'bn' ? 'মাসিক টিউশন ফি' : 'Monthly Tuition Fee', price: '৳ 2,000' },
                              { item: lang === 'bn' ? 'আইসিটি ল্যাব চার্জ' : 'ICT Lab Usage Charge', price: '৳ 300' },
                              { item: lang === 'bn' ? 'পরীক্ষার খাতা ও স্টেশনারি' : 'Exam Sheet & Stationery', price: '৳ 200' },
                              { item: lang === 'bn' ? 'ক্রীড়া ও সাংস্কৃতিক ফি' : 'Sports & Cultural Fee', price: '৳ 500' }
                            ]},
                            { id: 'INV-2026-002', purpose: lang === 'bn' ? 'ফেব্রুয়ারি ২০২৬ বেতন' : 'February 2026 Tuition Fee', amount: '৳ 3,000', date: '03 Mar, 2026', method: 'Card', year: '2026', items: [
                              { item: lang === 'bn' ? 'মাসিক টিউশন ফি' : 'Monthly Tuition Fee', price: '৳ 2,000' },
                              { item: lang === 'bn' ? 'আইসিটি ল্যাব চার্জ' : 'ICT Lab Usage Charge', price: '৳ 300' },
                              { item: lang === 'bn' ? 'পরীক্ষার খাতা ও স্টেশনারি' : 'Exam Sheet & Stationery', price: '৳ 200' },
                              { item: lang === 'bn' ? 'ক্রীড়া ও সাংস্কৃতিক ফি' : 'Sports & Cultural Fee', price: '৳ 500' }
                            ]},
                            { id: 'INV-2025-012', purpose: lang === 'bn' ? 'ডিসেম্বর ২০২৫ বেতন' : 'December 2025 Tuition Fee', amount: '৳ 2,500', date: '05 Dec, 2025', method: 'bKash', year: '2025', items: [
                              { item: lang === 'bn' ? 'মাসিক টিউশন ফি' : 'Monthly Tuition Fee', price: '৳ 1,800' },
                              { item: lang === 'bn' ? 'আইসিটি ল্যাব চার্জ' : 'ICT Lab Usage Charge', price: '৳ 400' },
                              { item: lang === 'bn' ? 'পরীক্ষার খাতা ও স্টেশনারি' : 'Exam Sheet & Stationery', price: '৳ 300' }
                            ]},
                            { id: 'INV-2025-011', purpose: lang === 'bn' ? 'নভেম্বর ২০২৫ বেতন' : 'November 2025 Tuition Fee', amount: '৳ 2,500', date: '02 Nov, 2025', method: 'Card', year: '2025', items: [
                              { item: lang === 'bn' ? 'মাসিক টিউশন ফি' : 'Monthly Tuition Fee', price: '৳ 1,800' },
                              { item: lang === 'bn' ? 'আইসিটি ল্যাব চার্জ' : 'ICT Lab Usage Charge', price: '৳ 400' },
                              { item: lang === 'bn' ? 'পরীক্ষার খাতা ও স্টেশনারি' : 'Exam Sheet & Stationery', price: '৳ 300' }
                            ]}
                          ];

                          const filteredInvoices = clearedInvoices.filter((inv) => {
                            if (feesFilter === 'all') return true;
                            if (feesFilter === '2026') return inv.year === '2026';
                            if (feesFilter === '2025') return inv.year === '2025';
                            if (feesFilter === 'bkash') return inv.method.toLowerCase() === 'bkash';
                            if (feesFilter === 'card') return inv.method.toLowerCase() === 'card';
                            if (feesFilter === 'bank') return inv.method.toLowerCase() === 'bank';
                            return true;
                          });

                          if (filteredInvoices.length === 0) {
                            return (
                              <div className="py-8 text-center text-xs text-slate-400 font-bold bg-slate-50/50 border border-dashed border-gray-150 rounded-xl">
                                {lang === 'bn' ? 'কোনো পরিশোধিত চালান পাওয়া যায়নি।' : 'No matching cleared invoices found.'}
                              </div>
                            );
                          }

                          return filteredInvoices.map((inv) => (
                            <div key={inv.id} className="p-4 border border-gray-100 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-50 transition-all duration-150">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-extrabold text-slate-800">{inv.purpose}</h5>
                                  <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-black uppercase">Paid</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold">{inv.id} • Paid on: {inv.date} ({inv.method})</p>
                              </div>
                              <div className="flex items-center gap-3 justify-between sm:justify-start">
                                <span className="font-mono font-black text-slate-800">{inv.amount}</span>
                                <div className="flex items-center gap-1.5">
                                  {/* View invoice eye icon button */}
                                  <button 
                                    onClick={() => {
                                      setPreviewedInvoice(inv);
                                      setIsInvoicePreviewOpen(true);
                                    }}
                                    title={lang === 'bn' ? 'রসিদ দেখুন' : 'View Invoice'}
                                    className="p-2 border border-gray-200 hover:border-[#025644] hover:bg-emerald-50 text-slate-600 hover:text-[#025644] rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  {/* Download receipt button */}
                                  <button 
                                    onClick={() => alert(lang === 'bn' ? 'রসিদ পিডিএফ ডাউনলোড সম্পন্ন হয়েছে (সিমুলেটেড)' : 'Receipt PDF downloaded successfully (Simulated)')}
                                    title={lang === 'bn' ? 'ডাউনলোড করুন' : 'Download Receipt'}
                                    className="p-2 border border-gray-200 hover:border-[#025644] hover:bg-emerald-50 text-slate-600 hover:text-[#025644] rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                  </div>

                  {/* Payment FAQ sidebar */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs text-slate-600 text-xs font-semibold">
                      <h4 className="font-extrabold text-slate-800 text-sm border-b border-gray-100 pb-2 mb-3">
                        {lang === 'bn' ? 'অনলাইন পেমেন্ট হেল্প' : 'Secure Online Billing FAQ'}
                      </h4>
                      <ul className="space-y-3 list-disc pl-4 leading-relaxed text-slate-500">
                        <li>You can pay using bKash, Nagad, Rocket, or any Visa/Mastercard.</li>
                        <li>Receipt is generated immediately inside the cleared invoices panel.</li>
                        <li>A confirmation SMS notification will be dispatched to your registered mobile within 5 minutes.</li>
                        <li>In case of billing disputes, please contact the Accounts section during office hours.</li>
                      </ul>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && (() => {
              const getResultsForTerm = (year: string, term: string) => {
                if (year === '2026') {
                  if (term === 'half-yearly') {
                    return {
                      gpa: '5.00',
                      grade: 'A+',
                      subjects: [
                        { subject: lang === 'bn' ? 'বাংলা ভাষা ও সাহিত্য' : 'Bangla Language & Literature', marks: 88, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'ইংরেজি সাহিত্য' : 'English Literature', marks: 92, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'সাধারণ গণিত' : 'General Mathematics', marks: 95, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'উচ্চতর গণিত' : 'Higher Mathematics', marks: 89, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'পদার্থবিজ্ঞান' : 'Physics', marks: 84, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'রসায়ন' : 'Chemistry', marks: 91, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'জীববিজ্ঞান' : 'Biology', marks: 87, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'আইসিটি ও কোডিং' : 'ICT & Coding', marks: 97, grade: 'A+', maxMarks: 100 }
                      ],
                      feedbackBn: 'আহসান এই সেমিস্টারে অসাধারণ ফলাফল করেছে। গণিত ও কোডিংয়ে তার পারফরম্যান্স অত্যন্ত প্রশংসনীয়। তার এই ধারাবাহিকতা বজায় থাকবে আশা করি।',
                      feedbackEn: 'Ahsan has performed exceptionally well this term. His dedication to General Mathematics and Coding is highly commendable. Keep up the excellent work!',
                      teacherNameEn: 'Sultana Razia',
                      teacherNameBn: 'সুলতানা রাজিয়া',
                      teacherRoleEn: 'Class Teacher, Class 8 Section A',
                      teacherRoleBn: 'শ্রেণী শিক্ষক, ৮ম শ্রেণী শাখা এ'
                    };
                  } else {
                    return {
                      gpa: '4.85',
                      grade: 'A',
                      subjects: [
                        { subject: lang === 'bn' ? 'বাংলা ভাষা ও সাহিত্য' : 'Bangla Language & Literature', marks: 82, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'ইংরেজি সাহিত্য' : 'English Literature', marks: 81, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'সাধারণ গণিত' : 'General Mathematics', marks: 92, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'উচ্চতর গণিত' : 'Higher Mathematics', marks: 78, grade: 'A-', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'পদার্থবিজ্ঞান' : 'Physics', marks: 80, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'রসায়ন' : 'Chemistry', marks: 85, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'জীববিজ্ঞান' : 'Biology', marks: 88, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'আইসিটি ও কোডিং' : 'ICT & Coding', marks: 90, grade: 'A+', maxMarks: 100 }
                      ],
                      feedbackBn: 'চূড়ান্ত পরীক্ষায় আহসান বেশ ভালো করেছে। সে গণিত এবং জীববিজ্ঞানে খুব ভালো করেছে, তবে উচ্চতর গণিতে একটু মনোযোগ বাড়ানো প্রয়োজন।',
                      feedbackEn: 'Ahsan finished the final exams strong. He excelled in mathematics and biology, though higher mathematics requires a bit more focus and practice.',
                      teacherNameEn: 'Sultana Razia',
                      teacherNameBn: 'সুলতানা রাজিয়া',
                      teacherRoleEn: 'Class Teacher, Class 8 Section A',
                      teacherRoleBn: 'শ্রেণী শিক্ষক, ৮ম শ্রেণী শাখা এ'
                    };
                  }
                } else if (year === '2025') {
                  if (term === 'half-yearly') {
                    return {
                      gpa: '4.75',
                      grade: 'A',
                      subjects: [
                        { subject: lang === 'bn' ? 'বাংলা ভাষা ও সাহিত্য' : 'Bangla Language & Literature', marks: 80, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'ইংরেজি সাহিত্য' : 'English Literature', marks: 79, grade: 'A-', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'সাধারণ গণিত' : 'General Mathematics', marks: 89, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'উচ্চতর গণিত' : 'Higher Mathematics', marks: 81, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'পদার্থবিজ্ঞান' : 'Physics', marks: 76, grade: 'A-', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'রসায়ন' : 'Chemistry', marks: 83, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'জীববিজ্ঞান' : 'Biology', marks: 82, grade: 'A', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'আইসিটি ও কোডিং' : 'ICT & Coding', marks: 85, grade: 'A+', maxMarks: 100 }
                      ],
                      feedbackBn: '২০২৫ সালের অর্ধবার্ষিক পরীক্ষায় আহসানের ফলাফল সন্তোষজনক। বিজ্ঞান বিষয়ে ভালো করলেও ইংরেজি এবং পদার্থবিজ্ঞানে আরো বেশি পরিশ্রম করতে হবে।',
                      feedbackEn: 'Ahsans mid-term results for 2025 are solid. While his science performance is satisfactory, english and physics would benefit from additional revision.',
                      teacherNameEn: 'Anisur Rahman',
                      teacherNameBn: 'আনিসুর রহমান',
                      teacherRoleEn: 'Class Teacher, Class 7 Section A',
                      teacherRoleBn: 'শ্রেণী শিক্ষক, ৭ম শ্রেণী শাখা এ'
                    };
                  } else {
                    return {
                      gpa: '4.60',
                      grade: 'A-',
                      subjects: [
                        { subject: lang === 'bn' ? 'বাংলা ভাষা ও সাহিত্য' : 'Bangla Language & Literature', marks: 75, grade: 'A-', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'ইংরেজি সাহিত্য' : 'English Literature', marks: 72, grade: 'B', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'সাধারণ গণিত' : 'General Mathematics', marks: 85, grade: 'A+', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'উচ্চতর গণিত' : 'Higher Mathematics', marks: 74, grade: 'B', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'পদার্থবিজ্ঞান' : 'Physics', marks: 52, grade: 'F', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'রসায়ন' : 'Chemistry', marks: 78, grade: 'A-', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'জীববিজ্ঞান' : 'Biology', marks: 79, grade: 'A-', maxMarks: 100 },
                        { subject: lang === 'bn' ? 'আইসিটি ও কোডিং' : 'ICT & Coding', marks: 82, grade: 'A', maxMarks: 100 }
                      ],
                      feedbackBn: 'আহসান চূড়ান্ত পরীক্ষায় বেশ কিছু বিষয়ে ভালো করেছে, কিন্তু পদার্থবিজ্ঞানে অকৃতকার্য হয়েছে। তাকে পদার্থবিজ্ঞানে বিশেষ মনোযোগ দিতে হবে।',
                      feedbackEn: 'Ahsan did well in some subjects but unfortunately failed in Physics. He must pay special attention to physics conceptual clearance in the next term.',
                      teacherNameEn: 'Anisur Rahman',
                      teacherNameBn: 'আনিসুর রহমান',
                      teacherRoleEn: 'Class Teacher, Class 7 Section A',
                      teacherRoleBn: 'শ্রেণী শিক্ষক, ৭ম শ্রেণী শাখা এ'
                    };
                  }
                } else {
                  return {
                    gpa: '4.25',
                    grade: 'B',
                    subjects: [
                      { subject: lang === 'bn' ? 'বাংলা ভাষা ও সাহিত্য' : 'Bangla Language & Literature', marks: 70, grade: 'B', maxMarks: 100 },
                      { subject: lang === 'bn' ? 'ইংরেজি সাহিত্য' : 'English Literature', marks: 68, grade: 'B', maxMarks: 100 },
                      { subject: lang === 'bn' ? 'সাধারণ গণিত' : 'General Mathematics', marks: 78, grade: 'A-', maxMarks: 100 },
                      { subject: lang === 'bn' ? 'উচ্চতর গণিত' : 'Higher Mathematics', marks: 65, grade: 'B', maxMarks: 100 },
                      { subject: lang === 'bn' ? 'পদার্থবিজ্ঞান' : 'Physics', marks: 72, grade: 'B', maxMarks: 100 },
                      { subject: lang === 'bn' ? 'রসায়ন' : 'Chemistry', marks: 70, grade: 'B', maxMarks: 100 },
                      { subject: lang === 'bn' ? 'জীববিজ্ঞান' : 'Biology', marks: 74, grade: 'B', maxMarks: 100 },
                      { subject: lang === 'bn' ? 'আইসিটি ও কোডিং' : 'ICT & Coding', marks: 80, grade: 'A', maxMarks: 100 }
                    ],
                    feedbackBn: '২০২৪ সালের পারফরম্যান্সে উন্নতির অনেক জায়গা রয়েছে। নিয়মানুবর্তিতা এবং ক্লাসে নিয়মিত মনোযোগ দিলে ফলাফল আরো অনেক ভালো হবে।',
                    feedbackEn: 'There is significant room for improvement in Ahsans 2024 results. Regular attendance and better class participation will help boost his scores.',
                    teacherNameEn: 'Farhana Yasmin',
                    teacherNameBn: 'ফারহানা ইয়াসমিন',
                    teacherRoleEn: 'Class Teacher, Class 6 Section B',
                    teacherRoleBn: 'শ্রেণী শিক্ষক, ৬ষ্ঠ শ্রেণী শাখা বি'
                  };
                }
              };

              const currentData = getResultsForTerm(selectedAcademicYear, selectedExamTerm);
              const termLabelBn = selectedExamTerm === 'half-yearly' ? 'অর্ধ-বার্ষিক পরীক্ষা' : 'বার্ষিক পরীক্ষা';
              const termLabelEn = selectedExamTerm === 'half-yearly' ? 'Half-Yearly Exam' : 'Final Exam';

              return (
                <motion.div
                  key="guardian-results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6 text-left"
                >
                  
                  {/* Academic results header */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-[#1E293B] text-lg">
                        {lang === 'bn' ? `${termLabelBn} মার্কশিট (${selectedAcademicYear})` : `${termLabelEn} Marksheet (${selectedAcademicYear})`}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        {lang === 'bn' 
                          ? `মূল্যায়ন সেশন: ${selectedExamTerm === 'half-yearly' ? 'গ্রীষ্মকালীন' : 'শীতকালীন'} ${selectedAcademicYear} • শ্রেণী: ${selectedAcademicYear === '2026' ? '৮ম শাখা এ' : selectedAcademicYear === '2025' ? '৭ম শাখা এ' : '৬ষ্ঠ শাখা বি'}` 
                          : `Grading Term: ${selectedExamTerm === 'half-yearly' ? 'Summer' : 'Winter'} Session ${selectedAcademicYear} • Class ${selectedAcademicYear === '2026' ? '8 Section A' : selectedAcademicYear === '2025' ? '7 Section A' : '6 Section B'}`}
                      </p>
                    </div>
                    
                    {/* Overall badges + Download button container */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                      <div className="flex gap-2 justify-center">
                        <span className="text-xs bg-emerald-50 text-emerald-800 font-black border border-emerald-100 px-3 py-2 rounded-xl flex items-center justify-center gap-1 shadow-3xs">
                          {lang === 'bn' ? `সর্বশেষ জিপিএ: ${currentData.gpa}` : `Final GPA: ${currentData.gpa}`}
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-800 font-black border border-blue-100 px-3 py-2 rounded-xl flex items-center justify-center gap-1 shadow-3xs">
                          {lang === 'bn' ? `গ্রেড: ${currentData.grade}` : `Overall Grade: ${currentData.grade}`}
                        </span>
                      </div>

                      {/* Prominent Download PDF Report Card Button */}
                      <button
                        onClick={() => alert(lang === 'bn' ? `${termLabelBn} (${selectedAcademicYear}) এর পূর্ণাঙ্গ পিডিএফ রিপোর্ট কার্ড ডাউনলোড সম্পন্ন হয়েছে (সিমুলেটেড)!` : `Report Card PDF for ${termLabelEn} (${selectedAcademicYear}) downloaded successfully (Simulated)!`)}
                        className="px-5 py-2.5 bg-[#025644] hover:bg-[#01352a] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md shrink-0"
                      >
                        <Download className="h-4 w-4" />
                        <span>{lang === 'bn' ? 'রিপোর্ট কার্ড ডাউনলোড' : 'Download PDF Report Card'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Marksheet table card with dropdown filters */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base">
                          {lang === 'bn' ? 'বিষয়ভিত্তিক নম্বরপত্র বিবরণী' : 'Academic Subject-Wise Grades'}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          {lang === 'bn' ? 'ফলাফল ফিল্টার করতে ডানদিকের ড্রপডাউনগুলো ব্যবহার করুন' : 'Change filters to review performance across different sessions and years'}
                        </p>
                      </div>

                      {/* Dropdown filters at the top right of the marksheet card */}
                      <div className="flex flex-row items-center gap-2 shrink-0">
                        <div className="flex flex-col gap-0.5 text-left">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                            {lang === 'bn' ? 'শিক্ষাবর্ষ:' : 'Academic Year:'}
                          </label>
                          <select
                            value={selectedAcademicYear}
                            onChange={(e) => setSelectedAcademicYear(e.target.value)}
                            className="bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 text-xs font-black rounded-lg px-2.5 py-1.5 outline-none focus:border-[#025644] cursor-pointer transition-all shadow-3xs"
                          >
                            <option value="2026">{lang === 'bn' ? '২০২৬ সাল' : 'Year 2026'}</option>
                            <option value="2025">{lang === 'bn' ? '২০২৫ সাল' : 'Year 2025'}</option>
                            <option value="2024">{lang === 'bn' ? '২০২৪ সাল' : 'Year 2024'}</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-0.5 text-left">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                            {lang === 'bn' ? 'পরীক্ষার টার্ম:' : 'Exam Term:'}
                          </label>
                          <select
                            value={selectedExamTerm}
                            onChange={(e) => setSelectedExamTerm(e.target.value)}
                            className="bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 text-xs font-black rounded-lg px-2.5 py-1.5 outline-none focus:border-[#025644] cursor-pointer transition-all shadow-3xs"
                          >
                            <option value="half-yearly">{lang === 'bn' ? 'অর্ধ-বার্ষিক পরীক্ষা' : 'Half-Yearly'}</option>
                            <option value="final">{lang === 'bn' ? 'বার্ষিক পরীক্ষা (Final)' : 'Final Exam'}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-slate-400 font-bold bg-[#F8FAFC]">
                            <th className="py-3 px-4 font-semibold">{lang === 'bn' ? 'বিষয় ও কোর্স' : 'Subject Course'}</th>
                            <th className="py-3 px-4 text-center font-semibold">{lang === 'bn' ? 'প্রাপ্ত নম্বর' : 'Obtained Marks'}</th>
                            <th className="py-3 px-4 text-center font-semibold">{lang === 'bn' ? 'লেটার গ্রেড' : 'Letter Grade'}</th>
                            <th className="py-3 px-4 text-center font-semibold">{lang === 'bn' ? 'সর্বোচ্চ নম্বর' : 'Max Cap'}</th>
                            <th className="py-3 px-4 text-right font-semibold">{lang === 'bn' ? 'মন্তব্য' : 'Remarks'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[#1E293B] font-extrabold">
                          {currentData.subjects.map((res) => (
                            <tr key={res.subject} className="hover:bg-gray-50/50 transition-colors">
                              {/* Enhanced typography: font weight and highly readable dark slate color (#1E293B) */}
                              <td className="py-4 px-4 font-extrabold text-[#1E293B]">{res.subject}</td>
                              <td className="py-4 px-4 text-center font-mono font-extrabold text-[#1E293B]">{res.marks}</td>
                              <td className="py-4 px-4 text-center">
                                {/* Differentiate letter grade badges with subtle color coding */}
                                {(() => {
                                  let badgeStyle = '';
                                  if (res.grade === 'A+') {
                                    badgeStyle = 'bg-emerald-600 border-emerald-700 text-white shadow-3xs';
                                  } else if (res.grade === 'A') {
                                    badgeStyle = 'bg-teal-600 border-teal-700 text-white shadow-3xs';
                                  } else if (res.grade === 'A-') {
                                    badgeStyle = 'bg-cyan-50 border-cyan-200 text-cyan-800';
                                  } else if (res.grade === 'B' || res.grade === 'C') {
                                    badgeStyle = 'bg-amber-50 border-amber-200 text-amber-800';
                                  } else if (res.grade === 'F' || res.grade === 'Fail') {
                                    badgeStyle = 'bg-rose-600 border-rose-700 text-white font-extrabold shadow-3xs animate-pulse';
                                  } else {
                                    badgeStyle = 'bg-slate-100 border-slate-200 text-slate-700';
                                  }
                                  return (
                                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-extrabold border ${badgeStyle}`}>
                                      {res.grade}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="py-4 px-4 text-center font-mono text-slate-400 font-bold">{res.maxMarks}</td>
                              <td className="py-4 px-4 text-right text-xs text-[#025644] font-bold">
                                {res.marks >= 90 ? (lang === 'bn' ? 'অসাধারণ' : 'Outstanding') : res.marks >= 80 ? (lang === 'bn' ? 'চমৎকার' : 'Excellent') : (lang === 'bn' ? 'সন্তোষজনক' : 'Satisfactory')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recharts long gpa graph */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
                      <div>
                        <h5 className="font-extrabold text-[#025644] text-base">
                          {lang === 'bn' ? 'গ্রেড বা জিপিএ উন্নতির চিত্র' : 'Academic GPA Improvement Trend'}
                        </h5>
                        <p className="text-xs text-slate-500 font-semibold">
                          {lang === 'bn' ? 'বিগত ৫ সেমিস্টারের জিপিএ (GPA) ভিত্তিক তুলনা চিত্র' : 'Comparative GPA improvement tracking over the last 5 semesters'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-[#025644]/5 text-[#025644] border border-[#025644]/10 rounded-xl px-3 py-1.5 self-start md:self-auto text-xs font-extrabold">
                        <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
                        <span>{lang === 'bn' ? '+১৭.৬% ধারাবাহিক উন্নতি' : '+17.6% Consistent Progress'}</span>
                      </div>
                    </div>

                    <div className="w-full h-72 bg-[#F8FAFC]/50 rounded-2xl border border-gray-100 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gpaTrendData} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey={lang === 'bn' ? 'bnSemester' : 'semester'} 
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            domain={[4.0, 5.05]} 
                            ticks={[4.0, 4.2, 4.4, 4.6, 4.8, 5.0]}
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip 
                            content={({ active, payload }: any) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-[#0f172a] text-white p-3 rounded-xl border border-slate-700 shadow-lg text-xs font-semibold">
                                    <p className="font-extrabold">{lang === 'bn' ? payload[0].payload.bnSemester : payload[0].payload.semester}</p>
                                    <p className="text-emerald-400 mt-1">
                                      {lang === 'bn' ? 'প্রাপ্ত জিপিএ' : 'Earned GPA'}: <span className="font-mono text-sm font-black">{payload[0].value.toFixed(2)}</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="gpa" 
                            stroke="#025644" 
                            strokeWidth={3} 
                            dot={{ fill: '#025644', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                            activeDot={{ r: 7, strokeWidth: 0, fill: '#f59e0b' }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Teacher's Feedback & Comments Card */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                      <MessageSquare className="h-5 w-5 text-[#025644]" />
                      <div>
                        <h5 className="font-extrabold text-[#1E293B] text-base">
                          {lang === 'bn' ? 'শ্রেণী শিক্ষকের মন্তব্য ও ফিডব্যাক' : "Teacher's Feedback & Comments"}
                        </h5>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          {lang === 'bn' ? 'শিক্ষার্থীর একাডেমিক পারফরম্যান্স এবং আচরণ সম্পর্কে শ্রেণী শিক্ষকের সামগ্রিক মন্তব্য' : "Class teacher's overall remarks and suggestions on the student's performance"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-slate-50/50 border border-gray-150 p-4 rounded-xl">
                      {/* Teacher Profile */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="h-12 w-12 rounded-full bg-[#025644]/10 text-[#025644] font-black text-sm flex items-center justify-center border border-[#025644]/20">
                          {selectedAcademicYear === '2026' ? 'SR' : selectedAcademicYear === '2025' ? 'AR' : 'FY'}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1E293B] text-sm leading-snug">
                            {lang === 'bn' ? currentData.teacherNameBn : currentData.teacherNameEn}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            {lang === 'bn' ? currentData.teacherRoleBn : currentData.teacherRoleEn}
                          </p>
                        </div>
                      </div>

                      {/* Comment body */}
                      <div className="md:border-l border-gray-200 md:pl-5 md:ml-2 flex-1">
                        <p className="text-xs text-[#1E293B] font-semibold italic leading-relaxed">
                          "{lang === 'bn' ? currentData.feedbackBn : currentData.feedbackEn}"
                        </p>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {lang === 'bn' ? 'প্রকাশের তারিখ:' : 'Released Date:'} <span className="font-mono">{selectedExamTerm === 'half-yearly' ? `15 May, ${selectedAcademicYear}` : `18 Dec, ${selectedAcademicYear}`}</span>
                          </span>
                          
                          <div className="flex items-center gap-1.5 bg-[#025644]/5 text-[#025644] border border-[#025644]/10 rounded-lg px-2.5 py-1 text-[10px] font-black">
                            <CheckCircle2 className="h-3 w-3 text-[#025644]" />
                            <span>{lang === 'bn' ? 'অভিভাবক কর্তৃক পঠিত' : 'Acknowledged by Parent'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })()}

            {/* NOTICES TAB */}
            {activeTab === 'notices' && (
              <motion.div
                key="guardian-notices"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6 text-left"
              >
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg">
                      {lang === 'bn' ? 'নোটিশ বোর্ড ও নির্দেশনা' : 'School Notices & Announcements'}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      {lang === 'bn' ? 'সব নোটিশ ও জরুরি ঘোষণাগুলোর বিস্তারিত বিবরণ' : 'Full archive of general notice lists, academic events and urgent updates'}
                    </p>
                  </div>
                </div>

                {(() => {
                  const filtered = notices.filter((n) => {
                    // Category filter
                    if (selectedNoticeCategory !== 'all') {
                      if (selectedNoticeCategory === 'exam' && n.category !== 'exam') return false;
                      if (selectedNoticeCategory === 'holiday' && n.category !== 'holiday') return false;
                      if (selectedNoticeCategory === 'meeting' && n.category !== 'meeting') return false;
                    }
                    
                    // Search filter
                    if (noticeSearchQuery.trim()) {
                      const query = noticeSearchQuery.toLowerCase();
                      const titleMatch = n.title.toLowerCase().includes(query);
                      const descMatch = n.desc.toLowerCase().includes(query);
                      const contentMatch = n.content.toLowerCase().includes(query);
                      return titleMatch || descMatch || contentMatch;
                    }
                    return true;
                  });

                  // Sort: Pinned/Urgent notices anchored at the top
                  const sorted = [...filtered].sort((a, b) => {
                    const aPinned = a.isPinned || false;
                    const bPinned = b.isPinned || false;
                    if (aPinned && !bPinned) return -1;
                    if (!aPinned && bPinned) return 1;
                    return 0;
                  });

                  const noticesPerPage = 4;
                  const totalPages = Math.ceil(sorted.length / noticesPerPage);
                  const startIndex = (noticePage - 1) * noticesPerPage;
                  const paginatedNotices = sorted.slice(startIndex, startIndex + noticesPerPage);

                  return (
                    <div className="space-y-6">
                      {/* Search & Category Filter Row */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                          {/* Categories List */}
                          <div className="flex flex-wrap gap-1.5 order-2 md:order-1">
                            {[
                              { id: 'all', labelEn: 'All Notices', labelBn: 'সকল নোটিশ' },
                              { id: 'exam', labelEn: 'Exams', labelBn: 'পরীক্ষা' },
                              { id: 'holiday', labelEn: 'Holidays', labelBn: 'ছুটি' },
                              { id: 'meeting', labelEn: 'Meetings', labelBn: 'মিটিং' }
                            ].map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  setSelectedNoticeCategory(cat.id);
                                  setNoticePage(1);
                                }}
                                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                                  selectedNoticeCategory === cat.id
                                    ? 'bg-[#025644] text-white shadow-3xs'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-150'
                                }`}
                              >
                                {lang === 'bn' ? cat.labelBn : cat.labelEn}
                              </button>
                            ))}
                          </div>

                          {/* Search bar */}
                          <div className="relative flex-1 max-w-md order-1 md:order-2">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder={lang === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices...'}
                              value={noticeSearchQuery}
                              onChange={(e) => {
                                setNoticeSearchQuery(e.target.value);
                                setNoticePage(1);
                              }}
                              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#025644] focus:bg-white transition-all shadow-3xs"
                            />
                            {noticeSearchQuery && (
                              <button
                                onClick={() => {
                                  setNoticeSearchQuery('');
                                  setNoticePage(1);
                                }}
                                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                              >
                                {lang === 'bn' ? 'মুছুন' : 'Clear'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Notices Grid */}
                      {paginatedNotices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {paginatedNotices.map((n) => {
                            const isPinned = n.isPinned || false;
                            return (
                              <div 
                                key={n.id}
                                onClick={() => setActiveNotice(n)}
                                className={`p-5 bg-white border rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-56 text-left hover:shadow-xs ${
                                  isPinned
                                    ? 'border-rose-200 bg-rose-50/10 shadow-3xs hover:border-rose-300'
                                    : 'border-gray-100 hover:border-[#025644]/40'
                                }`}
                              >
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {/* Category badge */}
                                      <span className={`text-[9px] font-black rounded-md px-2 py-0.5 uppercase tracking-wider ${
                                        n.category === 'exam' 
                                          ? 'bg-amber-50 border border-amber-100 text-amber-800' 
                                          : n.category === 'holiday' 
                                            ? 'bg-sky-50 border border-sky-100 text-sky-800' 
                                            : n.category === 'meeting' 
                                              ? 'bg-purple-50 border border-purple-100 text-purple-800' 
                                              : 'bg-teal-50 border border-teal-100 text-teal-800'
                                      }`}>
                                        {n.category === 'exam' ? (lang === 'bn' ? 'পরীক্ষা' : 'EXAM') :
                                         n.category === 'holiday' ? (lang === 'bn' ? 'ছুটি' : 'HOLIDAY') :
                                         n.category === 'meeting' ? (lang === 'bn' ? 'মিটিং' : 'MEETING') :
                                         (lang === 'bn' ? 'খেলাধুলা' : 'SPORTS')}
                                      </span>

                                      {/* Pinned / Urgent Badges */}
                                      {isPinned && (
                                        <span className="text-[9px] bg-rose-50 border border-rose-200 text-rose-700 font-black rounded-md px-2 py-0.5 uppercase flex items-center gap-0.5 animate-pulse">
                                          <AlertCircle className="h-2.5 w-2.5 text-rose-500 shrink-0" />
                                          {lang === 'bn' ? 'গুরুত্বপূর্ণ' : 'URGENT'}
                                        </span>
                                      )}
                                    </div>

                                    {/* Attachment / Download PDF Link */}
                                    {n.hasAttachment && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          alert(lang === 'bn' ? `"${n.attachmentName}" ডাউনলোড সম্পন্ন হয়েছে (সিমুলেটেড)!` : `Document "${n.attachmentName}" downloaded successfully (Simulated)!`);
                                        }}
                                        title={n.attachmentName}
                                        className="p-1.5 bg-slate-50 hover:bg-[#025644]/10 border border-slate-200 text-slate-500 hover:text-[#025644] rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-3xs"
                                      >
                                        <FileText className="h-3.5 w-3.5" />
                                        <Download className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>

                                  <h5 className="font-extrabold text-slate-800 text-base line-clamp-1 leading-snug">
                                    {n.title}
                                  </h5>
                                  <p className="text-xs text-slate-500 font-semibold line-clamp-2 overflow-hidden text-ellipsis leading-relaxed">
                                    {n.desc}
                                  </p>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3 text-[11px] font-bold text-slate-400">
                                  <span>{n.date}</span>
                                  <span className="text-[#025644] font-black hover:underline flex items-center gap-1">
                                    {lang === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read details'}
                                    <ChevronRight className="h-3 w-3" />
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Empty state */
                        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-3xs space-y-3">
                          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
                          <h5 className="font-extrabold text-slate-700 text-base">
                            {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি' : 'No Notices Found'}
                          </h5>
                          <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
                            {lang === 'bn' 
                              ? 'আপনার দেওয়া অনুসন্ধান বা ফিল্টার অনুযায়ী কোনো নোটিশ খুঁজে পাওয়া যায়নি। অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে চেষ্টা করুন।' 
                              : 'We could not find any notices matching your search query or selected category filter. Try clearing filters or using different keywords.'}
                          </p>
                          <button
                            onClick={() => {
                              setNoticeSearchQuery('');
                              setSelectedNoticeCategory('all');
                              setNoticePage(1);
                            }}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                          >
                            {lang === 'bn' ? 'রিসেট করুন' : 'Reset Filters'}
                          </button>
                        </div>
                      )}

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                          <button
                            disabled={noticePage === 1}
                            onClick={() => setNoticePage(prev => Math.max(prev - 1, 1))}
                            className="px-3 py-1.5 bg-white border border-gray-200 text-slate-600 font-extrabold text-xs rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer transition-all flex items-center gap-1 shadow-3xs"
                          >
                            {lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                              key={p}
                              onClick={() => setNoticePage(p)}
                              className={`h-8 w-8 text-xs font-black rounded-lg transition-all cursor-pointer ${
                                noticePage === p
                                  ? 'bg-[#025644] text-white shadow-3xs'
                                  : 'bg-white border border-gray-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {lang === 'bn' ? p.toLocaleString('bn-BD') : p}
                            </button>
                          ))}

                          <button
                            disabled={noticePage === totalPages}
                            onClick={() => setNoticePage(prev => Math.min(prev + 1, totalPages))}
                            className="px-3 py-1.5 bg-white border border-gray-200 text-slate-600 font-extrabold text-xs rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white cursor-pointer transition-all flex items-center gap-1 shadow-3xs"
                          >
                            {lang === 'bn' ? 'পরবর্তী' : 'Next'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div
                key="guardian-settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6 text-left animate-in fade-in-30"
              >
                <div className={`border rounded-2xl p-6 shadow-3xs transition-all duration-300 ${
                  appTheme === 'dark' 
                    ? 'bg-slate-900 border-slate-800 text-white' 
                    : 'bg-white border-gray-100 text-slate-800'
                }`}>
                  <div>
                    <h4 className={`font-extrabold text-lg ${appTheme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      {lang === 'bn' ? 'পোর্টাল সেটিংস ও কাস্টমাইজেশন' : 'Portal Preferences & Profile'}
                    </h4>
                    <p className={`text-xs font-semibold ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {lang === 'bn' ? 'আপনার প্রোফাইল, বিজ্ঞপ্তি পছন্দ এবং পাসওয়ার্ড কাস্টমাইজ করুন' : 'Manage your notification channels, personal details, and security credentials'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column: Theme selector and Notification Preferences */}
                  <div className="space-y-6">
                    {/* Appearance & Theme Selector */}
                    <div className={`border rounded-2xl p-6 shadow-3xs space-y-4 transition-all duration-300 ${
                      appTheme === 'dark' 
                        ? 'bg-slate-900 border-slate-800 text-slate-100' 
                        : 'bg-white border-gray-100 text-slate-800'
                    }`}>
                      <h5 className={`font-extrabold text-sm border-b pb-2 flex items-center gap-2 ${
                        appTheme === 'dark' ? 'border-slate-800 text-white' : 'border-gray-150 text-slate-800'
                      }`}>
                        <Sun className="h-4 w-4 text-[#025644]" />
                        <span>{lang === 'bn' ? 'থিম / ডিসপ্লে মোড' : 'Appearance / Theme Selector'}</span>
                      </h5>
                      <p className={`text-xs font-semibold ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {lang === 'bn' 
                          ? 'আপনার সুবিধার জন্য পোর্টালের রঙ পরিবর্তন করুন' 
                          : 'Toggle between clean light mode and optimized dark mode.'}
                      </p>
                      
                      <div className={`flex rounded-xl p-1 gap-1 w-full border ${
                        appTheme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/50'
                      }`}>
                        <button
                          type="button"
                          onClick={() => setAppTheme('light')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
                            appTheme === 'light'
                              ? 'bg-[#025644] text-white shadow-xs'
                              : appTheme === 'dark'
                                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                          }`}
                        >
                          <Sun className="h-4 w-4" />
                          <span>{lang === 'bn' ? 'লাইট মোড' : 'Light Mode'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppTheme('dark')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
                            appTheme === 'dark'
                              ? 'bg-[#025644] text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Moon className="h-4 w-4" />
                          <span>{lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Notification Preferences Card */}
                    <div className={`border rounded-2xl p-6 shadow-3xs space-y-4 transition-all duration-300 ${
                      appTheme === 'dark' 
                        ? 'bg-slate-900 border-slate-800 text-slate-100' 
                        : 'bg-white border-gray-100 text-slate-800'
                    }`}>
                      <h5 className={`font-extrabold text-sm border-b pb-2 flex items-center gap-2 ${
                        appTheme === 'dark' ? 'border-slate-800 text-white' : 'border-gray-150 text-slate-800'
                      }`}>
                        <Bell className="h-4 w-4 text-[#025644]" />
                        <span>{lang === 'bn' ? 'বিজ্ঞপ্তি অগ্রাধিকার সেটিংস' : 'Notification Preferences'}</span>
                      </h5>
                      
                      <div className="space-y-4 text-xs font-semibold">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                              {lang === 'bn' ? 'রেজিস্ট্রেশন মোবাইল নম্বর' : 'Primary Registered Phone'}
                            </label>
                            <input 
                              type="text" 
                              defaultValue="+880 1712-987654" 
                              className={`w-full px-3.5 py-2.5 rounded-xl font-bold ${
                                appTheme === 'dark' 
                                  ? 'bg-slate-950 border-slate-800 text-slate-200' 
                                  : 'bg-slate-50 border-gray-200 text-slate-800'
                              }`}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                              {lang === 'bn' ? 'বিকল্প মোবাইল নম্বর' : 'Secondary Alert Phone'}
                            </label>
                            <input 
                              type="text" 
                              placeholder="Provide optional backup phone..." 
                              className={`w-full px-3.5 py-2.5 rounded-xl ${
                                appTheme === 'dark' 
                                  ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-700' 
                                  : 'bg-white border-gray-200 text-slate-850'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Toggles List */}
                        <div className={`space-y-3 pt-3.5 border-t ${appTheme === 'dark' ? 'border-slate-800/85' : 'border-gray-100'}`}>
                          <span className={`text-[10px] uppercase font-black tracking-wider block ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {lang === 'bn' ? 'বিজ্ঞপ্তি চ্যানেলসমূহ' : 'Broadcasting Channels'}
                          </span>

                          {/* SMS Toggle */}
                          <div className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                            appTheme === 'dark' ? 'bg-slate-950/40 hover:bg-slate-950/60' : 'bg-slate-50/50 hover:bg-slate-50'
                          }`}>
                            <div className="space-y-0.5">
                              <p className={`text-xs font-extrabold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                {lang === 'bn' ? 'এসএমএস ব্রডকাস্ট' : 'SMS Alert Broadcast'}
                              </p>
                              <p className={`text-[10px] font-semibold ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {lang === 'bn' ? 'দৈনিক অনুপস্থিতি ও ফলাফলের মোবাইল এসএমএস' : 'Opt-in for instant daily absence & grading SMS alerts'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSmsAlerts(!smsAlerts)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                smsAlerts ? 'bg-[#025644]' : 'bg-slate-200 dark:bg-slate-800'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  smsAlerts ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Email Toggle */}
                          <div className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                            appTheme === 'dark' ? 'bg-slate-950/40 hover:bg-slate-950/60' : 'bg-slate-50/50 hover:bg-slate-50'
                          }`}>
                            <div className="space-y-0.5">
                              <p className={`text-xs font-extrabold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                {lang === 'bn' ? 'ইমেইল আপডেট' : 'Email Updates'}
                              </p>
                              <p className={`text-[10px] font-semibold ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {lang === 'bn' ? 'রিপোর্ট কার্ড ও ফি রসিদ সংস্করণ ইমেইলে পান' : 'Receive report cards & invoice receipts via email'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEmailUpdates(!emailUpdates)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                emailUpdates ? 'bg-[#025644]' : 'bg-slate-200 dark:bg-slate-800'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  emailUpdates ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Push Notification Toggle */}
                          <div className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                            appTheme === 'dark' ? 'bg-slate-950/40 hover:bg-slate-950/60' : 'bg-slate-50/50 hover:bg-slate-50'
                          }`}>
                            <div className="space-y-0.5">
                              <p className={`text-xs font-extrabold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                {lang === 'bn' ? 'পুশ নোটিফিকেশন' : 'Push Notifications'}
                              </p>
                              <p className={`text-[10px] font-semibold ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {lang === 'bn' ? 'নতুন নোটিশ প্রকাশের রিয়েল-টাইম পুশ নোটিফিকেশন' : 'Receive real-time push alerts on announcements inside the portal'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPushNotifications(!pushNotifications)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                pushNotifications ? 'bg-[#025644]' : 'bg-slate-200 dark:bg-slate-800'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  pushNotifications ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => alert(lang === 'bn' ? 'বিজ্ঞপ্তি অগ্রাধিকার সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Notification preferences saved successfully!')}
                          className="w-full py-2.5 px-4 bg-[#025644] hover:bg-[#01352a] text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-3xs"
                        >
                          {lang === 'bn' ? 'অগ্রাধিকার সংরক্ষণ করুন' : 'Save Preferences'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Guardian Profile Details and Security Credentials */}
                  <div className="space-y-6">
                    {/* Guardian Profile Details Card */}
                    <div className={`border rounded-2xl p-6 shadow-3xs space-y-4 transition-all duration-300 ${
                      appTheme === 'dark' 
                        ? 'bg-slate-900 border-slate-800 text-slate-100' 
                        : 'bg-white border-gray-100 text-slate-800'
                    }`}>
                      <h5 className={`font-extrabold text-sm border-b pb-2 flex items-center gap-2 ${
                        appTheme === 'dark' ? 'border-slate-800 text-white' : 'border-gray-150 text-slate-800'
                      }`}>
                        <User className="h-4 w-4 text-[#025644]" />
                        <span>{lang === 'bn' ? 'অভিভাবকের প্রোফাইল বিবরণী' : 'Guardian Profile Details'}</span>
                      </h5>

                      <div className="space-y-3.5 text-xs font-semibold">
                        {/* Email Address */}
                        <div className="space-y-1.5">
                          <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                            {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                            <input 
                              type="email" 
                              value={guardianEmail}
                              onChange={(e) => setGuardianEmail(e.target.value)}
                              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl font-bold ${
                                appTheme === 'dark' 
                                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:outline-none focus:border-[#025644]' 
                                  : 'bg-slate-50 border-gray-200 text-slate-800 focus:outline-[#025644]'
                              }`}
                            />
                          </div>
                        </div>

                        {/* NID / Passport */}
                        <div className="space-y-1.5">
                          <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                            {lang === 'bn' ? 'এনআইডি / পাসপোর্ট নম্বর' : 'NID / Passport Number'}
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                            <input 
                              type="text" 
                              value={guardianNid}
                              onChange={(e) => setGuardianNid(e.target.value)}
                              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl font-bold font-mono ${
                                appTheme === 'dark' 
                                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:outline-none focus:border-[#025644]' 
                                  : 'bg-slate-50 border-gray-200 text-slate-800 focus:outline-[#025644]'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Occupation & Address */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                              {lang === 'bn' ? 'পেশা' : 'Occupation'}
                            </label>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                              <input 
                                type="text" 
                                value={guardianOccupation}
                                onChange={(e) => setGuardianOccupation(e.target.value)}
                                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl font-bold ${
                                  appTheme === 'dark' 
                                    ? 'bg-slate-950 border-slate-800 text-slate-200 focus:outline-none focus:border-[#025644]' 
                                    : 'bg-slate-50 border-gray-200 text-slate-800 focus:outline-[#025644]'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                              {lang === 'bn' ? 'আবাসিক ঠিকানা' : 'Address'}
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                              <input 
                                type="text" 
                                value={guardianAddress}
                                onChange={(e) => setGuardianAddress(e.target.value)}
                                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl font-bold ${
                                  appTheme === 'dark' 
                                    ? 'bg-slate-950 border-slate-800 text-slate-200 focus:outline-none focus:border-[#025644]' 
                                    : 'bg-slate-50 border-gray-200 text-slate-800 focus:outline-[#025644]'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => alert(lang === 'bn' ? 'অভিভাবকের প্রোফাইল বিবরণী সফলভাবে আপডেট করা হয়েছে!' : 'Guardian profile details updated successfully!')}
                          className="w-full py-2.5 px-4 bg-[#025644] hover:bg-[#01352a] text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-3xs"
                        >
                          {lang === 'bn' ? 'প্রোফাইল আপডেট করুন' : 'Save Profile'}
                        </button>
                      </div>
                    </div>

                    {/* Reset Password Form */}
                    <div className={`border rounded-2xl p-6 shadow-3xs space-y-4 transition-all duration-300 ${
                      appTheme === 'dark' 
                        ? 'bg-slate-900 border-slate-800 text-slate-100' 
                        : 'bg-white border-gray-100 text-slate-800'
                    }`}>
                      <h5 className={`font-extrabold text-sm border-b pb-2 flex items-center gap-2 ${
                        appTheme === 'dark' ? 'border-slate-800 text-white' : 'border-gray-150 text-slate-800'
                      }`}>
                        <ShieldCheck className="h-4 w-4 text-[#025644]" />
                        <span>{lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Update Security Credentials'}</span>
                      </h5>

                      <form onSubmit={(e) => { e.preventDefault(); alert(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' : 'Password successfully changed!'); }} className="space-y-3.5 text-xs font-semibold">
                        <div className="space-y-1.5">
                          <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                            {lang === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
                          </label>
                          <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            className={`w-full px-3.5 py-2.5 rounded-xl ${
                              appTheme === 'dark' 
                                ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-700' 
                                : 'bg-white border-gray-200 text-slate-800'
                            }`} 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                            {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                          </label>
                          <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            className={`w-full px-3.5 py-2.5 rounded-xl ${
                              appTheme === 'dark' 
                                ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-700' 
                                : 'bg-white border-gray-200 text-slate-800'
                            }`} 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                            {lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                          </label>
                          <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            className={`w-full px-3.5 py-2.5 rounded-xl ${
                              appTheme === 'dark' 
                                ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-700' 
                                : 'bg-white border-gray-200 text-slate-800'
                            }`} 
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 px-4 bg-[#025644] hover:bg-[#01352a] text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-3xs"
                        >
                          {lang === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Save Password'}
                        </button>
                      </form>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* BOTTOM TICKER FOOTER */}
        <footer className="bg-slate-900 border-t border-slate-800 text-white h-10 flex items-center shrink-0 overflow-hidden relative z-10 shadow-lg">
          <div className="bg-emerald-700 px-4 h-full flex items-center text-xs font-black shrink-0 relative z-20 text-white uppercase tracking-wider gap-1.5 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
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

      {/* READING MODAL FOR NOTICE DETAILS */}
      <AnimatePresence>
        {activeNotice && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-xl w-full p-6 text-left shadow-2xl relative border border-gray-100"
            >
              <button 
                onClick={() => setActiveNotice(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] bg-teal-50 border border-teal-100 text-teal-800 font-black rounded-md px-2 py-0.5 w-fit uppercase">
                    {activeNotice.category}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-xl tracking-tight leading-tight pt-1">
                    {activeNotice.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-extrabold">
                    Published on: {activeNotice.date} • Issued by Administration
                  </p>
                </div>

                <div className="text-slate-600 text-sm font-semibold leading-relaxed border-t border-b border-gray-100 py-4 max-h-64 overflow-y-auto">
                  {activeNotice.content}
                </div>

                {activeNotice.hasAttachment && (
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-500 shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-700 leading-tight truncate">
                          {activeNotice.attachmentName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                          PDF Document • 1.2 MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(lang === 'bn' ? `"${activeNotice.attachmentName}" ডাউনলোড সম্পন্ন হয়েছে (সিমুলেটেড)!` : `Document "${activeNotice.attachmentName}" downloaded successfully (Simulated)!`)}
                      className="px-3.5 py-2 bg-[#025644] hover:bg-[#01352a] text-white text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs shrink-0"
                    >
                      <Download className="h-3 w-3" />
                      <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                    </button>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveNotice(null)}
                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    Close notice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ONLINE PAYMENT VERIFICATION SIMULATOR MODAL */}
      <AnimatePresence>
        {isPayModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden text-left shadow-2xl border border-gray-100"
            >
              {/* Header logo container */}
              <div className="bg-[#025644] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-emerald-400" />
                  <span className="font-black text-sm tracking-wide">SCMS Instant Pay Gateway</span>
                </div>
                <button 
                  onClick={() => setIsPayModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form body */}
              <div className="p-6">
                
                {paymentStep === 'select' && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-base">Select Payment Provider</h4>
                      <p className="text-xs text-slate-500 font-semibold">Total Payable: <span className="font-mono text-emerald-800 font-black text-sm">৳ 2,500</span></p>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { id: 'bkash', label: 'bKash', bg: 'bg-[#d12053] text-white', border: 'border-[#d12053]/30' },
                        { id: 'nagad', label: 'Nagad', bg: 'bg-[#f06424] text-white', border: 'border-[#f06424]/30' },
                        { id: 'rocket', label: 'Rocket', bg: 'bg-[#8c3494] text-white', border: 'border-[#8c3494]/30' },
                        { id: 'card', label: 'Card', bg: 'bg-[#0f172a] text-white', border: 'border-slate-800/30' },
                      ].map((method) => {
                        const isSel = selectedMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedMethod(method.id as any)}
                            className={`p-3 rounded-xl border text-xs font-black transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                              isSel 
                                ? `${method.bg} shadow-md scale-105` 
                                : 'bg-[#F8FAFC] border-gray-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-black tracking-wider">{method.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-3 pt-2 text-xs font-semibold">
                      <div className="space-y-1.5">
                        <label className="text-slate-500">Provide Provider Mobile Account</label>
                        <input 
                          type="text" 
                          value={paymentPhone}
                          onChange={(e) => setPaymentPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-gray-200 focus:outline-[#025644] font-mono font-bold rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-500">Provide Secret PIN Code</label>
                        <input 
                          type="password" 
                          placeholder="••••"
                          maxLength={4}
                          value={paymentPin}
                          onChange={(e) => setPaymentPin(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-gray-200 focus:outline-[#025644] font-mono font-bold rounded-xl text-center tracking-widest text-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <button
                        onClick={handlePaymentSimulation}
                        disabled={isPaymentSimulating}
                        className="w-full py-3 bg-[#025644] hover:bg-[#01352a] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                      >
                        {isPaymentSimulating ? (
                          <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <span>Dispatch Verification OTP</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {paymentStep === 'otp' && (
                  <div className="space-y-4 text-center">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-base">OTP Code Verification</h4>
                      <p className="text-xs text-slate-500 font-semibold">Enter the 6-digit OTP dispatched to your mobile</p>
                    </div>

                    <div className="max-w-xs mx-auto">
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="••••••"
                        value={paymentOtp}
                        onChange={(e) => setPaymentOtp(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-center font-black tracking-widest text-xl focus:outline-[#025644]"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <button
                        onClick={handlePaymentSimulation}
                        disabled={isPaymentSimulating}
                        className="w-full py-3 bg-[#025644] hover:bg-[#01352a] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                      >
                        {isPaymentSimulating ? (
                          <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <span>Verify and Complete Payment</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="space-y-5 text-center p-4">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 border border-emerald-150 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Check className="h-6 w-6 stroke-[3]" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-base">Payment Completed successfully!</h4>
                      <p className="text-xs text-slate-500 font-semibold">Your May Tuition fee ledger is settled.</p>
                    </div>

                    <div className="bg-[#F8FAFC] border border-gray-200/50 p-4 rounded-xl text-left text-xs font-semibold text-slate-600 space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span>Paid To:</span>
                        <span className="font-sans font-black text-slate-800">Students Care Model School</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Invoice No:</span>
                        <span className="text-slate-800">INV-2026-005</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Amount:</span>
                        <span className="text-emerald-800 font-black">৳ 2,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ref Txn ID:</span>
                        <span className="text-slate-800 font-black">TXN-OTP99X</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Manually downloaded receipt PDF (Simulated)')}
                        className="flex-1 py-2.5 border border-gray-200 hover:border-[#025644] hover:bg-emerald-50 text-slate-700 hover:text-[#025644] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                        <span>Receipt PDF</span>
                      </button>
                      <button
                        onClick={() => setIsPayModalOpen(false)}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTACT CLASS TEACHER MODAL */}
      <AnimatePresence>
        {isTeacherModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden text-left shadow-2xl border border-gray-100"
            >
              <div className="bg-[#025644] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                  <span className="font-black text-sm tracking-wide">Write to Class Teacher</span>
                </div>
                <button 
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleTeacherMessageSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <h5 className="font-extrabold text-slate-800 text-sm">Send Secure Portal Message</h5>
                  <p className="text-[11px] text-slate-500 font-semibold">Your message will be sent directly to Mr. Karim Uddin</p>
                </div>

                {teacherMsgStatus === 'success' ? (
                  <div className="p-6 text-center space-y-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                    <h5 className="font-bold text-slate-800 text-sm">Message Delivered!</h5>
                    <p className="text-xs text-slate-500 font-semibold">The teacher will get back to you inside the portal shortly.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      required
                      placeholder="Write your message here..."
                      value={teacherMessage}
                      onChange={(e) => setTeacherMessage(e.target.value)}
                      rows={4}
                      className="w-full p-3.5 border border-gray-200 focus:outline-[#025644] rounded-xl text-sm font-semibold"
                    />

                    <button
                      type="submit"
                      disabled={teacherMsgStatus === 'sending'}
                      className="w-full py-2.5 bg-[#025644] hover:bg-[#01352a] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      {teacherMsgStatus === 'sending' ? (
                        <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>Send Message</span>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLY FOR LEAVE MODAL */}
      <AnimatePresence>
        {isLeaveModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden text-left shadow-2xl border border-gray-100"
            >
              <div className="bg-[#025644] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-400" />
                  <span className="font-black text-sm tracking-wide">
                    {lang === 'bn' ? 'ছুটির জন্য আবেদন' : 'Apply for Leave'}
                  </span>
                </div>
                <button 
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h5 className="font-extrabold text-slate-800 text-sm">
                    {lang === 'bn' ? 'নতুন ছুটির আবেদন ফর্ম' : 'New Leave Request Form'}
                  </h5>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    {lang === 'bn' ? 'সরাসরি শ্রেণী শিক্ষকের কাছে ছুটির অনুমোদনের জন্য প্রেরণ করুন' : 'Submit direct leave query for class teacher approval'}
                  </p>
                </div>

                {leaveSubmitStatus === 'success' ? (
                  <div className="p-6 text-center space-y-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                    <h5 className="font-black text-slate-800 text-sm">
                      {lang === 'bn' ? 'আবেদন সফলভাবে দাখিল হয়েছে!' : 'Application Submitted Successfully!'}
                    </h5>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                      {lang === 'bn' 
                        ? 'আপনার ছুটির আবেদনটি শ্রেণী শিক্ষকের নিকট পাঠানো হয়েছে। স্ট্যাটাস আপডেট নোটিফিকেশনের মাধ্যমে জানানো হবে।' 
                        : 'Your leave application has been routed to Mr. Karim Uddin. You will be notified once reviewed.'}
                    </p>
                    <button
                      onClick={() => setIsLeaveModalOpen(false)}
                      className="mt-2 px-4 py-2 bg-[#025644] hover:bg-[#01352a] text-white font-black text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Leave Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600">
                        {lang === 'bn' ? 'ছুটির ধরন:' : 'Leave Type:'}
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 focus:outline-[#025644] rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="sick">{lang === 'bn' ? 'অসুস্থতাজনিত ছুটি (Sick Leave)' : 'Sick Leave'}</option>
                        <option value="casual">{lang === 'bn' ? 'নৈমিত্তিক ছুটি (Casual Leave)' : 'Casual Leave'}</option>
                        <option value="medical">{lang === 'bn' ? 'চিকিৎসাজনিত ছুটি (Medical Leave)' : 'Medical Leave'}</option>
                        <option value="other">{lang === 'bn' ? 'অন্যান্য ছুটি (Other)' : 'Other'}</option>
                      </select>
                    </div>

                    {/* Date picker grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-600">
                          {lang === 'bn' ? 'শুরুর তারিখ:' : 'Start Date:'}
                        </label>
                        <input
                          type="date"
                          required
                          value={leaveStartDate}
                          onChange={(e) => setLeaveStartDate(e.target.value)}
                          className="w-full p-2.5 border border-gray-200 focus:outline-[#025644] rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-600">
                          {lang === 'bn' ? 'শেষের তারিখ:' : 'End Date:'}
                        </label>
                        <input
                          type="date"
                          required
                          value={leaveEndDate}
                          onChange={(e) => setLeaveEndDate(e.target.value)}
                          className="w-full p-2.5 border border-gray-200 focus:outline-[#025644] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>

                    {/* Leave Reason */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600">
                        {lang === 'bn' ? 'ছুটির কারণ:' : 'Reason for Leave:'}
                      </label>
                      <textarea
                        required
                        placeholder={lang === 'bn' ? 'সংক্ষেপে ছুটির কারণ লিখুন...' : 'Write reason for leave...'}
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-200 focus:outline-[#025644] rounded-xl text-xs font-semibold"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => setIsLeaveModalOpen(false)}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                      >
                        {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        onClick={() => {
                          if (!leaveStartDate || !leaveEndDate || !leaveReason) {
                            alert(lang === 'bn' ? 'অনুগ্রহ করে সকল তথ্য পূরণ করুন।' : 'Please fill in all details.');
                            return;
                          }
                          setLeaveSubmitStatus('submitting');
                          setTimeout(() => {
                            setLeaveSubmitStatus('success');
                          }, 1500);
                        }}
                        disabled={leaveSubmitStatus === 'submitting'}
                        className="flex-1 py-2.5 bg-[#025644] hover:bg-[#01352a] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                      >
                        {leaveSubmitStatus === 'submitting' ? (
                          <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <span>{lang === 'bn' ? 'আবেদন দাখিল করুন' : 'Submit Application'}</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW INVOICE PREVIEW MODAL */}
      <AnimatePresence>
        {isInvoicePreviewOpen && previewedInvoice && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden text-left shadow-2xl border border-gray-100"
            >
              {/* Modal Header */}
              <div className="bg-[#025644] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  <span className="font-black text-sm tracking-wide">
                    {lang === 'bn' ? 'মানি রিসিট প্রিভিউ' : 'Receipt Invoice Preview'}
                  </span>
                </div>
                <button 
                  onClick={() => setIsInvoicePreviewOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                
                {/* School Receipt Branding */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div>
                    <h4 className="font-black text-[#025644] text-sm leading-none">STUDENTS CARE</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic Portal Receipt</span>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">Mirpur, Dhaka, Bangladesh</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-emerald-100 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md font-black uppercase">PAID RECEIPT</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5">{previewedInvoice.id}</p>
                    <p className="text-[10px] text-slate-500 font-semibold font-mono">Date: {previewedInvoice.date}</p>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-gray-150 text-xs text-slate-600 font-semibold">
                  <div>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'bn' ? 'শিক্ষার্থী বিবরণ:' : 'Student Details:'}</span>
                    <p className="text-slate-800 font-extrabold mt-0.5">Ahsan Habib</p>
                    <p className="text-[11px] text-slate-500 font-semibold">Class: 7 • Roll: 12</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{lang === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}</span>
                    <p className="text-slate-800 font-extrabold mt-0.5">{previewedInvoice.method} Wallet</p>
                    <p className="text-[11px] text-emerald-700 font-extrabold">Txn Status: Settled</p>
                  </div>
                </div>

                {/* Itemized Table Grid */}
                <div className="border border-gray-150 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-150 text-slate-500 font-black uppercase tracking-wider text-[9px]">
                        <th className="p-3">{lang === 'bn' ? 'ফি বিবরণ' : 'Description'}</th>
                        <th className="p-3 text-right">{lang === 'bn' ? 'পরিমাণ' : 'Price'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-slate-700 font-semibold font-mono">
                      {previewedInvoice.items ? (
                        previewedInvoice.items.map((it: any, idx: number) => (
                          <tr key={idx} className="font-sans font-semibold">
                            <td className="p-3 font-sans text-slate-700">{it.item}</td>
                            <td className="p-3 text-right font-mono text-slate-700">{it.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="p-3 font-sans">{previewedInvoice.purpose}</td>
                          <td className="p-3 text-right font-mono">{previewedInvoice.amount}</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-emerald-50/50 font-black text-slate-800 border-t border-gray-150">
                        <td className="p-3 text-slate-800 font-extrabold">{lang === 'bn' ? 'মোট পরিশোধিত পরিমাণ' : 'Total Settled Amount'}</td>
                        <td className="p-3 text-right font-mono text-emerald-800 font-black text-sm">{previewedInvoice.amount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      alert(lang === 'bn' ? 'রসিদ পিডিএফ ডাউনলোড সম্পন্ন হয়েছে (সিমুলেটেড)' : 'Receipt PDF downloaded successfully (Simulated)');
                    }}
                    className="flex-1 py-2.5 bg-[#025644] hover:bg-[#01352a] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>{lang === 'bn' ? 'রসিদ ডাউনলোড করুন' : 'Download Receipt'}</span>
                  </button>
                  <button
                    onClick={() => setIsInvoicePreviewOpen(false)}
                    className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
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
