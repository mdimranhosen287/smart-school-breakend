import React, { useState } from 'react';
import { 
  Sparkles, 
  Package, 
  ShieldAlert, 
  Settings, 
  Wrench, 
  Plus, 
  UserCheck, 
  AlertOctagon, 
  FileSpreadsheet, 
  Check, 
  X, 
  ArrowUpRight, 
  History, 
  Edit3, 
  Monitor, 
  BookOpen, 
  Shirt, 
  Trash2,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryTrackerDashboardProps {
  lang: 'bn' | 'en';
  showToastMsg: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export default function InventoryTrackerDashboard({ lang, showToastMsg }: InventoryTrackerDashboardProps) {
  // Localization Texts
  const texts = {
    en: {
      title: "Inventory & School Assets Ledger 🏫",
      aiSummary: "All school assets are logged. Currently, 3 high-value lab monitors are marked for maintenance. 2 daily-use items (Chalk & Whiteboard Markers) have dropped below the safety threshold. AI suggests placing a reorder today.",
      quickReorderBadge: "3 Items Low in Stock - Quick Reorder",
      kpiTotalAsset: "Total Asset Value",
      kpiTotalSubtitle: "IT Equipment: ৳ 9,80,000 | Stationary: ৳ 2,65,000",
      kpiStationaryStatus: "Stationary Stock Status",
      kpiStationarySubtitle: "85% Optimal Level",
      kpiLowStock: "Low Stock Warnings",
      kpiLowStockSubtitle: "2 Categories Critical",
      kpiMaintenance: "Assets Under Maintenance",
      kpiMaintenanceSubtitle: "5 Lab Computers & Monitors",
      matrixTitle: "Smart Inventory Matrix Ledger",
      colItem: "Item Details",
      colQty: "Current Qty",
      colThreshold: "Safety Threshold",
      colVendor: "Vendor Info",
      colPrice: "Unit Price",
      colStatus: "Status",
      colActions: "Actions",
      badgeInStock: "In Stock",
      badgeLowStock: "Low Stock",
      badgeOutOfStock: "Out of Stock",
      actionUpdate: "Update Stock",
      actionHistory: "View History",
      actionHubTitle: "Inventory Action Hub",
      btnAddNew: "Add New Item/Asset",
      btnIssueItem: "Issue Item to Staff",
      btnLogDamaged: "Log Damaged Asset",
      btnGenerateAudit: "Generate Audit/Depreciation Report",
      reqsTitle: "Teacher & Staff Requisitions",
      reqsPending: "Pending Approvals",
      btnApprove: "Approve & Issue",
      btnDecline: "Decline",
      emptyReqs: "All staff requisitions resolved!",
      historyTitle: "Stock Audit Logs",
      historyColEvent: "Event Log",
      historyColUser: "Updated By",
      historyColTime: "Timestamp"
    },
    bn: {
      title: "ইনভেন্টরি ও স্কুল সম্পদ লেজার 🏫",
      aiSummary: "স্কুলের সমস্ত সম্পদ লগ করা হয়েছে। বর্তমানে, ৩টি মূল্যবান ল্যাব মনিটর রক্ষণাবেক্ষণের জন্য চিহ্নিত রয়েছে। ২টি দৈনন্দিন ব্যবহারের আইটেম (চক এবং হোয়াইটবোর্ড মার্কার) নিরাপত্তা সীমার নিচে নেমে গেছে। এআই আজই রিঅর্ডার করার পরামর্শ দিচ্ছে।",
      quickReorderBadge: "৩টি আইটেম লো স্টক - দ্রুত রিঅর্ডার করুন",
      kpiTotalAsset: "মোট সম্পদ মূল্য",
      kpiTotalSubtitle: "আইটি যন্ত্রাংশ: ৳ ৯,৮০,০০০ | স্টেশনারি: ৳ ২,৬৫,০০০",
      kpiStationaryStatus: "স্টেশনারি স্টক অবস্থা",
      kpiStationarySubtitle: "৮৫% সন্তোষজনক পর্যায়",
      kpiLowStock: "লো স্টক সতর্কতা",
      kpiLowStockSubtitle: "২টি ক্যাটাগরি সংকটপূর্ণ",
      kpiMaintenance: "রক্ষণাবেক্ষণাধীন সম্পদ",
      kpiMaintenanceSubtitle: "৫টি ল্যাব কম্পিউটার ও মনিটর",
      matrixTitle: "স্মার্ট ইনভেন্টরি ম্যাট্রিক্স লেজার",
      colItem: "আইটেমের বিবরণ",
      colQty: "বর্তমান পরিমাণ",
      colThreshold: "নিরাপত্তা সীমা",
      colVendor: "ভেন্ডর তথ্য",
      colPrice: "একক মূল্য",
      colStatus: "স্ট্যাটাস",
      colActions: "পদক্ষেপ",
      badgeInStock: "স্টকে আছে",
      badgeLowStock: "লো স্টক",
      badgeOutOfStock: "স্টক শেষ",
      actionUpdate: "স্টক আপডেট",
      actionHistory: "ইতিহাস দেখুন",
      actionHubTitle: "ইনভেন্টরি অ্যাকশন হাব",
      btnAddNew: "নতুন আইটেম/সম্পদ যুক্ত করুন",
      btnIssueItem: "শিক্ষক/স্টাফদের আইটেম প্রদান",
      btnLogDamaged: "ক্ষতিগ্রস্ত সম্পদ নথিবদ্ধকরণ",
      btnGenerateAudit: "অডিট ও অবচয় রিপোর্ট তৈরি",
      reqsTitle: "শিক্ষক ও কর্মকর্তা চাহিদাপত্র",
      reqsPending: "অপেক্ষমান অনুমোদন",
      btnApprove: "অনুমোদন ও ইস্যু",
      btnDecline: "প্রত্যাখ্যান",
      emptyReqs: "সকল চাহিদাপত্র সফলভাবে সম্পন্ন হয়েছে!",
      historyTitle: "স্টক অডিট লগ সমূহ",
      historyColEvent: "ইভেন্ট বিবরণ",
      historyColUser: "হালনাগাদকারী",
      historyColTime: "সময়কাল"
    }
  };

  const t = lang === 'bn' ? texts.bn : texts.en;

  // Inventory list state
  const [items, setItems] = useState([
    { id: "INV001", name: "High-Value LCD Lab Monitors", category: "IT Lab", qty: 22, threshold: 25, vendor: "Star Tech Ltd.", price: 14500, status: "low" as "instock"|"low"|"out", icon: "monitor" },
    { id: "INV002", name: "Non-Dust Whiteboard Chalk (Box)", category: "Stationary", qty: 120, threshold: 50, vendor: "Anupam Prokashoni", price: 180, status: "instock" as "instock"|"low"|"out", icon: "book" },
    { id: "INV003", name: "Blackboard & Whiteboard Markers", category: "Stationary", qty: 8, threshold: 30, vendor: "Linc Stationary", price: 60, status: "low" as "instock"|"low"|"out", icon: "book" },
    { id: "INV004", name: "High School Physical Uniforms", category: "Uniform", qty: 45, threshold: 15, vendor: "Kader Tailors", price: 850, status: "instock" as "instock"|"low"|"out", icon: "shirt" },
    { id: "INV005", name: "Science Lab Glass Test Tubes", category: "IT Lab", qty: 0, threshold: 20, vendor: "Dhaka Scientific Co.", price: 120, status: "out" as "instock"|"low"|"out", icon: "monitor" }
  ]);

  // Requisitions state
  const [requisitions, setRequisitions] = useState([
    { id: "REQ-101", requester: "Mr. Imran (Mathematics)", detail: "2 boxes of Whiteboard Markers", category: "Stationary", qty: 2 },
    { id: "REQ-102", requester: "Science Lab Assistant", detail: "5 Glass Test Tubes", category: "IT Lab", qty: 5 }
  ]);

  // Stock audit log history state
  const [auditLogs, setAuditLogs] = useState([
    { id: "LOG-01", event: "Restocked High School Physical Uniforms (+15 units)", user: "Md. Kamrul Hasan", time: "2 hours ago" },
    { id: "LOG-02", event: "Approved and issued 5 boxes of Chalk to Teacher Common Room", user: "Md. Kamrul Hasan", time: "Yesterday" },
    { id: "LOG-03", event: "Marked 3 Lab Monitors as 'Under Maintenance'", user: "IT Coordinator", time: "3 days ago" }
  ]);

  // Modals controller
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [selectedItemForUpdate, setSelectedItemForUpdate] = useState<any | null>(null);

  // New item form state
  const [newItemForm, setNewItemForm] = useState({ name: '', category: 'Stationary', qty: '', threshold: '', vendor: '', price: '' });
  const [issueForm, setIssueForm] = useState({ itemId: 'INV002', receiver: '', qty: '' });
  const [damageForm, setDamageForm] = useState({ itemId: 'INV001', qty: '1', reason: '' });
  const [updateQtyVal, setUpdateQtyVal] = useState('');

  // Calculations
  const totalValue = items.reduce((sum, item) => sum + (item.qty * item.price), 0) + 1150000; // Adding base assets like computers, desks etc
  const lowStockCount = items.filter(item => item.qty <= item.threshold).length;

  const handleQuickReorder = () => {
    // Restock low items
    setItems(prev => prev.map(item => {
      if (item.status === 'low' || item.status === 'out' || item.qty <= item.threshold) {
        const reorderQty = item.threshold * 2;
        return {
          ...item,
          qty: item.qty + reorderQty,
          status: 'instock' as const
        };
      }
      return item;
    }));

    // Add audit log
    const logText = lang === 'bn' 
      ? `এআই অটোমেটিক রিঅর্ডার দ্বারা লো-স্টক আইটেমসমূহ পুনরায় স্টক করা হয়েছে`
      : `AI Quick Reorder successfully replenished all low-stock items`;

    setAuditLogs(prev => [
      { id: `LOG-${Date.now()}`, event: logText, user: "AI System", time: "Just now" },
      ...prev
    ]);

    showToastMsg(
      lang === 'bn'
        ? "লো-স্টক আইটেমসমূহের জন্য সফলভাবে রিঅর্ডার সম্পন্ন হয়েছে এবং নতুন স্টক যোগ হয়েছে!"
        : "Reorder successfully placed for low-stock items! Standard quantities added to ledger.",
      "success"
    );
  };

  const handleApproveReq = (reqId: string, req: any) => {
    setRequisitions(prev => prev.filter(r => r.id !== reqId));
    
    // Log audit trail
    const logText = lang === 'bn'
      ? `${req.requester}-এর জন্য ${req.detail} চাহিদাপত্র অনুমোদন ও প্রদান করা হয়েছে`
      : `Approved and issued "${req.detail}" requested by ${req.requester}`;

    setAuditLogs(prev => [
      { id: `LOG-${Date.now()}`, event: logText, user: "Md. Kamrul Hasan", time: "Just now" },
      ...prev
    ]);

    showToastMsg(
      lang === 'bn'
        ? "চাহিদাপত্র অনুমোদিত এবং আইটেম সফলভাবে ইস্যু করা হয়েছে!"
        : "Requisition approved and items issued from warehouse inventory.",
      "success"
    );
  };

  const handleDeclineReq = (reqId: string, requester: string) => {
    setRequisitions(prev => prev.filter(r => r.id !== reqId));
    showToastMsg(
      lang === 'bn'
        ? `${requester}-এর চাহিদাপত্রটি বাতিল করা হয়েছে`
        : `Requisition from ${requester} declined.`,
      "info"
    );
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.name || !newItemForm.qty || !newItemForm.price) {
      showToastMsg(lang === 'bn' ? "দয়া করে সব ফিল্ড পূরণ করুন" : "Please fill in all mandatory fields", "error");
      return;
    }

    const qtyNum = parseInt(newItemForm.qty) || 0;
    const thresholdNum = parseInt(newItemForm.threshold) || 5;
    const priceNum = parseFloat(newItemForm.price) || 0;

    const added: any = {
      id: `INV00${items.length + 1}`,
      name: newItemForm.name,
      category: newItemForm.category,
      qty: qtyNum,
      threshold: thresholdNum,
      vendor: newItemForm.vendor || "Local Vendor",
      price: priceNum,
      status: qtyNum === 0 ? 'out' : (qtyNum <= thresholdNum ? 'low' : 'instock'),
      icon: newItemForm.category === 'IT Lab' ? 'monitor' : (newItemForm.category === 'Uniform' ? 'shirt' : 'book')
    };

    setItems(prev => [...prev, added]);
    setAuditLogs(prev => [
      { id: `LOG-${Date.now()}`, event: `Added new item "${newItemForm.name}" (+${qtyNum} Qty)`, user: "Md. Kamrul Hasan", time: "Just now" },
      ...prev
    ]);

    setShowAddModal(false);
    setNewItemForm({ name: '', category: 'Stationary', qty: '', threshold: '', vendor: '', price: '' });
    showToastMsg(
      lang === 'bn'
        ? `নতুন সম্পদ "${added.name}" সফলভাবে তালিকায় যোগ করা হয়েছে!`
        : `Successfully registered new asset: "${added.name}" in inventory catalog.`
    );
  };

  const handleIssueItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.receiver || !issueForm.qty) {
      showToastMsg(lang === 'bn' ? "গ্রহীতার নাম ও পরিমাণ প্রয়োজন" : "Receiver and quantity are required", "error");
      return;
    }

    const targetItem = items.find(item => item.id === issueForm.itemId);
    if (!targetItem) return;

    const qtyToIssue = parseInt(issueForm.qty) || 0;
    if (targetItem.qty < qtyToIssue) {
      showToastMsg(
        lang === 'bn' 
          ? `অপর্যাপ্ত স্টক! উপলব্ধ পরিমাণ: ${targetItem.qty}` 
          : `Insufficient stock! Currently available quantity: ${targetItem.qty}`, 
        "error"
      );
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === issueForm.itemId) {
        const newQty = item.qty - qtyToIssue;
        return {
          ...item,
          qty: newQty,
          status: newQty === 0 ? 'out' : (newQty <= item.threshold ? 'low' : 'instock')
        };
      }
      return item;
    }));

    setAuditLogs(prev => [
      { id: `LOG-${Date.now()}`, event: `Issued ${qtyToIssue} units of "${targetItem.name}" to ${issueForm.receiver}`, user: "Md. Kamrul Hasan", time: "Just now" },
      ...prev
    ]);

    setShowIssueModal(false);
    setIssueForm({ itemId: 'INV002', receiver: '', qty: '' });
    showToastMsg(
      lang === 'bn'
        ? `সফলভাবে ${qtyToIssue}টি আইটেম ${issueForm.receiver}-কে প্রদান করা হয়েছে!`
        : `Successfully issued ${qtyToIssue} units of "${targetItem.name}" to ${issueForm.receiver}.`
    );
  };

  const handleLogDamageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = items.find(item => item.id === damageForm.itemId);
    if (!targetItem) return;

    const qtyToDamage = parseInt(damageForm.qty) || 0;
    if (targetItem.qty < qtyToDamage) {
      showToastMsg(lang === 'bn' ? "স্টকের পরিমাণের চেয়ে বেশি ক্ষতি দাবি করা অসম্ভব!" : "Damage quantity cannot exceed current ledger stock!", "error");
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === damageForm.itemId) {
        const newQty = item.qty - qtyToDamage;
        return {
          ...item,
          qty: newQty,
          status: newQty === 0 ? 'out' : (newQty <= item.threshold ? 'low' : 'instock')
        };
      }
      return item;
    }));

    setAuditLogs(prev => [
      { id: `LOG-${Date.now()}`, event: `Logged ${qtyToDamage} damaged units of "${targetItem.name}" [Reason: ${damageForm.reason || 'Not specified'}]`, user: "Md. Kamrul Hasan", time: "Just now" },
      ...prev
    ]);

    setShowDamageModal(false);
    setDamageForm({ itemId: 'INV001', qty: '1', reason: '' });
    showToastMsg(
      lang === 'bn'
        ? `ক্ষতিগ্রস্ত সম্পদ সফলভাবে সিস্টেমে নথিবদ্ধ করা হয়েছে!`
        : `Damaged item report compiled. Ledger adjusted accordingly.`
    );
  };

  const handleUpdateStockClick = (item: any) => {
    setSelectedItemForUpdate(item);
    setUpdateQtyVal(item.qty.toString());
    setShowUpdateStockModal(true);
  };

  const handleUpdateStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForUpdate) return;

    const newQty = parseInt(updateQtyVal);
    if (isNaN(newQty) || newQty < 0) {
      showToastMsg(lang === 'bn' ? "দয়া করে সঠিক সংখ্যা প্রদান করুন" : "Please provide a valid quantity", "error");
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === selectedItemForUpdate.id) {
        return {
          ...item,
          qty: newQty,
          status: newQty === 0 ? 'out' : (newQty <= item.threshold ? 'low' : 'instock')
        };
      }
      return item;
    }));

    setAuditLogs(prev => [
      { id: `LOG-${Date.now()}`, event: `Updated stock of "${selectedItemForUpdate.name}" to ${newQty} units`, user: "Md. Kamrul Hasan", time: "Just now" },
      ...prev
    ]);

    setShowUpdateStockModal(false);
    setSelectedItemForUpdate(null);
    showToastMsg(
      lang === 'bn'
        ? `সম্পদের স্টক সফলভাবে আপডেট করা হয়েছে!`
        : `Asset ledger stock quantity updated successfully.`
    );
  };

  const handleGenerateAuditReport = () => {
    const headers = "Item ID,Item Name,Category,Current Qty,Safety Threshold,Unit Price,Total Asset Value,Vendor\n";
    const rows = items.map(t => `${t.id},${t.name},${t.category},${t.qty},${t.threshold},৳${t.price},৳${t.qty * t.price},${t.vendor}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `scms_inventory_audit_june2026.csv`);
    a.click();
    showToastMsg(
      lang === 'bn'
        ? `বার্ষিক অবচয় ও স্টক অডিট রিপোর্ট ডাউনলোড শুরু হয়েছে!`
        : `Inventory Ledger Audit report compiled as CSV. Downloaded successfully.`
    );
  };

  return (
    <div className="space-y-6" id="inventory-dashboard-root">
      
      {/* 1. LOW STOCK & AI ALERTS HERO BANNER */}
      <section 
        id="inventory-hero-banner"
        className="relative overflow-hidden bg-gradient-to-br from-[#004D40] via-[#003d33] to-[#002e26] rounded-2xl shadow-md border border-teal-800 p-5 sm:p-6 text-white text-left"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none">
          <Package className="h-full w-full rotate-12" />
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
              id="ai-quick-reorder-btn"
              onClick={handleQuickReorder}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg border border-amber-400 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0 animate-pulse"
            >
              <ShieldAlert className="h-4 w-4 text-slate-950" />
              <span>{t.quickReorderBadge}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HIGH-IMPACT STOCK KPI CARDS */}
      <section id="inventory-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Asset Value */}
        <div id="kpi-asset-value" className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {t.kpiTotalAsset}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#004D40] block mt-1">
              ৳{totalValue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[9px] text-slate-500 font-bold border-t border-slate-100 pt-2.5 mt-2">
            <span>{t.kpiTotalSubtitle}</span>
          </div>
        </div>

        {/* Stationary Stock Status */}
        <div id="kpi-stationary-status" className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {t.kpiStationaryStatus}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-800 block mt-1">
              85%
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[9px] text-slate-400 font-extrabold mb-1">
              <span>{t.kpiStationarySubtitle}</span>
              <span>100% Max</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-600 rounded-full transition-all duration-300" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div id="kpi-low-stock-warnings" className="bg-amber-50/40 border border-amber-200 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider block">
              {t.kpiLowStock}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-700 block mt-1">
              {lowStockCount} Items
            </span>
          </div>
          <div className="text-[9px] text-amber-800/80 font-bold border-t border-amber-100 pt-2.5 mt-2 flex items-center gap-1">
            <AlertOctagon className="h-3 w-3 text-amber-600 shrink-0" />
            <span>{t.kpiLowStockSubtitle}</span>
          </div>
        </div>

        {/* Assets Under Maintenance */}
        <div id="kpi-assets-maintenance" className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-3xs flex flex-col justify-between text-left min-h-32">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {t.kpiMaintenance}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-teal-700 block mt-1">
              5 Items
            </span>
          </div>
          <div className="text-[9px] text-teal-700 font-bold border-t border-slate-100 pt-2.5 mt-2 flex items-center gap-1">
            <Wrench className="h-3 w-3 text-emerald-500 shrink-0" />
            <span>{t.kpiMaintenanceSubtitle}</span>
          </div>
        </div>

      </section>

      {/* 3. CORE INTELLIGENT GRID */}
      <section id="inventory-core-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: SMART INVENTORY MATRIX TABLE (8 Cols) */}
        <div id="inventory-matrix-container" className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl shadow-3xs p-5.5 text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.matrixTitle}
                </h4>
              </div>
              <span className="text-[10px] bg-[#004D40]/5 text-[#004D40] font-extrabold px-2.5 py-1 rounded-lg border border-[#004D40]/20">
                {lang === 'bn' ? "রিয়েল-টাইম স্টক লেজার" : "Real-time Tracker"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                    <th className="py-3 px-2">{t.colItem}</th>
                    <th className="py-3 px-2 text-center">{t.colQty}</th>
                    <th className="py-3 px-2 text-center">{t.colThreshold}</th>
                    <th className="py-3 px-2">{t.colVendor}</th>
                    <th className="py-3 px-2 text-right">{t.colPrice}</th>
                    <th className="py-3 px-2 text-center">{t.colStatus}</th>
                    <th className="py-3 px-2 text-right">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-bold text-[#1E293B]">
                  {items.map((item) => {
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Item Details */}
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-teal-50 text-[#004D40] font-black border border-teal-100 flex items-center justify-center shrink-0">
                              {item.icon === 'monitor' ? (
                                <Monitor className="h-4 w-4" />
                              ) : item.icon === 'shirt' ? (
                                <Shirt className="h-4 w-4" />
                              ) : (
                                <BookOpen className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 leading-tight">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">{item.category}</p>
                            </div>
                          </div>
                        </td>

                        {/* Current Quantity */}
                        <td className="py-3.5 px-2 text-center">
                          <span className={`font-black ${item.qty === 0 ? 'text-rose-600' : (item.qty <= item.threshold ? 'text-amber-600' : 'text-slate-900')}`}>
                            {item.qty}
                          </span>
                        </td>

                        {/* Safety Threshold */}
                        <td className="py-3.5 px-2 text-center text-slate-500">
                          <span>{item.threshold}</span>
                        </td>

                        {/* Vendor Info */}
                        <td className="py-3.5 px-2">
                          <span className="text-slate-600 font-medium">{item.vendor}</span>
                        </td>

                        {/* Unit Price */}
                        <td className="py-3.5 px-2 text-right">
                          <span className="font-extrabold text-slate-900">৳{item.price.toLocaleString('en-IN')}</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-2 text-center">
                          {item.qty === 0 ? (
                            <span className="px-2.5 py-0.5 inline-flex rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-extrabold">
                              {t.badgeOutOfStock}
                            </span>
                          ) : item.qty <= item.threshold ? (
                            <span className="px-2.5 py-0.5 inline-flex rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-extrabold">
                              {t.badgeLowStock}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-extrabold">
                              {t.badgeInStock}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => handleUpdateStockClick(item)}
                              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[10px] rounded-lg transition-all cursor-pointer shadow-3xs"
                            >
                              {t.actionUpdate}
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

        {/* RIGHT COLUMN: DISTRIBUTION, REQUESTS & VENDOR CONTROLS (4 Cols) */}
        <div id="inventory-controls-container" className="lg:col-span-4 space-y-6">
          
          {/* Inventory Action Hub */}
          <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.actionHubTitle}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Button 1: Add New */}
              <button
                onClick={() => setShowAddModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-teal-50 text-teal-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {t.btnAddNew}
                </span>
              </button>

              {/* Button 2: Issue Item */}
              <button
                onClick={() => setShowIssueModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {t.btnIssueItem}
                </span>
              </button>

              {/* Button 3: Log Damaged */}
              <button
                onClick={() => setShowDamageModal(true)}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-amber-50 text-amber-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wrench className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {t.btnLogDamaged}
                </span>
              </button>

              {/* Button 4: Generate Audit Report */}
              <button
                onClick={handleGenerateAuditReport}
                className="p-3 bg-slate-50 hover:bg-[#004D40]/5 border border-slate-200 hover:border-[#004D40]/30 rounded-xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-300 cursor-pointer"
              >
                <div className="h-9 w-9 bg-blue-50 text-blue-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-black text-slate-700 leading-tight group-hover:text-slate-900">
                  {t.btnGenerateAudit}
                </span>
              </button>
            </div>
          </div>

          {/* Teacher & Staff Requisitions (Pending Approvals) */}
          <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.reqsTitle}
                </h4>
              </div>
              <span className="text-[9px] bg-amber-50 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-100">
                {requisitions.length} {t.reqsPending}
              </span>
            </div>

            <div className="space-y-3.5">
              {requisitions.length === 0 ? (
                <div className="py-6 text-center text-slate-400 font-bold text-[11px] space-y-1 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Check className="h-6 w-6 text-emerald-500 mx-auto animate-bounce" />
                  <p>{t.emptyReqs}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {requisitions.map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: 50, height: 0, padding: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="p-3.5 bg-emerald-50/20 border border-teal-100 rounded-xl space-y-3 overflow-hidden"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-black text-xs text-slate-900 leading-tight">{req.requester}</span>
                          <span className="text-[9px] bg-teal-50 text-teal-800 font-extrabold px-1.5 py-0.5 rounded-md border border-teal-100 uppercase">
                            {req.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 font-medium mt-1 leading-snug">
                          {req.detail}
                        </p>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => handleApproveReq(req.id, req)}
                          className="px-2.5 py-1.5 bg-[#004D40] hover:bg-teal-900 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-0.5 shadow-3xs"
                        >
                          <Check className="h-3 w-3" />
                          <span>{t.btnApprove}</span>
                        </button>
                        <button
                          onClick={() => handleDeclineReq(req.id, req.requester)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
                        >
                          <X className="h-3 w-3" />
                          <span>{t.btnDecline}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Asset Logs / History Feed */}
          <div className="bg-white border border-slate-200/80 p-5.5 rounded-xl shadow-3xs text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-[#004D40]" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.historyTitle}
                </h4>
              </div>
            </div>

            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="border-l-2 border-teal-500 pl-3 py-1 text-xs">
                  <p className="font-black text-slate-800 leading-tight">{log.event}</p>
                  <div className="flex items-center gap-2 text-[9px] text-slate-400 font-medium mt-0.5">
                    <span>{log.user}</span>
                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* MODAL 1: ADD NEW ITEM / ASSET */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
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
                  <Package className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "নতুন স্কুল সম্পদ নথিবদ্ধকরণ" : "Register School Asset/Item"}
                  </h4>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "সম্পদ / আইটেমের নাম" : "Asset / Item Name"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Acer Full HD Monitors"
                    value={newItemForm.name} 
                    onChange={e => setNewItemForm({...newItemForm, name: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ক্যাটাগরি" : "Category"}</label>
                    <select 
                      value={newItemForm.category} 
                      onChange={e => setNewItemForm({...newItemForm, category: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="IT Lab">IT Lab</option>
                      <option value="Stationary">Stationary</option>
                      <option value="Uniform">Uniform</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "শুরুর স্টক" : "Initial Qty"}</label>
                    <input 
                      type="number" 
                      required
                      placeholder="10"
                      value={newItemForm.qty} 
                      onChange={e => setNewItemForm({...newItemForm, qty: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "নিরাপত্তা সীমা" : "Safety Limit"}</label>
                    <input 
                      type="number" 
                      required
                      placeholder="5"
                      value={newItemForm.threshold} 
                      onChange={e => setNewItemForm({...newItemForm, threshold: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "একক মূল্য (৳)" : "Unit Price (৳)"}</label>
                    <input 
                      type="number" 
                      required
                      placeholder="1200"
                      value={newItemForm.price} 
                      onChange={e => setNewItemForm({...newItemForm, price: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "সরবরাহকারী / ভেন্ডর" : "Supplier / Vendor"}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Star Tech Ltd."
                    value={newItemForm.vendor} 
                    onChange={e => setNewItemForm({...newItemForm, vendor: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'যুক্ত করুন' : 'Record Asset'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 2: ISSUE ITEM TO TEACHER/STAFF */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIssueModal(false)}
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
                  <UserCheck className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "শিক্ষক/কর্মকর্তাকে আইটেম ইস্যু" : "Issue Item to Teacher/Staff"}
                  </h4>
                </div>
                <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleIssueItemSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "আইটেম নির্বাচন করুন" : "Select Item"}</label>
                  <select 
                    value={issueForm.itemId} 
                    onChange={e => setIssueForm({...issueForm, itemId: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({lang === 'bn' ? "স্টক:" : "Stock:"} {item.qty})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "গ্রহীতার নাম ও শ্রেণী" : "Recipient Staff Name"}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Mr. Imran (Mathematics)"
                    value={issueForm.receiver} 
                    onChange={e => setIssueForm({...issueForm, receiver: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "বিতরণকৃত পরিমাণ" : "Quantity to Issue"}</label>
                  <input 
                    type="number" 
                    required
                    placeholder="2"
                    value={issueForm.qty} 
                    onChange={e => setIssueForm({...issueForm, qty: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowIssueModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'ইস্যু করুন' : 'Confirm Issue'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 3: LOG DAMAGED ASSET */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showDamageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDamageModal(false)}
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
                  <Wrench className="h-4.5 w-4.5 text-amber-600" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "ক্ষতিগ্রস্ত সম্পদ নথিবদ্ধকরণ" : "Log Damaged Asset / Loss"}
                  </h4>
                </div>
                <button onClick={() => setShowDamageModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleLogDamageSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ক্ষতিগ্রস্ত আইটেম" : "Select Damaged Item"}</label>
                  <select 
                    value={damageForm.itemId} 
                    onChange={e => setDamageForm({...damageForm, itemId: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "পরিমাণ" : "Quantity"}</label>
                    <input 
                      type="number" 
                      required
                      placeholder="1"
                      value={damageForm.qty} 
                      onChange={e => setDamageForm({...damageForm, qty: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "ক্ষতির বিবরণ / কারণ" : "Specific Damage Reason"}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Broken screen"
                      value={damageForm.reason} 
                      onChange={e => setDamageForm({...damageForm, reason: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowDamageModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'লগ ড্যামেজ' : 'Report Loss'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL 4: QUICK UPDATE STOCK LEVEL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showUpdateStockModal && selectedItemForUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowUpdateStockModal(false); setSelectedItemForUpdate(null); }}
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
                  <Package className="h-4.5 w-4.5 text-[#004D40]" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {lang === 'bn' ? "স্টক লেভেল আপডেট" : "Quick Adjust Stock Level"}
                  </h4>
                </div>
                <button onClick={() => { setShowUpdateStockModal(false); setSelectedItemForUpdate(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3.5 mb-4">
                <p className="font-black text-slate-900 text-xs leading-none">{selectedItemForUpdate.name}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mt-2">
                  <span>{lang === 'bn' ? "ক্যাটাগরি:" : "Category:"} {selectedItemForUpdate.category}</span>
                  <span>{lang === 'bn' ? "নিরাপত্তা সীমা:" : "Safety limit:"} {selectedItemForUpdate.threshold}</span>
                </div>
              </div>

              <form onSubmit={handleUpdateStockSubmit} className="space-y-4 text-xs font-extrabold text-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'bn' ? "নতুন স্টকের পরিমাণ" : "New Stock Quantity"}</label>
                  <input 
                    type="number" 
                    required
                    value={updateQtyVal} 
                    onChange={e => setUpdateQtyVal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowUpdateStockModal(false); setSelectedItemForUpdate(null); }} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#004D40] hover:bg-teal-900 text-white rounded-xl shadow-md cursor-pointer">{lang === 'bn' ? 'আপডেট করুন' : 'Save Qty'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
