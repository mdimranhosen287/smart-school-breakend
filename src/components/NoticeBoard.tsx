/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, User, AlertCircle, FileText, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../data/translations';
import { Notice } from '../types';

interface NoticeBoardProps {
  lang: 'bn' | 'en';
  selectedNoticeFromSearch?: any;
  setSelectedNoticeFromSearch?: (notice: any) => void;
}

export default function NoticeBoard({ lang, selectedNoticeFromSearch, setSelectedNoticeFromSearch }: NoticeBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const t = translations[lang];

  React.useEffect(() => {
    if (selectedNoticeFromSearch) {
      setSelectedNotice(selectedNoticeFromSearch);
      if (setSelectedNoticeFromSearch) {
        setSelectedNoticeFromSearch(null);
      }
    }
  }, [selectedNoticeFromSearch, setSelectedNoticeFromSearch]);

  const categories = [
    { id: 'all', label: lang === 'bn' ? 'সকল নোটিশ' : 'All Notices' },
    { id: 'academic', label: lang === 'bn' ? 'একাডেমিক' : 'Academic' },
    { id: 'exam', label: lang === 'bn' ? 'পরীক্ষা' : 'Exams' },
    { id: 'event', label: lang === 'bn' ? 'অনুষ্ঠান' : 'Events' },
    { id: 'sports', label: lang === 'bn' ? 'ক্রীড়া' : 'Sports' },
  ];

  const filteredNotices = t.noticesList.filter((notice) => {
    // Check match for category
    const matchesCategory = selectedCategory === 'all' || notice.category_en === selectedCategory;
    
    // Check match for search keyword
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'exam': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'event': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'sports': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div id="notice-board-section" className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
            {lang === 'bn' ? 'সর্বশেষ নোটিশ ও ঘোষণা সমূহ' : 'Latest Bulletins & Updates'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {lang === 'bn' ? 'প্রতিষ্ঠানের দৈনন্দিন ঘোষণা, পরীক্ষা এবং ভর্তি সংক্রান্ত খবরাখবর' : 'Stay updated with everyday announcements, academic calendars, and exams'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            id="notice-search-input"
            type="text"
            placeholder={lang === 'bn' ? 'কীওয়ার্ড দিয়ে খুঁজুন...' : 'Search notice by keyword...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-800 font-semibold"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            id={`notice-cat-${cat.id}`}
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-100'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <motion.div
              id={`notice-item-${notice.id}`}
              key={notice.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 sm:p-6 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${
                notice.urgent
                  ? 'bg-amber-50/30 border-amber-200 hover:bg-amber-50/50'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => setSelectedNotice(notice as unknown as Notice)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.urgent && (
                      <span className="flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-rose-200">
                        <AlertCircle className="h-3 w-3" /> {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                      </span>
                    )}
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getCategoryStyles(notice.category_en)}`}>
                      {notice.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1.5 ml-2 font-semibold">
                      <Calendar className="h-3.5 w-3.5" /> {notice.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
                <div className="flex items-center text-emerald-600 font-bold text-sm gap-1 self-end sm:self-center shrink-0">
                  {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Read Detail'} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">{lang === 'bn' ? 'খোঁজা নোটিশটি পাওয়া যায়নি' : 'No notices found matching your search'}</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-sm text-emerald-600 font-bold mt-2 hover:underline cursor-pointer"
            >
              {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              id="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setSelectedNotice(null)}
            />

            {/* Modal Body */}
            <motion.div
              id="notice-modal"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 z-10"
            >
              <div className="p-6 sm:p-8">
                {/* Close Button */}
                <button
                  id="close-notice-modal"
                  onClick={() => setSelectedNotice(null)}
                  className="absolute right-6 top-6 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {selectedNotice.urgent && (
                    <span className="flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border border-rose-200">
                      <AlertCircle className="h-3 w-3" /> {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                    </span>
                  )}
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getCategoryStyles((selectedNotice as any).category_en || 'general')}`}>
                    {selectedNotice.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-4">
                  {selectedNotice.title}
                </h3>

                {/* Date & Author */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-y border-gray-100 py-3 mb-6 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-400" /> {lang === 'bn' ? 'প্রকাশের তারিখ' : 'Date Posted'}: {selectedNotice.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-gray-400" /> {lang === 'bn' ? 'কর্তৃপক্ষ' : 'Issued By'}: {selectedNotice.author}
                  </span>
                </div>

                {/* Content */}
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
                  <p className="whitespace-pre-line font-medium">{selectedNotice.content}</p>
                </div>

                {/* Footer close button */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    id="close-notice-footer-btn"
                    onClick={() => setSelectedNotice(null)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                  >
                    {lang === 'bn' ? 'বন্ধ করুন' : 'Close Bulletin'}
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
