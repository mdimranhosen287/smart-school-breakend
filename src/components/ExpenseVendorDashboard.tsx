import React, { useState } from 'react';
import { 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Coins, 
  FileText, 
  Plus, 
  UploadCloud, 
  UserPlus, 
  FileSpreadsheet, 
  Check, 
  X, 
  Download, 
  Receipt, 
  Calendar, 
  CheckCircle, 
  Building2, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExpenseVendorDashboardProps {
  lang: 'bn' | 'en';
  showToastMsg: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export default function ExpenseVendorDashboard({ lang, showToastMsg }: ExpenseVendorDashboardProps) {
  // Localization Texts
  const texts = {
    en: {
      title: "Expense Ledger & Vendor Management 💸",
      aiSummary: "Total expenditure this month is ৳ 42,300 (within budget). The monthly Internet Bill is due in 3 days. AI detected a 15% spike in electricity expenses compared to last month—suggesting a utility audit.",
      quickActionBadge: "Internet Bill Due Soon - Click to Pay",
      kpiTotalExp: "Total Expenses (Current Month)",
      kpiTotalSubtitle: "vs last month (৳ 40,100)",
      kpiUtilityStatus: "Utility Bills Paid",
      kpiUtilitySubtitle: "Electric, Internet, Water - 100% Cleared",
      kpiPendingVendors: "Pending Vendor Payouts",
      kpiPendingSubtitle: "৳ 18,500 Outstanding",
      kpiPettyCash: "Daily Petty Cash Balance",
      kpiPettyCashSubtitle: "৳ 5,000 Available",
      ledgerTitle: "Smart Expense Voucher Table",
      colId: "Voucher ID",
      colDesc: "Expense Description",
      colCategory: "Category",
      colDate: "Date",
      colAmount: "Amount",
      colMethod: "Method",
      colReceipt: "Receipt Status",
      colActions: "Actions",
      badgeUploaded: "Uploaded",
      badgeMissing: "Missing Receipt",
      btnViewVoucher: "View Voucher",
      btnDownloadPdf: "Download PDF",
      actionHubTitle: "Expense Action Hub",
      btnPetty: "Log Daily Petty Expense",
      btnUploadBill: "Upload Vendor Bill/Invoice",
      btnCreateVendor: "Create Vendor Profile",
      btnGenReport: "Generate Monthly Expense Report",
      approvalsTitle: "Reimbursement & Purchase Approvals",
      approvalsPending: "Pending Approvals",
      btnApprovePay: "Approve & Pay",
      btnReject: "Reject",
      emptyApprovals: "All voucher reimbursement requests resolved!",
      activeVendorsTitle: "Active Vendor Partners",
      colVendorName: "Vendor Name",
      colVendorService: "Primary Service",
      colVendorDue: "Due Balance",
      vendorRep: "Representative",
      voucherModalTitle: "Digital Financial Voucher"
    },
    bn: {
      title: "খরচ হিসাব ও ভেন্ডর পোর্টাল 💸",
      aiSummary: "চলতি মাসে মোট খরচ ৪২,৩০০ ৳ (বাজেটের মধ্যে রয়েছে)। ৩ দিনের মধ্যে স্কুলের ইন্টারনেট বিল পরিশোধ করতে হবে। গত মাসের তুলনায় বিদ্যুৎ বিলে ১৫% বৃদ্ধির প্রবণতা দেখা গেছে যা অডিটের পরামর্শ দিচ্ছে।",
      quickActionBadge: "ইন্টারনেট বিল পরিশোধের সময় নিকটবর্তী - এখনই পরিশোধ করুন",
      kpiTotalExp: "মোট ব্যয় (চলতি মাস)",
      kpiTotalSubtitle: "গত মাসের তুলনায় (৪০,১০০ ৳)",
      kpiUtilityStatus: "ইউটিলিটি বিল পরিশোধ",
      kpiUtilitySubtitle: "বিদ্যুৎ, ইন্টারনেট, পানি - ১০০% পরিশোধিত",
      kpiPendingVendors: "বকেয়া ভেন্ডর পেমেন্ট",
      kpiPendingSubtitle: "১৮,৫০০ ৳ বকেয়া রয়েছে",
      kpiPettyCash: "দৈনিক পেটি ক্যাশ ব্যালেন্স",
      kpiPettyCashSubtitle: "৫,০০০ ৳ অবশিষ্ট রয়েছে",
      ledgerTitle: "স্মার্ট এক্সপেন্স ভাউচার টেবিল",
      colId: "ভাউচার আইডি",
      colDesc: "ব্যয়ের বিবরণ",
      colCategory: "ক্যাটাগরি",
      colDate: "তারিখ",
      colAmount: "পরিমাণ",
      colMethod: "মাধ্যম",
      colReceipt: "রসিদ স্ট্যাটাস",
      colActions: "পদক্ষেপ",
      badgeUploaded: "আপলোড সম্পন্ন",
      badgeMissing: "রসিদ ফাইল নেই",
      btnViewVoucher: "ভাউচার দেখুন",
      btnDownloadPdf: "পিডিএফ ডাউনলোড",
      actionHubTitle: "এক্সপেন্স অ্যাকশন হাব",
      btnPetty: "দৈনিক পেটি ক্যাশ এন্ট্রি",
      btnUploadBill: "ভেন্ডর বিল/ইনভয়েস আপলোড",
      btnCreateVendor: "নতুন ভেন্ডর প্রোফাইল তৈরি",
      btnGenReport: "মাসিক খরচ বিবরণী রিপোর্ট",
      approvalsTitle: "রিইমবার্সমেন্ট ও ক্রয় অনুমোদন",
      approvalsPending: "অপেক্ষমান অনুমোদন",
      btnApprovePay: "অনুমোদন ও পে",
      btnReject: "প্রত্যাখ্যান",
      emptyApprovals: "সকল ক্রয় ও রিইমবার্সমেন্ট আবেদন অনুমোদিত!",
      activeVendorsTitle: "সক্রিয় সহযোগী ভেন্ডর সমূহ",
      colVendorName: "ভেন্ডরের নাম",
      colVendorService: "মূল সেবা/পণ্য",
      colVendorDue: "বকেয়া ব্যালেন্স",
      vendorRep: "প্রতিনিধি",
      voucherModalTitle: "ডিজিটাল ফাইন্যান্সিয়াল ভাউচার"
    }
  };

  const t = lang === 'bn' ? texts.bn : texts.en;

  // Expenditures database
  const [vouchers, setVouchers] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('school_vouchers') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "VCH-301", description: "Purchased Whiteboard Markers & Chalks", category: "Stationary Procurement", date: "2026-07-08", amount: 4800, method: "Cash", receipt: "uploaded", attachment: "stationery_receipt_301.pdf" },
      { id: "VCH-302", description: "June Electric Utility Bill Clear", category: "Utilities", date: "2026-07-05", amount: 12500, method: "Bank Transfer", receipt: "uploaded", attachment: "desco_bill_june_paid.pdf" },
      { id: "VCH-303", description: "Water pump motor coil rewinding", category: "Maintenance", date: "2026-07-02", amount: 3500, method: "bKash", receipt: "missing", attachment: null },
      { id: "VCH-304", description: "Class VIII Physics Exam Script Print", category: "Events", date: "2026-06-28", amount: 6500, method: "Cash", receipt: "uploaded", attachment: "script_print_invoice.pdf" },
      { id: "VCH-305", description: "High-Speed Fiber Internet Bill (June)", category: "Utilities", date: "2026-06-25", amount: 15000, method: "Bank Transfer", receipt: "uploaded", attachment: "internet_june.pdf" }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('school_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  React.useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('school_vouchers');
      if (saved) {
        try {
          setVouchers(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('school_vouchers_updated', handleUpdate);
    return () => {
      window.removeEventListener('school_vouchers_updated', handleUpdate);
    };
  }, []);

  // Reimbursements pending approval
  const [approvals, setApprovals] = useState([
    { id: "APP-501", requester: "IT Lab Assistant", description: "Mouse replacements (4 Units)", amount: 1200, attachment: "it_mouse_quote.pdf" },
    { id: "APP-502", requester: "Office Admin (Kamrul)", description: "Emergency printer repair & toner refill", amount: 3500, attachment: "toner_refill_receipt.pdf" }
  ]);

  // Vendors list
  const [vendors, setVendors] = useState([
    { id: "VND-01", name: "Star Tech Ltd.", service: "IT Hardware & Support", rep: "Ataur Rahman", due: 15000 },
    { id: "VND-02", name: "Link3 Technologies", service: "School Internet Fiber", rep: "Mehedi Hasan", due: 3500 },
    { id: "VND-03", name: "Anupam Book Depot", service: "Textbooks & Library Supplies", rep: "Sushanto Kumar", due: 0 }
  ]);

  // Action indicators / trigger states
  const [showLogPettyModal, setShowLogPettyModal] = useState(false);
  const [showUploadBillModal, setShowUploadBillModal] = useState(false);
  const [showCreateVendorModal, setShowCreateVendorModal] = useState(false);
  const [selectedVoucherForView, setSelectedVoucherForView] = useState<any | null>(null);

  // Form states
  const [pettyForm, setPettyForm] = useState({ description: '', category: 'Maintenance', amount: '', method: 'Cash' });
  const [billForm, setBillForm] = useState({ description: '', category: 'Utilities', amount: '', vendorId: 'VND-01', hasReceipt: true });
  const [vendorForm, setVendorForm] = useState({ name: '', service: '', rep: '', due: '0' });

  // Calculations
  const totalExpensesSum = vouchers.reduce((sum, v) => sum + v.amount, 0) + 15000; // Adding base recurring bills
  const pendingVendorsSum = vendors.reduce((sum, v) => sum + v.due, 0);

  const handlePayInternetBill = () => {
    // If the due internet bill is already paid, let's inform them.
    const internetPaidAlready = vouchers.some(v => v.description.includes("Fiber Internet") && v.date === "2026-07-10");
    if (internetPaidAlready) {
      showToastMsg(
        lang === 'bn'
          ? "ইন্টারনেট বিল ইতিমধ্যেই পরিশোধ করা হয়েছে!"
          : "Internet Bill has already been paid for this period.",
        "info"
      );
      return;
    }

    // Add paid voucher
    const newV: any = {
      id: `VCH-30${vouchers.length + 1}`,
      description: "Emergency High-Speed Fiber Internet Bill Payment",
      category: "Utilities",
      date: "2026-07-10",
      amount: 3500,
      method: "Bank Transfer",
      receipt: "uploaded",
      attachment: "link3_receipt_paid.pdf"
    };

    setVouchers(prev => [newV, ...prev]);
    setVendors(prev => prev.map(v => v.id === 'VND-02' ? { ...v, due: 0 } : v));

    showToastMsg(
      lang === 'bn'
        ? "৳ ৩,৫০০ ইন্টারনেট বিল সফলভাবে পরিশোধিত হয়েছে এবং ব্যাংক রিসিট আপলোড করা হয়েছে!"
        : "Successfully cleared Link3 High-Speed Internet Bill of ৳ 3,500. Direct Bank Debit logged.",
      "success"
    );
  };

  const handleApproveApproval = (id: string, item: any) => {
    setApprovals(prev => prev.filter(a => a.id !== id));

    // Register approved reimbursement as a real expense voucher
    const newV: any = {
      id: `VCH-30${vouchers.length + 1}`,
      description: `Reimbursement: ${item.description} (Requested by ${item.requester})`,
      category: item.description.includes("mouse") ? "Stationary Procurement" : "Maintenance",
      date: "2026-07-10",
      amount: item.amount,
      method: "Cash",
      receipt: "uploaded",
      attachment: item.attachment
    };

    setVouchers(prev => [newV, ...prev]);
    showToastMsg(
      lang === 'bn'
        ? `${item.requester}-এর ৳${item.amount} রিমেইম্বার্সমেন্ট অনুমোদন ও পরিশোধ করা হয়েছে!`
        : `Approved and paid reimbursement of ৳${item.amount} to ${item.requester}.`,
      "success"
    );
  };

  const handleRejectApproval = (id: string, requester: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    showToastMsg(
      lang === 'bn'
        ? `${requester}-এর আবেদনের দাবি রিজেক্ট করা হয়েছে`
        : `Reimbursement claim from ${requester} has been rejected.`,
      "info"
    );
  };

  const handleLogPettySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pettyForm.description || !pettyForm.amount) {
      showToastMsg(lang === 'bn' ? "ব্যয়ের বর্ণনা এবং পরিমাণ প্রদান করুন" : "Please specify description and amount", "error");
      return;
    }

    const amountNum = parseFloat(pettyForm.amount) || 0;
    const newV: any = {
      id: `VCH-30${vouchers.length + 1}`,
      description: pettyForm.description,
      category: pettyForm.category,
      date: "2026-07-10",
      amount: amountNum,
      method: pettyForm.method,
      receipt: "uploaded",
      attachment: "petty_cash_voucher.pdf"
    };

    setVouchers(prev => [newV, ...prev]);
    setShowLogPettyModal(false);
    setPettyForm({ description: '', category: 'Maintenance', amount: '', method: 'Cash' });
    showToastMsg(
      lang === 'bn'
        ? `পেটি ক্যাশ খরচ "${newV.description}" (৳${amountNum}) সফলভাবে লগ করা হয়েছে!`
        : `Successfully logged daily petty cash voucher of ৳${amountNum} for "${newV.description}".`
    );
  };

  const handleUploadBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billForm.description || !billForm.amount) {
      showToastMsg(lang === 'bn' ? "বিলের বিবরণ এবং পরিমাণ আবশ্যক" : "Bill description and amount are required", "error");
      return;
    }

    const amountNum = parseFloat(billForm.amount) || 0;
    const targetVendor = vendors.find(v => v.id === billForm.vendorId);

    // Add to vouchers
    const newV: any = {
      id: `VCH-30${vouchers.length + 1}`,
      description: `Vendor Bill: ${billForm.description} [Vendor: ${targetVendor?.name || 'Local Vendor'}]`,
      category: billForm.category,
      date: "2026-07-10",
      amount: amountNum,
      method: "Bank Transfer",
      receipt: billForm.hasReceipt ? "uploaded" : "missing",
      attachment: billForm.hasReceipt ? "uploaded_vendor_invoice.pdf" : null
    };

    // Increase vendor due balance
    if (targetVendor) {
      setVendors(prev => prev.map(v => v.id === billForm.vendorId ? { ...v, due: v.due + amountNum } : v));
    }

    setVouchers(prev => [newV, ...prev]);
    setShowUploadBillModal(false);
    setBillForm({ description: '', category: 'Utilities', amount: '', vendorId: 'VND-01', hasReceipt: true });
    showToastMsg(
      lang === 'bn'
        ? `ভেন্ডর ইনভয়েস সফলভাবে আপলোড করা হয়েছে এবং হিসাবভুক্ত করা হয়েছে!`
        : `Vendor bill uploaded successfully. Vendor payable ledger increased.`
    );
  };

  const handleCreateVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.name || !vendorForm.service || !vendorForm.rep) {
      showToastMsg(lang === 'bn' ? "অনুগ্রহ করে সব তথ্য পূরণ করুন" : "Please fill in all vendor profile fields", "error");
      return;
    }

    const dueNum = parseFloat(vendorForm.due) || 0;
    const added: any = {
      id: `VND-0${vendors.length + 1}`,
      name: vendorForm.name,
      service: vendorForm.service,
      rep: vendorForm.rep,
      due: dueNum
    };

    setVendors(prev => [...prev, added]);
    setShowCreateVendorModal(false);
    setVendorForm({ name: '', service: '', rep: '', due: '0' });
    showToastMsg(
      lang === 'bn'
        ? `নতুন ভেন্ডর "${added.name}" সফলভাবে যুক্ত করা হয়েছে!`
        : `Successfully created partner vendor profile for "${added.name}".`
    );
  };

  const handleGenerateMonthlyReport = () => {
    const headers = "Voucher ID,Description,Category,Date,Amount,Payment Method,Receipt Status\n";
    const rows = vouchers.map(v => `${v.id},${v.description},${v.category},${v.date},৳${v.amount},${v.method},${v.receipt}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `scms_expenditures_report_june_july_2026.csv`);
    a.click();
    showToastMsg(
      lang === 'bn'
        ? "মাসিক স্কুল ব্যয়ের অডিটেবল ক্যাশফ্লো রিপোর্ট ডাউনলোড শুরু হয়েছে!"
        : "Auditable cash outflow ledger report generated as CSV."
    );
  };

  return (
    <div className="space-y-6" id="expense-dashboard-root">
      
      {/* 1. SMART CASH OUTFLOW & AI INSIGHTS HERO BANNER */}
      <section 
        id="expense-hero-banner"
        className="relative overflow-hidden bg-gradient-to-br from-[#004D40] via-[#003d33] to-[#002e26] rounded-2xl shadow-md border border-teal-800 p-5 sm:p-6 text-white text-left"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none">
          <DollarSign className="h-full w-full rotate-12 animate-pulse" />
        </div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-800/80 text-teal-300 rounded-lg border border-teal-700/50">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                {t.title}
              </h3>
            </div>
            
            <p className="text-xs text-teal-100/90 leading-relaxed font-medium">
              {t.aiSummary}
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <button
              id="pay-internet-bill-btn"
              onClick={handlePayInternetBill}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg border border-amber-400 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0 animate-bounce"
            >
              <Receipt className="h-4 w-4 text-slate-950" />
              <span>{t.quickActionBadge}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HIGH-IMPACT EXPENSE KPI CARDS */}
      <section id="expense-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Expenses Current Month */}
        <div id="kpi-total-expenses" className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {t.kpiTotalExp}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#004D40] block mt-1">
              ৳{totalExpensesSum.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[9px] text-slate-500 font-bold border-t border-slate-100 pt-2.5 mt-2 flex justify-between items-center">
            <span>{t.kpiTotalSubtitle}</span>
            <span className="text-rose-600 font-black">+5.4% increase</span>
          </div>
        </div>

        {/* Utility Bills Paid status */}
        <div id="kpi-utility-status" className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {t.kpiUtilityStatus}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-800 block mt-1">
              100% Cleared
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[9px] text-slate-400 font-extrabold mb-1">
              <span>{t.kpiUtilitySubtitle}</span>
              <span>3/3 Paid</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-600 rounded-full transition-all duration-300" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Pending Vendor Payouts */}
        <div id="kpi-pending-vendors" className="bg-amber-50/40 border border-amber-200 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider block">
              {t.kpiPendingVendors}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-700 block mt-1">
              ৳{pendingVendorsSum.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[9px] text-amber-800/80 font-bold border-t border-amber-100 pt-2.5 mt-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
            <span>{t.kpiPendingSubtitle}</span>
          </div>
        </div>

        {/* Daily Petty Cash balance */}
        <div id="kpi-petty-cash" className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {t.kpiPettyCash}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-teal-700 block mt-1">
              ৳5,000
            </span>
          </div>
          <div className="text-[9px] text-teal-700 font-bold border-t border-slate-100 pt-2.5 mt-2 flex items-center gap-1">
            <Coins className="h-3 w-3 text-emerald-500 shrink-0" />
            <span>{t.kpiPettyCashSubtitle}</span>
          </div>
        </div>

      </section>

      {/* 3. CORE INTELLIGENT GRID */}
      <section id="expense-core-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: EXPENSE VOUCHER LEDGER & LOGS (8 Cols) */}
        <div id="expense-ledger-container" className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl shadow-3xs p-5.5 text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.ledgerTitle}
                </h4>
              </div>
              <span className="text-[10px] bg-[#004D40]/5 text-[#004D40] font-extrabold px-2.5 py-1 rounded-lg border border-[#004D40]/20">
                {lang === 'bn' ? "সম্পূর্ণ অডিট ট্রেইল" : "Complete Audit Trail"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                    <th className="py-3 px-2">{t.colId}</th>
                    <th className="py-3 px-2">{t.colDesc}</th>
                    <th className="py-3 px-2">{t.colCategory}</th>
                    <th className="py-3 px-2 text-center">{t.colDate}</th>
                    <th className="py-3 px-2 text-right">{t.colAmount}</th>
                    <th className="py-3 px-2 text-center">{t.colMethod}</th>
                    <th className="py-3 px-2 text-center">{t.colReceipt}</th>
                    <th className="py-3 px-2 text-right">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-bold text-[#1E293B]">
                  {vouchers.map((v) => {
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Voucher ID */}
                        <td className="py-3.5 px-2 font-mono text-slate-500">
                          {v.id}
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-2 max-w-[180px] truncate">
                          <span className="text-slate-900 font-black">{v.description}</span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                            v.category === 'Utilities' 
                              ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                              : v.category === 'Maintenance' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {v.category}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-2 text-center text-slate-500">
                          {v.date}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-2 text-right">
                          <span className="font-black text-slate-900">৳{v.amount.toLocaleString('en-IN')}</span>
                        </td>

                        {/* Method */}
                        <td className="py-3.5 px-2 text-center text-slate-600">
                          {v.method}
                        </td>

                        {/* Receipt Status */}
                        <td className="py-3.5 px-2 text-center">
                          {v.receipt === 'uploaded' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[9px]">
                              <CheckCircle className="h-2.5 w-2.5" />
                              <span>{t.badgeUploaded}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 text-[9px]">
                              <AlertCircle className="h-2.5 w-2.5" />
                              <span>{t.badgeMissing}</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setSelectedVoucherForView(v)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-extrabold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
                            >
                              <FileText className="h-2.5 w-2.5" />
                              <span>{t.btnViewVoucher}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VENDOR DIRECTORY & SMART APPROVALS (4 Cols) */}
        <div id="expense-controls-container" className="lg:col-span-4 space-y-6">
          
          {/* Expense Action Hub */}
          <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Coins className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.actionHubTitle}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Button 1: Petty Cash */}
              <button
                onClick={() => setShowLogPettyModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-teal-50 text-teal-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Coins className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {t.btnPetty}
                </span>
              </button>

              {/* Button 2: Upload Vendor Bill */}
              <button
                onClick={() => setShowUploadBillModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {t.btnUploadBill}
                </span>
              </button>

              {/* Button 3: Create Vendor Profile */}
              <button
                onClick={() => setShowCreateVendorModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-amber-50 text-amber-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserPlus className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {t.btnCreateVendor}
                </span>
              </button>

              {/* Button 4: Generate Report */}
              <button
                onClick={handleGenerateMonthlyReport}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-blue-50 text-blue-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {t.btnGenReport}
                </span>
              </button>
            </div>
          </div>

          {/* Reimbursement & Purchase Approvals from Staff */}
          <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.approvalsTitle}
                </h4>
              </div>
              <span className="text-[9px] bg-amber-50 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-100">
                {approvals.length} {t.approvalsPending}
              </span>
            </div>

            <div className="space-y-3.5">
              {approvals.length === 0 ? (
                <div className="py-6 text-center text-slate-400 font-bold text-[11px] space-y-1 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto animate-bounce" />
                  <p>{t.emptyApprovals}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {approvals.map((app) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: 50, height: 0, padding: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="p-3.5 bg-amber-50/20 border border-amber-100 rounded-xl space-y-3 overflow-hidden"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-black text-xs text-slate-900 leading-tight">{app.requester}</span>
                          <span className="text-xs font-black text-[#004D40]">৳{app.amount.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 font-medium mt-1 leading-snug">
                          {app.description}
                        </p>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => handleApproveApproval(app.id, app)}
                          className="px-2.5 py-1.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-0.5 shadow-3xs"
                        >
                          <Check className="h-3 w-3" />
                          <span>{t.btnApprovePay}</span>
                        </button>
                        <button
                          onClick={() => handleRejectApproval(app.id, app.requester)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
                        >
                          <X className="h-3 w-3" />
                          <span>{t.btnReject}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Active Vendor Directory & Due Status */}
          <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.activeVendorsTitle}
                </h4>
              </div>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between text-xs font-bold">
                  <div>
                    <p className="font-black text-slate-900 leading-tight">{vendor.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium leading-none mt-1">
                      {vendor.service} • {vendor.rep}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {vendor.due > 0 ? (
                      <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg">
                        ৳{vendor.due.toLocaleString('en-IN')} {lang === 'bn' ? "বকেয়া" : "Due"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                        {lang === 'bn' ? "পরিশোধিত" : "No Due"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* MODAL 1: LOG DAILY PETTY CASH EXPENSE */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showLogPettyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogPettyModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "দৈনিক পেটি ক্যাশ ব্যয় এন্ট্রি" : "Log Petty Cash Voucher"}
                  </h4>
                </div>
                <button onClick={() => setShowLogPettyModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleLogPettySubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ব্যয়ের বর্ণনা / উদ্দেশ্য" : "Purpose / Description"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Science Lab beaker cleanup supplies"
                    value={pettyForm.description} 
                    onChange={e => setPettyForm({...pettyForm, description: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ক্যাটাগরি" : "Category"}</label>
                    <select 
                      value={pettyForm.category} 
                      onChange={e => setPettyForm({...pettyForm, category: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="Maintenance">Maintenance</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Stationary Procurement">Stationary</option>
                      <option value="Events">School Events</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "পরিমাণ (৳)" : "Amount (৳)"}</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 500"
                      value={pettyForm.amount} 
                      onChange={e => setPettyForm({...pettyForm, amount: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "পেমেন্ট পদ্ধতি" : "Payment Method"}</label>
                  <select 
                    value={pettyForm.method} 
                    onChange={e => setPettyForm({...pettyForm, method: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="bKash">bKash</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowLogPettyModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'সংরক্ষণ' : 'Disburse Cash'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: UPLOAD VENDOR BILL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showUploadBillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadBillModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "ভেন্ডর ইনভয়েস / বিল আপলোড" : "Upload Vendor Bill"}
                  </h4>
                </div>
                <button onClick={() => setShowUploadBillModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleUploadBillSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "বিলের বিবরণ" : "Bill Description"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Classroom boards refurbishment invoice"
                    value={billForm.description} 
                    onChange={e => setBillForm({...billForm, description: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ভেন্ডর" : "Associated Vendor"}</label>
                    <select 
                      value={billForm.vendorId} 
                      onChange={e => setBillForm({...billForm, vendorId: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                    >
                      {vendors.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "পরিমাণ (৳)" : "Invoice Amount (৳)"}</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 15000"
                      value={billForm.amount} 
                      onChange={e => setBillForm({...billForm, amount: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ক্যাটাগরি" : "Category"}</label>
                    <select 
                      value={billForm.category} 
                      onChange={e => setBillForm({...billForm, category: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="Utilities">Utilities</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Stationary Procurement">Stationary Procurement</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "রসিদ ফাইল সংলগ্ন?" : "Scan / PDF Attached?"}</label>
                    <select 
                      value={billForm.hasReceipt ? 'yes' : 'no'} 
                      onChange={e => setBillForm({...billForm, hasReceipt: e.target.value === 'yes'})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="yes">Yes, Upload Scan</option>
                      <option value="no">No receipt file</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowUploadBillModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'আপলোড করুন' : 'Record Vendor Invoice'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: CREATE NEW VENDOR PROFILE */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showCreateVendorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateVendorModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "নতুন সহযোগী ভেন্ডর তৈরি" : "Register New Vendor Profile"}
                  </h4>
                </div>
                <button onClick={() => setShowCreateVendorModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateVendorSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ভেন্ডর / প্রতিষ্ঠানের নাম" : "Vendor / Corporate Name"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Link3 Technologies"
                    value={vendorForm.name} 
                    onChange={e => setVendorForm({...vendorForm, name: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "মূল সেবা বা সামগ্রী" : "Primary Product / Service Supplied"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Stationery, Fiber Optics"
                    value={vendorForm.service} 
                    onChange={e => setVendorForm({...vendorForm, service: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "প্রতিনিধি (কন্ট্যাক্ট)" : "Representative Name"}</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mehedi Hasan"
                      value={vendorForm.rep} 
                      onChange={e => setVendorForm({...vendorForm, rep: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "বকেয়া ব্যালেন্স (৳)" : "Initial Due Balance (৳)"}</label>
                    <input 
                      type="number" 
                      value={vendorForm.due} 
                      onChange={e => setVendorForm({...vendorForm, due: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateVendorModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'সংরক্ষণ' : 'Save Vendor Profile'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 4: VIEW DIGITAL VOUCHER */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedVoucherForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVoucherForView(null)}
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
                  <Receipt className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t.voucherModalTitle}
                  </h4>
                </div>
                <button onClick={() => setSelectedVoucherForView(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-bold text-slate-800">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ভাউচার আইডি" : "VOUCHER NO"}</p>
                    <p className="font-black text-slate-950 font-mono text-sm mt-0.5">{selectedVoucherForView.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "তারিখ" : "DATE RECORDED"}</p>
                    <p className="font-black text-slate-950 mt-0.5">{selectedVoucherForView.date}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "খরচের বিবরণ" : "DESCRIPTION"}</p>
                  <p className="font-black text-slate-950 text-sm leading-snug">{selectedVoucherForView.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "হিসাব ক্যাটাগরি" : "ACCOUNT CATEGORY"}</p>
                    <p className="font-black text-[#004D40] mt-1">{selectedVoucherForView.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "পেমেন্ট মাধ্যম" : "METHOD"}</p>
                    <p className="font-black text-slate-800 mt-1">{selectedVoucherForView.method}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "রসিদ ফাইল" : "RECEIPT ATTACHED"}</p>
                    <p className="font-black text-emerald-600 mt-1">
                      {selectedVoucherForView.attachment || (lang === 'bn' ? "সংযুক্ত নেই" : "No file attached")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "মোট বিতরিত পরিমাণ" : "NET CASH PAID"}</p>
                    <p className="font-black text-rose-600 text-lg">৳{selectedVoucherForView.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => {
                      showToastMsg(lang === 'bn' ? "পিডিএফ ভাউচার সফলভাবে ডাউনলোড হয়েছে!" : "PDF document version generated and downloaded.");
                      setSelectedVoucherForView(null);
                    }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl cursor-pointer font-extrabold text-xs"
                  >
                    {t.btnDownloadPdf}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedVoucherForView(null)} 
                    className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer font-extrabold text-xs"
                  >
                    {lang === 'bn' ? 'বন্ধ করুন' : 'Close Voucher'}
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
