/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Clock, 
  BookOpen, 
  Sliders, 
  User, 
  Search, 
  Sparkles, 
  X, 
  HelpCircle,
  GraduationCap,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface AcademicClass {
  id: string;
  name: string;
  shift: string;
  group: string;
  classTeacher: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  group: string;
  status: 'Active' | 'Inactive';
}

interface ClassSectionsProps {
  classes?: AcademicClass[];
  students?: Student[];
  lang?: 'bn' | 'en';
  onSelectClass?: (className: string) => void;
}

export default function ClassSections({ 
  classes = [], 
  students = [], 
  lang = 'en', 
  onSelectClass 
}: ClassSectionsProps) {
  const [filterShift, setFilterShift] = useState<string>('All');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Translations
  const t = {
    en: {
      title: "Class & Section Directory",
      subtitle: "Comprehensive overview of school sections, shifts, academic streams, and student enrollment statistics",
      searchPlaceholder: "Search class name or teacher...",
      allShifts: "All Shifts",
      morning: "Morning",
      day: "Day",
      allGroups: "All Groups",
      general: "General",
      science: "Science",
      commerce: "Commerce",
      arts: "Arts",
      sortByLabel: "Sort By:",
      sortNameAsc: "Name (A-Z)",
      sortNameDesc: "Name (Z-A)",
      sortStudentsDesc: "Most Students",
      sortStudentsAsc: "Least Students",
      studentsCount: "Students",
      teacher: "Class Teacher",
      shift: "Shift",
      group: "Group",
      noTeacher: "Not Assigned",
      noResults: "No Matching Class Sections Found",
      noResultsDesc: "Try adjusting your filters, search term, or create a new class section.",
      resetFilters: "Reset Filters",
      totalSections: "Total Sections",
      totalStudents: "Total Enrolled Students",
      morningCount: "Morning Shift",
      dayCount: "Day Shift",
      viewStudents: "View Students",
      viewDetails: "View Details",
      detailsTitle: "Class Breakdown",
    },
    bn: {
      title: "ক্লাস ও সেকশন ডিরেক্টরি",
      subtitle: "স্কুলের বিভিন্ন সেকশন, শিফট, শাখা এবং শিক্ষার্থীর ভর্তি সংক্রান্ত বিস্তারিত পরিসংখ্যান",
      searchPlaceholder: "ক্লাসের নাম অথবা শিক্ষক খুঁজুন...",
      allShifts: "সকল শিফট",
      morning: "সকাল (Morning)",
      day: "দিন (Day)",
      allGroups: "সকল গ্রুপ",
      general: "সাধারণ (General)",
      science: "বিজ্ঞান (Science)",
      commerce: "ব্যবসায় শিক্ষা (Commerce)",
      arts: "মানবিক (Arts)",
      sortByLabel: "সাজানোর নিয়ম:",
      sortNameAsc: "নাম অনুযায়ী (ক-অ)",
      sortNameDesc: "নাম অনুযায়ী (অ-ক)",
      sortStudentsDesc: "সর্বোচ্চ শিক্ষার্থী",
      sortStudentsAsc: "সর্বনিম্ন শিক্ষার্থী",
      studentsCount: "শিক্ষার্থী",
      teacher: "শ্রেণী শিক্ষক",
      shift: "শিফট",
      group: "গ্রুপ",
      noTeacher: "নির্ধারিত নেই",
      noResults: "কোনো ম্যাচিং ক্লাস সেকশন পাওয়া যায়নি",
      noResultsDesc: "অনুগ্রহ করে আপনার ফিল্টার পরিবর্তন করুন অথবা নতুন সেকশন যোগ করুন।",
      resetFilters: "ফিল্টার রিসেট",
      totalSections: "মোট সেকশন",
      totalStudents: "মোট শিক্ষার্থী",
      morningCount: "মর্নিং শিফট",
      dayCount: "ডে শিফট",
      viewStudents: "শিক্ষার্থী তালিকা",
      viewDetails: "বিস্তারিত দেখুন",
      detailsTitle: "শ্রেণী বিন্যাস",
    }
  }[lang];

  // Helper to parse class and section name to match students list
  const getStudentsForClassSection = (clsName: string) => {
    const clean = clsName.replace(/Class\s+/i, '').trim();
    let clsPart = '';
    let secPart = '';
    
    if (clean.includes('-')) {
      const parts = clean.split('-');
      clsPart = parts[0].trim();
      secPart = parts[1].trim();
    } else if (clean.includes(' ')) {
      const parts = clean.split(/\s+/);
      clsPart = parts[0].trim();
      secPart = parts[1].trim();
    } else {
      const match = clean.match(/^(\d+|[a-zA-Z]+)(.*)$/);
      if (match) {
        clsPart = match[1].trim();
        secPart = match[2].trim();
      } else {
        clsPart = clean;
      }
    }

    if (!clsPart) return [];

    return students.filter(student => {
      const sClass = String(student.class).trim().toLowerCase();
      const sSection = String(student.section).trim().toLowerCase();
      
      const matchesClass = sClass === clsPart.toLowerCase() || 
                           sClass === ('class ' + clsPart.toLowerCase()) ||
                           clsPart.toLowerCase() === ('class ' + sClass) ||
                           sClass === clsPart.replace(/\s+/g, '').toLowerCase();
                           
      const matchesSection = secPart ? (sSection === secPart.toLowerCase()) : true;
      
      return matchesClass && matchesSection;
    });
  };

  // Perform filtering & sorting in useMemo for performance
  const processedClasses = useMemo(() => {
    let result = [...classes];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(cls => 
        cls.name.toLowerCase().includes(query) || 
        (cls.classTeacher && cls.classTeacher.toLowerCase().includes(query))
      );
    }

    // Shift Filter
    if (filterShift !== 'All') {
      result = result.filter(cls => cls.shift === filterShift);
    }

    // Group Filter
    if (filterGroup !== 'All') {
      result = result.filter(cls => cls.group === filterGroup);
    }

    // Sorting
    result.sort((a, b) => {
      const aStudentsCount = getStudentsForClassSection(a.name).length;
      const bStudentsCount = getStudentsForClassSection(b.name).length;

      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        case 'name-desc':
          return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
        case 'students-desc':
          return bStudentsCount - aStudentsCount;
        case 'students-asc':
          return aStudentsCount - bStudentsCount;
        default:
          return 0;
      }
    });

    return result;
  }, [classes, students, searchQuery, filterShift, filterGroup, sortBy]);

  // Overall Statistics for visual feedback
  const stats = useMemo(() => {
    const totalSects = processedClasses.length;
    let totalStuds = 0;
    let morningSects = 0;
    let daySects = 0;

    processedClasses.forEach(cls => {
      totalStuds += getStudentsForClassSection(cls.name).length;
      if (cls.shift === 'Morning') morningSects++;
      else if (cls.shift === 'Day') daySects++;
    });

    return {
      totalSects,
      totalStuds,
      morningSects,
      daySects
    };
  }, [processedClasses, students]);

  const handleResetFilters = () => {
    setFilterShift('All');
    setFilterGroup('All');
    setSearchQuery('');
    setSortBy('name-asc');
  };

  return (
    <div id="class-sections-container" className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-150 shadow-3xs">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Layers className="h-5.5 w-5.5 text-[#005c53]" />
            <span>{t.title}</span>
          </h2>
          <p className="text-xs text-gray-400 font-bold mt-1 max-w-xl">
            {t.subtitle}
          </p>
        </div>

        {/* Mini stats count */}
        <div className="flex gap-4 self-stretch sm:self-auto bg-gray-50 p-3 rounded-xl border border-gray-200 divide-x divide-gray-200">
          <div className="px-2 text-center">
            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{t.totalSections}</span>
            <span className="text-lg font-black text-[#005c53]">{stats.totalSects}</span>
          </div>
          <div className="pl-4 pr-2 text-center">
            <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{t.totalStudents}</span>
            <span className="text-lg font-black text-[#0593dd]">{stats.totalStuds}</span>
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white border border-gray-150 p-4 rounded-2xl shadow-3xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-8.5 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none focus:border-[#005c53] font-bold text-xs text-gray-800 placeholder-gray-400 shadow-3xs transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Shift Filter */}
          <div className="md:col-span-2.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005c53] font-bold text-xs text-gray-700 cursor-pointer"
            >
              <option value="All">{t.allShifts}</option>
              <option value="Morning">{t.morning}</option>
              <option value="Day">{t.day}</option>
            </select>
          </div>

          {/* Group Filter */}
          <div className="md:col-span-2.5 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005c53] font-bold text-xs text-gray-700 cursor-pointer"
            >
              <option value="All">{t.allGroups}</option>
              <option value="General">{t.general}</option>
              <option value="Science">{t.science}</option>
              <option value="Commerce">{t.commerce}</option>
              <option value="Arts">{t.arts}</option>
            </select>
          </div>

          {/* Sorting Option */}
          <div className="md:col-span-2 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005c53] font-bold text-xs text-gray-700 cursor-pointer"
            >
              <option value="name-asc">{t.sortNameAsc}</option>
              <option value="name-desc">{t.sortNameDesc}</option>
              <option value="students-desc">{t.sortStudentsDesc}</option>
              <option value="students-asc">{t.sortStudentsAsc}</option>
            </select>
          </div>

        </div>

        {/* Filter Badges & Reset Trigger */}
        {(filterShift !== 'All' || filterGroup !== 'All' || searchQuery) && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
            <div className="flex flex-wrap gap-1.5">
              {filterShift !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold">
                  {lang === 'bn' ? 'শিফট: ' : 'Shift: '} {filterShift === 'Morning' ? t.morning : t.day}
                </span>
              )}
              {filterGroup !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold">
                  {lang === 'bn' ? 'গ্রুপ: ' : 'Group: '} {filterGroup}
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold truncate max-w-xs">
                  {lang === 'bn' ? 'অনুসন্ধান: ' : 'Search: '} "{searchQuery}"
                </span>
              )}
            </div>
            
            <button
              onClick={handleResetFilters}
              className="text-[#005c53] hover:underline cursor-pointer font-extrabold flex items-center gap-1 transition-all text-[11px]"
            >
              <X className="h-3 w-3" />
              <span>{t.resetFilters}</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid Layout of Cards */}
      {processedClasses.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-150 rounded-2xl shadow-3xs space-y-4">
          <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-150 text-gray-400">
            <Sliders className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-gray-800 text-sm">{t.noResults}</h3>
            <p className="text-xs text-gray-400 font-bold max-w-md mx-auto">{t.noResultsDesc}</p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black rounded-xl transition-all cursor-pointer"
          >
            {t.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {processedClasses.map((cls, idx) => {
            const classStudents = getStudentsForClassSection(cls.name);
            const studentCount = classStudents.length;

            // Generate aesthetic color themes per group
            const groupTheme = {
              'Science': { bg: 'from-emerald-50 to-teal-50/30', border: 'border-emerald-150', badge: 'bg-emerald-50 text-emerald-800 border border-emerald-100', text: 'text-emerald-700' },
              'Commerce': { bg: 'from-purple-50 to-indigo-50/30', border: 'border-purple-150', badge: 'bg-purple-50 text-purple-800 border border-purple-100', text: 'text-purple-700' },
              'Arts': { bg: 'from-pink-50 to-rose-50/30', border: 'border-pink-150', badge: 'bg-pink-50 text-pink-800 border border-pink-100', text: 'text-pink-700' },
              'General': { bg: 'from-sky-50 to-blue-50/30', border: 'border-sky-150', badge: 'bg-sky-50 text-sky-800 border border-sky-100', text: 'text-sky-700' }
            }[cls.group] || { bg: 'from-gray-50 to-gray-100/30', border: 'border-gray-200', badge: 'bg-gray-50 text-gray-800 border border-gray-150', text: 'text-gray-700' };

            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                className={`group bg-white border rounded-2xl shadow-3xs hover:shadow-md hover:border-[#005c53]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative`}
              >
                {/* Decorative Colored Strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${cls.group === 'Science' ? 'from-emerald-500 to-teal-500' : cls.group === 'Commerce' ? 'from-purple-500 to-indigo-500' : cls.group === 'Arts' ? 'from-pink-500 to-rose-500' : 'from-sky-500 to-blue-500'}`} />

                {/* Main Card Content */}
                <div className="p-5 space-y-4 grow flex flex-col justify-between">
                  
                  {/* Top row: Section Name and Shift */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-black text-gray-900 text-base group-hover:text-[#005c53] transition-colors">
                        {cls.name}
                      </h4>
                      
                      {/* Shift Badge */}
                      <span className={`inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-wider ${
                        cls.shift === 'Morning' 
                          ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100' 
                          : 'text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100'
                      }`}>
                        <Clock className="h-2.5 w-2.5" />
                        <span>{cls.shift === 'Morning' ? t.morning : t.day}</span>
                      </span>
                    </div>

                    {/* Group Badge */}
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-extrabold ${groupTheme.badge}`}>
                      {cls.group}
                    </span>
                  </div>

                  {/* Dynamic Student Count Panel */}
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${groupTheme.bg} border border-gray-100 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white shadow-3xs flex items-center justify-center text-gray-600">
                        <Users className="h-4.5 w-4.5 text-[#005c53]" />
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{t.studentsCount}</span>
                        <span className="text-sm font-black text-gray-800">{studentCount}</span>
                      </div>
                    </div>

                    {/* Animated visual indicators */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(Math.ceil(studentCount / 5), 4) }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-2.5 w-1.5 rounded-full ${groupTheme.text} bg-current opacity-70`} 
                          title={`${studentCount} Students`}
                        />
                      ))}
                      {studentCount === 0 && (
                        <span className="text-[10px] text-gray-400 font-bold italic">Empty</span>
                      )}
                    </div>
                  </div>

                  {/* Class Teacher Details */}
                  <div className="space-y-1 pt-1 border-t border-gray-50">
                    <span className="block text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">
                      {t.teacher}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                        <User className="h-3.5 w-3.5 text-gray-500" />
                      </div>
                      <span className="text-xs font-black text-gray-700 truncate max-w-[150px]">
                        {cls.classTeacher || t.noTeacher}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Area */}
                <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs mt-auto group-hover:bg-gray-50 transition-colors">
                  <span className="text-[9px] text-gray-400 font-black tracking-widest">
                    ID: {cls.id.toUpperCase()}
                  </span>

                  {onSelectClass && (
                    <button
                      onClick={() => onSelectClass(cls.name)}
                      className="text-[#005c53] hover:text-[#004d44] font-black flex items-center gap-1 transition-all cursor-pointer group-hover:translate-x-0.5"
                    >
                      <span>{t.viewStudents}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
