import React, { useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Activity, 
  Clock, 
  CreditCard, 
  Download, 
  Sliders, 
  AlertTriangle, 
  Check, 
  X, 
  CheckCircle2, 
  Printer, 
  Building, 
  CheckCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TeacherPayrollDashboardProps {
  lang: 'bn' | 'en';
  showToastMsg: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export default function TeacherPayrollDashboard({ lang, showToastMsg }: TeacherPayrollDashboardProps) {
  // Localization
  const payrollT = {
    en: {
      title: "Payroll & Salary Management 💸",
      syncStatus: "Attendance and leave logs for June 2026 are fully synced. Ready to process salaries for 35 active teachers. AI has flagged 2 pending leave approvals that might affect salary deductions.",
      runBulk: "Run One-Click Bulk Payroll",
      allPaid: "All Salaries Disbursed",
      outflow: "Total Monthly Payroll Outflow",
      processedCount: "Processed Salaries",
      deductionsLabel: "Total Deductions & Lates",
      bonusesLabel: "Bonus & Incentives Disbursed",
      matrixTitle: "Automated Salary Matrix Table",
      teacherDetails: "Teacher Details",
      baseSalary: "Base Salary",
      attended: "Attended Days",
      leaves: "Approved (vs Unpaid) Leaves",
      deductions: "Deductions",
      bonus: "Performance Bonus",
      netPayable: "Net Payable",
      status: "Status",
      action: "Actions",
      approve: "Approve & Disburse",
      viewPayslip: "View Payslip",
      settingsTitle: "Salary Settings Hub",
      configureStruct: "Configure Base Structure",
      addBonus: "Add Performance Bonus",
      setLateRules: "Set Late-Deduction Rules",
      exportBank: "Export Bank Advice/Tax Report",
      conflictsTitle: "Leave Conflicts Requiring Review",
      waive: "Excuse/Waive Deduction",
      applyPenalty: "Apply Penalty",
    },
    bn: {
      title: "শিক্ষক পে-রোল ও সম্মানী পোর্টাল 💸",
      syncStatus: "জুন ২০২৬-এর উপস্থিতি এবং ছুটির লগ সম্পূর্ণ সিঙ্ক করা হয়েছে। ৩৫ জন শিক্ষকের বেতন প্রক্রিয়াকরণের জন্য প্রস্তুত। এআই ২টি অমীমাংসিত ছুটির আবেদন চিহ্নিত করেছে যা বেতন কর্তনে প্রভাব ফেলতে পারে।",
      runBulk: "ওয়ান-ক্লিক বাল্ক পে-রোল চালান",
      allPaid: "সকল সম্মানী প্রদান সম্পন্ন",
      outflow: "মোট মাসিক পে-রোল আউটফ্লো",
      processedCount: "প্রক্রিয়াকৃত সম্মানী",
      deductionsLabel: "মোট কর্তন ও লেট-পেনাল্টি",
      bonusesLabel: "বোনাস ও প্রণোদনা বিতরণ",
      matrixTitle: "স্বয়ংক্রিয় সেলারি ম্যাট্রিক্স টেবিল",
      teacherDetails: "শিক্ষকের বিবরণ",
      baseSalary: "মূল বেতন",
      attended: "উপস্থিত দিন",
      leaves: "অনুমোদিত (বনাম অবৈতনিক) ছুটি",
      deductions: "বেতন কর্তন",
      bonus: "পারফরম্যান্স বোনাস",
      netPayable: "মোট প্রদেয়",
      status: "স্ট্যাটাস",
      action: "পদক্ষেপ",
      approve: "অনুমোদন ও প্রদান",
      viewPayslip: "পে-স্লিপ দেখুন",
      settingsTitle: "স্যালারি সেটিংস হাব (কন্ট্রোল)",
      configureStruct: "বেস কাঠামো পরিবর্তন করুন",
      addBonus: "বোনাস প্রদান করুন",
      setLateRules: "লেট কর্তন নিয়ম সেট করুন",
      exportBank: "ব্যাংক এডভাইস রিপোর্ট এক্সপোর্ট",
      conflictsTitle: "ছুটির বিবাদ ও অমীমাংসিত লগ",
      waive: "কর্তন মওকুফ করুন",
      applyPenalty: "পেনাল্টি প্রয়োগ করুন"
    }
  };

  const pT = lang === 'bn' ? payrollT.bn : payrollT.en;

  // Local State definitions
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

  // Action indicators
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);
  const [payrollProgress, setPayrollProgress] = useState(0);

  // Modal Control States
  const [showConfigureBaseModal, setShowConfigureBaseModal] = useState(false);
  const [showAddBonusModal, setShowAddBonusModal] = useState(false);
  const [showLateRulesModal, setShowLateRulesModal] = useState(false);
  const [selectedPayslipTeacher, setSelectedPayslipTeacher] = useState<any | null>(null);

  // Form structures
  const [baseConfig, setBaseConfig] = useState({ workingDays: '26', gracePeriod: '15', providentFund: '10' });
  const [bonusForm, setBonusForm] = useState({ teacherId: 'TCH001', amount: '1500', type: 'Performance Bonus' });
  const [lateRulesForm, setLateRulesForm] = useState({ perLateAmount: '250', perUnexcusedAmount: '1200' });

  // Calculation helpers
  const visiblePaid = teachers.filter(t => t.status === 'paid').length;
  const totalPaidCount = 30 + visiblePaid; // 30 pre-paid in background + visible ones
  const totalPayrollOutflow = teachers.reduce((sum, t) => sum + (t.baseSalary - t.deductions + t.bonus), 0) + 400000;
  const totalDeductions = teachers.reduce((sum, t) => sum + t.deductions, 0) + 8000;
  const totalBonuses = teachers.reduce((sum, t) => sum + t.bonus, 0) + 36000;

  // Actions
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

  return (
    <div className="space-y-6">
      
      {/* 1. ONE-CLICK AUTOMATION & AI INSIGHTS HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#004D40] via-[#003d33] to-[#002e26] rounded-2xl shadow-md border border-teal-800 p-5 sm:p-6 text-white text-left">
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
                {pT.title}
              </h3>
            </div>
            
            <p className="text-xs text-teal-100/90 leading-relaxed font-medium">
              {teachers.every(t => t.status === 'paid') 
                ? (lang === 'bn' 
                    ? "জুন ২০২৬-এর সকল শিক্ষকের স্যালারি শীট সফলভাবে প্রস্তুত করা হয়েছে এবং সরাসরি ব্যাংক ট্রান্সফার সম্পন্ন হয়েছে।" 
                    : "All June 2026 teacher salary sheets have been fully compiled and disbursed successfully via Direct Bank Advice wires. 35 bank transfer files are complete.") 
                : pT.syncStatus
              }
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            {isProcessingPayroll ? (
              <div className="flex flex-col items-end gap-1.5 min-w-[200px]">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                  <span>{lang === 'bn' ? `প্রক্রিয়াধীন... ${payrollProgress}%` : `Processing... ${payrollProgress}%`}</span>
                </div>
                <div className="h-1.5 w-full bg-teal-950 rounded-full overflow-hidden border border-teal-800">
                  <div className="h-full bg-emerald-400 transition-all duration-200" style={{ width: `${payrollProgress}%` }} />
                </div>
              </div>
            ) : teachers.every(t => t.status === 'paid') ? (
              <span className="px-4 py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{pT.allPaid}</span>
              </span>
            ) : (
              <button
                onClick={handleBulkPayrollRun}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-emerald-400 shrink-0"
              >
                <Coins className="h-4 w-4" />
                <span>{pT.runBulk}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. HIGH-IMPACT PAYROLL KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Outflow */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {pT.outflow}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#004D40] block mt-1">
              ৳{totalPayrollOutflow.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2.5 mt-2 flex justify-between">
            <span>{lang === 'bn' ? "৩৫ জন শিক্ষকের বেস" : "Based on 35 active staff"}</span>
            <span className="text-emerald-600 font-extrabold">+1.2% {lang === 'bn' ? 'বৃদ্ধি' : 'vs last mth'}</span>
          </div>
        </div>

        {/* Processed Count */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {pT.processedCount}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-800 block mt-1">
              {totalPaidCount}/35
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[9px] text-slate-400 font-extrabold mb-1">
              <span>{Math.round((totalPaidCount / 35) * 100)}% {lang === 'bn' ? 'বিতরণ' : 'Disbursed'}</span>
              <span>35 {lang === 'bn' ? 'মোট' : 'Total'}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-600 rounded-full transition-all duration-300" style={{ width: `${(totalPaidCount / 35) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-amber-50/40 border border-amber-200 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider block">
              {pT.deductionsLabel}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-700 block mt-1">
              ৳{totalDeductions.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[10px] text-amber-800/80 font-bold border-t border-amber-100 pt-2.5 mt-2 flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>{lang === 'bn' ? "দেরি ও ছুটির কারণে কর্তন" : "Absence/Late arrivals auto-calculated"}</span>
          </div>
        </div>

        {/* Incentives / Bonuses */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {pT.bonusesLabel}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-teal-700 block mt-1">
              ৳{totalBonuses.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[10px] text-teal-700 font-bold border-t border-slate-100 pt-2.5 mt-2 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-emerald-500 animate-pulse" />
            <span>{lang === 'bn' ? "পারফরম্যান্স ও উৎসব বোনাস" : "Festival & merit incentives credited"}</span>
          </div>
        </div>

      </section>

      {/* 3. CORE INTELLIGENT GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: AUTOMATED SALARY MATRIX TABLE (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl shadow-3xs p-5.5 text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {pT.matrixTitle}
                </h4>
              </div>
              <span className="text-[10px] bg-[#004D40]/5 text-[#004D40] font-extrabold px-2.5 py-1 rounded-lg border border-[#004D40]/20">
                {lang === 'bn' ? "জুন ২০২৬ পে-রোল" : "June 2026 Cycle"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                    <th className="py-3 px-2">{pT.teacherDetails}</th>
                    <th className="py-3 px-2">{pT.baseSalary}</th>
                    <th className="py-3 px-2 text-center">{pT.attended}</th>
                    <th className="py-3 px-2 text-center">{pT.leaves}</th>
                    <th className="py-3 px-2 text-right">{pT.deductions}</th>
                    <th className="py-3 px-2 text-right">{pT.bonus}</th>
                    <th className="py-3 px-2 text-right">{pT.netPayable}</th>
                    <th className="py-3 px-2 text-center">{pT.status}</th>
                    <th className="py-3 px-2 text-right">{pT.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-bold text-[#1E293B]">
                  {teachers.map((t) => {
                    const net = t.baseSalary - t.deductions + t.bonus;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Teacher Details */}
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-teal-50 text-[#004D40] font-black border border-teal-100 flex items-center justify-center shrink-0">
                              {t.avatar}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 leading-tight">{t.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">{t.designation}</p>
                            </div>
                          </div>
                        </td>

                        {/* Base Salary */}
                        <td className="py-3.5 px-2">
                          <span className="font-extrabold text-slate-900">৳{t.baseSalary.toLocaleString('en-IN')}</span>
                        </td>

                        {/* Attended Days */}
                        <td className="py-3.5 px-2 text-center text-slate-600">
                          <span>{t.attendedDays} {lang === 'bn' ? 'দিন' : 'days'}</span>
                        </td>

                        {/* Approved leaves / Unpaid */}
                        <td className="py-3.5 px-2 text-center">
                          <span className="text-slate-500">{t.approvedLeaves}</span>
                          <span className="text-slate-300 mx-1">/</span>
                          <span className={t.unpaidLeaves > 0 ? 'text-amber-600 font-black' : 'text-slate-400'}>{t.unpaidLeaves}</span>
                        </td>

                        {/* Deductions */}
                        <td className="py-3.5 px-2 text-right text-rose-600">
                          {t.deductions > 0 ? `-৳${t.deductions.toLocaleString('en-IN')}` : '৳0'}
                        </td>

                        {/* Performance bonus */}
                        <td className="py-3.5 px-2 text-right text-emerald-600">
                          {t.bonus > 0 ? `+৳${t.bonus.toLocaleString('en-IN')}` : '৳0'}
                        </td>

                        {/* Net Payable */}
                        <td className="py-3.5 px-2 text-right">
                          <span className="font-black text-slate-900 text-sm">৳{net.toLocaleString('en-IN')}</span>
                        </td>

                        {/* Status badge */}
                        <td className="py-3.5 px-2 text-center">
                          {t.status === 'paid' ? (
                            <span className="px-2 py-0.5 inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-extrabold">
                              {lang === 'bn' ? 'পরিশোধিত' : 'Paid'}
                            </span>
                          ) : t.status === 'on_hold' ? (
                            <span className="px-2 py-0.5 inline-flex rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-extrabold">
                              {lang === 'bn' ? 'হোল্ড' : 'On Hold'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 inline-flex rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-extrabold">
                              {lang === 'bn' ? 'অপেক্ষমান সিঙ্ক' : 'Pending Sync'}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex gap-1.5 justify-end">
                            {t.status !== 'paid' && (
                              <button
                                onClick={() => handleDisburseIndividual(t.id, t.name)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg transition-all shadow-3xs cursor-pointer"
                              >
                                {lang === 'bn' ? 'বিতরণ' : 'Disburse'}
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedPayslipTeacher(t)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 font-extrabold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
                            >
                              <FileText className="h-2.5 w-2.5 shrink-0" />
                              <span>{lang === 'bn' ? 'পে-স্লিপ' : 'Payslip'}</span>
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

        {/* RIGHT COLUMN: QUICK CONTROLS & REVIEW Absences (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Salary Settings Hub (Quick Actions) */}
          <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {pT.settingsTitle}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Button 1: Configure Structure */}
              <button
                onClick={() => setShowConfigureBaseModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-teal-50 text-teal-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sliders className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {pT.configureStruct}
                </span>
              </button>

              {/* Button 2: Add Performance Bonus */}
              <button
                onClick={() => setShowAddBonusModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {pT.addBonus}
                </span>
              </button>

              {/* Button 3: Set Late rules */}
              <button
                onClick={() => setShowLateRulesModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-amber-50 text-amber-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {pT.setLateRules}
                </span>
              </button>

              {/* Button 4: Export bank Advice */}
              <button
                onClick={handleExportBankAdvice}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-blue-50 text-blue-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Download className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {pT.exportBank}
                </span>
              </button>
            </div>
          </div>

          {/* Leave Conflicts Requiring Review */}
          <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {pT.conflictsTitle}
                </h4>
              </div>
              <span className="text-[9px] bg-amber-50 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-100">
                {leaveConflicts.length} {lang === 'bn' ? "বাকি" : "Active"}
              </span>
            </div>

            <div className="space-y-3.5">
              {leaveConflicts.length === 0 ? (
                <div className="py-6 text-center text-slate-400 font-bold text-[11px] space-y-1 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto animate-bounce" />
                  <p>{lang === 'bn' ? "সকল ছুটির আবেদন অনুমোদিত!" : "No leave conflicts requiring review."}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {leaveConflicts.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: 50, height: 0, padding: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-3.5 bg-amber-50/30 border border-amber-100 rounded-xl space-y-3 overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs text-slate-900">{c.teacherName}</span>
                            <span className="h-1 w-1 bg-slate-300 rounded-full" />
                            <span className="text-[9px] text-[#475569] font-bold">{c.conflictType}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium mt-1 leading-snug">
                            {c.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-amber-100 text-[10px]">
                        <span className="font-bold text-slate-500">{lang === 'bn' ? "সম্ভavy জরিমানা:" : "Potential deduction:"}</span>
                        <span className="font-black text-rose-700">৳{c.deductionAmount}</span>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleResolveConflict(c.id, 'excuse')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
                        >
                          <Check className="h-3 w-3" />
                          <span>{lang === 'bn' ? 'মওকুফ' : 'Excuse'}</span>
                        </button>
                        <button
                          onClick={() => handleResolveConflict(c.id, 'penalize')}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
                        >
                          <X className="h-3 w-3" />
                          <span>{lang === 'bn' ? 'পেনাল্টি' : 'Penalize'}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* PAYROLL MODAL 1: CONFIGURE BASE STRUCTURE */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showConfigureBaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigureBaseModal(false)}
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
                  <Sliders className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "বেস কাঠামো পরিবর্তন" : "Configure Base Structure"}
                  </h4>
                </div>
                <button onClick={() => setShowConfigureBaseModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleConfigureBaseSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "কাজের দিন (মাসিক)" : "Standard Working Days"}</label>
                  <input 
                    type="number" 
                    value={baseConfig.workingDays} 
                    onChange={e => setBaseConfig({...baseConfig, workingDays: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "বিলম্ব গ্রেস পিরিয়ড (মিনিট)" : "Late Grace Minutes"}</label>
                  <input 
                    type="number" 
                    value={baseConfig.gracePeriod} 
                    onChange={e => setBaseConfig({...baseConfig, gracePeriod: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "প্রভিডেন্ট ফান্ড কর্তন (%)" : "Provident Fund Contribution (%)"}</label>
                  <input 
                    type="number" 
                    value={baseConfig.providentFund} 
                    onChange={e => setBaseConfig({...baseConfig, providentFund: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowConfigureBaseModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'সংরক্ষণ' : 'Save Config'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* PAYROLL MODAL 2: ADD PERFORMANCE BONUS */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAddBonusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBonusModal(false)}
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
                  <Sparkles className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "পারফরম্যান্স বোনাস প্রদান" : "Add Performance Bonus"}
                  </h4>
                </div>
                <button onClick={() => setShowAddBonusModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleAddBonusSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "শিক্ষক নির্বাচন করুন" : "Select Teacher"}</label>
                  <select 
                    value={bonusForm.teacherId} 
                    onChange={e => setBonusForm({...bonusForm, teacherId: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "বোনাস পরিমাণ (৳)" : "Bonus Amount (৳)"}</label>
                  <input 
                    type="number" 
                    value={bonusForm.amount} 
                    onChange={e => setBonusForm({...bonusForm, amount: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "বোনাসের কারণ" : "Description / Purpose"}</label>
                  <input 
                    type="text" 
                    value={bonusForm.type} 
                    onChange={e => setBonusForm({...bonusForm, type: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddBonusModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'বোনাস যোগ করুন' : 'Award Bonus'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* PAYROLL MODAL 3: SET LATE DEDUCTION RULES */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showLateRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLateRulesModal(false)}
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
                  <Clock className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "বিলম্ব ও অনুপস্থিতি কর্তন নিয়ম" : "Late-Deduction Rules"}
                  </h4>
                </div>
                <button onClick={() => setShowLateRulesModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleLateRulesSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "প্রতি দেরির জরিমানা (৳)" : "Penalty Per Late Arrival (৳)"}</label>
                  <input 
                    type="number" 
                    value={lateRulesForm.perLateAmount} 
                    onChange={e => setLateRulesForm({...lateRulesForm, perLateAmount: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "প্রতি অবৈতনিক অনুপস্থিতির জরিমানা (৳)" : "Penalty Per Unpaid Day (৳)"}</label>
                  <input 
                    type="number" 
                    value={lateRulesForm.perUnexcusedAmount} 
                    onChange={e => setLateRulesForm({...lateRulesForm, perUnexcusedAmount: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowLateRulesModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'নিয়ম আপডেট করুন' : 'Update Guidelines'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* PAYROLL MODAL 4: DETAILED PRINTABLE PAYSLIP */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedPayslipTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPayslipTeacher(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 text-left text-slate-800"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="font-extrabold text-xs text-[#004D40] uppercase tracking-widest">{lang === 'bn' ? 'স্টুডেন্টস কেয়ার মডেল স্কুল' : 'STUDENTS CARE MODEL SCHOOL'}</h3>
                  <h4 className="text-sm font-black text-slate-900 mt-1">{lang === 'bn' ? 'কর্মকর্তা বেতন রসিদ' : 'Teacher Monthly Salary Payslip'}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Month: June 2026 Academic Session</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      window.print();
                      showToastMsg(lang === 'bn' ? "মুদ্রণ শুরু হচ্ছে..." : "Sending payslip to print queue...");
                    }} 
                    className="p-1.5 text-slate-500 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button onClick={() => setSelectedPayslipTeacher(null)} className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-100 rounded-lg cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Roster detail */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{lang === 'bn' ? 'শিক্ষকের নাম ও আইডি' : 'Teacher Name & ID'}</p>
                  <p className="font-black text-slate-950 text-sm">{selectedPayslipTeacher.name}</p>
                  <p className="text-slate-500">ID: {selectedPayslipTeacher.id} &bull; {selectedPayslipTeacher.designation}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{lang === 'bn' ? 'ব্যাংক তথ্য' : 'Payment Target Route'}</p>
                  <p className="font-black text-slate-950 flex items-center gap-1 justify-end">
                    <Building className="h-3 w-3 text-cyan-700" />
                    Sonali Bank Ltd.
                  </p>
                  <p className="text-slate-500">A/C: 1022445588{selectedPayslipTeacher.id.replace('TCH', '')}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-5 space-y-2.5">
                <div className="flex justify-between text-[10px] uppercase font-extrabold text-slate-400 tracking-wider border-b border-slate-100 pb-1.5">
                  <span>{lang === 'bn' ? 'বেতন উপাদান' : 'Earnings & Adjustments'}</span>
                  <span>{lang === 'bn' ? 'পরিমাণ' : 'Amount'}</span>
                </div>

                <div className="space-y-2 text-xs font-bold text-slate-800">
                  {/* Basic */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">{lang === 'bn' ? 'মূল বেতন (বেস)' : 'Base Monthly Salary'}</span>
                    <span>৳{selectedPayslipTeacher.baseSalary.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Additions */}
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-emerald-500" />
                      {lang === 'bn' ? 'পারফরম্যান্স / উৎসব বোনাস' : 'Performance Incentive'}
                    </span>
                    <span>+৳{selectedPayslipTeacher.bonus.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Deductions */}
                  {selectedPayslipTeacher.deductions > 0 && (
                    <div className="flex justify-between items-center text-rose-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-rose-500" />
                        {lang === 'bn' ? 'ছুটি / বিলম্ব পেনাল্টি কর্তন' : 'Unpaid Leaves/Late Penalties'}
                      </span>
                      <span>-৳{selectedPayslipTeacher.deductions.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-[1px] bg-slate-100 my-2.5" />

                  {/* Total Net */}
                  <div className="flex justify-between items-center text-sm font-black text-slate-950 bg-teal-50/50 p-3 rounded-xl border border-teal-100/50">
                    <span className="text-[#004D40]">{lang === 'bn' ? 'মোট নেট প্রদেয়' : 'Total Net Disbursed'}</span>
                    <span className="text-base text-[#004D40]">
                      ৳{(selectedPayslipTeacher.baseSalary - selectedPayslipTeacher.deductions + selectedPayslipTeacher.bonus).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp & Signatures */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-extrabold">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 text-[9px] uppercase font-black">
                    {lang === 'bn' ? 'বিতরণ সম্পন্ন' : 'Direct Bank Remitted ✓'}
                  </span>
                  <p className="mt-1">TxID: REM-2026-{selectedPayslipTeacher.id}-480A</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="h-7 w-20 bg-slate-100/50 rounded border border-slate-200/50 border-dashed flex items-center justify-center text-[8px] text-slate-300 font-bold tracking-widest italic select-none">
                    SCMS SEAL
                  </div>
                  <p>{lang === 'bn' ? 'প্রধান হিসাবরক্ষক স্বাক্ষর' : 'Kamrul Hasan (Senior Accountant)'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
