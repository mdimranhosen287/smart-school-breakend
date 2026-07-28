import React, { useState } from 'react';
import { 
  Coins, 
  DollarSign, 
  Activity, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Plus, 
  Send, 
  Download, 
  Search, 
  Bell, 
  CreditCard, 
  Wallet, 
  Clock, 
  ArrowUpRight, 
  AlertCircle, 
  Printer, 
  Building, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  LogOut, 
  UserCheck, 
  QrCode, 
  Receipt, 
  Calendar, 
  Users,
  Check,
  AlertTriangle,
  Info,
  Sliders,
  Package,
  LayoutDashboard,
  BookOpen,
  Percent,
  ClipboardList,
  TrendingDown,
  BarChart3,
  Lock,
  MoreVertical,
  Trash2,
  Edit,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TeacherPayrollDashboard from './TeacherPayrollDashboard';
import InventoryTrackerDashboard from './InventoryTrackerDashboard';
import ExpenseVendorDashboard from './ExpenseVendorDashboard';
import AccountantOverview from './AccountantOverview';
import {
  CollectFeesView,
  ExpenseReportsView,
  GenerateInvoicesView,
  FeeStructureView,
  FeeDiscountsView,
  ConcessionReportView,
  FeesReportsView,
  ProfileView
} from './AccountantSubViews';
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Taka Only";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  const convertLessThanOneThousand = (n: number): string => {
    if (n < 20) return ones[n];
    const digit = n % 10;
    if (n < 100) return tens[Math.floor(n / 10)] + (digit ? " " + ones[digit] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + convertLessThanOneThousand(n % 100) : "");
  };
  
  let temp = Math.floor(num);
  const crore = Math.floor(temp / 10000000);
  temp %= 10000000;
  
  const lakh = Math.floor(temp / 100000);
  temp %= 100000;
  
  const thousand = Math.floor(temp / 1000);
  temp %= 1000;
  
  const hundred = Math.floor(temp / 100);
  temp %= 100;
  
  let result = "";
  if (crore) {
    result += convertLessThanOneThousand(crore) + " Crore ";
  }
  if (lakh) {
    result += convertLessThanOneThousand(lakh) + " Lakh ";
  }
  if (thousand) {
    result += convertLessThanOneThousand(thousand) + " Thousand ";
  }
  if (hundred) {
    result += convertLessThanOneThousand(hundred) + " Hundred ";
  }
  if (temp) {
    if (result !== "") result += "and ";
    result += convertLessThanOneThousand(temp) + " ";
  }
  
  return result.trim() + " Taka Only";
};

interface AccountantDashboardProps {
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  onLogout: () => void;
}

