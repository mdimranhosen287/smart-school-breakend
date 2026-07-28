/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { School, Menu, X, User, Globe, Phone, Mail, ChevronDown, Home, Search, Calendar, FileText, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from '../data/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  onSearchSelectNotice?: (notice: any) => void;
  settings?: any;
}

const formatToNiceEnglish = (str: string) => {
  if (!str) return "";
  if (str === "STUDENTS CARE MODEL SCHOOL") {
    return "Students Care Model School";
  }
  if (str === str.toUpperCase()) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return str;
};

export default function Navbar({ activeTab, setActiveTab, lang, setLang, onSearchSelectNotice, settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchCategory, setActiveSearchCategory] = useState<'all' | 'section' | 'notice' | 'program'>('all');
  
  const t = translations[lang];

  // Dynamically load custom pages from localStorage
  const [customMenuItems, setCustomMenuItems] = useState<any[]>([]);

  React.useEffect(() => {
    const loadCustomPages = () => {
      try {
        const saved = localStorage.getItem('school_frontend_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          const activePages = (parsed.customPages || [])
            .filter((p: any) => p && p.status === 'active' && p.showInMenu !== false)
            .sort((a: any, b: any) => (Number(a.menuOrder) || 1) - (Number(b.menuOrder) || 1))
            .map((p: any) => ({
              id: p.slug || p.id,
              label: lang === 'bn' ? p.titleBn : p.titleEn
            }));
          setCustomMenuItems(activePages);
        }
      } catch (e) {
        console.error("Error loading custom pages for navbar", e);
      }
    };

    loadCustomPages();
    window.addEventListener('storage', loadCustomPages);
    
    // Listen for custom event
    const handleSettingsUpdate = () => {
      loadCustomPages();
    };
    window.addEventListener('school_settings_updated', handleSettingsUpdate);

    // Add support for navigation from preview links inside iframe
    const handleCustomNavigate = (e: any) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('navigate_custom_tab', handleCustomNavigate);

    return () => {
      window.removeEventListener('storage', loadCustomPages);
      window.removeEventListener('school_settings_updated', handleSettingsUpdate);
      window.removeEventListener('navigate_custom_tab', handleCustomNavigate);
    };
  }, [lang, setActiveTab]);

  // Combined menu items
  const menuItems = [
    { id: 'home', label: lang === 'bn' ? 'প্রচ্ছদ' : 'Home', icon: Home },
    { id: 'history', label: lang === 'bn' ? 'প্রতিষ্ঠানের ইতিহাস' : 'History' },
    { id: 'teachers', label: lang === 'bn' ? 'শিক্ষকমণ্ডলী' : 'Teachers' },
    { id: 'student', label: lang === 'bn' ? 'শিক্ষার্থী' : 'Students' },
    ...customMenuItems,
    { id: 'results', label: lang === 'bn' ? 'পরীক্ষার ফলাফল' : 'Exam Results' },
    { id: 'photo', label: lang === 'bn' ? 'ফটো' : 'Photo Gallery' },
    { id: 'video', label: lang === 'bn' ? 'ভিডিও' : 'Videos' },
    { id: 'contact', label: lang === 'bn' ? 'যোগাযোগ' : 'Contact Us' },
  ];

  // Hotkey listener for '/' key to open search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Academic Session State
  const [academicSession, setAcademicSession] = useState('2023');
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const sessions = ['2021', '2022', '2023'];

  // Construct bilingual search database index
  const searchIndex = React.useMemo(() => {
    const list: Array<{
      id: string;
      type: 'section' | 'notice' | 'program';
      title: string;
      description: string;
      category: string;
      targetTab: string;
      targetId?: string;
      rawObject?: any;
    }> = [];

    // 1. Core Pages & Dynamic Cards / Sections on Homepage
    const sections = [
      {
        id: 'home',
        titleBn: 'প্রচ্ছদ / হোমপেজ',
        titleEn: 'Home / Welcome',
        descBn: 'স্টুডেন্টস কেয়ার মডেল স্কুলের প্রধান পাতা',
        descEn: 'Main landing page of Students Care Model School',
        targetTab: 'home',
      },
      {
        id: 'history',
        titleBn: 'প্রতিষ্ঠানের ইতিহাস',
        titleEn: 'Institutions History',
        descBn: 'বিদ্যালয় প্রতিষ্ঠার পটভূমি ও গৌরবময় অর্জনসমূহ (২০১৮)',
        descEn: 'Historical background, milestones and achievements since 2018',
        targetTab: 'home',
        targetId: 'school-history-section',
      },
      {
        id: 'headmaster-speech',
        titleBn: 'প্রধান শিক্ষকের বাণী ও বক্তব্য',
        titleEn: "Headmaster's Welcome Message",
        descBn: 'সম্মানিত প্রধান শিক্ষক মোরশেদ নূর মহোদয়ের শুভেচ্ছা বার্তা ও উপদেশ',
        descEn: 'Official greetings, views and guidelines from Headmaster Morshed Nur',
        targetTab: 'home',
        targetId: 'school-history-section',
      },
      {
        id: 'asst-headmaster-speech',
        titleBn: 'সহকারী প্রধান শিক্ষকের বাণী ও বক্তব্য',
        titleEn: "Assistant Headmaster's Message",
        descBn: 'সহকারী প্রধান শিক্ষক জনাব মো: তৈয়ব হোসেনের শুভেচ্ছা বার্তা ও শৃঙ্খলা নীতি',
        descEn: 'Message on academic discipline, ethics and standards from Md. Toyub Hosen',
        targetTab: 'home',
        targetId: 'school-history-section',
      },
      {
        id: 'students-corner',
        titleBn: 'শিক্ষার্থীদের কর্নার',
        titleEn: 'Students Corner & Study Guides',
        descBn: 'শ্রেণীভিত্তিক ক্লাস রুটিন, সিলেবাস এবং বইয়ের তালিকা ডাউনলোড করার কর্নার',
        descEn: 'Quick access to school class routines, term syllabus and reading books list',
        targetTab: 'home',
        targetId: 'students-corner-card',
      },
      {
        id: 'teachers-corner',
        titleBn: 'শিক্ষকমণ্ডলীর কর্নার ও অনুষদ',
        titleEn: 'Respected Teachers Corner',
        descBn: 'আমাদের অভিজ্ঞ শিক্ষকমণ্ডলীর পরিচিতি, যোগ্যতা ও যোগাযোগ মাধ্যম',
        descEn: 'View our highly trained, experienced, and student-focused teachers list',
        targetTab: 'home',
        targetId: 'teachers-corner-card',
      },
      {
        id: 'admissions',
        titleBn: 'অনлайн ভর্তি আবেদন',
        titleEn: 'Online Admission Portal & Form',
        descBn: 'নার্সারি থেকে ১০ম শ্রেণীতে নতুন সেশনের জন্য ভর্তি আবেদন ফরম পূরণ করুন',
        descEn: 'Apply online for Nursery to Class X admissions for the upcoming academic session',
        targetTab: 'admissions',
      },
      {
        id: 'pay-fees',
        titleBn: 'অনলাইনে ফি পরিশোধ করুন',
        titleEn: 'Pay Fees Online',
        descBn: 'অনলাইন পেমেন্ট গেটওয়ের মাধ্যমে টিউশন এবং ভর্তি ফি নিরাপদে দিন',
        descEn: 'Clear monthly school tuition fees and exam charges securely online',
        targetTab: 'portal',
      },
      {
        id: 'class-routine',
        titleBn: 'ক্লাস রুটিন ও ছুটির তালিকা',
        titleEn: 'Download Class Routine & Calendar',
        descBn: '২০২৬ সালের নতুন সাপ্তাহিক ক্লাস রুটিন পিডিএফ ডাউনলোড লিঙ্ক',
        descEn: 'View and save the latest official school class schedules for all sessions',
        targetTab: 'portal',
      },
      {
        id: 'results',
        titleBn: 'পরীক্ষার ফলাফল অনুসন্ধান বোর্ড',
        titleEn: 'Exam Results Board',
        descBn: 'শিক্ষার্থীদের অর্ধবার্ষিক ও বার্ষিক পরীক্ষার মার্কশিট ও গ্রেড রেকর্ড খুঁজুন',
        descEn: 'Look up student exam grades, progress reports and terminal report cards online',
        targetTab: 'portal',
      },
      {
        id: 'gallery',
        titleBn: 'ফটো গ্যালারি ও অনুষ্ঠানমালার ভিডিও',
        titleEn: 'Photo & Video Gallery',
        descBn: 'জাতীয় উৎসব, ক্রীড়া প্রতিযোগিতা এবং বিজ্ঞান ল্যাবের বিভিন্ন ছবি',
        descEn: 'High-definition updates of campus events, national days and academic exhibitions',
        targetTab: 'gallery',
      },
      {
        id: 'contact',
        titleBn: 'আমাদের অবস্থান ও যোগাযোগের ঠিকানা',
        titleEn: 'Contact Coordinates & Campus Map',
        descBn: 'চরলক্ষ্যা, কর্ণফুলী, চট্টগ্রামের ঠিকানা এবং অফিসিয়াল হটলাইন নম্বর',
        descEn: 'Official address coordinates, telephone help desk numbers, and direct google map route',
        targetTab: 'contact',
      },
      {
        id: 'faqs',
        titleBn: 'এফএকিউ (সাধারণ প্রশ্নোত্তর সমূহ)',
        titleEn: 'Frequently Asked Questions (FAQs)',
        descBn: 'ভর্তি পরীক্ষা, স্কুল বাস সার্ভিস, এবং ছাত্র পোর্টাল ব্যবহার সংক্রান্ত প্রশ্নোত্তর',
        descEn: 'Get instant answers for admissions syllabus, transport routes, and portals logins',
        targetTab: 'contact',
        targetId: 'faq-section',
      },
    ];

    sections.forEach((s) => {
      list.push({
        id: s.id,
        type: 'section',
        title: lang === 'bn' ? s.titleBn : s.titleEn,
        description: lang === 'bn' ? s.descBn : s.descEn,
        category: lang === 'bn' ? 'সেকশন' : 'Section',
        targetTab: s.targetTab,
        targetId: s.targetId,
      });
    });

    // 2. Notices Database
    const noticesList = translations[lang].noticesList || [];
    const noticesListEn = translations['en'].noticesList || [];

    noticesList.forEach((n) => {
      const nEn = noticesListEn.find((item) => item.id === n.id) || n;
      list.push({
        id: n.id,
        type: 'notice',
        title: lang === 'bn' ? n.title : nEn.title,
        description: lang === 'bn' ? n.content : nEn.content,
        category: lang === 'bn' ? `নোটিশ (${n.category})` : `Notice (${nEn.category})`,
        targetTab: 'notices',
        rawObject: n,
      });
    });

    // 3. Academic Programs / Divisions
    const programsBn = [
      {
        level: "প্রাথমিক শাখা (নার্সারি - ৫ম শ্রেণী)",
        desc: "একটি যত্নশীল ও ক্রীড়াময় শিক্ষণ পরিবেশ যা শিশুর বুদ্ধিবৃত্তিক বিকাশ, প্রাথমিক শিক্ষা, সংখ্যা জ্ঞান এবং সামাজিক সমন্বয়ের উপর দৃষ্টি আকর্ষণ করে।"
      },
      {
        level: "মাধ্যমিক শাখা (৬ষ্ঠ - ১০ম শ্রেণী)",
        desc: "শিক্ষার্থীদের গভীর বিশ্লেষণাত্মক চিন্তাভাবনা এবং সৃজনশীল আত্ম-আবিষ্কারের দিকে পরিচালিত করা। এনসিটিবি অনুমোদিত এসএসসি পরীক্ষার প্রস্তুতি।"
      },
      {
        level: "উচ্চ মাধ্যমিক শাখা (১১শ - ১২শ শ্রেণী)",
        desc: "উচ্চ মাধ্যমিক পরীক্ষার জন্য কঠোর শিক্ষায়তনিক প্রস্তুতি এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার বিশেষ গাইডলাইন ও নিবিড় ল্যাব কার্যপরিচালনা।"
      }
    ];

    const programsEn = [
      {
        level: "Primary Division (Nursery - Class V)",
        desc: "A nurturing and playful learning environment focusing on cognitive development, basic literacy, numeracy, and social integration."
      },
      {
        level: "Secondary Division (Class VI - Class X)",
        desc: "Transitioning students into deeper analytical thinking and self-discovery. Preparation for the Secondary School Certificate (SSC) examinations under NCTB."
      },
      {
        level: "Higher Secondary Division (Class XI - XII)",
        desc: "Rigorous academic preparation for Higher Secondary Certificate (HSC) examinations and competitive university admission tests."
      }
    ];

    programsEn.forEach((p, index) => {
      const pBn = programsBn[index] || p;
      list.push({
        id: `academic-prog-${index}`,
        type: 'program',
        title: lang === 'bn' ? pBn.level : p.level,
        description: lang === 'bn' ? pBn.desc : p.desc,
        category: lang === 'bn' ? 'একাডেমিক শাখা' : 'Academic Program',
        targetTab: 'academics',
        targetId: `academic-prog-${index}`,
      });
    });

    return list;
  }, [lang]);

  // Real-time typeahead query filter
  const filteredResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return searchIndex.filter((item) => {
      const matchesCategory = activeSearchCategory === 'all' || item.type === activeSearchCategory;
      const matchesText = item.title.toLowerCase().includes(query) || 
                          item.description.toLowerCase().includes(query) ||
                          item.category.toLowerCase().includes(query);
      return matchesCategory && matchesText;
    });
  }, [searchIndex, searchQuery, activeSearchCategory]);

  const popularSuggestions = [
    { label: lang === 'bn' ? 'ভর্তি বিজ্ঞপ্তি' : 'Admission Alert', query: lang === 'bn' ? 'ভর্তি' : 'Admission' },
    { label: lang === 'bn' ? 'পরীক্ষার সময়সূচী' : 'Exam Routine', query: lang === 'bn' ? 'পরীক্ষা' : 'Exam' },
    { label: lang === 'bn' ? 'ইতিহাস' : 'School History', query: lang === 'bn' ? 'ইতিহাস' : 'History' },
    { label: lang === 'bn' ? 'বিজ্ঞান মেলা' : 'Science Fair', query: lang === 'bn' ? 'বিজ্ঞান' : 'Science' },
  ];

  const handleSearchResultClick = (item: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    
    if (item.type === 'notice') {
      if (onSearchSelectNotice) {
        onSearchSelectNotice(item.rawObject);
      } else {
        setActiveTab('notices');
      }
    } else if (item.type === 'program') {
      setActiveTab('academics');
      setTimeout(() => {
        const element = document.getElementById(item.targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-emerald-500', 'transition-all', 'duration-500');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-emerald-500');
          }, 3000);
        }
      }, 150);
    } else if (item.type === 'section') {
      if (item.id === 'history' || item.id === 'headmaster-speech' || item.id === 'asst-headmaster-speech') {
        setActiveTab('home');
        setTimeout(() => {
          const element = document.getElementById('school-history-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else if (item.id === 'students-corner') {
        setActiveTab('home');
        setTimeout(() => {
          const element = document.getElementById('students-corner-card');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else if (item.id === 'teachers-corner') {
        setActiveTab('home');
        setTimeout(() => {
          const element = document.getElementById('teachers-corner-card');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else if (item.id === 'faqs') {
        setActiveTab('contact');
        setTimeout(() => {
          const element = document.getElementById('faq-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else {
        setActiveTab(item.targetTab);
        if (item.targetId) {
          setTimeout(() => {
            const element = document.getElementById(item.targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 150);
        }
      }
    }
  };

  const handleNavClick = (tabId: string) => {
    if (tabId === 'home') {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'history') {
      setActiveTab('home');
      setTimeout(() => {
        const element = document.getElementById('school-history-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else if (tabId === 'teachers') {
      setActiveTab('academics');
    } else if (tabId === 'student' || tabId === 'results') {
      setActiveTab('portal');
    } else if (tabId === 'photo' || tabId === 'video') {
      setActiveTab('gallery');
    } else if (tabId === 'contact') {
      setActiveTab('contact');
    } else {
      setActiveTab(tabId);
    }
    setIsOpen(false);
  };

  const getResultIcon = (type: 'section' | 'notice' | 'program') => {
    switch (type) {
      case 'section': return <Layers className="h-4.5 w-4.5" />;
      case 'notice': return <FileText className="h-4.5 w-4.5" />;
      case 'program': return <BookOpen className="h-4.5 w-4.5" />;
    }
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. Beautiful Header Banner in screenshot style */}
      <div 
        style={{
          backgroundColor: settings?.bannerColor || '#1e5fb3',
          backgroundImage: settings?.bannerGradient !== false
            ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.3) 100%)'
            : 'none'
        }}
        className="text-white py-3 px-3 sm:py-5 sm:px-6 lg:px-8 border-b border-blue-800 shadow-sm relative overflow-hidden"
      >
        
        {/* Subtle background overlay shapes */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-xl -ml-20 -mb-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2.5 sm:gap-5 relative z-10">
          
          {/* Left / Middle: Logo & School Identifiers */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex flex-row items-center gap-2 sm:gap-4 text-left flex-1 min-w-0 cursor-pointer select-none active:scale-[0.99] transition-transform"
          >
            {/* White circle containing the school logo or default icon */}
            <div className="h-11 w-11 xs:h-14 xs:w-14 sm:h-20 sm:w-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-white/20 shrink-0 transform hover:scale-105 transition-transform duration-300 overflow-hidden">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="School Logo" className="h-full w-full object-cover" />
              ) : (
                <School className="h-6 w-6 xs:h-8 xs:w-8 sm:h-11 sm:w-11 text-blue-600" />
              )}
            </div>

            <div className="min-w-0 flex-1 flex flex-col items-start justify-center text-left">
              <h1 
                style={{ fontSize: settings?.bannerFontSize ? `clamp(11px, 2.5vw + 5px, ${settings.bannerFontSize}px)` : undefined }}
                className="text-[11px] xs:text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight drop-shadow-xs break-words w-full leading-tight"
              >
                {settings?.siteNameBn || 'স্টুডেন্টস কেয়ার মডেল স্কুল'}
              </h1>
              <h2 className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-blue-100 tracking-normal break-words w-full leading-snug mt-1 sm:mt-1.5 uppercase">
                {formatToNiceEnglish(settings?.siteNameEn || 'STUDENTS CARE MODEL SCHOOL')}
              </h2>
              <div className="hidden xs:flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[8px] sm:text-[10px] md:text-xs text-blue-100/85 mt-1 sm:mt-2 w-full">
                <span className="break-words">{settings?.addressBn || 'চরলক্ষ্যা, কর্ণফুলী, চট্টগ্রাম'}</span>
                <span className="opacity-60">•</span>
                <span>EIIN: {settings?.eiin || '471547'}</span>
                <span className="opacity-60">•</span>
                <span>প্রতিষ্ঠিত: {settings?.foundedYear || '2018'}</span>
              </div>
            </div>
          </div>

          {/* Right: Contact details box */}
          <div className="w-[45%] xs:w-[40%] md:w-auto shrink-0 border border-white/15 rounded-xl p-1.5 sm:p-3 bg-white/5 flex flex-col justify-center gap-1 sm:gap-2 text-[8px] xs:text-[10px] sm:text-xs text-white tracking-wide select-text shadow-inner">
            <div className="flex items-center gap-1 sm:gap-2">
              <Phone className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-blue-200 shrink-0" />
              <span className="font-bold truncate" title={settings?.helpline || '+880 1814913049'}>
                {settings?.helpline || '+880 1814913049'}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 border-t border-white/10 pt-1 sm:pt-1.5">
              <Mail className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-blue-200 shrink-0" />
              <span className="font-bold select-all truncate" title={settings?.email || 'studentscare2006@gmail.com'}>
                {settings?.email || 'studentscare2006@gmail.com'}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 border-t border-white/10 pt-1 sm:pt-1.5">
              <Globe className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-blue-200 shrink-0" />
              <span className="font-bold truncate" title={settings?.website || 'Students Care'}>
                {settings?.website || 'Students Care'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Slate/Dark Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#090f1d] text-white border-b border-slate-800/80 shadow-md">
        
        {/* Top actions line inside nav to match screenshot */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/40 py-1.5 flex justify-end items-center gap-2">
          
          {/* Login Action Button */}
          <button
            onClick={() => handleNavClick('student')}
            className="bg-[#025644] hover:bg-[#014436] text-white px-3 sm:px-4 py-1 rounded-md text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm ml-1"
          >
            <User className="h-3.5 w-3.5" />
            <span>লগইন</span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </button>

          {/* Academic Session Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSessionOpen(!isSessionOpen)}
              className="bg-white text-gray-800 px-3 sm:px-4 py-1 rounded-md text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm ml-2 border border-gray-300"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{academicSession}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>
            {isSessionOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-2 text-sm text-gray-700">
                {sessions.map((session) => (
                  <button
                    key={session}
                    onClick={() => {
                      setAcademicSession(session);
                      setIsSessionOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex justify-between items-center ${academicSession === session ? 'bg-gray-100 font-bold' : ''}`}
                  >
                    {session}
                    {academicSession === session && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            aria-label="Search website"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Mobile menu toggle (Visible on small screens) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Bottom links line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 sm:h-11">
            
            {/* Left/Main menu item list on Desktop */}
            <div className="hidden lg:flex items-center justify-between h-full w-full">
              <div className="flex items-center h-full">
                {menuItems.map((item, idx) => {
                  let isActive = false;
                  if (item.id === 'home' && activeTab === 'home') isActive = true;
                  else if (item.id === 'teachers' && activeTab === 'academics') isActive = true;
                  else if ((item.id === 'student' || item.id === 'results') && activeTab === 'portal') isActive = true;
                  else if (item.id === 'photo' && activeTab === 'gallery') isActive = true;
                  else if (item.id === 'video' && activeTab === 'gallery') isActive = false; 
                  else if (item.id === 'contact' && activeTab === 'contact') isActive = true;
                  else if (item.id === activeTab) isActive = true;

                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`h-full px-4 flex items-center text-[11px] sm:text-xs font-bold transition-all hover:text-white cursor-pointer relative group ${
                        idx !== menuItems.length - 1 ? 'border-r border-slate-800/80' : ''
                      } ${isActive ? 'text-blue-400 bg-white/5' : 'text-slate-300'}`}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 mr-1 text-slate-300 group-hover:text-white transition-colors" />}
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Integrated sleek desktop search trigger button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-inner shrink-0"
              >
                <Search className="h-3.5 w-3.5" />
                <span>{lang === 'bn' ? 'অনুসন্ধান...' : 'Search...'}</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-950 text-[10px] text-slate-500 rounded border border-slate-850 ml-1.5 font-mono">
                  /
                </kbd>
              </button>
            </div>

            {/* Mobile Title indicator inside links row */}
            <div className="lg:hidden flex items-center gap-2 h-full">
              <School className="h-4.5 w-4.5 text-blue-400" />
              <span className="text-xs font-black text-slate-300 tracking-tight">
                {lang === 'bn' ? 'স্টুডেন্টস কেয়ার মডেল স্কুল' : 'Students Care Model School'}
              </span>
            </div>

          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#070b16] border-t border-slate-800/80 text-left"
            >
              <div className="px-3 py-3 space-y-1">
                {/* Search in mobile drawer too */}
                <div className="px-3 pb-2 pt-1">
                  <button
                    onClick={() => { setIsOpen(false); setIsSearchOpen(true); }}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-xs font-bold transition-all text-left"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>{lang === 'bn' ? 'অনুসন্ধান করুন...' : 'Search website...'}</span>
                  </button>
                </div>

                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ==================== COMMAND PALETTE / SEARCH MODAL ==================== */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 sm:pt-28">
            
            {/* Dark glass backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
            />

            {/* Central modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-slate-950 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
            >
              {/* Search Bar Input */}
              <div className="relative flex items-center border-b border-slate-800 px-5 py-4">
                <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  autoFocus
                  placeholder={
                    lang === 'bn' 
                      ? 'সেকশন, নোটিশ বা একাডেমিক প্রোগ্রাম খুঁজুন...' 
                      : 'Search sections, notices, academic programs...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none font-bold select-text"
                />
                
                {/* Clear / Esc tag */}
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[9px] text-slate-500 rounded font-mono select-none">
                    ESC
                  </span>
                )}

                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors ml-2 cursor-pointer shrink-0"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Category Pills Filter */}
              <div className="flex flex-wrap items-center gap-1.5 px-5 py-2.5 bg-slate-900/40 border-b border-slate-900">
                {[
                  { id: 'all', label: lang === 'bn' ? 'সব ফলাফল' : 'All results' },
                  { id: 'section', label: lang === 'bn' ? 'ওয়েবসাইট সেকশন' : 'Sections' },
                  { id: 'notice', label: lang === 'bn' ? 'নোটিশ সমূহ' : 'Notices' },
                  { id: 'program', label: lang === 'bn' ? 'একাডেমিক প্রোগ্রাম' : 'Programs' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSearchCategory(cat.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      activeSearchCategory === cat.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Results Box */}
              <div className="overflow-y-auto p-4 space-y-2 max-h-[50vh] scrollbar-thin select-none">
                
                {/* 1. Suggestions block when search string is empty */}
                {!searchQuery && (
                  <div className="py-6 px-4 space-y-4">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                      {lang === 'bn' ? 'জনপ্রিয় অনুসন্ধান সমূহ' : 'Popular Searches'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSuggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSearchQuery(s.query)}
                          className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <span>🔍</span>
                          <span>{s.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-500 leading-relaxed font-semibold pt-4 border-t border-slate-900 text-center sm:text-left">
                      {lang === 'bn' 
                        ? '💡 যেকোনো পেজ থেকে সরাসরি সার্চ উইন্ডো চালু করতে কিবোর্ডের / কী প্রেস করুন।'
                        : '💡 Pro Tip: Press the / key anywhere on the page to trigger this interactive search instantly.'
                      }
                    </div>
                  </div>
                )}

                {/* 2. List of Filtered Items */}
                {searchQuery && filteredResults.length > 0 && (
                  filteredResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSearchResultClick(item)}
                      className="w-full text-left p-3.5 rounded-2xl hover:bg-slate-900 border border-transparent hover:border-slate-800/80 flex items-start gap-4 transition-all group cursor-pointer"
                    >
                      {/* Icon */}
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-all shrink-0">
                        {getResultIcon(item.type)}
                      </div>

                      {/* Content details */}
                      <div className="grow min-w-0 space-y-1 text-left">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                            {item.title}
                          </h4>
                          <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-md uppercase shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium line-clamp-1 leading-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {/* 3. Empty Search results fallback */}
                {searchQuery && filteredResults.length === 0 && (
                  <div className="text-center py-12 px-4 space-y-2">
                    <span className="text-4xl">🔍</span>
                    <h4 className="font-black text-slate-300 text-sm">
                      {lang === 'bn' ? 'কোনো ফলাফল খুঁজে পাওয়া যায়নি' : 'No Results Found'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-bold leading-normal">
                      {lang === 'bn'
                        ? `"${searchQuery}" এর সাথে মিলে এমন কোনো সেকশন, নোটিশ বা একাডেমিক প্রোগ্রাম পাওয়া যায়নি। অন্য কিছু দিয়ে চেষ্টা করুন।`
                        : `We couldn't find any match for "${searchQuery}". Try searching for categories like "admission", "exam", "routine", or "history".`
                      }
                    </p>
                  </div>
                )}

              </div>

              {/* Search Modal Footer */}
              <div className="border-t border-slate-800 px-5 py-3 bg-slate-950 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span className="hidden sm:inline">
                  {lang === 'bn' ? 'নির্বাচন করতে এন্টার চাপুন • বন্ধ করতে এস্কেপ' : 'Press Enter to select • Esc to close'}
                </span>
                <span>
                  {lang === 'bn' ? 'স্টুডেন্টস কেয়ার মডেল স্কুল সার্চ ইঞ্জিন' : 'Students Care Search Engine v1.0'}
                </span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

