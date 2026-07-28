import React from 'react';
import { 
  Calendar, 
  AlertCircle, 
  Wallet, 
  Building, 
  AlertTriangle, 
  Activity, 
  Plus, 
  Clock 
} from 'lucide-react';

interface AccountantOverviewProps {
  lang: 'bn' | 'en';
  stats: {
    totalCollected: number;
    pendingDues: number;
    monthlyExpense: number;
    netBalance: number;
    cashInHand: number;
    bankBalance: number;
    targetAchieved: number;
    targetGoal: number;
    todaysCollection: number;
    overdue: number;
  };
  txs: Array<{
    id: string;
    date: string;
    name: string;
    class: string;
    idNo: string;
    method: string;
    type: string;
    amount: number;
  }>;
  setActiveTab: (tab: string) => void;
  setShowAddExpenseModal: (show: boolean) => void;
}

export default function AccountantOverview({
  lang,
  stats,
  txs,
  setActiveTab,
  setShowAddExpenseModal
}: AccountantOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Accounts Overview Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 pb-5 text-left">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight">
            {lang === 'bn' ? 'হিসাবের ওভারভিউ' : 'Accounts Overview'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'ফি, ব্যয় এবং পে-রোলের সংক্ষিপ্ত বিবরণ।' : 'Snapshot of fees, expenses and payroll.'}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab('collect_fees')}
            className="px-4 py-2 bg-[#004D40] hover:bg-[#00382e] text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'bn' ? 'ফি আদায় করুন' : 'Record Fee'}</span>
          </button>
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-semibold text-xs shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-slate-500" />
            <span>{lang === 'bn' ? 'ব্যয় যোগ করুন' : 'Add Expense'}</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Today's Collection */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col justify-between relative overflow-hidden text-left min-h-32">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-slate-450 font-bold block">
                {lang === 'bn' ? 'আজকের আদায়' : "Today's Collection"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800 block">
                ৳{stats.todaysCollection.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="p-2 bg-amber-50 rounded-lg text-amber-600 border border-amber-100/50">
              <Calendar className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{lang === 'bn' ? 'আজকের পেমেন্ট রিসিভড' : 'Today payments received'}</span>
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col justify-between relative overflow-hidden text-left min-h-32">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-slate-455 font-bold block">
                {lang === 'bn' ? 'বকেয়া ফি' : 'Pending Dues'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-600 block">
                ৳{stats.pendingDues.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="p-2 bg-amber-50 rounded-lg text-amber-600 border border-amber-100/50">
              <AlertCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[10px] text-amber-600 font-bold mt-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{lang === 'bn' ? '১৪২ জন বকেয়া অভিভাবক' : '142 unpaid students'}</span>
          </div>
        </div>

        {/* Monthly Expense */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col justify-between relative overflow-hidden text-left min-h-32">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-slate-455 font-bold block">
                {lang === 'bn' ? 'মাসিক খরচ' : 'Monthly Expense'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-rose-600 block">
                ৳{stats.monthlyExpense.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="p-2 bg-rose-50 rounded-lg text-rose-600 border border-rose-100/50">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[10px] text-rose-650 font-bold mt-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>{lang === 'bn' ? 'ইউটিলিটি ও পে-রোল সহ' : 'Utilities + Payroll accounts'}</span>
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs flex flex-col justify-between relative overflow-hidden text-left min-h-32">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-slate-455 font-bold block">
                {lang === 'bn' ? 'নেট ব্যালেন্স' : 'Net Balance'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#004D40] block">
                ৳{stats.netBalance.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="p-2 bg-teal-50 rounded-lg text-[#004D40] border border-teal-100/50">
              <Building className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>{lang === 'bn' ? 'সুস্থ তহবিল ব্যালেন্স' : 'Healthy treasury balance'}</span>
          </div>
        </div>
      </section>

      {/* Row 2: Cash In Hand, Bank Balance, Monthly Target Achievement */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash In Hand */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-left lg:col-span-3 flex flex-col justify-between min-h-28">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {lang === 'bn' ? 'ক্যাশ ইন হ্যান্ড' : 'Cash In Hand'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 block mt-1">
              ৳{stats.cashInHand.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-2 border-t border-slate-100 pt-2">
            {lang === 'bn' ? 'অফিস ক্যাশ + খুচরা ক্যাশ' : 'Office cash + petty cash'}
          </p>
        </div>

        {/* Bank Balance */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-left lg:col-span-4 flex flex-col justify-between min-h-28">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {lang === 'bn' ? 'ব্যাংক ব্যালেন্স' : 'Bank Balance'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 block mt-1">
              ৳{stats.bankBalance.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-2 border-t border-slate-100 pt-2">
            {lang === 'bn' ? 'সকল ব্যাংক অ্যাকাউন্টস' : 'All bank accounts'}
          </p>
        </div>

        {/* Monthly Target Achievement */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-left lg:col-span-5 flex flex-col justify-between min-h-28">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {lang === 'bn' ? 'মাসিক লক্ষ্যমাত্রা অর্জন' : 'Monthly Target Achievement'}
            </span>
            <span className="text-xs font-black text-[#004D40]">
              {Math.round((stats.targetAchieved / stats.targetGoal) * 100)}%
            </span>
          </div>
          
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-1 shadow-inner">
            <div 
              className="bg-[#004D40] h-full rounded-full transition-all duration-500 shadow-sm" 
              style={{ width: `${(stats.targetAchieved / stats.targetGoal) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-2 text-[10px] font-bold text-slate-500">
            <span>{lang === 'bn' ? `অর্জিত: ৳${stats.targetAchieved.toLocaleString('en-IN')}` : `Achieved: ৳${stats.targetAchieved.toLocaleString('en-IN')}`}</span>
            <span>{lang === 'bn' ? `लक्ष्य: ৳${stats.targetGoal.toLocaleString('en-IN')}` : `Goal: ৳${stats.targetGoal.toLocaleString('en-IN')}`}</span>
          </div>
        </div>
      </section>

      {/* Row 3: Income vs Expenses & Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* Income vs Expenses Overview */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs lg:col-span-8">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">
                {lang === 'bn' ? 'আয় বনাম ব্যয় বিবরণী' : 'Income vs Expenses Overview'}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                {lang === 'bn' ? 'মাসিক ক্যাশফ্লো স্ন্যাপশট (শেষ ৮ মাস)' : 'Monthly cashflow snapshot (last 8 months)'}
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#004D40]" />
                <span className="text-slate-600">{lang === 'bn' ? 'আয়' : 'Income'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-teal-400" />
                <span className="text-slate-600">{lang === 'bn' ? 'ব্যয়' : 'Expense'}</span>
              </div>
            </div>
          </div>

          {/* HTML Custom Visual Bar Chart */}
          <div className="relative pt-6 pb-2 px-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-slate-300 font-semibold pl-1">
              <div className="border-b border-slate-100 w-full text-right pr-2">600k</div>
              <div className="border-b border-slate-100 w-full text-right pr-2">400k</div>
              <div className="border-b border-slate-100 w-full text-right pr-2">200k</div>
              <div className="w-full text-right pr-2 mt-auto">0</div>
            </div>

            <div className="h-32 flex justify-around items-end relative z-10 pl-8">
              {[
                { month: 'Jan', income: 420000, expense: 280000 },
                { month: 'Feb', income: 480000, expense: 310000 },
                { month: 'Mar', income: 510000, expense: 340000 },
                { month: 'Apr', income: 460000, expense: 300000 },
                { month: 'May', income: 550000, expense: 390000 },
                { month: 'Jun', income: 600000, expense: 450000 },
                { month: 'Jul', income: 580000, expense: 410000 },
                { month: 'Aug', income: 640000, expense: 430000 },
              ].map((item, idx) => {
                const maxVal = 640000;
                const incPercent = (item.income / maxVal) * 100;
                const expPercent = (item.expense / maxVal) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 w-1/8 group">
                    <div className="flex items-end gap-1 h-24">
                      {/* Income Bar */}
                      <div 
                        className="w-2.5 sm:w-3 bg-[#004D40] rounded-t-sm transition-all duration-550 hover:brightness-110 relative"
                        style={{ height: `${incPercent}%` }}
                        title={`${item.month} Income: ৳${item.income.toLocaleString()}`}
                      />
                      {/* Expense Bar */}
                      <div 
                        className="w-2.5 sm:w-3 bg-teal-400 rounded-t-sm transition-all duration-550 hover:brightness-110 relative"
                        style={{ height: `${expPercent}%` }}
                        title={`${item.month} Expense: ৳${item.expense.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-extrabold tracking-tight mt-1">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Payroll Alerts */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs lg:col-span-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2.5 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <h3 className="font-extrabold text-slate-800 text-sm">
              {lang === 'bn' ? 'আসন্ন পেমেন্ট ও অ্যালার্ট' : 'Upcoming Payroll Alerts'}
            </h3>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {/* Alert 1 */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-lg flex justify-between items-center text-xs">
              <div className="text-left">
                <p className="font-bold text-slate-800">{lang === 'bn' ? 'শিক্ষক পে-রোল - জুন' : 'Teacher Payroll - June'}</p>
                <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{lang === 'bn' ? '২ দিন বাকি' : 'Due in 2 days'}</p>
              </div>
              <span className="font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">৳৪,৫৫,০০০</span>
            </div>

            {/* Alert 2 */}
            <div className="bg-[#FFF5F5] border border-[#FED7D7] p-3 rounded-lg flex justify-between items-center text-xs">
              <div className="text-left">
                <p className="font-bold text-slate-800">{lang === 'bn' ? 'ভেন্ডর বিল - স্টেশনারি হাব' : 'Vendor Bill - Stationery Hub'}</p>
                <p className="text-[10px] text-rose-600 font-semibold mt-0.5">{lang === 'bn' ? 'আগামীকাল শেষ দিন' : 'Due tomorrow'}</p>
              </div>
              <span className="font-extrabold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-md">৳১৮,৫০০</span>
            </div>

            {/* Alert 3 */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3 rounded-lg flex justify-between items-center text-xs">
              <div className="text-left">
                <p className="font-bold text-slate-800">{lang === 'bn' ? 'বিদ্যুৎ বিল - জুন' : 'Electricity Bill - June'}</p>
                <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{lang === 'bn' ? '৩ দিন বাকি' : 'Due in 3 days'}</p>
              </div>
              <span className="font-extrabold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-md">৳২২,৪০০</span>
            </div>
          </div>
        </div>
      </section>

      {/* Row 4: Spend Share & Logs */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* Category Share */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs lg:col-span-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">
                {lang === 'bn' ? 'ক্যাটাগরি-ভিত্তিক ব্যয়' : 'Category-wise Expense'}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                {lang === 'bn' ? 'চলতি মাসে স্কুল তহবিলের খরচের খাতসমূহ' : 'Where school funds are spent this month'}
              </p>
            </div>
            <span className="text-[10px] font-extrabold text-[#004D40] bg-teal-50 border border-teal-100/50 px-2.5 py-1 rounded-md">
              {lang === 'bn' ? 'মোট ৳৪,৫০,৫০০' : 'Total ৳ 4,50,500'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Circle SVG */}
            <div className="sm:col-span-5 flex justify-center relative">
              <div className="w-28 h-28 relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#004D40" strokeWidth="12" strokeDasharray="219.9" strokeDashoffset="83.5" />
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#2DD4BF" strokeWidth="12" strokeDasharray="219.9" strokeDashoffset="197.9" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-slate-400 font-bold">{lang === 'bn' ? 'চলতি ব্যয়' : 'Monthly'}</span>
                  <span className="text-sm font-black text-slate-800">৳৪.৫L</span>
                </div>
              </div>
            </div>

            {/* Spend legends */}
            <div className="sm:col-span-7 space-y-2">
              {[
                { label_en: 'Salary & Payroll', label_bn: 'বেতন ও পে-রোল', amount: 285000, percent: 62, color: 'bg-[#004D40]' },
                { label_en: 'Utilities & Bills', label_bn: 'ইউটিলিটি ও বিল', amount: 42000, percent: 10, color: 'bg-teal-400' },
                { label_en: 'Stationery & Papers', label_bn: 'স্টেশনারি ও প্রিন্ট', amount: 28500, percent: 6, color: 'bg-amber-400' },
                { label_en: 'Maintenance', label_bn: 'রক্ষণাবেক্ষণ', amount: 25000, percent: 5, color: 'bg-rose-400' },
                { label_en: 'Transport & Fuel', label_bn: 'পরিবহন ও জ্বালানি', amount: 22000, percent: 5, color: 'bg-emerald-400' },
                { label_en: 'Other Expenses', label_bn: 'অন্যান্য খরচ', amount: 18000, percent: 4, color: 'bg-slate-400' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] font-bold">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-slate-600 truncate">{lang === 'bn' ? item.label_bn : item.label_en}</span>
                  </div>
                  <span className="text-slate-800 font-extrabold">৳{item.amount.toLocaleString()} ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs lg:col-span-6 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm">
              {lang === 'bn' ? 'অডিট লগ / সাম্প্রতিক ঘটনা' : 'Audit Log'}
            </h3>
          </div>

          <div className="space-y-4 relative pl-3 border-l-2 border-slate-100 flex-1 flex flex-col justify-center">
            {[
              { text_en: 'Created Expense Voucher EXP-1153 (Stationery)', text_bn: 'এক্সপেন্স ভাউচার EXP-1153 তৈরি সম্পন্ন', sub: 'Admin - 20 Jun, 03:45 PM' },
              { text_en: 'Collected Fee INV-2401 from Rahim Uddin', text_bn: 'রহিম উদ্দিন থেকে ফি আদায় সম্পন্ন (INV-2401)', sub: 'Accountant - 20 Jun, 12:42 PM' },
              { text_en: 'Approved salary payout for June payroll', text_bn: 'জুন পে-রোল এবং শিক্ষক বেতন বিতরণ মঞ্জুর', sub: 'Admin - 20 Jun, 11:32 AM' },
              { text_en: 'Edited Fee Structure for Class 8', text_bn: 'ক্লাস ৮-এর ফি কাঠামো সংশোধন করা হয়েছে', sub: 'Principal - 20 Jun, 09:12 AM' },
              { text_en: 'Generated monthly invoices for August 2026', text_bn: 'আগস্ট ২০২৬ সেশনের অটোমেটিক ইনভয়েস জেনারেট সম্পন্ন', sub: 'Admin - 20 Jun, 09:00 AM' },
            ].map((log, idx) => (
              <div key={idx} className="relative text-xs">
                <span className="absolute -left-[17px] top-1.5 h-2 w-2 rounded-full bg-[#004D40] border border-white shadow-sm" />
                <p className="font-bold text-slate-700">{lang === 'bn' ? log.text_bn : log.text_en}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{log.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Row 5: Recent Transactions Table */}
      <section className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-3xs text-left">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              {lang === 'bn' ? 'সাম্প্রতিক আদায়সমূহ' : 'Recent Transactions'}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold">
              {lang === 'bn' ? 'সর্বশেষ ৫টি আদায়কৃত ছাত্র ইনভয়েস ও রসিদ' : 'Top 5 most recent financial logs'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold">
                <th className="py-3 px-1">{lang === 'bn' ? 'ছাত্র' : 'Student'}</th>
                <th className="py-3 px-1">{lang === 'bn' ? 'ইনভয়েস আইডি' : 'Invoice ID'}</th>
                <th className="py-3 px-1">{lang === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                <th className="py-3 px-1">{lang === 'bn' ? 'তারিখ' : 'Date / Time'}</th>
                <th className="py-3 px-1 text-center">{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {txs.slice(0, 5).map((tx, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-1">
                    <div className="font-bold text-slate-800">{tx.name}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{tx.class} | Roll: {tx.idNo}</div>
                  </td>
                  <td className="py-3 px-1 font-mono text-slate-500 font-semibold text-[11px]">{tx.id}</td>
                  <td className="py-3 px-1 font-black text-slate-800">৳{tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-1 text-slate-400 font-semibold">{tx.date}</td>
                  <td className="py-3 px-1 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
                      {lang === 'bn' ? 'পরিশোধিত' : 'Paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
