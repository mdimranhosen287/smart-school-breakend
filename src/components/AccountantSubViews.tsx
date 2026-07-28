import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Plus, 
  Receipt, 
  Coins, 
  Wallet, 
  AlertCircle, 
  Download, 
  X, 
  ChevronRight,
  UserCheck,
  Search,
  Printer,
  Eye,
  Send,
  TrendingUp,
  FolderOpen,
  FileSpreadsheet,
  AlertTriangle,
  Folder,
  ArrowDownRight,
  Sparkles,
  Bell,
  RefreshCw
} from 'lucide-react';

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

// ==========================================
// 1. COLLECT FEES VIEW
// ==========================================
interface CollectFeesViewProps {
  lang: 'bn' | 'en';
  spotCashForm: { studentId: string; feeType: string; method: string; amount: string };
  setSpotCashForm: React.Dispatch<React.SetStateAction<{ studentId: string; feeType: string; method: string; amount: string }>>;
  handleSpotCashSubmit: (e: React.FormEvent) => void;
  mockStudents: Record<string, { name: string; class: string }>;
  txs: any[];
  setTxs: React.Dispatch<React.SetStateAction<any[]>>;
  stats: any;
  setStats: React.Dispatch<React.SetStateAction<any>>;
}

export function CollectFeesView({
  lang,
  spotCashForm,
  setSpotCashForm,
  handleSpotCashSubmit,
  mockStudents,
  txs,
  setTxs,
  stats,
  setStats
}: CollectFeesViewProps) {
  // Modal togglers
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Search & Filters states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');

  // Dynamic calculations / adjustments tracked locally
  const [additionalCollection, setAdditionalCollection] = useState(0);

  // Toast indicator (localized)
  const [localToast, setLocalToast] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setLocalToast({ text, type });
    setTimeout(() => setLocalToast(null), 4000);
  };

  // Base list of student invoices matching Image 1
  const [invoices, setInvoices] = useState([
    { id: "INV-2048", studentName: "Aarav Hossain", classId: "8-A", rollId: "01", month: "August", type: "Tuition", method: "bKash", date: "2026-06-18", amount: 3200, status: "Paid", description: "Monthly Tuition Fee - August Cycle" },
    { id: "INV-2047", studentName: "Maya Rahman", classId: "6-B", rollId: "05", month: "August", type: "Tuition", method: "Cash", date: "2026-06-18", amount: 2800, status: "Paid", description: "Monthly Tuition Fee - August Cycle" },
    { id: "INV-2046", studentName: "Tanvir Ahmed", classId: "9-A", rollId: "03", month: "August", type: "Exam", method: "Bank", date: "2026-06-17", amount: 3500, status: "Pending", description: "Half-Yearly Exam Fees 2026" },
    { id: "INV-2045", studentName: "Nadia Islam", classId: "7-C", rollId: "12", month: "August", type: "Tuition", method: "Card", date: "2026-05-30", amount: 3000, status: "Overdue", description: "Monthly Tuition Fee - August Cycle" }
  ]);

  // Combine parent txs or track new collections in our state
  useEffect(() => {
    // If parent added something via handleSpotCashSubmit, we can merge or make sure it's reflected
    // We synchronize parent txs with our local high fidelity invoices list!
    const unseenTxs = txs.filter(t => !invoices.some(inv => inv.id === t.id));
    if (unseenTxs.length > 0) {
      const formatted = unseenTxs.map(t => ({
        id: t.id.startsWith("INV") ? t.id : `INV-${t.id.slice(-4)}`,
        studentName: t.name,
        classId: t.class.replace("Class ", ""),
        rollId: t.idNo.slice(-2),
        month: "August",
        type: t.type.replace(" Fee", ""),
        method: t.method,
        date: t.date,
        amount: t.amount,
        status: "Paid",
        description: `${t.type} Payment`
      }));
      setInvoices(prev => [...formatted, ...prev]);
    }
  }, [txs]);

  // "+ Collect Fee" form state
  const classOptions = ['5-A', '6-B', '7-C', '8-A', '9-A', '10-A'];
  const [formClass, setFormClass] = useState('8-A');
  const [formSection, setFormSection] = useState('A');
  const [formRoll, setFormRoll] = useState('12');

  // List of mock students categorized by class to make form autofill magical
  const mockStudentsLookup: Record<string, { id: string, name: string }[]> = {
    '5-A': [
      { id: '2026110', name: 'Zayan Ahmed' },
      { id: '2026111', name: 'Tasnia Karim' }
    ],
    '6-B': [
      { id: '2026103', name: 'Maya Rahman' },
      { id: '2026112', name: 'Israt Jahan' }
    ],
    '7-C': [
      { id: '2026105', name: 'Nadia Islam' },
      { id: '2026113', name: 'Anisur Rahman' }
    ],
    '8-A': [
      { id: '2026101', name: 'Aarav Hossain' },
      { id: '2026102', name: 'Farhan Ishrak' }
    ],
    '9-A': [
      { id: '2026104', name: 'Tanvir Ahmed' },
      { id: '2026114', name: 'Rohan Chowdhury' }
    ],
    '10-A': [
      { id: '2026115', name: 'Abrar Fahad' },
      { id: '2026116', name: 'Sadia Sultana' }
    ]
  };

  const getStudentsForClass = (cls: string) => mockStudentsLookup[cls] || [{ id: '2026999', name: 'Walk-in Student' }];

  const [formStudentId, setFormStudentId] = useState('2026101');
  const [formFeeType, setFormFeeType] = useState('Tuition');
  const [formBaseAmount, setFormBaseAmount] = useState(3000);

  // Month pills states
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [formMonths, setFormMonths] = useState<string[]>(['Aug']);

  // Exam pills states
  const examList = [
    '1st Semester Exam',
    '2nd Semester Exam',
    '3rd Semester Exam',
    '4th Semester Exam',
    '1st Model Test Exam',
    '2nd Model Test Exam',
    'Half Yearly Exam',
    'Annual Exam'
  ];
  const [formExams, setFormExams] = useState<string[]>([]);

  // Payment Method state
  const paymentMethods = ['Cash', 'bKash', 'Rocket', 'Nagad', 'Bank', 'Card'];
  const [formMethod, setFormMethod] = useState('Cash');

  // Adjustments states
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formFine, setFormFine] = useState<number>(0);

  // Calculations
  const calcNetPayable = () => {
    const monthlyTotal = formBaseAmount * formMonths.length;
    const examTotal = formExams.length * 1500; // Assume ৳1,500 per exam fee
    return Math.max(0, monthlyTotal + examTotal - formDiscount + formFine);
  };

  const [formPayAmount, setFormPayAmount] = useState<number>(3000);
  const [formRemarks, setFormRemarks] = useState('');
  const [formMarkAsPartial, setFormMarkAsPartial] = useState(false);

  // Auto-sync payAmount to Net Payable when components of Net Payable change
  useEffect(() => {
    const net = calcNetPayable();
    setFormPayAmount(net);
    if (net > 0 && formPayAmount > net) {
      setFormPayAmount(net);
    }
  }, [formBaseAmount, formMonths, formExams, formDiscount, formFine]);

  const calcOutstanding = () => {
    return Math.max(0, calcNetPayable() - formPayAmount);
  };

  // Sync Student Selection when class changes
  useEffect(() => {
    const list = getStudentsForClass(formClass);
    if (list.length > 0) {
      setFormStudentId(list[0].id);
    }
  }, [formClass]);

  // Form Submit Action
  const handleCollectFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentsList = getStudentsForClass(formClass);
    const matchedStud = studentsList.find(s => s.id === formStudentId) || { name: "Unknown Student", id: formStudentId };
    const netPayable = calcNetPayable();
    const paidAmount = formPayAmount;

    if (paidAmount <= 0) {
      showToast(lang === 'bn' ? 'দয়া করে পরিশোধের পরিমাণ লিখুন!' : 'Please enter a valid pay amount!', 'error');
      return;
    }

    const outstanding = calcOutstanding();
    const status = outstanding === 0 ? 'Paid' : (formMarkAsPartial ? 'Paid' : 'Pending');

    const newInvoice = {
      id: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
      studentName: matchedStud.name,
      classId: formClass,
      rollId: formRoll,
      month: formMonths.join(', ') || 'August',
      type: formFeeType,
      method: formMethod,
      date: new Date().toISOString().split('T')[0],
      amount: paidAmount,
      status: status,
      description: `${formFeeType} Fee payment for month(s): ${formMonths.join(', ')}. ${formRemarks}`
    };

    // Update Local and Parent lists
    setInvoices(prev => [newInvoice, ...prev]);

    // Parent transactions sync
    const parentTx = {
      id: newInvoice.id,
      date: newInvoice.date,
      name: newInvoice.studentName,
      class: `Class ${formClass}`,
      idNo: formStudentId,
      method: formMethod,
      type: `${formFeeType} Fee`,
      amount: paidAmount
    };
    setTxs(prev => [parentTx, ...prev]);

    // Update parent metrics dynamically
    setStats((prev: any) => ({
      ...prev,
      todaysCollection: prev.todaysCollection + paidAmount,
      netBalance: prev.netBalance + paidAmount,
      cashInHand: formMethod === 'Cash' ? prev.cashInHand + paidAmount : prev.cashInHand,
      bankBalance: formMethod !== 'Cash' ? prev.bankBalance + paidAmount : prev.bankBalance,
      pendingDues: Math.max(0, prev.pendingDues - paidAmount)
    }));

    setAdditionalCollection(prev => prev + paidAmount);

    // Prepare Invoice for receipt layout & launch preview
    setSelectedInvoice(newInvoice);
    setShowCollectModal(false);
    setShowReceiptModal(true);

    showToast(
      lang === 'bn' 
        ? `${matchedStud.name}-এর জন্য ৳${paidAmount.toLocaleString()} ফি আদায় করা হয়েছে এবং রসিদ তৈরি হয়েছে!` 
        : `Recorded ৳${paidAmount.toLocaleString()} fee for ${matchedStud.name}. Money receipt generated!`,
      'success'
    );
  };

  // Helper functions for horizontal method pills
  const renderMethodBadge = (m: string) => {
    const colors: Record<string, string> = {
      Cash: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      bKash: 'bg-pink-50 text-pink-700 border-pink-100',
      Nagad: 'bg-orange-50 text-orange-700 border-orange-100',
      Rocket: 'bg-purple-50 text-purple-700 border-purple-100',
      Card: 'bg-blue-50 text-blue-700 border-blue-100',
      Visa: 'bg-blue-50 text-blue-700 border-blue-100',
      Bank: 'bg-teal-50 text-teal-700 border-teal-100'
    };
    const c = colors[m] || 'bg-slate-50 text-slate-700 border-slate-100';
    return (
      <span className={`px-2 py-1 text-[10px] font-extrabold border rounded-md uppercase tracking-tight ${c}`}>
        {m}
      </span>
    );
  };

  // Filter calculations
  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = 
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.classId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchClass = selectedClassFilter === 'All' || inv.classId.includes(selectedClassFilter);
    const matchType = selectedTypeFilter === 'All' || inv.type.toLowerCase() === selectedTypeFilter.toLowerCase();

    return matchSearch && matchClass && matchType;
  });

  // Dual Copy receipt copy renderer
  const renderMoneyReceiptCopy = (copyType: 'STUDENT COPY' | 'OFFICE COPY') => {
    if (!selectedInvoice) return null;
    const dateFormatted = selectedInvoice.date.split('-').reverse().join('/');
    const words = numberToWords(selectedInvoice.amount);

    return (
      <div className="bg-white border-2 border-slate-800 rounded-xl p-5 sm:p-6 text-slate-900 relative shadow-xs">
        {/* Header section with circular SCMS logo */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-slate-300 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center font-black text-xs text-slate-800 tracking-wider bg-slate-50 shrink-0 select-none">
              SCMS
            </div>
            <div className="text-left">
              <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-wider leading-none">
                STUDENTS CARE MODEL SCHOOL
              </h2>
              <p className="text-[9px] font-bold text-slate-500 leading-tight mt-1">
                Main Road, Dhaka, Bangladesh &bull; +880 1812-555066 &bull; info@scms.edu.bd
              </p>
            </div>
          </div>
          <div className="border border-slate-800 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-800 bg-slate-50 rounded">
            {copyType}
          </div>
        </div>

        {/* BLUE MONEY RECEIPT TITLE BAR */}
        <div className="bg-[#1565C0] text-white py-1.5 px-4 rounded mb-4 text-center">
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">
            MONEY RECEIPT / টাকা প্রাপ্তি রসিদ
          </h3>
        </div>

        {/* Dotted underline metadata fields */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-[11px] font-bold mb-5 text-left">
          <div className="flex items-end gap-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0">INVOICE NO:</span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 font-mono text-slate-800">{selectedInvoice.id}</span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0">DATE:</span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800">{dateFormatted}</span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0">METHOD:</span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800">{selectedInvoice.method}</span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0">REFERENCE:</span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800">SCMS-{selectedInvoice.rollId}-REC</span>
          </div>

          <div className="flex items-end gap-1.5 sm:col-span-2">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0">STUDENT:</span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800 uppercase">{selectedInvoice.studentName}</span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0">ROLL / ID:</span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800">{selectedInvoice.rollId || '—'}</span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0">CLASS & SEC:</span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800 uppercase">{selectedInvoice.classId}</span>
          </div>

          <div className="flex items-end gap-1.5 sm:col-span-4">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 shrink-0">MONTH(S):</span>
            <span className="grow border-b border-dotted border-slate-400 pb-0.5 text-slate-800">{selectedInvoice.month || 'August'}</span>
          </div>
        </div>

        {/* Table of particulars */}
        <div className="border border-slate-300 rounded overflow-hidden mb-4">
          <div className="grid grid-cols-4 bg-[#1565C0] text-white text-[9px] font-black uppercase tracking-wider py-1.5 px-3">
            <div className="col-span-3 text-left">DESCRIPTION</div>
            <div className="col-span-1 text-right">AMOUNT (BDT)</div>
          </div>
          <div className="grid grid-cols-4 py-3 px-3 text-xs text-slate-800 font-bold border-b border-slate-200">
            <div className="col-span-3 text-left capitalize">
              {selectedInvoice.type} Fee payment ({selectedInvoice.month})
            </div>
            <div className="col-span-1 text-right font-mono">
              ৳{selectedInvoice.amount.toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-4 bg-blue-50/50 py-2 px-3 text-xs font-black text-slate-900 border-t border-slate-200">
            <div className="col-span-3 text-left">TOTAL PAID AMOUNT</div>
            <div className="col-span-1 text-right font-mono text-[#1565C0]">
              ৳{selectedInvoice.amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* In Words bar */}
        <div className="text-left text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 p-2 rounded mb-6 italic flex gap-1.5">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 not-italic shrink-0">IN WORDS:</span>
          <span>{words}</span>
        </div>

        {/* Stamp & Signatures */}
        <div className="flex justify-between items-end pt-2 relative">
          {/* Student signature line */}
          <div className="flex flex-col items-center w-1/3">
            <div className="w-full border-b border-slate-400 mb-1"></div>
            <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">
              Student / Guardian Signature
            </span>
          </div>

          {/* GREEN CASH RECEIVED STAMP */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 flex items-center justify-center select-none rotate-[-15deg] opacity-80 pointer-events-none z-10">
            <div className="relative w-16 h-16 rounded-full border-2 border-double border-emerald-500 flex items-center justify-center bg-white/40">
              <div className="absolute inset-0.5 rounded-full border border-dashed border-emerald-400/60 flex items-center justify-center">
                <div className="text-[8px] font-black text-emerald-600 text-center tracking-tighter leading-none uppercase">
                  CASH<br/>RECEIVED<br/>✓
                </div>
              </div>
            </div>
          </div>

          {/* Accountant signature line */}
          <div className="flex flex-col items-center w-1/3">
            <span className="text-[9px] font-mono text-slate-700 leading-none mb-0.5">Kamrul Hasan</span>
            <div className="w-full border-b border-slate-400 mb-1"></div>
            <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">
              Authorized Accountant
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header section with Title and "+ Collect Fee" primary button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Coins className="h-6 w-6 text-[#004D40]" />
            {lang === 'bn' ? 'ফি আদায় ও প্রাপ্তি' : 'Fees'}
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {lang === 'bn' ? 'বিলিং, ইনভয়েস ট্র্যাকিং এবং আদায় সংক্রান্ত লেজার খতিয়ান।' : 'Billing, invoices, and transaction logs.'}
          </p>
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => showToast(lang === 'bn' ? 'সকল লেনদেন CSV হিসেবে এক্সপোর্ট করা হচ্ছে...' : 'Exporting invoices ledger as CSV format...', 'info')}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 font-extrabold hover:bg-slate-50 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{lang === 'bn' ? 'এক্সপোর্ট' : 'Export'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowCollectModal(true)}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            <span>{lang === 'bn' ? 'ফি সংগ্রহ করুন' : 'Collect Fee'}</span>
          </button>
        </div>
      </div>

      {/* TOP THREE METRICS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Collected (Green background) */}
        <div className="bg-[#004D40] text-emerald-50 rounded-2xl p-5 border border-teal-950/20 shadow-xs relative overflow-hidden flex flex-col justify-between h-[105px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-200/80">
                {lang === 'bn' ? 'আদায়কৃত' : 'Collected'}
              </p>
              <h2 className="text-2xl font-black mt-1 tracking-tight font-sans">
                ৳{(22000 + additionalCollection).toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="p-2 bg-teal-950/30 rounded-xl">
              <Wallet className="h-5 w-5 text-emerald-300" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-emerald-200/70">
            {lang === 'bn' ? 'চলতি মাস' : 'This month'}
          </p>
        </div>

        {/* Card 2: Pending (White with orange accents) */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between h-[105px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {lang === 'bn' ? 'বকেয়া' : 'Pending'}
              </p>
              <h2 className="text-2xl font-black mt-1 tracking-tight font-sans text-slate-800">
                ৳{Math.max(0, 9300 - additionalCollection).toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="p-2 bg-amber-50 rounded-xl">
              <Folder className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400">
            {lang === 'bn' ? 'পরিশোধের অপেক্ষায়' : 'Awaiting payment'}
          </p>
        </div>

        {/* Card 3: Overdue (White with rose/red accents) */}
        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between h-[105px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {lang === 'bn' ? 'অতিবকেয়া' : 'Overdue'}
              </p>
              <h2 className="text-2xl font-black mt-1 tracking-tight font-sans text-slate-800">
                ৳6,500
              </h2>
            </div>
            <div className="p-2 bg-rose-50 rounded-xl">
              <ArrowDownRight className="h-5 w-5 text-rose-500" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-rose-500">
            {lang === 'bn' ? '> ৩০ দিন বিলম্বিত' : '> 30 days late'}
          </p>
        </div>
      </div>

      {/* REVENUE TREND CHART (High Fidelity representation) */}
      <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-[#004D40]" />
              {lang === 'bn' ? 'রাজস্ব আদায়ের ধারা' : 'Revenue Trend'}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
              {lang === 'bn' ? 'আদায় পারফরম্যান্স - বিগত ৬ মাস' : 'Collection performance · last 6 months'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-extrabold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#004D40]"></span>
              {lang === 'bn' ? 'আদায়কৃত' : 'Collected'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              {lang === 'bn' ? 'বকেয়া' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Responsive inline-SVG cubic line area chart matching the user's hill shape */}
        <div className="h-48 sm:h-56 relative w-full pt-2">
          {/* Y-Axis values */}
          <div className="absolute left-0 top-0 bottom-4 w-8 flex flex-col justify-between text-[9px] font-bold text-slate-400 font-mono text-left z-10 pointer-events-none">
            <span>৳22k</span>
            <span>৳17k</span>
            <span>৳11k</span>
            <span>৳6k</span>
            <span>৳0</span>
          </div>

          <div className="absolute left-8 right-0 top-0 bottom-6 border-b border-l border-slate-100">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb300" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffb300" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#004D40" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#004D40" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              <line x1="0" y1="0" x2="600" y2="0" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Pending Gradient Area */}
              <path d="M 0,160 Q 150,160 300,120 T 500,50 Q 550,70 600,140 L 600,160 Z" fill="url(#chartGradient)" />

              {/* Collected Gradient Area */}
              <path d="M 0,160 Q 150,160 300,145 T 500,70 Q 550,10 600,160 Z" fill="url(#collectedGradient)" />

              {/* Pending Curve Line */}
              <path d="M 0,160 Q 150,160 300,120 T 500,50 Q 550,70 600,140" fill="none" stroke="#ffb300" strokeWidth="2.5" strokeLinecap="round" />

              {/* Collected Curve Line */}
              <path d="M 0,160 Q 150,160 300,145 T 500,70 Q 550,10 600,160" fill="none" stroke="#004D40" strokeWidth="3" strokeLinecap="round" />

              {/* Accent interactive indicator circle on the peak of Collected */}
              <circle cx="500" cy="70" r="5" fill="#004D40" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="500" cy="50" r="4" fill="#ffb300" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>

          {/* X-Axis Month labels */}
          <div className="absolute left-8 right-0 bottom-0 h-4 flex justify-between text-[10px] font-black text-slate-400 select-none">
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & INVOICES GRID TABLE */}
      <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {/* Live Search input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'bn' ? 'রসিদ, শিক্ষার্থীর নাম, বা ক্লাস খুঁজুন...' : 'Search invoices, students, status...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#004D40] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Class filter dropdown */}
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-[#004D40]"
            >
              <option value="All">{lang === 'bn' ? 'সকল ক্লাস' : 'All Classes'}</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>

            {/* Fee Type Filter dropdown */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-[#004D40]"
            >
              <option value="All">{lang === 'bn' ? 'সকল ফি প্রকার' : 'All Fee Types'}</option>
              <option value="Tuition">Tuition</option>
              <option value="Exam">Exam</option>
              <option value="Admission">Admission</option>
            </select>
          </div>
        </div>

        {/* Invoice List Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-2">Student</th>
                <th className="py-3 px-2">Class</th>
                <th className="py-3 px-2">Month</th>
                <th className="py-3 px-2">Fee Type</th>
                <th className="py-3 px-2">Method</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <FolderOpen className="h-8 w-8 mx-auto stroke-[1.5] mb-2" />
                    <span>No invoices match your search query.</span>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv, index) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-2">
                      <p className="text-slate-900 font-extrabold">{inv.studentName}</p>
                    </td>
                    <td className="py-3.5 px-2 font-black uppercase text-slate-500">
                      {inv.classId}
                    </td>
                    <td className="py-3.5 px-2 text-slate-500 font-semibold">
                      {inv.month}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800">
                        {inv.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      {renderMethodBadge(inv.method)}
                    </td>
                    <td className="py-3.5 px-2 font-mono text-slate-400 text-[10px]">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono font-black text-slate-900">
                      ৳{inv.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : inv.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setShowReceiptModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#004D40] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title="View & Print Money Receipt"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setShowReceiptModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {(inv.status === 'Pending' || inv.status === 'Overdue') && (
                          <button
                            type="button"
                            onClick={() => showToast(
                              lang === 'bn' 
                                ? `${inv.studentName}-এর অভিভাবককে বকেয়া ফি পরিশোধের তাগিদপত্র SMS পাঠানো হয়েছে!` 
                                : `SMS payment reminder sent successfully to ${inv.studentName}'s guardian!`, 
                              'success'
                            )}
                            className="px-2 py-1 bg-amber-50 border border-amber-100 hover:bg-amber-500 hover:text-white text-amber-700 rounded-md font-extrabold text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Bell className="h-2.5 w-2.5" />
                            <span>Remind</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: COLLECT FEE LOGGER (IMAGE 2 POPUP)                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showCollectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCollectModal(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#F0F9F9] border border-teal-100 rounded-3xl shadow-2xl p-6 text-left z-10 max-h-[95vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4">
                <div className="text-left">
                  <h3 className="text-lg font-black text-slate-850 tracking-tight flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#004D40]" />
                    {lang === 'bn' ? 'ফি আদায় রিসিট ফর্ম' : 'Collect Fee'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    Generate a new invoice and money receipt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/50 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCollectFeeSubmit} className="space-y-4 text-xs font-bold text-slate-700">
                
                {/* Row 1: Class, Section, Roll */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Class *</label>
                    <select
                      value={formClass}
                      onChange={(e) => setFormClass(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#004D40] text-slate-800"
                    >
                      {classOptions.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Section</label>
                    <select
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#004D40] text-slate-800"
                    >
                      <option value="All">All</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Roll *</label>
                    <input
                      type="text"
                      value={formRoll}
                      onChange={(e) => setFormRoll(e.target.value)}
                      placeholder="e.g. 12"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#004D40] text-slate-800 font-mono"
                    />
                  </div>
                </div>

                {/* Student Selector */}
                <div>
                  <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Student *</label>
                  <select
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#004D40] text-slate-800 font-extrabold"
                  >
                    {getStudentsForClass(formClass).map(s => (
                      <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                    ))}
                  </select>
                </div>

                {/* Fee Type & Base Amount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Fee Type</label>
                    <select
                      value={formFeeType}
                      onChange={(e) => {
                        setFormFeeType(e.target.value);
                        setFormBaseAmount(e.target.value === 'Admission' ? 5000 : e.target.value === 'Exam' ? 1500 : 3000);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#004D40] text-slate-800"
                    >
                      <option value="Tuition">Tuition</option>
                      <option value="Exam">Exam Fee</option>
                      <option value="Admission">Admission Fee</option>
                      <option value="Session">Session Fee</option>
                      <option value="Lab Fee">Lab Fee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Base Amount per Month (৳)</label>
                    <input
                      type="number"
                      value={formBaseAmount}
                      onChange={(e) => setFormBaseAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#004D40] font-mono text-slate-800"
                    />
                  </div>
                </div>

                {/* Months multi-pills selector */}
                <div>
                  <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">
                    Months ({formMonths.length} selected)
                  </label>
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap gap-1.5 justify-center">
                    {monthsList.map(m => {
                      const isActive = formMonths.includes(m);
                      return (
                        <button
                          type="button"
                          key={m}
                          onClick={() => {
                            if (isActive) {
                              setFormMonths(prev => prev.filter(item => item !== m));
                            } else {
                              setFormMonths(prev => [...prev, m]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-[#004D40] text-white shadow-xs' 
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exam Fees pills */}
                <div>
                  <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">
                    Exam Fees ({formExams.length} selected - ৳ {(formExams.length * 1500).toLocaleString()})
                  </label>
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap gap-2">
                    {examList.map(ex => {
                      const isActive = formExams.includes(ex);
                      return (
                        <button
                          type="button"
                          key={ex}
                          onClick={() => {
                            if (isActive) {
                              setFormExams(prev => prev.filter(item => item !== ex));
                            } else {
                              setFormExams(prev => [...prev, ex]);
                            }
                          }}
                          className={`px-3 py-1 text-[9px] font-extrabold rounded-full transition-all border cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-[#004D40] border-emerald-200'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-500'
                          }`}
                        >
                          {ex}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method Selector (Row of pills) */}
                <div>
                  <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Payment Method</label>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map(method => {
                      const isActive = formMethod === method;
                      return (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setFormMethod(method)}
                          className={`flex-1 min-w-[70px] py-2 px-3 border-2 rounded-xl text-[10px] font-black transition-all text-center cursor-pointer ${
                            isActive
                              ? 'bg-teal-50 border-[#004D40] text-[#004D40]'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {method}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Adjustments: Discount and Fine */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Discount / Waiver (৳)</label>
                    <input
                      type="number"
                      value={formDiscount || ''}
                      onChange={(e) => setFormDiscount(Number(e.target.value))}
                      placeholder="e.g. 0"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#004D40] font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Fine / Late Fee (৳)</label>
                    <input
                      type="number"
                      value={formFine || ''}
                      onChange={(e) => setFormFine(Number(e.target.value))}
                      placeholder="e.g. 0"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#004D40] font-mono text-slate-800"
                    />
                  </div>
                </div>

                {/* Calculations summary bar */}
                <div className="grid grid-cols-3 gap-3 bg-teal-50/50 border border-teal-100 p-3.5 rounded-2xl text-center">
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider">Net Payable</p>
                    <p className="text-sm font-black text-slate-800 mt-1">৳{calcNetPayable().toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider">Outstanding</p>
                    <p className="text-sm font-black text-rose-500 mt-1">৳{calcOutstanding().toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider">Pay Amount *</p>
                    <input
                      type="number"
                      value={formPayAmount}
                      onChange={(e) => setFormPayAmount(Number(e.target.value))}
                      className="w-full text-center bg-white border border-teal-200 rounded-lg py-0.5 px-1 font-mono font-black text-teal-800 text-xs focus:outline-none focus:border-[#004D40] mt-0.5"
                    />
                  </div>
                </div>

                {/* Remarks / Notes */}
                <div>
                  <label className="block mb-1.5 text-slate-500 uppercase tracking-wider text-[9px]">Remarks / Notes</label>
                  <textarea
                    rows={2}
                    value={formRemarks}
                    onChange={(e) => setFormRemarks(e.target.value)}
                    placeholder="Optional notes for this payment (e.g. partial payment, paid by guardian, etc.)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#004D40] text-slate-800 font-semibold"
                  />
                </div>

                {/* Presets and checkboxes */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-100 pt-3 text-[10px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setFormPayAmount(calcNetPayable())}
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg font-black cursor-pointer transition-all"
                    >
                      Pay Full (৳{calcNetPayable().toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormPayAmount(Math.round(calcNetPayable() * 0.5));
                        setFormMarkAsPartial(true);
                      }}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-black cursor-pointer transition-all"
                    >
                      Partial (50%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormMonths(['Aug']);
                        setFormExams([]);
                        setFormDiscount(0);
                        setFormFine(0);
                        setFormRemarks('');
                        setFormMarkAsPartial(false);
                      }}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-black cursor-pointer transition-all"
                    >
                      Reset
                    </button>
                  </div>

                  <label className="flex items-center gap-1.5 text-slate-600 font-bold select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formMarkAsPartial}
                      onChange={(e) => setFormMarkAsPartial(e.target.checked)}
                      className="rounded border-slate-300 text-[#004D40] focus:ring-[#004D40] h-3.5 w-3.5"
                    />
                    <span>Mark as Partial Payment</span>
                  </label>
                </div>

                {/* Submit button bar */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Printer className="h-4.5 w-4.5" />
                    <span>Collect & Print Receipt</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: MONEY RECEIPT DUAL PRINT SHEETS (IMAGE 3 PREVIEW)    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showReceiptModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReceiptModal(false)}
              className="absolute inset-0"
            />

            {/* Print style injection to make dual copies print on single standard page perfectly */}
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-money-receipt-sheet, #printable-money-receipt-sheet * {
                  visibility: visible !important;
                }
                #printable-money-receipt-sheet {
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
              {/* No-print Header bar */}
              <div className="flex justify-between items-center mb-5 print:hidden">
                <h3 className="text-lg font-black text-slate-850 tracking-tight flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-[#004D40]" />
                  {lang === 'bn' ? 'আদায়কৃত অর্থ রশিদ প্রিভিউ' : 'Money Receipt Preview'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/50 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Printable dual copy content sheet */}
              <div id="printable-money-receipt-sheet" className="space-y-6 bg-slate-50/40 p-4 rounded-2xl border border-slate-200/50 print:p-0 print:bg-white print:border-none">
                
                {/* 1. Student Copy (Top copy) */}
                {renderMoneyReceiptCopy('STUDENT COPY')}

                {/* Separator / Scissors Cut Line */}
                <div className="flex items-center gap-2 my-4 text-slate-400 select-none print:hidden">
                  <div className="grow border-t border-dashed border-slate-300"></div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                    <span>✂</span>
                    <span>{lang === 'bn' ? 'এখান থেকে কাটুন' : 'Scissors Cut'}</span>
                  </div>
                  <div className="grow border-t border-dashed border-slate-300"></div>
                </div>

                {/* 2. Office Copy (Bottom copy) */}
                {renderMoneyReceiptCopy('OFFICE COPY')}

              </div>

              {/* No-print footer actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200/50 print:hidden justify-end">
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  {lang === 'bn' ? 'রসিদ প্রিন্ট করুন' : 'Print Receipt'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Local Toast notifications */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold ${
              localToast.type === 'success'
                ? 'bg-emerald-900 text-emerald-50 border-emerald-850'
                : localToast.type === 'error'
                ? 'bg-rose-950 text-rose-50 border-rose-900'
                : 'bg-slate-900 text-slate-50 border-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${
              localToast.type === 'success' ? 'bg-emerald-950/40' : localToast.type === 'error' ? 'bg-rose-950/40' : 'bg-slate-950/40'
            }`}>
              {localToast.type === 'success' ? <Check className="h-4 w-4 text-emerald-300" /> : <AlertTriangle className="h-4 w-4 text-amber-300" />}
            </div>
            <span>{localToast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 2. EXPENSE REPORTS VIEW
// ==========================================
export function ExpenseReportsView({ lang }: { lang: 'bn' | 'en' }) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'স্কুল ব্যয় প্রতিবেদন ও রিপোর্ট' : 'School Expense Reports'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'চলতি মাস এবং বার্ষিক বাজেটের ব্যয়ের পুঙ্খানুপুঙ্খ প্রতিবেদন।' : 'Detailed analysis of monthly expenditures and cost centers.'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">{lang === 'bn' ? 'পেটি ক্যাশ স্থিতি' : 'Petty Cash Pool'}</span>
            <span className="text-xl font-black text-slate-800 block mt-1">৳৫,০০০</span>
            <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded mt-1.5 inline-block border border-emerald-100">{lang === 'bn' ? '১০০% নিরাপদ' : 'Fully Funded'}</span>
          </div>
          <span className="p-3 bg-teal-50 text-[#004D40] rounded-xl"><Coins className="h-6 w-6" /></span>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">{lang === 'bn' ? 'মঞ্জুরীকৃত বিল' : 'Approved Reimbursements'}</span>
            <span className="text-xl font-black text-emerald-600 block mt-1">৳১২,৩০০</span>
            <span className="text-[9px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded mt-1.5 inline-block border border-teal-100">{lang === 'bn' ? 'বিতরণ সম্পন্ন' : 'Disbursed'}</span>
          </div>
          <span className="p-3 bg-teal-50 text-[#004D40] rounded-xl"><Check className="h-6 w-6" /></span>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block">{lang === 'bn' ? 'বকেয়া ভেন্ডর পেমেন্ট' : 'Pending Vendor Dues'}</span>
            <span className="text-xl font-black text-amber-600 block mt-1">৳১৮,৫০০</span>
            <span className="text-[9px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded mt-1.5 inline-block border border-amber-100">{lang === 'bn' ? '১টি ভাউচার বাকি' : '1 invoice due'}</span>
          </div>
          <span className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle className="h-6 w-6" /></span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs">
        <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">{lang === 'bn' ? 'বাজেট ব্যবহার শতাংশ' : 'Expense Category Budget Usage'}</h3>
        <div className="space-y-4">
          {[
            { cat: 'Salary & Allowances', spent: 285000, budget: 300000, color: 'bg-[#004D40]' },
            { cat: 'Utilities & Internet', spent: 42000, budget: 50000, color: 'bg-teal-400' },
            { cat: 'Stationery & Papers', spent: 28500, budget: 30000, color: 'bg-amber-400' },
            { cat: 'School Repairs & Paint', spent: 25000, budget: 40000, color: 'bg-rose-400' },
            { cat: 'Transport & Fuel', spent: 22000, budget: 25000, color: 'bg-emerald-400' },
          ].map((x, idx) => {
            const ratio = Math.round((x.spent / x.budget) * 100);
            return (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-center font-bold text-slate-700 mb-1.5">
                  <span>{x.cat}</span>
                  <span className="font-extrabold text-slate-800">৳{x.spent.toLocaleString()} / ৳{x.budget.toLocaleString()} ({ratio}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${x.color}`} style={{ width: `${ratio}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. GENERATE INVOICES VIEW
// ==========================================
interface GenerateInvoicesViewProps {
  lang: 'bn' | 'en';
  isProcessingBulk: boolean;
  bulkProgress: number;
  handleRunBulkInvoice: () => void;
  showToastMsg: (msg: string, type?: 'success' | 'error') => void;
}

export function GenerateInvoicesView({
  lang,
  isProcessingBulk,
  bulkProgress,
  handleRunBulkInvoice,
  showToastMsg
}: GenerateInvoicesViewProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'ইনভয়েস বিলিং চক্র পরিচালনা' : 'Invoice Billing Engine'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'বাল্ক ইনভয়েস জেনারেট এবং ইনডিভিজুয়াল ছাত্র বিলিং টুলস।' : 'Trigger school-wide monthly billing run or issue individual invoice.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-2">{lang === 'bn' ? 'বাল্ক মাসিক বিলিং রান' : 'Bulk Monthly Billing Cycle'}</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">{lang === 'bn' ? 'প্রতি মাসে নির্দিষ্ট ক্লাসের সকল শিক্ষার্থীর জন্য মাসিক সেশন ও টিউশন ফি ইনভয়েস বাল্ক আকারে এক ক্লিকে জেনারেট করুন।' : 'Run the global billing cycle. System will crawl active rosters and auto-create due invoices for the selected target cycle.'}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1.5">{lang === 'bn' ? 'বিলিং মাস' : 'Billing Cycle Month'}</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <option>July 2026</option>
                  <option>August 2026</option>
                </select>
              </div>
              <div>
                <label className="block mb-1.5">{lang === 'bn' ? 'টার্গেট ক্লাস' : 'Target Roster'}</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <option>All Classes</option>
                  <option>Class 8</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            {isProcessingBulk ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                  <span>{lang === 'bn' ? 'ইনভয়েস জেনারেট হচ্ছে...' : 'Generating invoices...'}</span>
                  <span>{bulkProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#004D40] h-full rounded-full transition-all duration-200" style={{ width: `${bulkProgress}%` }} />
                </div>
              </div>
            ) : (
              <button
                onClick={handleRunBulkInvoice}
                className="w-full py-2.5 bg-[#004D40] hover:bg-[#00382e] text-white rounded-lg transition-all font-semibold shadow-sm text-center flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Receipt className="h-4 w-4" />
                <span>{lang === 'bn' ? 'বাল্ক ইনভয়েস রান করুন' : 'Run Bulk Billing Cycle'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-xs font-bold text-slate-700">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'একক ছাত্র ইনভয়েস ইস্যু' : 'Issue Single Student Invoice'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'ছাত্র আইডি' : 'Student Mock ID'}</label>
              <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg">
                <option>2026101 - Farhan Ishrak</option>
                <option>2026102 - Nusrat Jahan</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5">{lang === 'bn' ? 'ফি বিবরণ' : 'Description'}</label>
                <input type="text" placeholder="e.g. Sports Equipment Fee" className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1.5">{lang === 'bn' ? 'টাকার পরিমাণ' : 'Amount'}</label>
                <input type="number" placeholder="৳ 1500" className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToastMsg(lang === 'bn' ? 'ইনভয়েস ইস্যু করা হয়েছে!' : 'Invoice successfully dispatched to student roster!')}
              className="w-full py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-800 rounded-lg transition-all border border-slate-200/60 flex items-center justify-center gap-2 cursor-pointer mt-2 text-xs"
            >
              <Plus className="h-4 w-4 text-slate-600" />
              <span>{lang === 'bn' ? 'ইনভয়েস ইস্যু করুন' : 'Issue Custom Invoice'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. FEE STRUCTURE VIEW
// ==========================================
interface FeeStructureViewProps {
  lang: 'bn' | 'en';
  feeStructures: Array<{ classId: string; tuitionFee: number; examFee: number; sportsFee: number; sessionFee: number }>;
  setFeeStructures: React.Dispatch<React.SetStateAction<Array<{ classId: string; tuitionFee: number; examFee: number; sportsFee: number; sessionFee: number }>>>;
  editingFee: any | null;
  setEditingFee: (fee: any | null) => void;
  showToastMsg: (msg: string, type?: 'success' | 'error') => void;
}

export function FeeStructureView({
  lang,
  feeStructures,
  setFeeStructures,
  editingFee,
  setEditingFee,
  showToastMsg
}: FeeStructureViewProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'ক্লাস-ভিত্তিক ফি কাঠামো' : 'Fee Structure Configuration'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'প্রথম থেকে দশম শ্রেণী পর্যন্ত সকল প্রকার ফি পরিবর্তনের মূল প্যানেল।' : 'Manage tuition fees, exam fees, session and sports fee configurations.'}</p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-3.5 px-4">{lang === 'bn' ? 'শ্রেণী' : 'Class Grade'}</th>
                <th className="py-3.5 px-4">{lang === 'bn' ? 'মাসিক টিউশন ফি' : 'Monthly Tuition'}</th>
                <th className="py-3.5 px-4">{lang === 'bn' ? 'পরীক্ষার ফি (টার্ম)' : 'Exam Term Fee'}</th>
                <th className="py-3.5 px-4">{lang === 'bn' ? 'ল্যাব ও স্পোর্টস ফি' : 'Sports/Lab Fee'}</th>
                <th className="py-3.5 px-4">{lang === 'bn' ? 'বাৎসরিক সেশন ফি' : 'Annual Session'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'bn' ? 'পদক্ষেপ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {feeStructures.map((fee, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{fee.classId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">৳{fee.tuitionFee.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">৳{fee.examFee.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">৳{fee.sportsFee.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">৳{fee.sessionFee.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setEditingFee(fee)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-[#004D40] border border-slate-200/60 rounded font-extrabold text-[11px] cursor-pointer"
                    >
                      {lang === 'bn' ? 'সম্পাদনা' : 'Edit Fee'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingFee && (
        <div className="fixed inset-0 bg-slate-900/45 z-[120] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">
                {lang === 'bn' ? `${editingFee.classId} ফি পরিবর্তন` : `Edit Fee for ${editingFee.classId}`}
              </h3>
              <button type="button" onClick={() => setEditingFee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">{lang === 'bn' ? 'টিউশন ফি (৳)' : 'Tuition Fee (৳)'}</label>
                <input 
                  type="number" 
                  value={editingFee.tuitionFee}
                  onChange={(e) => setEditingFee({ ...editingFee, tuitionFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">{lang === 'bn' ? 'পরীক্ষার ফি (৳)' : 'Exam Term Fee (৳)'}</label>
                <input 
                  type="number" 
                  value={editingFee.examFee}
                  onChange={(e) => setEditingFee({ ...editingFee, examFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">{lang === 'bn' ? 'ল্যাব ও স্পোর্টস ফি (৳)' : 'Sports/Lab Fee (৳)'}</label>
                <input 
                  type="number" 
                  value={editingFee.sportsFee}
                  onChange={(e) => setEditingFee({ ...editingFee, sportsFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">{lang === 'bn' ? 'বাৎসরিক সেশন ফি (৳)' : 'Session Fee (৳)'}</label>
                <input 
                  type="number" 
                  value={editingFee.sessionFee}
                  onChange={(e) => setEditingFee({ ...editingFee, sessionFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button 
                type="button"
                onClick={() => setEditingFee(null)} 
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setFeeStructures(prev => prev.map(f => f.classId === editingFee.classId ? editingFee : f));
                  setEditingFee(null);
                  showToastMsg(lang === 'bn' ? 'ফি কাঠামো সফলভাবে আপডেট হয়েছে!' : 'Fee structure saved successfully!');
                }} 
                className="px-4 py-1.5 bg-[#004D40] hover:bg-[#00382e] text-white rounded-lg font-bold"
              >
                {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. FEE DISCOUNTS VIEW
// ==========================================
interface FeeDiscountsViewProps {
  lang: 'bn' | 'en';
  feeDiscounts: Array<{ studentId: string; studentName: string; class: string; discountType: string; waiverPercentage: number; amountSaved: number }>;
  setFeeDiscounts: React.Dispatch<React.SetStateAction<Array<{ studentId: string; studentName: string; class: string; discountType: string; waiverPercentage: number; amountSaved: number }>>>;
  discountForm: { studentId: string; discountType: string; waiverPercentage: string };
  setDiscountForm: React.Dispatch<React.SetStateAction<{ studentId: string; discountType: string; waiverPercentage: string }>>;
  showToastMsg: (msg: string, type?: 'success' | 'error') => void;
}

export function FeeDiscountsView({
  lang,
  feeDiscounts,
  setFeeDiscounts,
  discountForm,
  setDiscountForm,
  showToastMsg
}: FeeDiscountsViewProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'বৃত্তি এবং ফি ডিসকাউন্ট' : 'Scholarships & Fee Discounts'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'মেধাবী ও বিশেষ সুবিধাভোগী শিক্ষার্থীদের কনসেশন ও বৃত্তি বরাদ্দ প্যানেল।' : 'Award waivers, merit-based scholarship discounts, or concession tiers.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-xs font-bold text-slate-700">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'ডিসকাউন্ট বা কনসেশন বরাদ্দ' : 'Waiver Assignment Form'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'শিক্ষার্থী' : 'Target Student'}</label>
              <select 
                value={discountForm.studentId}
                onChange={(e) => setDiscountForm(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
              >
                <option value="2026101">2026101 - Farhan Ishrak</option>
                <option value="2026102">2026102 - Nusrat Jahan</option>
                <option value="2026103">2026103 - Zayan Ahmed</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'বৃত্তির ধরণ' : 'Waiver Category'}</label>
              <select 
                value={discountForm.discountType}
                onChange={(e) => setDiscountForm(prev => ({ ...prev, discountType: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
              >
                <option value="Merit Scholarship">{lang === 'bn' ? 'মেধাবৃত্তি' : 'Merit Scholarship (GPA 5.00)'}</option>
                <option value="Sibling Discount">{lang === 'bn' ? 'সহোদর ডিসকাউন্ট' : 'Sibling Discount'}</option>
                <option value="Special Concession">{lang === 'bn' ? 'বিশেষ কনসেশন' : 'Special Concession'}</option>
                <option value="Sportsperson Waiver">{lang === 'bn' ? 'ক্রীড়া কোটা ছাড়' : 'Sportsperson Waiver'}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5">{lang === 'bn' ? 'ছাড়ের হার (%)' : 'Waiver Ratio (%)'}</label>
              <input 
                type="number" 
                value={discountForm.waiverPercentage}
                onChange={(e) => setDiscountForm(prev => ({ ...prev, waiverPercentage: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                placeholder="50"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const studLookup: Record<string, string> = { '2026101': 'Farhan Ishrak', '2026102': 'Nusrat Jahan', '2026103': 'Zayan Ahmed' };
                const name = studLookup[discountForm.studentId] || 'Selected Student';
                const wVal = Number(discountForm.waiverPercentage) || 0;
                const newDiscount = {
                  studentId: discountForm.studentId,
                  studentName: name,
                  class: 'Class 8A',
                  discountType: discountForm.discountType,
                  waiverPercentage: wVal,
                  amountSaved: Math.round((2000 * wVal) / 100)
                };
                setFeeDiscounts(prev => [newDiscount, ...prev]);
                showToastMsg(lang === 'bn' ? 'কনসেশন কোটা বরাদ্দ করা হয়েছে!' : 'Waiver successfully assigned!');
              }}
              className="w-full py-2.5 bg-[#004D40] hover:bg-[#00382e] text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Check className="h-4 w-4" />
              <span>{lang === 'bn' ? 'বৃত্তির ছাড় কোটা অনুমোদন করুন' : 'Assign Waiver'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'সক্রিয় বৃত্তি ও ছাড়ের তালিকা' : 'Active Waiver Roster'}</h3>
          <div className="space-y-2.5">
            {feeDiscounts.map((fd, idx) => (
              <div key={idx} className="border border-slate-100 p-3 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">{fd.studentName}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{fd.class} | ID: {fd.studentId} | <span className="text-[#004D40] font-bold">{fd.discountType}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-extrabold px-2.5 py-1 rounded-md block mb-1">
                    {fd.waiverPercentage}% OFF
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">{lang === 'bn' ? `মাসিক সাশ্রয়: ৳${fd.amountSaved}` : `Saves: ৳${fd.amountSaved}/mo`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. CONCESSION REPORT VIEW
// ==========================================
export function ConcessionReportView({
  lang,
  feeDiscounts
}: {
  lang: 'bn' | 'en';
  feeDiscounts: Array<{ studentId: string; studentName: string; class: string; discountType: string; waiverPercentage: number; amountSaved: number }>;
}) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'ফি ছাড় / কনসেশন বার্ষিক বিবরণী' : 'Concession Report'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'চলতি শিক্ষাবর্ষে বৃত্তিপ্রাপ্ত ও রেয়াত প্রাপ্ত ছাত্র-ছাত্রীদের বিবরণ।' : 'Audit log of waivers and scholarships granted in active rosters.'}</p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <th className="py-3 px-4">{lang === 'bn' ? 'ছাত্র আইডি' : 'ID'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'নাম' : 'Student Name'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'ক্লাস' : 'Roster Class'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'বৃত্তি ধরণ' : 'Concession Tactic'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'ছাড় শতাংশ' : 'Ratio'}</th>
                <th className="py-3 px-4 text-right">{lang === 'bn' ? 'সাশ্রয়কৃত পরিমাণ' : 'Amount Saved'}</th>
              </tr>
            </thead>
            <tbody>
              {feeDiscounts.map((fd, idx) => (
                <tr key={idx} className="border-b border-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">{fd.studentId}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{fd.studentName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{fd.class}</td>
                  <td className="py-3 px-4 text-indigo-700 font-semibold">{fd.discountType}</td>
                  <td className="py-3 px-4 font-black text-emerald-600">{fd.waiverPercentage}%</td>
                  <td className="py-3 px-4 text-right font-black text-slate-800">৳{fd.amountSaved.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. FEES REPORTS VIEW
// ==========================================
export function FeesReportsView({ lang }: { lang: 'bn' | 'en' }) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'আদায়কৃত ফি রিপোর্ট এবং চার্ট' : 'Fee Collection Reports'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'শ্রেণী ভিত্তিক আদায়কৃত ও বকেয়া ফি-র বিস্তারিত চার্ট।' : 'Analytics of total fee collections vs pending roster defaults.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'আদায় অর্জিত শতাংশ' : 'Collection Target Ratios'}</h3>
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="10" />
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#004D40" strokeWidth="10" strokeDasharray="238.76" strokeDashoffset="45" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[#004D40]">81%</span>
              <span className="text-[10px] text-slate-400 font-bold">{lang === 'bn' ? 'আদায় রেশিও' : 'Cleared'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-4">{lang === 'bn' ? 'শ্রেণীভিত্তিক পেমেন্ট সম্পন্ন' : 'Roster Completion status'}</h3>
          <div className="space-y-3.5">
            {[
              { class: 'Class 10', completed: 92 },
              { class: 'Class 9', completed: 85 },
              { class: 'Class 8', completed: 81 },
              { class: 'Class 7', completed: 78 },
              { class: 'Class 6', completed: 74 },
            ].map((cl, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-center font-bold text-slate-650 mb-1">
                  <span>{cl.class}</span>
                  <span className="font-extrabold text-slate-800">{cl.completed}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#004D40] h-full rounded-full" style={{ width: `${cl.completed}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. PROFILE VIEW
// ==========================================
export function ProfileView({ lang }: { lang: 'bn' | 'en' }) {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl font-extrabold text-slate-800">{lang === 'bn' ? 'হিসাবরক্ষক প্রোফাইল' : 'Accountant User Profile'}</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{lang === 'bn' ? 'সিস্টেম অ্যাক্সেস লেভেল এবং ইউজার ক্রিডেনশিয়াল।' : 'Finance Officer workspace configuration.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 rounded-full bg-[#004D40] text-emerald-105 flex items-center justify-center font-black text-2xl uppercase shadow-md mb-3 border-2 border-emerald-500">
            KH
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">Md. Kamrul Hasan</h3>
          <p className="text-xs text-slate-400 font-bold mt-0.5">Senior Financial Controller</p>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full font-bold uppercase mt-3">
            Level 3 Administrator
          </span>
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-xs font-bold text-slate-700 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-2">{lang === 'bn' ? 'প্রোফাইল বিবরণী' : 'Credentials & Configuration'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">{lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Official Email'}</p>
              <p className="text-slate-800 font-extrabold text-xs">k.hasan@studentscare.edu.bd</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">{lang === 'bn' ? 'যোগাযোগ নম্বর' : 'Primary Contact'}</p>
              <p className="text-slate-800 font-extrabold text-xs">+880 1712-345678</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">{lang === 'bn' ? 'অ্যাক্সেস কোড' : 'Auth Terminal ID'}</p>
              <p className="text-slate-800 font-mono text-[11px]">SCMS-TERM-801</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">{lang === 'bn' ? 'অডিটেবেল ভূমিকা' : 'Roster Signatory'}</p>
              <p className="text-slate-800 font-extrabold text-xs">Principal + Accountant Board</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