export default function AccountantDashboard({ lang, setLang, onLogout }: AccountantDashboardProps) {
  // Translatable texts
  const t = {
    en: {
      dashboardTitle: "Accountant Ledger Panel",
      schoolName: "Students Care Model School",
      greeting: "Good Morning, Md. Kamrul Hasan 📊",
      aiBanner: "Total collection this month is at 81% of the target. 142 guardians have pending dues, and ৳ 9,870 is currently overdue by 30+ days. AI suggests sending automated SMS reminders today.",
      aiBannerDone: "SMS Dues Reminders were successfully sent to 142 guardians today. The transaction dashboard is active.",
      sendSmsBtn: "Send Auto-Dues Reminder via SMS",
      totalColl: "Total Collection (Current Month)",
      pendingDues: "Pending Dues",
      overdueAcc: "Overdue Accounts",
      bankBal: "Available Bank Balance",
      unpaidGuardians: "142 guardians pending",
      daysOverdue: "30+ Days Delayed",
      ledgerBal: "Real-time Ledger Balance",
      targetText: "Target: ৳ 1,55,260",
      feeStatus: "Fee Collection Status (Live)",
      recentTx: "Recent Invoices & Transactions",
      actionHub: "Smart Action Hub",
      disputesTitle: "Dispute & Refund Approvals",
      colSpotCash: "Collect Spot Cash",
      genBulkInvoice: "Generate Bulk Invoice",
      exportReport: "Export Tax/Audit Report",
      date: "Date",
      studentName: "Student",
      class: "Class",
      method: "Method",
      amount: "Amount",
      actions: "Actions",
      genReceipt: "Generate Receipt",
      viewLedger: "View Ledger",
      approve: "Approve",
      review: "Review",
      refunded: "Refunded",
      reviewed: "Reviewed",
      spotCashTitle: "Collect Spot Cash Payment",
      studentId: "Student ID",
      feeType: "Fee Type",
      paymentMethod: "Payment Method",
      cancel: "Cancel",
      save: "Save / Record Payment",
      bulkInvoiceTitle: "Generate Bulk Invoices",
      billingMonth: "Billing Month",
      selectClass: "Select Class",
      allClasses: "All Classes",
      runEngine: "Run Billing Engine",
      smsTitle: "Send Automated Dues Reminders",
      smsPrompt: "You are about to broadcast customized SMS payment links to 142 guardians with outstanding balances. Standard SMS API rates apply.",
      smsProgress: "Dispatched successfully!",
      sendSmsConfirm: "Broadcast SMS",
      exportTitle: "Export Financial Ledger",
      exportFormat: "Select Export Format",
      downloadReport: "Download Report Data",
      receiptTitle: "Students Care Model School - Invoice Receipt",
      invoiceNo: "Invoice No",
      signature: "Authorized Signature",
      paidStatus: "PAID",
      refundTitle: "Refund Request Review"
    },
    bn: {
      dashboardTitle: "হিসাবরক্ষক লেজার প্যানেল",
      schoolName: "স্টুডেন্টস কেয়ার মডেল স্কুল",
      greeting: "শুভ সকাল, মো. কামরুল হাসান 📊",
      aiBanner: "চলতি মাসে আদায় লক্ষ্যমাত্রার ৮১% এ রয়েছে। ১৪২ জন অভিভাবকের ফি বকেয়া আছে, এবং ৯,৮৭০ ৳ ৩০+ দিন ধরে ওভারডিউ। এআই আজই অটোমেটেড এসএমএস রিমাইন্ডার পাঠানোর পরামর্শ দিচ্ছে।",
      aiBannerDone: "আজ সফলভাবে ১৪২ জন অভিভাবককে বকেয়া পরিশোধের অটোমেটেড এসএমএস পাঠানো হয়েছে। লেজার ড্যাশবোর্ড সচল রয়েছে।",
      sendSmsBtn: "এসএমএস দ্বারা অটো-বকেয়া রিমাইন্ডার",
      totalColl: "মোট আদায় (চলতি মাস)",
      pendingDues: "বকেয়া পাওনা",
      overdueAcc: "অত্যধিক বিলম্বিত বকেয়া",
      bankBal: "ব্যাংক ব্যালেন্স ফান্ড",
      unpaidGuardians: "১৪২ জন অভিভাবক বকেয়া",
      daysOverdue: "৩০+ দিনের বিলম্ব",
      ledgerBal: "রিয়েল-টাইম লেজার ব্যালেন্স",
      targetText: "লক্ষ্যমাত্রা: ১,৫৫,২৬০ ৳",
      feeStatus: "ফি আদায়ের বর্তমান অবস্থা (লাইভ)",
      recentTx: "সাম্প্রতিক ইনভয়েস ও লেনদেন সমূহ",
      actionHub: "স্মার্ট অ্যাকশন হাব",
      disputesTitle: "ফি আপত্তি ও রিফান্ড অনুমোদন",
      colSpotCash: "স্পট ক্যাশ আদায়",
      genBulkInvoice: "একত্রে বাল্ক ইনভয়েস তৈরি",
      exportReport: "ট্যাক্স/অডিট রিপোর্ট ডাউনলোড",
      date: "তারিখ",
      studentName: "শিক্ষার্থী",
      class: "শ্রেণী",
      method: "মাধ্যম",
      amount: "পরিমাণ",
      actions: "পদক্ষেপ",
      genReceipt: "রসিদ তৈরি",
      viewLedger: "লেজার দেখুন",
      approve: "অনুমোদন",
      review: "রিভিউ",
      refunded: "রিফান্ড সম্পন্ন",
      reviewed: "রিভিউ সম্পন্ন",
      spotCashTitle: "সরাসরি স্পট ক্যাশ আদায় করুন",
      studentId: "শিক্ষার্থী আইডি",
      feeType: "ফি এর ধরণ",
      paymentMethod: "আদায়ের মাধ্যম",
      cancel: "বাতিল",
      save: "ফি আদায় নিশ্চিত করুন",
      bulkInvoiceTitle: "একত্রে বাল্ক ইনভয়েস জেনারেট",
      billingMonth: "বিলিং মাস",
      selectClass: "শ্রেণী নির্বাচন করুন",
      allClasses: "সকল শ্রেণী",
      runEngine: "বিলিং ইঞ্জিন চালু করুন",
      smsTitle: "বকেয়া আদায়ের এসএমএস পাঠান",
      smsPrompt: "আপনি বকেয়া ফি পরিশোধের জন্য ১৪২ জন অভিভাবকের কাছে কাস্টমাইজড পেমেন্ট লিংক সহ এসএমএস পাঠাতে যাচ্ছেন।",
      smsProgress: "এসএমএস সফলভাবে পাঠানো হয়েছে!",
      sendSmsConfirm: "এসএমএস ব্রডকাস্ট করুন",
      exportTitle: "আর্থিক লেজার রিপোর্ট এক্সপোর্ট",
      exportFormat: "এক্সপোর্ট ফরম্যাট সিলেক্ট করুন",
      downloadReport: "রিপোর্ট ডাটা ডাউনলোড",
      receiptTitle: "স্টুডেন্টস কেয়ার মডেল স্কুল - পেমেন্ট রসিদ",
      invoiceNo: "রসিদ নম্বর",
      signature: "অনুমোদিত স্বাক্ষর",
      paidStatus: "পরিশোধিত",
      refundTitle: "রিফান্ড আপত্তি পুঙ্খানুপুঙ্খ রিভিউ"
    }
  };

  const currentT = lang === 'bn' ? t.bn : t.en;

  // React Core States
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [smsSentToday, setSmsSentToday] = useState(false);
  const [selectedChartSegment, setSelectedChartSegment] = useState<'paid' | 'pending' | null>(null);
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'collect_fees'
    | 'expenses'
    | 'expense_reports'
    | 'generate_invoices'
    | 'fee_structure'
    | 'fee_discounts'
    | 'concession_report'
    | 'ledger'
    | 'fees_reports'
    | 'profile'
    | 'payroll'
    | 'inventory'
  >('dashboard');

  // Teacher Payroll States
  const [teachers, setTeachers] = useState([
    { id: "TCH001", name: "Sajid Hasan", designation: "Senior Mathematics Teacher", avatar: "SH", baseSalary: 35000, attendedDays: 24, approvedLeaves: 2, unpaidLeaves: 1, deductions: 1200, bonus: 2500, status: 'pending' as 'paid' | 'pending' | 'on_hold', role: "math" },
    { id: "TCH002", name: "Mst. Sharmin Akter", designation: "English Lecturer", avatar: "SA", baseSalary: 32000, attendedDays: 26, approvedLeaves: 0, unpaidLeaves: 0, deductions: 0, bonus: 3000, status: 'paid' as 'paid' | 'pending' | 'on_hold', role: "english" },
    { id: "TCH003", name: "Ferdousi Rahman", designation: "Science Specialist", avatar: "FR", baseSalary: 28000, attendedDays: 25, approvedLeaves: 1, unpaidLeaves: 0, deductions: 0, bonus: 1500, status: 'paid' as 'paid' | 'pending' | 'on_hold', role: "science" },
    { id: "TCH004", name: "Dr. Alim Al Razi", designation: "History Specialist", avatar: "AR", baseSalary: 45000, attendedDays: 22, approvedLeaves: 2, unpaidLeaves: 2, deductions: 3000, bonus: 0, status: 'on_hold' as 'paid' | 'pending' | 'on_hold', role: "history" },
    { id: "TCH005", name: "Anisur Rahman", designation: "Assistant ICT Teacher", avatar: "AN", baseSalary: 25000, attendedDays: 25, approvedLeaves: 1, unpaidLeaves: 0, deductions: 250, bonus: 1000, status: 'pending' as 'paid' | 'pending' | 'on_hold', role: "ict" }
  ]);

  const [leaveConflicts, setLeaveConflicts] = useState([
    { id: "LC-01", teacherId: "TCH001", teacherName: "Sajid Hasan", conflictType: "Unexcused Absence (June 18)", deductionAmount: 1200, description: "Absent without prior notice during exam week." },
    { id: "LC-02", teacherId: "TCH004", teacherName: "Dr. Alim Al Razi", conflictType: "Late Arrival (4 Times)", deductionAmount: 1000, description: "Exceeded grace period four times due to transport issues." }
  ]);

  // Payroll Action Indicator States
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);
  const [payrollProgress, setPayrollProgress] = useState(0);

  // New Payroll Modal States
  const [showConfigureBaseModal, setShowConfigureBaseModal] = useState(false);
  const [showAddBonusModal, setShowAddBonusModal] = useState(false);
  const [showLateRulesModal, setShowLateRulesModal] = useState(false);
  const [selectedPayslipTeacher, setSelectedPayslipTeacher] = useState<any | null>(null);

  // Payroll Form states
  const [baseConfig, setBaseConfig] = useState({ workingDays: '26', gracePeriod: '15', providentFund: '10' });
  const [bonusForm, setBonusForm] = useState({ teacherId: 'TCH001', amount: '1500', type: 'Performance Bonus' });
  const [lateRulesForm, setLateRulesForm] = useState({ perLateAmount: '250', perUnexcusedAmount: '1200' });

  // Financial Stats Core state
  const [stats, setStats] = useState({
    todaysCollection: 84500,
    pendingDues: 212300,
    monthlyExpense: 145000,
    netBalance: 568900,
    cashInHand: 124500,
    bankBalance: 1842300,
    targetAchieved: 365000,
    targetGoal: 500000
  });

  // Add Expense form states
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showVoucherPreview, setShowVoucherPreview] = useState(false);
  const [previewVoucher, setPreviewVoucher] = useState<any | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    accountName: '',
    address: '',
    category: 'Stationery',
    amount: '',
    date: '2026-07-16',
    voucherNo: 'EXP-202607-0001',
    paymentMethod: 'Cash',
    approvedBy: '',
    description: '',
    receiptFile: null as File | null,
    receiptFileName: ''
  });

  const handleOpenAddExpenseModal = () => {
    let count = 5;
    try {
      const saved = localStorage.getItem('school_vouchers');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          count = list.length;
        }
      }
    } catch (e) {}
    
    const pad = (num: number, size: number) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };
    const nextVNo = `EXP-202607-${pad(count + 1, 4)}`;

    setExpenseForm({
      accountName: '',
      address: '',
      category: 'Stationery',
      amount: '',
      date: '2026-07-16',
      voucherNo: nextVNo,
      paymentMethod: 'Cash',
      approvedBy: '',
      description: '',
      receiptFile: null,
      receiptFileName: ''
    });
    setShowAddExpenseModal(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.accountName || !expenseForm.amount) {
      showToastMsg(
        lang === 'bn' 
          ? "দয়া করে একাউন্টের নাম এবং খরচের পরিমাণ প্রদান করুন" 
          : "Please enter Account Name and Amount", 
        "error"
      );
      return;
    }

    const amountNum = parseFloat(expenseForm.amount) || 0;
    
    let currentVouchers = [];
    try {
      const saved = localStorage.getItem('school_vouchers');
      if (saved) {
        currentVouchers = JSON.parse(saved);
      } else {
        currentVouchers = [
          { id: "VCH-301", description: "Purchased Whiteboard Markers & Chalks", category: "Stationary Procurement", date: "2026-07-08", amount: 4800, method: "Cash", receipt: "uploaded", attachment: "stationery_receipt_301.pdf" },
          { id: "VCH-302", description: "June Electric Utility Bill Clear", category: "Utilities", date: "2026-07-05", amount: 12500, method: "Bank Transfer", receipt: "uploaded", attachment: "desco_bill_june_paid.pdf" },
          { id: "VCH-303", description: "Water pump motor coil rewinding", category: "Maintenance", date: "2026-07-02", amount: 3500, method: "bKash", receipt: "missing", attachment: null },
          { id: "VCH-304", description: "Class VIII Physics Exam Script Print", category: "Events", date: "2026-06-28", amount: 6500, method: "Cash", receipt: "uploaded", attachment: "script_print_invoice.pdf" },
          { id: "VCH-305", description: "High-Speed Fiber Internet Bill (June)", category: "Utilities", date: "2026-06-25", amount: 15000, method: "Bank Transfer", receipt: "uploaded", attachment: "internet_june.pdf" }
        ];
      }
    } catch (err) {}

    const newVoucher = {
      id: expenseForm.voucherNo || `EXP-202607-${String(currentVouchers.length + 1).padStart(4, '0')}`,
      description: expenseForm.description || `Expense for ${expenseForm.accountName}`,
      category: expenseForm.category || 'Stationery',
      date: expenseForm.date || '2026-07-16',
      amount: amountNum,
      method: expenseForm.paymentMethod || 'Cash',
      receipt: expenseForm.receiptFileName ? "uploaded" : "missing",
      attachment: expenseForm.receiptFileName || null,
      accountName: expenseForm.accountName,
      address: expenseForm.address,
      approvedBy: expenseForm.approvedBy
    };

    localStorage.setItem('school_vouchers', JSON.stringify([newVoucher, ...currentVouchers]));
    window.dispatchEvent(new Event('school_vouchers_updated'));

    setStats(prev => ({
      ...prev,
      monthlyExpense: prev.monthlyExpense + amountNum,
      netBalance: prev.netBalance - amountNum
    }));

    setPreviewVoucher(newVoucher);
    setShowVoucherPreview(true);
    setShowAddExpenseModal(false);
    showToastMsg(
      lang === 'bn'
        ? `খরচ ভাউচার "${newVoucher.id}" সফলভাবে সংরক্ষণ করা হয়েছে এবং প্রিভিউ জেনারেট করা হয়েছে!`
        : `Successfully saved expense voucher "${newVoucher.id}" and generated preview!`,
      "success"
    );
  };

  const renderVoucherCopy = (type: 'OFFICE COPY' | 'ACCOUNT COPY') => {
    if (!previewVoucher) return null;
    const amountNum = previewVoucher.amount || 0;
    const formattedAmount = amountNum.toLocaleString('en-IN');
    const words = numberToWords(amountNum);
    
    // Date formatting: if date is YYYY-MM-DD, convert to DD/MM/YYYY
    let displayDate = previewVoucher.date || '';
    if (displayDate.includes('-')) {
      const parts = displayDate.split('-');
      if (parts.length === 3) {
        displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    
    return (
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 text-slate-900 relative shadow-xs">
        {/* Header section with SCMS logo on left, text in middle, copy badge on right */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Circle SCMS Logo */}
            <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center font-black text-xs text-slate-800 tracking-wider bg-slate-50 shrink-0 select-none">
              SCMS
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wider leading-snug">
                STUDENTS CARE MODEL SCHOOL
              </h2>
              <p className="text-[10px] font-bold text-slate-600 leading-tight">
                Main Road, Dhaka, Bangladesh &bull; +880 1812-555066
              </p>
            </div>
          </div>
          <div className="border-2 border-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-900 bg-slate-50 rounded-md">
            {type}
          </div>
        </div>

        {/* EXPENSE VOUCHER Title Bar */}
        <div className="bg-slate-900 text-white py-2 px-4 rounded-md mb-6 text-center">
          <h3 className="text-xs font-black uppercase tracking-[0.25em]">
            {lang === 'bn' ? 'খরচ ভাউচার' : 'EXPENSE VOUCHER'}
          </h3>
        </div>

        {/* Metadata Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs font-bold mb-6">
          {/* Row 1 */}
          <div className="flex items-end gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
              {lang === 'bn' ? 'ভাউচার নং:' : 'VOUCHER NO'}
            </span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 font-mono text-slate-800 pl-1">
              {previewVoucher.id}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
              {lang === 'bn' ? 'তারিখ:' : 'DATE'}
            </span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800 pl-1">
              {displayDate}
            </span>
          </div>

          {/* Row 2 */}
          <div className="flex items-end gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
              {lang === 'bn' ? 'প্রাপক:' : 'PAID TO'}
            </span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800 pl-1">
              {previewVoucher.accountName}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
              {lang === 'bn' ? 'ক্যাটাগরি:' : 'CATEGORY'}
            </span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800 pl-1">
              {previewVoucher.category}
            </span>
          </div>

          {/* Row 3 */}
          <div className="flex items-end gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
              {lang === 'bn' ? 'মাধ্যম:' : 'PAYMENT'}
            </span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800 pl-1">
              {previewVoucher.method}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
              {lang === 'bn' ? 'অনুমোদনকারী:' : 'APPROVED BY'}
            </span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800 pl-1">
              {previewVoucher.approvedBy || "Principal"}
            </span>
          </div>

          {/* Row 4 */}
          <div className="flex items-end gap-2 sm:col-span-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
              {lang === 'bn' ? 'ঠিকানা:' : 'ADDRESS'}
            </span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800 pl-1">
              {previewVoucher.address || "N/A"}
            </span>
          </div>
        </div>

        {/* Table of Particulars */}
        <div className="border-2 border-slate-900 rounded-lg overflow-hidden mb-6">
          <div className="grid grid-cols-4 bg-slate-900 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider py-2 px-3">
            <div className="col-span-3 text-left">
              {lang === 'bn' ? 'বিবরণ' : 'PARTICULARS / DESCRIPTION'}
            </div>
            <div className="col-span-1 text-right">
              {lang === 'bn' ? 'পরিমাণ (টাকা)' : 'AMOUNT (BDT)'}
            </div>
          </div>
          
          <div className="grid grid-cols-4 border-b-2 border-slate-900 py-4 px-3 text-xs text-slate-800 font-bold min-h-[60px]">
            <div className="col-span-3 text-left leading-relaxed">
              {previewVoucher.description}
            </div>
            <div className="col-span-1 text-right font-mono text-sm">
              ৳{formattedAmount}
            </div>
          </div>

          <div className="grid grid-cols-4 bg-slate-50 py-3 px-3 text-xs font-black uppercase text-slate-900 tracking-wider">
            <div className="col-span-3 text-left">
              {lang === 'bn' ? 'মোট খরচের পরিমাণ' : 'TOTAL EXPENSE AMOUNT'}
            </div>
            <div className="col-span-1 text-right font-mono text-sm text-[#004D40]">
              ৳{formattedAmount}
            </div>
          </div>
        </div>

        {/* In Words Box */}
        <div className="border border-slate-900 p-3 rounded-lg text-xs font-bold text-slate-800 text-left bg-slate-50/50 mb-8 flex gap-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
            {lang === 'bn' ? 'কথায়:' : 'IN WORDS:'}
          </span>
          <span className="italic">
            {words}
          </span>
        </div>

        {/* Signatures & Stamp */}
        <div className="flex justify-between items-end pt-4 relative">
          {/* Prepared By Signature Line */}
          <div className="flex flex-col items-center w-1/3">
            <div className="w-full border-b border-slate-900 mb-1.5"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
              {lang === 'bn' ? 'প্রস্তুতকারী' : 'Prepared By'}
            </span>
          </div>

          {/* Stamp Circle */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 flex items-center justify-center select-none rotate-[-12deg]">
            <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-rose-500/80 flex items-center justify-center">
              <div className="absolute inset-1 rounded-full border border-rose-500/40 flex items-center justify-center">
                <div className="text-[10px] font-black text-rose-500/90 text-center tracking-tight leading-none uppercase">
                  PAID<br/>VOUCHER
                </div>
              </div>
            </div>
          </div>

          {/* Approved By Signature Line */}
          <div className="flex flex-col items-center w-1/3 z-10">
            <span className="text-xs font-bold font-mono text-slate-800 leading-none mb-1">
              {previewVoucher.approvedBy || "Principal"}
            </span>
            <div className="w-full border-b border-slate-900 mb-1.5"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
              {lang === 'bn' ? 'অনুমোদনকারী' : 'Approved By'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Fee Structure State
  const [feeStructures, setFeeStructures] = useState([
    { classId: 'Class 1', tuitionFee: 1200, examFee: 500, sportsFee: 300, sessionFee: 1500 },
    { classId: 'Class 2', tuitionFee: 1200, examFee: 500, sportsFee: 300, sessionFee: 1500 },
    { classId: 'Class 3', tuitionFee: 1500, examFee: 600, sportsFee: 300, sessionFee: 1800 },
    { classId: 'Class 4', tuitionFee: 1500, examFee: 600, sportsFee: 300, sessionFee: 1800 },
    { classId: 'Class 5', tuitionFee: 1800, examFee: 700, sportsFee: 400, sessionFee: 2000 },
    { classId: 'Class 6', tuitionFee: 1800, examFee: 700, sportsFee: 400, sessionFee: 2000 },
    { classId: 'Class 7', tuitionFee: 2000, examFee: 800, sportsFee: 500, sessionFee: 2200 },
    { classId: 'Class 8', tuitionFee: 2000, examFee: 800, sportsFee: 500, sessionFee: 2200 },
    { classId: 'Class 9', tuitionFee: 2500, examFee: 1000, sportsFee: 600, sessionFee: 2500 },
    { classId: 'Class 10', tuitionFee: 2500, examFee: 1000, sportsFee: 600, sessionFee: 2500 },
  ]);
  const [editingFee, setEditingFee] = useState<any | null>(null);

  // Fee Discounts State
  const [feeDiscounts, setFeeDiscounts] = useState([
    { studentId: '2026101', studentName: 'Farhan Ishrak', class: 'Class 8A', discountType: 'Merit Scholarship', waiverPercentage: 50, amountSaved: 1000 },
    { studentId: '2026102', studentName: 'Nusrat Jahan', class: 'Class 8A', discountType: 'Sibling Discount', waiverPercentage: 25, amountSaved: 500 },
    { studentId: '2026104', studentName: 'Tasfia Karim', class: 'Class 10A', discountType: 'Special Concession', waiverPercentage: 100, amountSaved: 2500 },
  ]);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    studentId: '2026101',
    discountType: 'Merit Scholarship',
    waiverPercentage: '50'
  });

  // Recent Invoices / Transactions List
  const [txs, setTxs] = useState([
    { id: "INV2026901", date: "2026-07-10", name: "Farhan Ishrak", class: "Class 8A", idNo: "2026101", method: "bKash", type: "Tuition Fee", amount: 2000 },
    { id: "INV2026902", date: "2026-07-09", name: "Nusrat Jahan", class: "Class 8A", idNo: "2026102", method: "Visa", type: "Admission Fee", amount: 5000 },
    { id: "INV2026903", date: "2026-07-08", name: "Zayan Ahmed", class: "Class 9B", idNo: "2026103", method: "Bank", type: "Exam Fee", amount: 1200 },
    { id: "INV2026904", date: "2026-07-07", name: "Tasfia Karim", class: "Class 10A", idNo: "2026104", method: "Rocket", type: "Lab Fee", amount: 1500 },
    { id: "INV2026905", date: "2026-07-06", name: "Abrar Fahad", class: "Class 7C", idNo: "2026105", method: "Cash", type: "Tuition Fee", amount: 2000 }
  ]);

  // Disputes & Refund Approvals List
  const [disputes, setDisputes] = useState([
    { id: "DSP301", name: "Amina Rahman", class: "Class 7B", idNo: "2026144", reason: "Double payment charged on bKash", amount: 2000, status: "pending" },
    { id: "DSP302", name: "Tanvir Ahmed", class: "Class 10A", idNo: "2026188", reason: "Exam waiver scholarship not applied", amount: 1200, status: "pending" },
    { id: "DSP303", name: "Sumaiya Akter", class: "Class 9A", idNo: "2026190", reason: "Refund request for cancelled sports event", amount: 800, status: "pending" }
  ]);

  // Modal Control States
  const [showSpotCashModal, setShowSpotCashModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState<any | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<any | null>(null);

  // Forms States
  const [spotCashForm, setSpotCashForm] = useState({
    studentId: '2026101',
    feeType: 'Tuition Fee',
    method: 'Cash',
    amount: '2000'
  });
  const [bulkInvoiceForm, setBulkInvoiceForm] = useState({
    month: 'July 2026',
    selectedClass: 'All'
  });
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');

  // Animation/Processing indicator states
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsProgress, setSmsProgress] = useState(0);

  // Helper mock students lookup for spot cash collection
  const mockStudents: Record<string, { name: string; class: string }> = {
    '2026101': { name: "Farhan Ishrak", class: "Class 8A" },
    '2026102': { name: "Nusrat Jahan", class: "Class 8A" },
    '2026103': { name: "Zayan Ahmed", class: "Class 9B" },
    '2026104': { name: "Tasfia Karim", class: "Class 10A" },
    '2026105': { name: "Abrar Fahad", class: "Class 7C" }
  };

  const showToastMsg = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Actions implementations
  const handleSpotCashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stud = mockStudents[spotCashForm.studentId] || { name: "Unknown Student", class: "General" };
    const amountNum = parseFloat(spotCashForm.amount) || 0;

    if (amountNum <= 0) {
      showToastMsg(lang === 'bn' ? 'সঠিক টাকার পরিমাণ লিখুন!' : 'Please enter a valid amount!', 'error');
      return;
    }

    // Add to transactions
    const newTx = {
      id: "INV2026" + Math.floor(Math.random() * 9000 + 1000),
      date: new Date().toISOString().split('T')[0],
      name: stud.name,
      class: stud.class,
      idNo: spotCashForm.studentId,
      method: spotCashForm.method,
      type: spotCashForm.feeType,
      amount: amountNum
    };

    setTxs(prev => [newTx, ...prev]);
    setStats(prev => ({
      ...prev,
      todaysCollection: prev.todaysCollection + amountNum,
      netBalance: prev.netBalance + amountNum,
      bankBalance: spotCashForm.method === 'Bank' || spotCashForm.method === 'Visa' ? prev.bankBalance + amountNum : prev.bankBalance,
      cashInHand: spotCashForm.method === 'Cash' ? prev.cashInHand + amountNum : prev.cashInHand,
      targetAchieved: Math.min(prev.targetGoal, prev.targetAchieved + amountNum),
      pendingDues: Math.max(0, prev.pendingDues - amountNum)
    }));

    setShowSpotCashModal(false);
    showToastMsg(
      lang === 'bn' 
        ? `${stud.name}-এর জন্য ৳${amountNum} সফলভাবে আদায় করা হয়েছে!` 
        : `Successfully recorded spot cash of ৳${amountNum} for ${stud.name}!`
    );
  };

  const handleRunBulkInvoice = () => {
    setIsProcessingBulk(true);
    setBulkProgress(0);
    const interval = setInterval(() => {
      setBulkProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessingBulk(false);
            setShowBulkModal(false);
            setStats(prevStats => ({
              ...prevStats,
              pendingDues: prevStats.pendingDues + 45000
            }));
            showToastMsg(
              lang === 'bn' 
                ? `সফলভাবে সকল ক্লাসের জন্য নতুন ইনভয়েস জেনারেট হয়েছে!` 
                : `Bulk billing cycle complete. Invoices generated for all active rosters.`
            );
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleBroadcastSms = () => {
    setIsSendingSms(true);
    setSmsProgress(0);
    const interval = setInterval(() => {
      setSmsProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSendingSms(false);
            setSmsSentToday(true);
            setShowSmsModal(false);
            showToastMsg(
              lang === 'bn' 
                ? `১৪২ জন অভিভাবককে সফলভাবে এসএমএস পাঠানো হয়েছে!` 
                : `142 automated dues reminders successfully dispatched via Twilio API Gateway.`
            );
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleExportLedger = () => {
    setShowExportModal(false);
    // Create actual downloadable mock file
    const headers = "Invoice ID,Date,Student Name,Class,Method,Type,Amount\n";
    const rows = txs.map(t => `${t.id},${t.date},${t.name},${t.class},${t.method},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `scms_financials_report_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    showToastMsg(
      lang === 'bn' 
        ? `লেজার ডাটা এক্সপোর্ট সম্পন্ন! ডাউনলোড শুরু হয়েছে।` 
        : `Ledger dataset compiled successfully as CSV. Download started.`
    );
  };

  const handleApproveDispute = (id: string, amount: number, student: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    setStats(prev => ({
      ...prev,
      todaysCollection: Math.max(0, prev.todaysCollection - amount),
      netBalance: Math.max(0, prev.netBalance - amount),
      bankBalance: Math.max(0, prev.bankBalance - amount)
    }));
    showToastMsg(
      lang === 'bn' 
        ? `${student}-এর ৳${amount} রিফান্ড মঞ্জুর ও সেটেল করা হয়েছে।` 
        : `Dispute ${id} approved. ৳${amount} credited back to ${student}'s guardian.`
    );
  };

  const handleReviewDisputeSubmit = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'reviewed' } : d));
    setShowReviewModal(null);
    showToastMsg(
      lang === 'bn' 
        ? `অভিযোগটি সফলভাবে রিভিউড অবস্থায় চিহ্নিত করা হয়েছে!` 
        : `Dispute record updated to 'Reviewed' status.`
    );
  };

  // ========================================================
  // TEACHER PAYROLL HANDLERS
  // ========================================================
  const handleBulkPayrollRun = () => {
    setIsProcessingPayroll(true);
    setPayrollProgress(0);
    const interval = setInterval(() => {
      setPayrollProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessingPayroll(false);
            setTeachers(prevT => prevT.map(t => ({ ...t, status: 'paid' as const })));
            showToastMsg(
              lang === 'bn'
                ? "৳ ৫,৪৫,২০০ এর বাল্ক পে-রোল সফলভাবে সম্পন্ন হয়েছে এবং ৩৫টি ব্যাংক এডভাইস প্রস্তুত করা হয়েছে!"
                : "Bulk payroll of ৳ 5,45,200 processed successfully! 35 Bank Transfer advisements generated."
            );
          }, 800);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleDisburseIndividual = (id: string, name: string) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: 'paid' as const } : t));
    showToastMsg(
      lang === 'bn'
        ? `${name}-এর বেতন সফলভাবে ব্যাংকে ট্রান্সফার করা হয়েছে!`
        : `Salary successfully dispatched for ${name}.`
    );
  };

  const handleResolveConflict = (conflictId: string, action: 'excuse' | 'penalize') => {
    const conflict = leaveConflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    if (action === 'excuse') {
      setTeachers(prev => prev.map(t => {
        if (t.id === conflict.teacherId) {
          const newDeductions = Math.max(0, t.deductions - conflict.deductionAmount);
          return { ...t, deductions: newDeductions };
        }
        return t;
      }));
      showToastMsg(
        lang === 'bn'
          ? `${conflict.teacherName}-এর জন্য ৳${conflict.deductionAmount} কর্তন মওকুফ করা হয়েছে!`
          : `Waived penalty of ৳${conflict.deductionAmount} for ${conflict.teacherName}.`
      );
    } else {
      showToastMsg(
        lang === 'bn'
          ? `${conflict.teacherName}-এর জন্য পূর্বনির্ধারিত ৳${conflict.deductionAmount} কর্তন বহাল রাখা হয়েছে!`
          : `Applied late/absence deduction penalty of ৳${conflict.deductionAmount} for ${conflict.teacherName}.`
      );
    }
    setLeaveConflicts(prev => prev.filter(c => c.id !== conflictId));
  };

  const handleConfigureBaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfigureBaseModal(false);
    showToastMsg(
      lang === 'bn'
        ? `বেতন কাঠামো সফলভাবে হালনাগাদ হয়েছে! কাজের দিন: ${baseConfig.workingDays} দিন।`
        : `Salary baseline structure updated successfully! Active working days: ${baseConfig.workingDays}.`
    );
  };

  const handleAddBonusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(bonusForm.amount) || 0;
    const targetTeacher = teachers.find(t => t.id === bonusForm.teacherId);
    if (targetTeacher) {
      setTeachers(prev => prev.map(t => {
        if (t.id === bonusForm.teacherId) {
          return { ...t, bonus: t.bonus + amountNum };
        }
        return t;
      }));
      setShowAddBonusModal(false);
      showToastMsg(
        lang === 'bn'
          ? `${targetTeacher.name}-এর জন্য ৳${amountNum} বোনাস সফলভাবে যুক্ত করা হয়েছে!`
          : `Successfully credited ৳${amountNum} performance bonus to ${targetTeacher.name}!`
      );
    }
  };

  const handleLateRulesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLateRulesModal(false);
    showToastMsg(
      lang === 'bn'
        ? `বিলম্ব কর্তন নিয়ম সফলভাবে সেট করা হয়েছে! প্রতি দেরির জন্য: ৳${lateRulesForm.perLateAmount}`
        : `Deduction guidelines updated! Single late penalty set to ৳${lateRulesForm.perLateAmount}.`
    );
  };

  const handleExportBankAdvice = () => {
    const headers = "Teacher ID,Teacher Name,Designation,Base Salary,Deductions,Bonus,Net Payable,Bank Routing,Bank Account\n";
    const rows = teachers.map(t => `${t.id},${t.name},${t.designation},${t.baseSalary},${t.deductions},${t.bonus},${t.baseSalary - t.deductions + t.bonus},999260111,1022445588${t.id.replace('TCH', '')}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `scms_bank_advice_june2026.csv`);
    a.click();
    showToastMsg(
      lang === 'bn'
        ? `ব্যাংক ট্রান্সফার এডভাইস ডাউনলোড শুরু হয়েছে!`
        : `Bank Advice list compiled successfully as CSV. File downloaded for bank remittance processing.`
    );
  };

  // Quick helper to draw payment method icons
  const renderMethodBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bkash':
        return (
          <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-100 text-[10px] font-black tracking-wide flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse" />
            bKash
          </span>
        );
      case 'visa':
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black tracking-wide flex items-center gap-1">
            <CreditCard className="h-2.5 w-2.5" />
            Visa/Card
          </span>
        );
      case 'bank':
        return (
          <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-100 text-[10px] font-black tracking-wide flex items-center gap-1">
            <Building className="h-2.5 w-2.5" />
            Bank Trf
          </span>
        );
      case 'rocket':
        return (
          <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-black tracking-wide flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Rocket
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-black tracking-wide flex items-center gap-1">
            <Wallet className="h-2.5 w-2.5" />
            Cash
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800 antialiased">
      
      {/* ======================================================== */}
      {/* LEFT SIDEBAR (Modern Light Aesthetics matching screenshot) */}
      {/* ======================================================== */}
      <aside className="w-64 bg-white shrink-0 flex flex-col justify-between hidden md:flex border-r border-slate-200/80 select-none">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="h-9 w-9 bg-[#004D40] text-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
              <Coins className="h-5 w-5" />
            </div>
            <div className="text-left min-w-0">
              <h4 className="font-extrabold text-slate-800 text-[11px] tracking-tight leading-snug uppercase">
                {lang === 'bn' ? 'স্টুডেন্টস কেয়ার মডেল স্কুল' : 'Students Care Model School'}
              </h4>
              <p className="text-[9px] text-[#004D40] font-bold tracking-wider uppercase mt-0.5 truncate">
                {lang === 'bn' ? 'অ্যাকাউন্ট্যান্ট পোর্টাল' : 'Accountant Portal'}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {[
              { id: 'dashboard', label_en: 'Dashboard', label_bn: 'ড্যাশবোর্ড', icon: LayoutDashboard },
              { id: 'collect_fees', label_en: 'Collect Fees', label_bn: 'ফি আদায়', icon: Coins },
              { id: 'expenses', label_en: 'Expense Vouchers', label_bn: 'খরচ ভাউচার', icon: FileText },
              { id: 'expense_reports', label_en: 'Expense Reports', label_bn: 'ব্যয় রিপোর্ট', icon: TrendingDown },
              { id: 'generate_invoices', label_en: 'Generate Invoices', label_bn: 'ইনভয়েস তৈরি', icon: Receipt },
              { id: 'fee_structure', label_en: 'Fee Structure', label_bn: 'ফি কাঠামো', icon: Sliders },
              { id: 'fee_discounts', label_en: 'Fee Discounts', label_bn: 'ফি ডিসকাউন্ট', icon: Percent },
              { id: 'concession_report', label_en: 'Concession Report', label_bn: 'কনসেশন রিপোর্ট', icon: ClipboardList },
              { id: 'ledger', label_en: 'Ledger', label_bn: 'লেজার খাতা', icon: BookOpen },
              { id: 'fees_reports', label_en: 'Fees Reports', label_bn: 'ফি রিপোর্ট', icon: BarChart3 },
              { id: 'payroll', label_en: 'Teacher Payroll', label_bn: 'শিক্ষক পে-রোল', icon: Users },
              { id: 'inventory', label_en: 'Inventory & Assets', label_bn: 'ইনভেন্টরি ও সম্পদ', icon: Package },
              { id: 'profile', label_en: 'Profile', label_bn: 'প্রোফাইল', icon: UserCheck },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#004D40] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{lang === 'bn' ? item.label_bn : item.label_en}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40">
          <div className="bg-slate-100/60 p-3 rounded-lg border border-slate-200/50 mb-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-[#004D40] text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                KH
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 text-xs font-bold truncate">
                  {lang === 'bn' ? 'কামরুল হাসান' : 'Kamrul Hasan'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {lang === 'bn' ? 'হিসাবরক্ষক' : 'Finance Officer'}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-rose-600 font-bold text-xs rounded-lg transition-all cursor-pointer border border-slate-200/60"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{lang === 'bn' ? 'লগআউট' : 'Logout Portal'}</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN VIEW CONTENT AREA                                    */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP COMPACT HEADER */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-left">
            <div className="md:hidden h-8 w-8 bg-[#004D40] text-teal-50 rounded-lg flex items-center justify-center">
              <Coins className="h-4.5 w-4.5" />
            </div>
            
            {/* Search Input Box */}
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder={lang === 'bn' ? 'খুঁজুন...' : 'Search...'}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#004D40] focus:ring-1 focus:ring-[#004D40] transition-all"
              />
            </div>
          </div>

          {/* Quick Header actions */}
          <div className="flex items-center gap-3">
            {/* Lang Switcher */}
            <div className="bg-slate-50 border border-slate-200 p-0.5 rounded-xl flex items-center shadow-3xs">
              <button
                onClick={() => setLang('bn')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'bn' ? 'bg-[#004D40] text-white font-black' : 'text-slate-500 hover:text-[#004D40]'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-[#004D40] text-white font-black' : 'text-slate-500 hover:text-[#004D40]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Profile badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-[#004D40] text-emerald-100 flex items-center justify-center font-extrabold text-xs uppercase shadow-sm">
                KH
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-slate-800 text-xs font-bold leading-none">{lang === 'bn' ? 'কামরুল হাসান' : 'Finance Officer'}</p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">{lang === 'bn' ? 'হিসাবরক্ষক' : 'Accountant'}</p>
              </div>
            </div>

            {/* Mobile-only logout */}
            <button 
              onClick={onLogout}
              className="md:hidden p-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* BODY CONTAINER */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' ? (
            <AccountantOverview
              lang={lang}
              stats={stats}
              txs={txs}
              setActiveTab={setActiveTab}
              setShowAddExpenseModal={(show) => {
                if (show) handleOpenAddExpenseModal();
                else setShowAddExpenseModal(false);
              }}
            />
          ) : activeTab === 'collect_fees' ? (
            <CollectFeesView
              lang={lang}
              spotCashForm={spotCashForm}
              setSpotCashForm={setSpotCashForm}
              handleSpotCashSubmit={handleSpotCashSubmit}
              mockStudents={mockStudents}
              txs={txs}
              setTxs={setTxs}
              stats={stats}
              setStats={setStats}
            />
          ) : activeTab === 'expense_reports' ? (
            <ExpenseReportsView lang={lang} />
          ) : activeTab === 'generate_invoices' ? (
            <GenerateInvoicesView
              lang={lang}
              isProcessingBulk={isProcessingBulk}
              bulkProgress={bulkProgress}
              handleRunBulkInvoice={handleRunBulkInvoice}
              showToastMsg={showToastMsg}
            />
          ) : activeTab === 'fee_structure' ? (
            <FeeStructureView
              lang={lang}
              feeStructures={feeStructures}
              setFeeStructures={setFeeStructures}
              editingFee={editingFee}
              setEditingFee={setEditingFee}
              showToastMsg={showToastMsg}
            />
          ) : activeTab === 'fee_discounts' ? (
            <FeeDiscountsView
              lang={lang}
              feeDiscounts={feeDiscounts}
              setFeeDiscounts={setFeeDiscounts}
              discountForm={discountForm}
              setDiscountForm={setDiscountForm}
              showToastMsg={showToastMsg}
            />
          ) : activeTab === 'concession_report' ? (
            <ConcessionReportView
              lang={lang}
              feeDiscounts={feeDiscounts}
            />
          ) : activeTab === 'fees_reports' ? (
            <FeesReportsView lang={lang} />
          ) : activeTab === 'profile' ? (
            <ProfileView lang={lang} />
          ) : activeTab === 'ledger' ? (
            <>
              {/* ======================================================== */}
              {/* 1. CASHFLOW & AI INSIGHTS HERO BANNER                     */}
          {/* ======================================================== */}
          <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-[#004D40] to-teal-950 rounded-2xl shadow-md border border-teal-800 p-5 sm:p-6 text-white text-left">
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none">
              <Activity className="h-full w-full rotate-12" />
            </div>
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-teal-800/80 text-teal-300 rounded-lg border border-teal-700/50">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                    {currentT.greeting}
                  </h3>
                </div>
                
                <p className="text-xs text-teal-100/90 leading-relaxed font-medium">
                  {smsSentToday ? currentT.aiBannerDone : currentT.aiBanner}
                </p>
              </div>

              {!smsSentToday && (
                <button
                  onClick={() => setShowSmsModal(true)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start md:self-center cursor-pointer active:scale-95 border border-emerald-400 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{currentT.sendSmsBtn}</span>
                </button>
              )}
            </div>
          </section>

          {/* ======================================================== */}
          {/* 2. HIGH-IMPACT FINANCIAL KPI CARDS                        */}
          {/* ======================================================== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: Total Collection */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between relative overflow-hidden text-left min-h-32">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                  {currentT.totalColl}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#004D40] block mt-1">
                  ৳{stats.totalCollected.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 mb-1">
                  <span>81%</span>
                  <span>{currentT.targetText}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '81%' }} />
                </div>
              </div>
            </div>

            {/* Card 2: Pending Dues */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between relative overflow-hidden text-left min-h-32">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    {currentT.pendingDues}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-600 block mt-1">
                    ৳{stats.pendingDues.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[9px] bg-amber-50 text-amber-800 font-black px-2 py-0.5 rounded-md border border-amber-100 uppercase tracking-wide">
                  {lang === 'bn' ? '১৪২ জন' : '142 Unpaid'}
                </span>
              </div>
              <div className="text-[10px] text-[#475569] font-bold mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
                <Clock className="h-3 w-3 text-amber-500" />
                <span>{currentT.unpaidGuardians}</span>
              </div>
            </div>

            {/* Card 3: Overdue Accounts */}
            <div className="bg-rose-50/60 border border-rose-200 p-5 rounded-xl shadow-3xs flex flex-col justify-between relative overflow-hidden text-left min-h-32">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider block">
                    {currentT.overdueAcc}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-rose-700 block mt-1">
                    ৳{stats.overdue.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping mt-1" />
              </div>
              <div className="text-[10px] text-rose-700 font-bold mt-2 flex items-center gap-1.5 border-t border-rose-100 pt-2.5">
                <AlertTriangle className="h-3 w-3" />
                <span>{currentT.daysOverdue}</span>
              </div>
            </div>

            {/* Card 4: Available Bank Balance */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between relative overflow-hidden text-left min-h-32">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    {currentT.bankBal}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-cyan-800 block mt-1">
                    ৳{stats.bankBalance.toLocaleString('en-IN')}
                  </span>
                </div>
                {/* SVG Mini Trendline */}
                <div className="w-14 h-8 shrink-0">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                    <path
                      d="M 0 25 Q 15 15, 30 20 T 60 5 T 90 10"
                      fill="none"
                      stroke="#0D9488"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 25 Q 15 15, 30 20 T 60 5 T 90 10 L 90 30 L 0 30 Z"
                      fill="url(#sparklineGrad)"
                      opacity="0.1"
                    />
                    <defs>
                      <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0D9488" />
                        <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="text-[10px] text-cyan-700 font-bold mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2.5">
                <TrendingUp className="h-3 w-3" />
                <span>{currentT.ledgerBal}</span>
              </div>
            </div>

          </section>

          {/* ======================================================== */}
          {/* 3. CORE INTELLIGENT GRID (2-COLUMN MAIN LAYOUT)          */}
          {/* ======================================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* LEFT COLUMN: CASHFLOW & ANALYTICS (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Fee Collection Status (Live Donut Chart) */}
              <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-[#004D40]" />
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {currentT.feeStatus}
                    </h4>
                  </div>
                  <span className="text-[10px] bg-slate-50 text-slate-500 font-extrabold px-2.5 py-1 rounded-lg border border-slate-200">
                    {lang === 'bn' ? "জুলাই ২০২৬" : "July 2026 Academic"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                  {/* Interactive SVG Donut Chart */}
                  <div className="relative w-40 h-40 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Segment: Pending Dues (19% Amber) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#FBBF24"
                        strokeWidth="10"
                        strokeDasharray="238.76"
                        strokeDashoffset="0"
                        className="transition-all duration-300"
                        onMouseEnter={() => setSelectedChartSegment('pending')}
                        onMouseLeave={() => setSelectedChartSegment(null)}
                      />
                      {/* Segment: Paid Collection (81% Teal) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#0D9488"
                        strokeWidth="10"
                        strokeDasharray="238.76"
                        strokeDashoffset="45.36" // 19% * 2.3876
                        className="transition-all duration-300 cursor-pointer hover:stroke-[#0f766e]"
                        onMouseEnter={() => setSelectedChartSegment('paid')}
                        onMouseLeave={() => setSelectedChartSegment(null)}
                      />
                    </svg>

                    {/* Center details */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                      <span className="text-2xl font-black text-slate-900 leading-none">
                        {selectedChartSegment === 'pending' ? '19%' : '81%'}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 mt-0.5 uppercase tracking-wide">
                        {selectedChartSegment === 'pending' 
                          ? (lang === 'bn' ? 'বকেয়া' : 'Pending') 
                          : (lang === 'bn' ? 'আদায়কৃত' : 'Collected')}
                      </span>
                    </div>
                  </div>

                  {/* Legends & Metrics */}
                  <div className="space-y-3 shrink-0 text-left w-full sm:w-auto">
                    {/* Paid portion */}
                    <div 
                      className={`p-2.5 rounded-xl border transition-all select-none ${
                        selectedChartSegment === 'paid' ? 'bg-teal-50/50 border-teal-200' : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-teal-600 block shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase">
                            {lang === 'bn' ? "পরিশোধিত ফি (আদায়কৃত)" : "Fees Collected (M-T-D)"}
                          </p>
                          <p className="text-sm font-black text-teal-800 leading-snug mt-0.5">
                            ৳{stats.totalCollected.toLocaleString('en-IN')} (81%)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pending portion */}
                    <div 
                      className={`p-2.5 rounded-xl border transition-all select-none ${
                        selectedChartSegment === 'pending' ? 'bg-amber-50/50 border-amber-200' : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-amber-400 block shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase">
                            {lang === 'bn' ? "অনাদায়ী ফি (বকেয়া)" : "Pending Receivables"}
                          </p>
                          <p className="text-sm font-black text-amber-700 leading-snug mt-0.5">
                            ৳{stats.pendingDues.toLocaleString('en-IN')} (19%)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Invoices & Transactions Table */}
              <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2 text-left">
                    <FileText className="h-4.5 w-4.5 text-[#004D40]" />
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {currentT.recentTx}
                    </h4>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase">
                        <th className="pb-2.5">{lang === 'bn' ? 'ইনভয়েস' : 'Invoice'}</th>
                        <th className="pb-2.5">{currentT.studentName}</th>
                        <th className="pb-2.5">{currentT.method}</th>
                        <th className="pb-2.5 text-right">{currentT.amount}</th>
                        <th className="pb-2.5 text-right pl-4">{currentT.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-extrabold text-left">
                      {txs.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/40 transition-colors group">
                          <td className="py-3 pr-2">
                            <span className="font-mono text-[10px] font-black text-slate-400 block">
                              {t.id}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
                              {t.date}
                            </span>
                          </td>
                          <td className="py-3">
                            <p className="text-xs font-black text-slate-800 leading-none">{t.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-1">
                              {t.class} &bull; Roll: {t.idNo}
                            </p>
                          </td>
                          <td className="py-3">
                            {renderMethodBadge(t.method)}
                          </td>
                          <td className="py-3 text-right text-slate-900 font-black text-xs">
                            ৳{t.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 text-right pl-4">
                            <button
                              onClick={() => setShowReceiptModal(t)}
                              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-[#004D40] hover:text-[#004D40] rounded-lg transition-all text-[10px] font-black tracking-tight inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Printer className="h-2.5 w-2.5" />
                              <span>{lang === 'bn' ? 'রসিদ' : 'Receipt'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: QUICK ACTION HUB & DISPUTES (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Smart Action Hub */}
              <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <Sliders className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {currentT.actionHub}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Action 1: Collect Spot Cash */}
                  <button
                    onClick={() => setShowSpotCashModal(true)}
                    className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40] rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-9 w-9 bg-teal-50 text-teal-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                      {currentT.colSpotCash}
                    </span>
                  </button>

                  {/* Action 2: Generate Bulk Invoices */}
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40] rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-9 w-9 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                      {currentT.genBulkInvoice}
                    </span>
                  </button>

                  {/* Action 3: SMS Dues */}
                  <button
                    onClick={() => setShowSmsModal(true)}
                    className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40] rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-9 w-9 bg-purple-50 text-purple-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Send className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                      {lang === 'bn' ? 'বকেয়া এসএমএস পাঠান' : 'Dues Link via SMS'}
                    </span>
                  </button>

                  {/* Action 4: Export Audit Data */}
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40] rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-9 w-9 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Download className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                      {currentT.exportReport}
                    </span>
                  </button>

                </div>
              </div>

              {/* Dispute & Refund Approvals List */}
              <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-[#004D40]" />
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {currentT.disputesTitle}
                    </h4>
                  </div>
                  <span className="text-[9px] bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded-full border border-rose-100">
                    {disputes.filter(d => d.status === 'pending').length} {lang === 'bn' ? "বিবাদমান" : "Pending"}
                  </span>
                </div>

                <div className="space-y-3.5">
                  <AnimatePresence>
                    {disputes.map((d) => (
                      <motion.div
                        key={d.id}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0, padding: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl space-y-3 transition-colors overflow-hidden"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-xs text-slate-900">{d.name}</span>
                              <span className="h-1 w-1 bg-slate-300 rounded-full" />
                              <span className="text-[9px] text-[#475569] font-bold">{d.class} (Roll: {d.idNo})</span>
                            </div>
                            <p className="text-[10px] text-[#475569] font-medium mt-1 leading-snug">
                              {d.reason}
                            </p>
                          </div>
                          <span className="text-xs font-black text-slate-900 block tracking-tight">
                            ৳{d.amount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            d.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            d.status === 'reviewed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {d.status === 'approved' ? currentT.refunded :
                             d.status === 'reviewed' ? currentT.reviewed :
                             (lang === 'bn' ? 'অপেক্ষমান' : 'In dispute')}
                          </span>

                          {d.status === 'pending' && (
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleApproveDispute(d.id, d.amount, d.name)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-3xs"
                              >
                                <Check className="h-2.5 w-2.5" />
                                <span>{currentT.approve}</span>
                              </button>
                              <button
                                onClick={() => setShowReviewModal(d)}
                                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-300/40"
                              >
                                <span>{currentT.review}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>

          </section>
            </>
          ) : activeTab === 'payroll' ? (
            <TeacherPayrollDashboard lang={lang} showToastMsg={showToastMsg} />
          ) : activeTab === 'inventory' ? (
            <InventoryTrackerDashboard lang={lang} showToastMsg={showToastMsg} />
          ) : activeTab === 'expenses' ? (
            <ExpenseVendorDashboard lang={lang} showToastMsg={showToastMsg} />
          ) : null}
        </div>
      </main>

      {/* ======================================================== */}
      {/* GLOBAL REACTIVE REAL-TIME TOASTS                         */}
      {/* ======================================================== */}
      <AnimatePresence>
        {toast && (
          <div className="fixed top-6 right-6 z-[100] max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`p-4 rounded-xl shadow-xl flex items-center gap-3 text-xs font-black text-white ${
                toast.type === 'error' ? 'bg-rose-600 border border-rose-500' : 'bg-[#004D40] border border-teal-700'
              }`}
            >
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
              <span>{toast.text}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 1: COLLECT SPOT CASH PAYMENT                       */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showSpotCashModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSpotCashModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {currentT.spotCashTitle}
                  </h4>
                </div>
                <button 
                  onClick={() => setShowSpotCashModal(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSpotCashSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "শিক্ষার্থী আইডি সিলেক্ট করুন" : "Select Student ID (Mock DB)"}</label>
                  <select
                    value={spotCashForm.studentId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const stud = mockStudents[selectedId];
                      setSpotCashForm(prev => ({
                        ...prev,
                        studentId: selectedId,
                        // Pre-populate logical default amounts
                        amount: prev.feeType === 'Admission Fee' ? '5000' : '2000'
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#004D40] focus:bg-white cursor-pointer font-extrabold"
                  >
                    {Object.keys(mockStudents).map(id => (
                      <option key={id} value={id}>
                        ID: {id} &bull; {mockStudents[id].name} ({mockStudents[id].class})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{currentT.feeType}</label>
                    <select
                      value={spotCashForm.feeType}
                      onChange={(e) => {
                        const type = e.target.value;
                        setSpotCashForm(prev => ({
                          ...prev,
                          feeType: type,
                          amount: type === 'Admission Fee' ? '5000' : type === 'Exam Fee' ? '1200' : '2000'
                        }));
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer focus:outline-none focus:border-[#004D40] focus:bg-white"
                    >
                      <option value="Tuition Fee">{lang === 'bn' ? "মাসিক বেতন" : "Tuition Fee"}</option>
                      <option value="Admission Fee">{lang === 'bn' ? "ভর্তি ফি" : "Admission Fee"}</option>
                      <option value="Exam Fee">{lang === 'bn' ? "পরীক্ষার ফি" : "Exam Fee"}</option>
                      <option value="Lab Fee">{lang === 'bn' ? "ল্যাব ও সেমিনার ফি" : "Lab Fee"}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{currentT.paymentMethod}</label>
                    <select
                      value={spotCashForm.method}
                      onChange={(e) => setSpotCashForm(prev => ({ ...prev, method: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer focus:outline-none focus:border-[#004D40] focus:bg-white"
                    >
                      <option value="Cash">{lang === 'bn' ? "নগদ ক্যাশ" : "Cash / On-Spot"}</option>
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Visa">Visa / Credit Card</option>
                      <option value="Bank">Bank Deposit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "পরিশোধিত অর্থ (৳)" : "Amount Received (BDT)"}</label>
                  <input
                    type="number"
                    min="1"
                    value={spotCashForm.amount}
                    onChange={(e) => setSpotCashForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#004D40] focus:bg-white font-black text-sm"
                    required
                  />
                </div>

                <div className="flex gap-3.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSpotCashModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    {currentT.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold rounded-xl transition-colors cursor-pointer shadow-md text-center"
                  >
                    {currentT.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: BULK INVOICES GENERATOR                           */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessingBulk && setShowBulkModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {currentT.bulkInvoiceTitle}
                </h4>
                {!isProcessingBulk && (
                  <button 
                    onClick={() => setShowBulkModal(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>

              {isProcessingBulk ? (
                <div className="py-6 text-center space-y-4">
                  <RefreshCw className="h-10 w-10 text-[#004D40] animate-spin mx-auto" />
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-slate-800">
                      {lang === 'bn' ? `রোল আউট হচ্ছে... ${bulkProgress}%` : `Running SCMS Billing Engines... ${bulkProgress}%`}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {lang === 'bn' ? "সকল শ্রেণীর ডেটাবেস সিঙ্ক হচ্ছে..." : "Processing roster files & creating auto-remittance entries..."}
                    </p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#004D40] transition-all duration-200" style={{ width: `${bulkProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs font-extrabold text-slate-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{currentT.billingMonth}</label>
                      <select
                        value={bulkInvoiceForm.month}
                        onChange={(e) => setBulkInvoiceForm(prev => ({ ...prev, month: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                      >
                        <option value="July 2026">July 2026</option>
                        <option value="August 2026">August 2026</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{currentT.selectClass}</label>
                      <select
                        value={bulkInvoiceForm.selectedClass}
                        onChange={(e) => setBulkInvoiceForm(prev => ({ ...prev, selectedClass: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                      >
                        <option value="All">{currentT.allClasses}</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex gap-2">
                    <Info className="h-4 w-4 text-teal-800 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-teal-900 leading-normal font-bold">
                      {lang === 'bn' 
                        ? "এটি নির্বাচনকৃত সেশনের সকল শিক্ষার্থীর জন্য স্বয়ংক্রিয়ভাবে মাসিক বেতনের ডিক্লেয়ারেশন ও এসএমএস ইনভয়েস রসিদ জেনারেট করবে।" 
                        : "Generating bulk invoices automatically applies standard tuition templates to all rosters. All data syncs live on parent dashboards."}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowBulkModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors cursor-pointer"
                    >
                      {currentT.cancel}
                    </button>
                    <button
                      onClick={handleRunBulkInvoice}
                      className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold rounded-xl transition-colors cursor-pointer shadow-md"
                    >
                      {currentT.runEngine}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: SEND SMS DETAILS                                 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showSmsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSendingSms && setShowSmsModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {currentT.smsTitle}
                </h4>
                {!isSendingSms && (
                  <button 
                    onClick={() => setShowSmsModal(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>

              {isSendingSms ? (
                <div className="py-6 text-center space-y-4">
                  <Send className="h-10 w-10 text-emerald-600 animate-bounce mx-auto" />
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-slate-800">
                      {lang === 'bn' ? `ব্রডকাস্ট পাঠানো হচ্ছে... ${smsProgress}%` : `Dispatched API requests... ${smsProgress}%`}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {lang === 'bn' ? "মোবাইল অপারেটর গেটওয়ে লিংক সিঙ্ক হচ্ছে..." : "Broadcasting custom links to unpaid accounts..."}
                    </p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-200" style={{ width: `${smsProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs font-extrabold text-slate-800">
                  <p className="text-[#475569] leading-relaxed font-bold">
                    {currentT.smsPrompt}
                  </p>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                    <p className="text-slate-900 font-black">
                      {lang === 'bn' ? "বার্তা ডেমো (SMS Preview):" : "SMS Payload Example:"}
                    </p>
                    <p className="text-[11px] font-medium leading-relaxed text-slate-600 italic">
                      "Dear Guardian, Fee for Tasfia Karim is unpaid for July 2026. Total Overdue: ৳1500. Pay securely inside 1-click ledger here: https://scms.edu/pay/TXN_LINK."
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowSmsModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors"
                    >
                      {currentT.cancel}
                    </button>
                    <button
                      onClick={handleBroadcastSms}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-colors shadow-md cursor-pointer"
                    >
                      {currentT.sendSmsConfirm}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 4: EXPORT REPORT                                    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {currentT.exportTitle}
                </h4>
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">
                    {currentT.exportFormat}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setExportFormat('csv')}
                      className={`py-2 px-3 border rounded-xl font-extrabold transition-all ${
                        exportFormat === 'csv' 
                          ? 'border-[#004D40] bg-teal-50/40 text-[#004D40]' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      CSV Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportFormat('excel')}
                      className={`py-2 px-3 border rounded-xl font-extrabold transition-all ${
                        exportFormat === 'excel' 
                          ? 'border-[#004D40] bg-teal-50/40 text-[#004D40]' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      MS Excel
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportFormat('pdf')}
                      className={`py-2 px-3 border rounded-xl font-extrabold transition-all ${
                        exportFormat === 'pdf' 
                          ? 'border-[#004D40] bg-teal-50/40 text-[#004D40]' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      PDF Book
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1 text-[#475569]">
                  <p className="font-black text-slate-800">{lang === 'bn' ? "রিপোর্ট কন্টেন্ট:" : "Report Parameters:"}</p>
                  <p>&bull; July 2026 Academic Collections</p>
                  <p>&bull; 5 active logged remittance receipts</p>
                  <p>&bull; System operator: Kamrul Hasan</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl"
                  >
                    {currentT.cancel}
                  </button>
                  <button
                    onClick={handleExportLedger}
                    className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold rounded-xl transition-colors shadow-md flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 5: FULL-FIDELITY INVOICE RECEIPT VIEW                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showReceiptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReceiptModal(null)}
              className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              {/* Header inside receipt */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Building className="h-5 w-5 text-[#004D40]" />
                    <h4 className="font-extrabold text-sm text-slate-900 leading-none">
                      {lang === 'bn' ? "স্টুডেন্টস কেয়ার মডেল স্কুল" : "STUDENTS CARE MODEL SCHOOL"}
                    </h4>
                  </div>
                  <p className="text-[9px] text-[#475569] font-bold">
                    Govt Registration No: Dhaka-SCMS-2026 &bull; Dhaleshwari, Dhaka
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-wide">
                    {currentT.paidStatus}
                  </span>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">{currentT.invoiceNo}</p>
                    <p className="font-mono font-black text-slate-900">{showReceiptModal.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">{currentT.date}</p>
                    <p className="text-slate-900 font-bold">{showReceiptModal.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "শিক্ষার্থীর বিবরণ" : "Student Details"}</p>
                    <p className="text-slate-900 font-black">{showReceiptModal.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-0.5">{showReceiptModal.class} &bull; Roll ID: {showReceiptModal.idNo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "পরিশোধ পদ্ধতি" : "Payment Method"}</p>
                    <p className="text-slate-900 font-bold flex items-center gap-1">{showReceiptModal.method}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-0.5">Ref ID: SCMS-{showReceiptModal.idNo}-MTD</p>
                  </div>
                </div>

                {/* Items details table */}
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
                    <span>Description</span>
                    <span>Amount</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{showReceiptModal.type} ({showReceiptModal.class} Cycle)</span>
                    <span>৳{showReceiptModal.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-950 border-t border-slate-150 pt-2 text-sm">
                    <span>Total Paid</span>
                    <span>৳{showReceiptModal.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Footnote and Barcode */}
                <div className="flex justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-xl mt-4">
                  <div className="text-[9px] text-[#475569] font-medium leading-relaxed">
                    <p>&bull; This receipt is computer generated.</p>
                    <p>&bull; Secure payment processed via SCMS Ledger Panel.</p>
                  </div>
                  {/* barcode indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <QrCode className="h-7 w-7 text-slate-700" />
                    <span className="font-mono text-[7px] text-slate-400">VERIFIED-SCMS</span>
                  </div>
                </div>

                {/* Print button */}
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setShowReceiptModal(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 6: REASON REVIEW FOR DISPUTE                         */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {currentT.refundTitle}
                </h4>
                <button 
                  onClick={() => setShowReviewModal(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <p className="text-slate-400 uppercase text-[9px] tracking-wider">{lang === 'bn' ? "শিক্ষার্থীর নাম" : "Student Name"}</p>
                  <p className="text-slate-900 text-sm font-black">{showReviewModal.name}</p>
                  <p className="text-[#475569] font-medium mt-0.5">{showReviewModal.class} &bull; ID: {showReviewModal.idNo}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-slate-400 uppercase text-[9px] tracking-wider">{lang === 'bn' ? "অভিযোগের বিবরণ" : "Dispute Detail Reason"}</p>
                  <p className="text-slate-800 p-3 bg-rose-50 border border-rose-100/50 rounded-xl leading-relaxed">
                    {showReviewModal.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "টাকার পরিমাণ" : "Amount In Dispute"}</p>
                    <p className="text-sm font-black text-rose-700">৳{showReviewModal.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "রসিদ ফাইল ট্র্যাকার" : "Attached Proof File"}</p>
                    <span className="text-[10px] text-teal-800 underline font-black block mt-1 cursor-pointer">
                      bkash_scr_9012.png
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowReviewModal(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl"
                  >
                    {currentT.cancel}
                  </button>
                  <button
                    onClick={() => handleReviewDisputeSubmit(showReviewModal.id)}
                    className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold rounded-xl transition-colors shadow-md cursor-pointer text-center"
                  >
                    {lang === 'bn' ? "রিভিউ চিহ্নিত করুন" : "Mark Reviewed"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 7: ADD EXPENSE VOUCHER                             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAddExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddExpenseModal(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#F0F9F9] border border-teal-100 rounded-3xl shadow-2xl p-6 sm:p-8 text-left z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-850 tracking-tight">
                  {lang === 'bn' ? 'খরচ ভাউচার যুক্ত করুন' : 'Add Expense Voucher'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveExpense} className="space-y-4">
                {/* Account Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#475569]">
                    {lang === 'bn' ? 'অ্যাকাউন্টের নাম' : 'Account Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electricity Bill / Vendor Name"
                    value={expenseForm.accountName}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, accountName: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent transition-all"
                  />
                </div>

                {/* Address & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#475569]">
                      {lang === 'bn' ? 'ঠিকানা' : 'Address'}
                    </label>
                    <input
                      type="text"
                      placeholder="Vendor address"
                      value={expenseForm.address}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#475569]">
                      {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Utility, Salary, Stationery"
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Amount & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#475569]">
                      {lang === 'bn' ? 'পরিমাণ (৳)' : 'Amount (৳)'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#475569]">
                      {lang === 'bn' ? 'তারিখ' : 'Date'}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent transition-all"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Voucher No */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#475569]">
                    {lang === 'bn' ? 'ভাউচার নং' : 'Voucher No'}
                  </label>
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={expenseForm.voucherNo}
                    className="w-full bg-[#EBF5F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 font-mono cursor-not-allowed"
                  />
                </div>

                {/* Payment Method & Approved By */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#475569]">
                      {lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
                    </label>
                    <select
                      value={expenseForm.paymentMethod}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent transition-all"
                    >
                      <option value="Cash">{lang === 'bn' ? 'নগদ (Cash)' : 'Cash'}</option>
                      <option value="Bank Transfer">{lang === 'bn' ? 'ব্যাংক ট্রান্সফার' : 'Bank Transfer'}</option>
                      <option value="bKash">{lang === 'bn' ? 'বিকাশ' : 'bKash'}</option>
                      <option value="Nagad">{lang === 'bn' ? 'নগদ (Mobile)' : 'Nagad'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#475569]">
                      {lang === 'bn' ? 'অনুমোদনকারী' : 'Approved By'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Principal Md. Rahman"
                      value={expenseForm.approvedBy}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, approvedBy: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Upload Receipt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#475569]">
                    {lang === 'bn' ? 'রসিদ আপলোড করুন (ছবি / পিডিএফ)' : 'Upload Receipt (Photo / PDF)'}
                  </label>
                  <div className="relative flex items-center bg-white border border-slate-200 rounded-xl p-2">
                    <input
                      type="file"
                      id="expense-file-upload"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setExpenseForm(prev => ({
                            ...prev,
                            receiptFile: file,
                            receiptFileName: file.name
                          }));
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('expense-file-upload')?.click()}
                      className="px-4 py-2 bg-[#004D40] hover:bg-teal-900 text-teal-50 text-xs font-bold rounded-lg transition-colors cursor-pointer mr-3 shrink-0"
                    >
                      Browse...
                    </button>
                    <span className="text-xs text-slate-500 font-medium truncate">
                      {expenseForm.receiptFileName || (lang === 'bn' ? 'কোনো ফাইল নির্বাচন করা হয়নি' : 'No file selected.')}
                    </span>
                    {expenseForm.receiptFileName && (
                      <button
                        type="button"
                        onClick={() => setExpenseForm(prev => ({ ...prev, receiptFile: null, receiptFileName: '' }))}
                        className="ml-auto text-rose-500 hover:text-rose-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#475569]">
                    {lang === 'bn' ? 'বিবরণ' : 'Description'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Purpose / details of expense"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setShowAddExpenseModal(false)}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Save & Preview
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 8: VOUCHER PREVIEW (OFFICE COPY & ACCOUNT COPY)     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showVoucherPreview && previewVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVoucherPreview(false)}
              className="absolute inset-0"
            />

            {/* Print style injection to make printing flawless */}
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-voucher-sheet, #printable-voucher-sheet * {
                  visibility: visible !important;
                }
                #printable-voucher-sheet {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  background: white !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                }
              }
            `}} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-[#F0F9F9] border border-teal-100 rounded-3xl shadow-2xl p-6 sm:p-8 text-left z-10 max-h-[95vh] overflow-y-auto print:p-0 print:bg-white print:border-none print:shadow-none"
            >
              {/* Header (No-print) */}
              <div className="flex justify-between items-center mb-6 print:hidden">
                <h3 className="text-lg font-black text-slate-850 tracking-tight flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-[#004D40]" />
                  {lang === 'bn' ? 'ভাউচার প্রিভিউ' : 'Voucher Preview'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowVoucherPreview(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/50 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Printable sheet containing both copies separated by Cut Here */}
              <div id="printable-voucher-sheet" className="space-y-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 print:p-0 print:bg-white print:border-none">
                {/* 1. Office Copy */}
                {renderVoucherCopy('OFFICE COPY')}

                {/* 2. Cut Here Separator */}
                <div className="flex items-center gap-2 my-4 text-slate-400 select-none print:hidden">
                  <div className="grow border-t border-dashed border-slate-300"></div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                    <span>✂</span>
                    <span>{lang === 'bn' ? 'এখান থেকে কাটুন' : 'CUT HERE'}</span>
                  </div>
                  <div className="grow border-t border-dashed border-slate-300"></div>
                </div>

                {/* 3. Account Copy */}
                {renderVoucherCopy('ACCOUNT COPY')}
              </div>

              {/* Action Buttons (No-print) */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200/50 print:hidden justify-end">
                <button
                  type="button"
                  onClick={() => setShowVoucherPreview(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  {lang === 'bn' ? 'ভাউচার প্রিন্ট করুন' : 'Print Voucher'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
