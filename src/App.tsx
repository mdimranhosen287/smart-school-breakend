/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Sparkles,
  ClipboardList,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Globe,
  Download,
  User,
  FileText,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NoticeBoard from './components/NoticeBoard';
import AdmissionForm from './components/AdmissionForm';
import StudentPortal from './components/StudentPortal';

// Assets
// @ts-ignore
import bannerImage from './assets/images/school_celebration_banner_1783279354681.jpg';
// @ts-ignore
import campusImage from './assets/images/school_campus_front_1783321057894.jpg';
// @ts-ignore
import labImage from './assets/images/school_classroom_activity_1783321072592.jpg';
// @ts-ignore
import dir1 from './assets/images/school_director_1_1783321600455.jpg';
// @ts-ignore
import dir2 from './assets/images/school_director_2_1783321616498.jpg';
// @ts-ignore
import dir3 from './assets/images/school_director_3_1783321631272.jpg';
// @ts-ignore
import tFemale1 from './assets/images/teacher_female_1_1783321646624.jpg';
// @ts-ignore
import tMale1 from './assets/images/teacher_male_1_1783321684430.jpg';

// Newly generated assets for Masterpiece Students and Blog
// @ts-ignore
import studentSumaiya from './assets/images/student_sumaiya_aktar_1783322204776.jpg';
// @ts-ignore
import studentTanvir from './assets/images/student_tanvir_rahman_1783322216353.jpg';
// @ts-ignore
import studentMitu from './assets/images/student_mitu_khatun_1783322228325.jpg';
// @ts-ignore
import studentRashed from './assets/images/student_rashed_hossain_1783322240392.jpg';
// @ts-ignore
import blogBasketball from './assets/images/blog_basketball_sports_1783322253365.jpg';

// Data
import {
  schoolInfo,
  academicPrograms,
  teachers,
  galleryItems,
  faqs,
  notices,
  events
} from './data/schoolData';
import { translations } from './data/translations';
import { getMergedFrontendData } from './data/defaultFrontendData';

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved === 'en' || saved === 'bn') return saved;
    return 'en';
  });

  React.useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<string>(() => {
    return sessionStorage.getItem('app_activeTab') || 'home';
  });
  const [selectedNoticeFromSearch, setSelectedNoticeFromSearch] = useState<any>(null);
  
  React.useEffect(() => {
    (window as any).setActiveTab = (tab: string) => {
      if (tab === 'admission') {
        setActiveTab('admissions');
      } else {
        setActiveTab(tab);
      }
    };
  }, []);

  React.useEffect(() => {
    sessionStorage.setItem('app_activeTab', activeTab);
  }, [activeTab]);

  const [faqOpenId, setFaqOpenId] = useState<string | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  
  // Zoomed gallery image state
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);
  const [isHmSpeechExpanded, setIsHmSpeechExpanded] = useState<boolean>(false);
  const [isAhmSpeechExpanded, setIsAhmSpeechExpanded] = useState<boolean>(false);

  // Image slider states
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [frontendData, setFrontendData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  React.useEffect(() => {
    const loadFrontendData = async () => {
      const saved = localStorage.getItem('school_frontend_data');
      let merged = getMergedFrontendData(saved);

      try {
        const res = await fetch('/api/banner');
        const text = await res.text();
        
        // If the PHP file is returned as raw source code or HTML, parse error is avoided.
        if (text.trim().startsWith('<?php') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || !res.ok) {
          throw new Error('PHP script was not executed (returned raw source or HTML)');
        }
        
        const data = JSON.parse(text);
        if (data && data.frontend_data) {
          merged = { ...merged, ...data.frontend_data };
        }
        if (data && data.settings) {
          merged.settings = { ...merged.settings, ...data.settings };
        }
        if (data && data.slider) {
          merged.slider = data.slider;
        }
      } catch (err: any) {
        console.warn('PHP get_banner.php fetch bypassed/failed (expected in development):', err.message);
      }

      setFrontendData(merged);
      if (merged && merged.settings) {
        setSettings(merged.settings);
      }
    };

    loadFrontendData();
    window.addEventListener('storage', loadFrontendData);
    
    // Custom event listener for instant refreshes when settings are modified
    const handleSettingsUpdate = () => {
      loadFrontendData();
    };
    window.addEventListener('school_settings_updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', loadFrontendData);
      window.removeEventListener('school_settings_updated', handleSettingsUpdate);
    };
  }, [activeTab]);

  const directorPanelPosition = Number(frontendData?.settings?.directorPanelPosition || 1);
  
  const defaultSlides = [
    {
      image: bannerImage,
      titleBn: "আনন্দমুখর শিক্ষাদান ও শিক্ষার্থীদের উচ্ছ্বাস",
      titleEn: "Joyful Learning & Student Vibrancy",
      subtitleBn: "স্টুডেন্টস কেয়ার মডেল স্কুলে প্রতিটি দিনই নতুন কিছু শেখার এবং উদযাপনের।",
      subtitleEn: "Every day at Students Care Model School is a new journey of learning and celebration."
    },
    {
      image: campusImage,
      titleBn: "মনোরম ও আধুনিক স্কুল ক্যাম্পাস ও খেলার মাঠ",
      titleEn: "Scenic & Modern School Campus",
      subtitleBn: "শিক্ষার্থীবান্ধব সবুজ ও সুশৃঙ্খল পরিবেশ, যেখানে ভবিষ্যৎ গড়ে ওঠে।",
      subtitleEn: "Student-friendly green environment where the future is shaped."
    },
    {
      image: labImage,
      titleBn: "সমৃদ্ধ বিজ্ঞান ও উন্নত আইসিটি কম্পিউটার ল্যাব",
      titleEn: "Advanced Science & ICT Computer Lab",
      subtitleBn: "হাতে-কলমে পরীক্ষা ও বিজ্ঞানসম্মত আধুনিক প্রযুক্তির মেলবন্ধন।",
      subtitleEn: "Hands-on experiments paired with modern digital technology."
    }
  ];

  const mappedSlides = frontendData?.slider && frontendData.slider.length > 0
    ? frontendData.slider
        .filter((slide: any) => slide.status !== 'inactive' && slide.status !== false)
        .sort((a: any, b: any) => (Number(a.order) || 99) - (Number(b.order) || 99))
        .map((slide: any, idx: number) => {
          const defaultImages = [bannerImage, campusImage, labImage];
          return {
            image: slide.image || defaultImages[idx % defaultImages.length],
            titleBn: slide.titleBn || slide.title || "নতুন ক্লাসরুম ব্যানার",
            titleEn: slide.titleEn || slide.title || "New Classroom Banner",
            subtitleBn: slide.descBn || slide.subtitleBn || "স্টুডেন্টস কেয়ার মডেল স্কুলে প্রতিটি দিনই নতুন কিছু শেখার এবং উদযাপনের।",
            subtitleEn: slide.descEn || slide.subtitleEn || "Every day at Students Care Model School is a new journey of learning and celebration.",
            btnTextBn: slide.btnTextBn || '',
            btnTextEn: slide.btnTextEn || '',
            btnLink: slide.btnLink || ''
          };
        })
    : [];

  const sliderSlides = mappedSlides.length > 0 ? mappedSlides : defaultSlides;
  const safeSlideIdx = (currentSlide < sliderSlides.length && currentSlide >= 0) ? currentSlide : 0;

  // Auto play the slider
  React.useEffect(() => {
    if (activeTab !== 'home') return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (sliderSlides.length > 0 ? (prev + 1) % sliderSlides.length : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab, sliderSlides.length]);

  React.useEffect(() => {
    if (currentSlide >= sliderSlides.length) {
      setCurrentSlide(0);
    }
  }, [sliderSlides.length, currentSlide]);

  // Director Panel Data
  const directorsList = [
    {
      id: "D001",
      nameBn: "জনাব আলহাজ্ব কামাল উদ্দিন",
      nameEn: "Alhaj Kamal Uddin",
      designationBn: "চেয়ারম্যান, গভর্নিং বডি",
      designationEn: "Chairman, Governing Body",
      image: dir1,
      quoteBn: "আমাদের লক্ষ্য কর্ণফুলী ও চরলক্ষ্যার বুকে সুশিক্ষিত সৎ ও আদর্শ প্রজন্ম গড়ে তোলা।",
      quoteEn: "Our mission is to build a well-educated, honest, and ideal generation."
    },
    {
      id: "D002",
      nameBn: "জনাব মোরশেদ আলম",
      nameEn: "Morshed Alam",
      designationBn: "ব্যবস্থাপনা পরিচালক",
      designationEn: "Managing Director",
      image: dir2,
      quoteBn: "আইসিটি ও আধুনিক বিজ্ঞান শিক্ষায় স্টুডেন্টস কেয়ার হবে এই অঞ্চলের মডেল দৃষ্টান্ত।",
      quoteEn: "With ICT and modern science education, Students Care will be a role model."
    },
    {
      id: "D003",
      nameBn: "জনাবা ফাতেমা বেগম",
      nameEn: "Fatema Begum",
      designationBn: "অর্থ পরিচালক",
      designationEn: "Director of Finance",
      image: dir3,
      quoteBn: "স্বচ্ছতা, শৃঙ্খলা ও প্রতিটি শিক্ষার্থীর ব্যক্তিগত যত্ন আমাদের সফলতার প্রধান চাবিকাঠি।",
      quoteEn: "Transparency, discipline and individual care for every student is our key to success."
    }
  ];

  // Extended Teacher Panel Data
  const extendedTeachersList = [
    {
      id: "T001",
      nameBn: "জনাব এম. এ. হাসান",
      nameEn: "Mr. M. A. Hasan",
      designationBn: "অধ্যক্ষ (প্রিন্সিপাল)",
      designationEn: "Principal",
      image: teachers[0].image,
      subjectBn: "ইংরেজি সাহিত্য ও প্রশাসন",
      subjectEn: "English Literature & Administration"
    },
    {
      id: "T002",
      nameBn: "জনাবা শামীমা সুলতানা",
      nameEn: "Mrs. Shamima Sultana",
      designationBn: "সহকারী প্রধান শিক্ষিকা",
      designationEn: "Assistant Headmistress",
      image: teachers[1].image,
      subjectBn: "প্রাথমিক শিক্ষা ও সমন্বয়",
      subjectEn: "Primary Division & Coordination"
    },
    {
      id: "T003",
      nameBn: "জনাব আব্দুল হাই",
      nameEn: "Mr. Abdul Hye",
      designationBn: "সিনিয়র শিক্ষক (পদার্থবিজ্ঞান)",
      designationEn: "Senior Teacher (Physics)",
      image: teachers[2].image,
      subjectBn: "পদার্থবিজ্ঞান ও গণিত",
      subjectEn: "Physics & Mathematics"
    },
    {
      id: "T004",
      nameBn: "ড. ফারহানা রহমান",
      nameEn: "Dr. Farhana Rahman",
      designationBn: "সহকারী অধ্যাপিকা",
      designationEn: "Assistant Professor",
      image: teachers[3].image,
      subjectBn: "রসায়ন বিজ্ঞান",
      subjectEn: "Chemistry"
    },
    {
      id: "T005",
      nameBn: "জনাব রফিকুল ইসলাম",
      nameEn: "Mr. Rafiqul Islam",
      designationBn: "সিনিয়র প্রশিক্ষক",
      designationEn: "Senior Instructor",
      image: teachers[4].image,
      subjectBn: "উচ্চতর গণিত",
      subjectEn: "Higher Mathematics"
    },
    {
      id: "T006",
      nameBn: "জনাবা তাসনিম জাহান",
      nameEn: "Mrs. Tasnim Jahan",
      designationBn: "সহকারী শিক্ষিকা",
      designationEn: "Assistant Teacher",
      image: tFemale1,
      subjectBn: "ইংরেজি ভাষা ও ব্যাকরণ",
      subjectEn: "English Language & Grammar"
    },
    {
      id: "T007",
      nameBn: "জনাব ইমরান হোসাইন",
      nameEn: "Mr. Imran Hosen",
      designationBn: "সহকারী শিক্ষক (আইসিটি)",
      designationEn: "Assistant Teacher (ICT)",
      image: tMale1,
      subjectBn: "কম্পিউটার বিজ্ঞান ও কোডিং",
      subjectEn: "Computer Science & Coding"
    }
  ];

  // Homepage Sliders States & Effects
  const [directorSlideIdx, setDirectorSlideIdx] = useState<number>(0);
  const [teacherSlideIdx, setTeacherSlideIdx] = useState<number>(0);
  const [studentSlideIdx, setStudentSlideIdx] = useState<number>(0);

  const [visibleDirectors, setVisibleDirectors] = useState<number>(3);
  const [visibleTeachers, setVisibleTeachers] = useState<number>(4);
  const [visibleStudents, setVisibleStudents] = useState<number>(4);

  React.useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      // Directors Visibility
      if (w >= 1024) setVisibleDirectors(3);
      else if (w >= 768) setVisibleDirectors(2);
      else setVisibleDirectors(1);

      // Teachers Visibility
      if (w >= 1280) setVisibleTeachers(4);
      else if (w >= 1024) setVisibleTeachers(3);
      else if (w >= 640) setVisibleTeachers(2);
      else setVisibleTeachers(1);

      // Students Visibility
      if (w >= 1280) setVisibleStudents(4);
      else if (w >= 1024) setVisibleStudents(3);
      else if (w >= 640) setVisibleStudents(2);
      else setVisibleStudents(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Homepage sliders auto-play
  React.useEffect(() => {
    if (activeTab !== 'home') return;

    const directorInterval = setInterval(() => {
      const maxDir = 3 - visibleDirectors;
      setDirectorSlideIdx((prev) => (maxDir <= 0 ? 0 : (prev + 1) % (maxDir + 1)));
    }, 6000);

    const teacherInterval = setInterval(() => {
      const maxTeacher = 7 - visibleTeachers;
      setTeacherSlideIdx((prev) => (maxTeacher <= 0 ? 0 : (prev + 1) % (maxTeacher + 1)));
    }, 5000);

    const studentInterval = setInterval(() => {
      const maxStudent = 4 - visibleStudents;
      setStudentSlideIdx((prev) => (maxStudent <= 0 ? 0 : (prev + 1) % (maxStudent + 1)));
    }, 5500);

    return () => {
      clearInterval(directorInterval);
      clearInterval(teacherInterval);
      clearInterval(studentInterval);
    };
  }, [activeTab, visibleDirectors, visibleTeachers, visibleStudents]);

  // Notice Board Auto-slide State
  const [noticeSlideIdx, setNoticeSlideIdx] = useState<number>(0);
  const [homeSelectedNotice, setHomeSelectedNotice] = useState<any>(null);

  // Notice board auto-play
  React.useEffect(() => {
    if (activeTab !== 'home') return;
    const listLength = t.noticesList?.length || 1;
    const interval = setInterval(() => {
      setNoticeSlideIdx((prev) => (prev + 1) % listLength);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeTab, t.noticesList?.length]);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please fill out all required fields.');
      return;
    }
    setContactSubmitted(true);
    setContactError('');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // Suggestion Form State
  const [suggestionForm, setSuggestionForm] = useState({ name: '', suggestion: '' });
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionForm.suggestion.trim()) return;
    setSuggestionSubmitted(true);
    setTimeout(() => {
      setSuggestionForm({ name: '', suggestion: '' });
      setSuggestionSubmitted(false);
    }, 4000);
  };

  // Homework Form State
  const [homeworkForm, setHomeworkForm] = useState({
    studentName: '',
    rollNo: '',
    studentClass: '',
    section: '',
    phone: '',
    subject: '',
    note: '',
    fileName: ''
  });
  const [homeworkSubmitted, setHomeworkSubmitted] = useState(false);

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeworkForm.studentName.trim() || !homeworkForm.rollNo.trim() || !homeworkForm.studentClass) {
      return;
    }
    setHomeworkSubmitted(true);
    setTimeout(() => {
      setHomeworkForm({
        studentName: '',
        rollNo: '',
        studentClass: '',
        section: '',
        phone: '',
        subject: '',
        note: '',
        fileName: ''
      });
      setHomeworkSubmitted(false);
    }, 5000);
  };

  // Filter gallery items
  const filteredGallery = galleryFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === galleryFilter);

  const galleryCategories = ['All', 'Academic', 'Lab', 'Sports', 'Culture'];

  const renderGoverningBodySection = () => (
    <div id="governing-body-section" className="space-y-12 pt-8 text-left">
      
      {/* Divider Line with Badge */}
      <div className="relative py-4 text-center">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 animate-pulse"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 px-4 text-xs font-black uppercase tracking-widest text-[#0f172a] flex items-center gap-1.5">
            <Users className="h-4 w-4 text-emerald-500" />
            {lang === 'bn' ? 'পরিচালনা পর্ষদ ও শিক্ষক প্যানেল' : 'Governing Body & Academic Faculty'}
          </span>
        </div>
      </div>

      {/* DIRECTOR PANEL (পরিচালনা পর্ষদ) */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {lang === 'bn' ? 'স্কুল ডিরেক্টর প্যানেল' : 'School Director Panel'}
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-1">
              {lang === 'bn' ? 'আমাদের গভর্নিং বডির সম্মানিত সদস্যবৃন্দ' : 'Respected members of our Governing Body'}
            </p>
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setDirectorSlideIdx((prev) => (prev <= 0 ? Math.max(0, 3 - visibleDirectors) : prev - 1))}
              className="p-2 rounded-full border border-gray-200 bg-white hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer shadow-3xs"
              aria-label="Previous Director"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDirectorSlideIdx((prev) => (prev >= Math.max(0, 3 - visibleDirectors) ? 0 : prev + 1))}
              className="p-2 rounded-full border border-gray-200 bg-white hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer shadow-3xs"
              aria-label="Next Director"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sliding Viewport */}
        <div className="overflow-hidden w-full relative py-2">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${directorSlideIdx * (100 / visibleDirectors)}%)`,
            }}
          >
            {directorsList.map((director) => (
              <div
                key={director.id}
                className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                style={{
                  width: `calc(${100 / visibleDirectors}% - ${(visibleDirectors - 1) * 24 / visibleDirectors}px)`,
                  minWidth: `calc(${100 / visibleDirectors}% - ${(visibleDirectors - 1) * 24 / visibleDirectors}px)`,
                }}
              >
                <div className="p-6 space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left grow">
                  <div className="h-20 w-20 relative overflow-hidden rounded-2xl border border-gray-100 shadow-3xs shrink-0 bg-slate-50 group">
                    <img
                      src={director.image}
                      alt={lang === 'bn' ? director.nameBn : director.nameEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 to-transparent" />
                  </div>

                  <div className="space-y-1 grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-[#0f172a] text-base leading-tight">
                        {lang === 'bn' ? director.nameBn : director.nameEn}
                      </h4>
                      <p className="text-xs text-[#0593dd] font-bold mt-1 uppercase tracking-wider">
                        {lang === 'bn' ? director.designationBn : director.designationEn}
                      </p>
                    </div>

                    <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed font-semibold italic border-l-2 border-emerald-500 pl-3">
                      "{lang === 'bn' ? director.quoteBn : director.quoteEn}"
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3.5 border-t border-gray-150/60 flex justify-between items-center mt-auto">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">MEMBER ID: {director.id}</span>
                  <span className="text-[10px] text-emerald-600 font-extrabold hover:underline cursor-pointer flex items-center gap-0.5">
                    {lang === 'bn' ? 'বিস্তারিত তথ্য' : 'Read Bio'}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TEACHERS PANEL (শিক্ষক প্যানেল) */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {lang === 'bn' ? 'সম্মানিত শিক্ষক মণ্ডলী' : 'Our Academic Faculty'}
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-1">
              {lang === 'bn' ? 'আমাদের দক্ষ, অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকবৃন্দ' : 'Meet our qualified, experienced, and dedicated mentors'}
            </p>
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setTeacherSlideIdx((prev) => (prev <= 0 ? Math.max(0, 8 - visibleTeachers) : prev - 1))}
              className="p-2 rounded-full border border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer shadow-3xs"
              aria-label="Previous Teacher"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTeacherSlideIdx((prev) => (prev >= Math.max(0, 8 - visibleTeachers) ? 0 : prev + 1))}
              className="p-2 rounded-full border border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer shadow-3xs"
              aria-label="Next Teacher"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sliding Viewport */}
        <div className="overflow-hidden w-full relative py-2">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${teacherSlideIdx * (100 / visibleTeachers)}%)`,
            }}
          >
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-[#0b1329] border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                style={{
                  width: `calc(${100 / visibleTeachers}% - ${(visibleTeachers - 1) * 24 / visibleTeachers}px)`,
                  minWidth: `calc(${100 / visibleTeachers}% - ${(visibleTeachers - 1) * 24 / visibleTeachers}px)`,
                }}
              >
                <div className="p-5 flex flex-col items-center text-center grow">
                  <div className="h-24 w-24 relative overflow-hidden rounded-full border-2 border-emerald-500/40 shadow-sm shrink-0 bg-[#0f172a] group mb-4">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 to-transparent" />
                  </div>

                  <div className="space-y-1 grow flex flex-col justify-between w-full">
                    <div>
                      <h4 className="font-extrabold text-white text-base tracking-tight leading-snug">
                        {teacher.name}
                      </h4>
                      <p className="text-xs text-emerald-400 font-extrabold mt-1 uppercase tracking-wider">
                        {teacher.designation}
                      </p>
                    </div>

                    <div className="text-left mt-4 bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                        <Mail className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-bold truncate">
                        <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">DEPT:</span>
                        <span className="truncate">{teacher.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#025644]/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/10 mt-3 truncate max-w-full">
                    {teacher.qualification}
                  </div>
                </div>

                <div className="bg-emerald-950/40 px-5 py-3.5 border-t border-white/5 flex justify-between items-center mt-auto">
                  <span className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-wider">ID: {teacher.id}</span>
                  <span className="text-[10px] text-emerald-400 font-extrabold hover:underline cursor-pointer flex items-center gap-0.5">
                    {lang === 'bn' ? 'বিস্তারিত প্রোফাইল' : 'Full Profile'}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress dots for Teachers */}
      {7 - visibleTeachers > 0 && (
        <div className="flex justify-center gap-1.5 pt-1">
          {Array.from({ length: 8 - visibleTeachers }).map((_, tIdx) => (
            <button
              key={tIdx}
              onClick={() => setTeacherSlideIdx(tIdx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                teacherSlideIdx === tIdx ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label={`Go to slide ${tIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-gray-800">
      
      {/* Main Navbar */}
      {activeTab !== 'portal' && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          lang={lang} 
          setLang={setLang} 
          onSearchSelectNotice={(notice) => {
            setSelectedNoticeFromSearch(notice);
            setActiveTab('notices');
          }}
          settings={settings}
        />
      )}

      {/* Main Container */}
      <main className="grow">
        <AnimatePresence mode="wait">
          
          {/* ==================== HOME VIEW ==================== */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-100/50 min-h-screen text-slate-800"
            >
              {/* Custom CSS for Smooth Scrolling Marquee */}
              <style>{`
                @keyframes marquee {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee-custom {
                  display: inline-flex;
                  animation: marquee 35s linear infinite;
                }
                .animate-marquee-custom:hover {
                  animation-play-state: paused;
                }
              `}</style>

              {/* 1.1. Beautiful Interactive Image Slider / Carousel */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="relative w-full aspect-[16/11] xs:aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md bg-slate-900 group">
                  
                  {/* Slider Images with AnimatePresence */}
                  <div className="absolute inset-0 w-full h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <img
                          src={sliderSlides[safeSlideIdx]?.image}
                          alt={lang === 'bn' ? sliderSlides[safeSlideIdx]?.titleBn : sliderSlides[safeSlideIdx]?.titleEn}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Dark Gradient Overlay for Readability */}
                        <div className="absolute inset-0 bg-slate-950/30 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent" />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Left Navigation Arrow */}
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderSlides.length) % sliderSlides.length)}
                    className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-blue-600/90 text-white transition-all border border-white/10 backdrop-blur-xs opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer shadow-lg"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>

                  {/* Right Navigation Arrow */}
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderSlides.length)}
                    className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-blue-600/90 text-white transition-all border border-white/10 backdrop-blur-xs opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer shadow-lg"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                  </button>

                  {/* Text Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 xs:p-6 sm:p-10 z-10 text-left space-y-1.5 sm:space-y-2 pointer-events-none">
                    <motion.div
                      key={`text-${currentSlide}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="max-w-2xl space-y-1.5 sm:space-y-2 pointer-events-auto"
                    >
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/90 text-white text-[9px] xs:text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-xs">
                        <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-300 animate-pulse" />
                        {lang === 'bn' ? "ক্যাম্পাস গ্যালারি" : "Campus Gallery"}
                      </span>
                      <h2 className="text-base xs:text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                        {lang === 'bn' ? sliderSlides[safeSlideIdx]?.titleBn : sliderSlides[safeSlideIdx]?.titleEn}
                      </h2>
                      <p className="text-[11px] xs:text-xs sm:text-sm md:text-base text-gray-200/90 font-medium max-w-xl leading-relaxed drop-shadow-xs hidden xs:block">
                        {lang === 'bn' ? sliderSlides[safeSlideIdx]?.subtitleBn : sliderSlides[safeSlideIdx]?.subtitleEn}
                      </p>
                      {sliderSlides[safeSlideIdx]?.btnLink && (
                        <div className="pt-2">
                          <a
                            href={sliderSlides[safeSlideIdx]?.btnLink}
                            target={sliderSlides[safeSlideIdx]?.btnLink.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              // If it is an internal tab link, click inside the app instead of default anchor jump
                              if (sliderSlides[safeSlideIdx]?.btnLink && !sliderSlides[safeSlideIdx].btnLink.startsWith('http')) {
                                e.preventDefault();
                                setActiveTab(sliderSlides[safeSlideIdx].btnLink);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-black rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
                          >
                            <span>
                              {lang === 'bn' 
                                ? (sliderSlides[safeSlideIdx]?.btnTextBn || 'বিস্তারিত দেখুন') 
                                : (sliderSlides[safeSlideIdx]?.btnTextEn || 'Learn More')}
                            </span>
                            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </a>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Slide Indicators (Dots) */}
                  <div className="absolute bottom-4 right-4 sm:right-10 z-20 flex gap-1.5">
                    {sliderSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentSlide === idx ? 'w-5 sm:w-8 bg-blue-500' : 'w-1.5 bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                </div>
              </div>

              {/* 1. Dark Top-Bar Notice Ticker - Positioned Underneath the Slider */}
              <div className="w-full flex items-center bg-[#FEFBF0] h-11 border-y border-gray-200/80 shadow-xs overflow-hidden mt-6">
                {/* Left Badge: Dark Background */}
                <div className="bg-[#0f172a] text-white px-5 h-full flex items-center gap-2 text-xs sm:text-sm font-black tracking-wide shrink-0 select-none border-r border-slate-800 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{lang === 'bn' ? 'জরুরী ঘোষণা :' : 'Important Notice :'}</span>
                </div>
                {/* Right Area: Scrolling Text Marquee */}
                <div className="grow overflow-hidden relative flex items-center h-full select-none cursor-default">
                  <div className="animate-marquee-custom whitespace-nowrap flex items-center gap-8 pl-4">
                    <span className="text-gray-800 text-xs sm:text-sm font-bold">
                      {lang === 'bn' 
                        ? (frontendData?.noticeTickerBn || settings?.noticeTickerBn || 'অর্ধবার্ষিক পরীক্ষা ২৫শে জুন থেকে শুরু হবে। • আগামী ১লা জুলাই থেকে অর্ধবার্ষিক পরীক্ষা শুরু হতে যাচ্ছে। বিস্তারিত নোটিশ বোর্ডে দেখুন। • স্টুডেন্টস কেয়ার মডেল স্কুলের নতুন ভর্তি কার্যক্রম চলছে! অনলাইনের মাধ্যমে দ্রুত আবেদন করুন।')
                        : (frontendData?.noticeTickerEn || settings?.noticeTickerEn || 'Half-yearly exams will commence from July 15th, 2026. Please collect admit cards from office. • Admission is ongoing for the new session! Apply online today.')
                      }
                    </span>
                    <span className="text-gray-800 text-xs sm:text-sm font-bold">
                      {lang === 'bn' 
                        ? (frontendData?.noticeTickerBn || settings?.noticeTickerBn || 'অর্ধবার্ষিক পরীক্ষা ২৫শে জুন থেকে শুরু হবে। • আগামী ১লা জুলাই থেকে অর্ধবার্ষিক পরীক্ষা শুরু হতে যাচ্ছে। বিস্তারিত নোটিশ বোর্ডে দেখুন। • স্টুডেন্টস কেয়ার মডেল স্কুলের নতুন ভর্তি কার্যক্রম চলছে! অনলাইনের মাধ্যমে দ্রুত আবেদন করুন।')
                        : (frontendData?.noticeTickerEn || settings?.noticeTickerEn || 'Half-yearly exams will commence from July 15th, 2026. Please collect admit cards from office. • Admission is ongoing for the new session! Apply online today.')
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-8">
                
                {directorPanelPosition === 3 && renderGoverningBodySection()}
                
                {/* 2. Three Large, Centered Action Buttons (Styled Exactly Like Screenshot) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  
                  {/* Button 1: Online Admission */}
                  <div
                    onClick={() => setActiveTab('admissions')}
                    className="bg-[#009a68] text-white rounded-2xl p-5 flex items-center justify-between hover:bg-[#008257] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group shadow-sm text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-full text-white">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg tracking-tight">Online Admission</h4>
                        <p className="text-xs text-white/80 font-bold mt-0.5">নতুন ভর্তির আবেদন</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/95 group-hover:translate-x-1.5 transition-transform duration-300 shrink-0" />
                  </div>

                  {/* Button 2: Pay Fees */}
                  <div
                    onClick={() => setActiveTab('portal')}
                    className="bg-[#0593dd] text-white rounded-2xl p-5 flex items-center justify-between hover:bg-[#047ebb] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group shadow-sm text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-full text-white">
                        <ClipboardList className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg tracking-tight">Pay Fees</h4>
                        <p className="text-xs text-white/80 font-bold mt-0.5">অনলাইনে ফি পরিশোধ</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/95 group-hover:translate-x-1.5 transition-transform duration-300 shrink-0" />
                  </div>

                  {/* Button 3: Download Routine */}
                  <div
                    onClick={() => setActiveTab('portal')}
                    className="bg-[#e27103] text-white rounded-2xl p-5 flex items-center justify-between hover:bg-[#c46101] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group shadow-sm text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-full text-white">
                        <Download className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg tracking-tight">Download Routine</h4>
                        <p className="text-xs text-white/80 font-bold mt-0.5">ক্লাস রুটিন ডাউনলোড</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/95 group-hover:translate-x-1.5 transition-transform duration-300 shrink-0" />
                  </div>

                </div>

                {directorPanelPosition === 2 && renderGoverningBodySection()}

                {/* 3. High-Fidelity Custom Homepage Layout (Styled Exactly Like User Screenshot) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
                  
                  {/* Left Column (Main Content - lg:col-span-8) */}
                  <div className="lg:col-span-8 space-y-6">
                    {(() => {
                      const defaultFeatures = [
                        { id: '1', titleBn: 'মানসম্মত শিক্ষা', titleEn: 'Quality Education', descBn: 'আধুনিক কারিকুলাম ও নৈতিক শিক্ষার সমন্বয়।', descEn: 'Blending state curricula with ethical grooming.', icon: 'GraduationCap', color: 'emerald', order: 1, status: 'active' },
                        { id: '2', titleBn: 'নিরাপদ ক্যাম্পাস', titleEn: 'Safe Campus', descBn: 'সিসিটিভি দ্বারা নিয়ন্ত্রিত সুরক্ষিত ক্যাম্পাস।', descEn: 'Fully secured under 24/7 camera monitoring.', icon: 'ShieldCheck', color: 'rose', order: 2, status: 'active' },
                        { id: '3', titleBn: 'সহশিক্ষা কার্যক্রম', titleEn: 'Co-curricular Activities', descBn: 'ডিবেট, স্পোর্টস ও সাংস্কৃতিক চর্চা।', descEn: 'Promoting debate, scout, arts, and athletics.', icon: 'Sparkles', color: 'sky', order: 3, status: 'active' }
                      ];

                      const coreFeatures = (frontendData?.features && frontendData.features.length > 0)
                        ? frontendData.features
                        : defaultFeatures;

                      const renderIcon = (name: string, className?: string) => {
                        switch (name) {
                          case 'GraduationCap': return <GraduationCap className={className} />;
                          case 'ShieldCheck': return <ShieldCheck className={className} />;
                          case 'Award': return <Award className={className} />;
                          case 'BookOpen': return <BookOpen className={className} />;
                          case 'Sparkles': return <Sparkles className={className} />;
                          case 'Users': return <Users className={className} />;
                          case 'Heart': return <Heart className={className} />;
                          case 'Clock': return <Clock className={className} />;
                          case 'Calendar': return <Calendar className={className} />;
                          case 'Globe': return <Globe className={className} />;
                          default: return <GraduationCap className={className} />;
                        }
                      };

                      const blocks = [
                        {
                          id: 'about',
                          node: (
                            <div id="school-history-section" className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs">
                              <div className="bg-[#0f172a] text-white font-extrabold text-sm sm:text-base px-6 py-4 flex items-center gap-2 text-left">
                                <BookOpen className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                                <span>{lang === 'bn' ? 'প্রতিষ্ঠানের ইতিহাস' : 'Institutions History'}</span>
                              </div>
                              
                              <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                  {/* Student Image on Left */}
                                  <div className="md:col-span-4 relative overflow-hidden rounded-xl border border-gray-100 shadow-xs group">
                                    <img
                                      src={bannerImage}
                                      alt="Students at Students Care Model School"
                                      className="w-full h-auto aspect-[4/3] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                                  </div>

                                  {/* Historical text on the Right */}
                                  <div className="md:col-span-8 space-y-3 text-left">
                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-semibold">
                                      {lang === 'bn' 
                                        ? 'চট্টগ্রাম জেলার কর্ণফুলী উপজেলার চরলক্ষ্যা ইউনিয়নের বুকে শিক্ষার আলো ছড়িয়ে দেওয়ার এক মহান ব্রত নিয়ে ২০১৮ সালে প্রতিষ্ঠিত হয় স্টুডেন্টস কেয়ার মডেল স্কুল। চরলক্ষ্যা ও এর আশেপাশের অঞ্চলের শিক্ষার্থীদের জন্য একটি আধুনিক, নৈতিক এবং মানসম্মত শিক্ষার পরিবেশ নিশ্চিত করার লক্ষ্যেই এই শিক্ষাপ্রতিষ্ঠানটির যাত্রা শুরু হয়েছিল। এলাকার সন্তানদের সুশিক্ষায় শিক্ষিত করে আদর্শ নাগরিক...'
                                        : 'With a noble mission to spread the light of education in Charlakshya Union under Karnaphuli Upazila of Chattogram District, Students Care Model School was established in 2018. It is dedicated to securing a modern and moral standard of education for young minds...'
                                      }
                                    </p>
                                    <button
                                      onClick={() => setIsHistoryExpanded(true)}
                                      className="text-[#0593dd] hover:text-blue-750 font-extrabold text-sm sm:text-base transition-colors cursor-pointer inline-flex items-center gap-1 hover:underline"
                                    >
                                      {lang === 'bn' ? 'বিস্তারিত »' : 'Read More »'}
                                    </button>
                                  </div>
                                </div>

                                {/* Precise Statistics Cards row inside/below history card */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                                  {/* Stat 1 */}
                                  <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 text-center">
                                    <p className="text-xl sm:text-2xl font-black text-[#0f172a]">2018</p>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">FOUNDED</p>
                                  </div>
                                  {/* Stat 2 */}
                                  <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 text-center">
                                    <p className="text-xl sm:text-2xl font-black text-[#0f172a]">1,000+</p>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">STUDENTS</p>
                                  </div>
                                  {/* Stat 3 */}
                                  <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 text-center">
                                    <p className="text-xl sm:text-2xl font-black text-[#0f172a]">40+</p>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">TEACHERS</p>
                                  </div>
                                  {/* Stat 4 */}
                                  <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 text-center">
                                    <p className="text-xl sm:text-2xl font-black text-[#0f172a]">100%</p>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">PASS RATE</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        },
                        {
                          id: 'speech',
                          node: (
                            (() => {
                              const hmName = lang === 'bn' ? (frontendData?.speech?.speakerNameBn || t.headmasterName) : (frontendData?.speech?.speakerNameEn || 'Morshed Nur');
                              const hmDesig = lang === 'bn' ? (frontendData?.speech?.designationBn || t.headmasterDesig) : (frontendData?.speech?.designationEn || 'Headmaster, Students Care Model School');
                              const hmText = lang === 'bn' ? (frontendData?.speech?.contentBn || t.headmasterText) : (frontendData?.speech?.contentEn || t.headmasterText);
                              const hmExcerpt = hmText && hmText.length > 200 ? hmText.substring(0, 200) + '...' : hmText;

                              const ahmName = lang === 'bn' ? (frontendData?.speech?.asstSpeakerNameBn || t.asstHeadmasterName) : (frontendData?.speech?.asstSpeakerNameEn || 'Md. Toyub Hosen');
                              const ahmDesig = lang === 'bn' ? (frontendData?.speech?.asstDesignationBn || t.asstHeadmasterDesig) : (frontendData?.speech?.asstDesignationEn || 'Asst. Headmaster, Students Care Model School');
                              const ahmText = lang === 'bn' ? (frontendData?.speech?.asstContentBn || t.asstHeadmasterText) : (frontendData?.speech?.asstContentEn || t.asstHeadmasterText);
                              const ahmExcerpt = ahmText && ahmText.length > 200 ? ahmText.substring(0, 200) + '...' : ahmText;

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Principal Speech Card */}
                                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs flex flex-col justify-between">
                                    <div className="bg-[#0f172a] text-white font-extrabold text-sm sm:text-base px-5 py-3.5 flex items-center gap-2 text-left">
                                      <User className="h-4 w-4 text-emerald-400" />
                                      <span>{lang === 'bn' ? 'প্রধান শিক্ষকের বাণী' : 'Message from Headmaster'}</span>
                                    </div>
                                    
                                    <div className="p-5 flex flex-col justify-between grow text-left space-y-4">
                                      <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-[#dbeafe] text-[#2563eb] rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-blue-150 shadow-xs">
                                          {frontendData?.speech?.headmasterPhoto ? (
                                            <img src={frontendData?.speech?.headmasterPhoto} alt="Headmaster" className="h-full w-full object-cover" />
                                          ) : (
                                            <User className="h-6 w-6" />
                                          )}
                                        </div>
                                        <div>
                                          <h4 className="font-extrabold text-[#0f172a] text-sm sm:text-base">
                                            {hmName}
                                          </h4>
                                          <p className="text-xs text-gray-400 font-bold">
                                            {hmDesig}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold text-left whitespace-pre-line">
                                        {hmExcerpt}
                                      </p>
                                      
                                      <div className="text-left">
                                        <button
                                          onClick={() => {
                                            setIsHmSpeechExpanded(true);
                                          }}
                                          className="text-[#0593dd] hover:text-blue-700 font-extrabold text-xs sm:text-sm cursor-pointer transition-colors hover:underline flex items-center gap-0.5"
                                        >
                                          {lang === 'bn' ? 'বিস্তারিত »' : 'Read More »'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Assistant Principal Speech Card */}
                                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs flex flex-col justify-between">
                                    <div className="bg-[#0f172a] text-white font-extrabold text-sm sm:text-base px-5 py-3.5 flex items-center gap-2 text-left">
                                      <User className="h-4 w-4 text-emerald-400" />
                                      <span>{lang === 'bn' ? 'সহকারী প্রধান শিক্ষকের বাণী' : 'Message from Assistant Headmaster'}</span>
                                    </div>
                                    
                                    <div className="p-5 flex flex-col justify-between grow text-left space-y-4">
                                      <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-[#dbeafe] text-[#2563eb] rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-blue-150 shadow-xs">
                                          {frontendData?.speech?.asstHeadmasterPhoto ? (
                                            <img src={frontendData?.speech?.asstHeadmasterPhoto} alt="Asst Headmaster" className="h-full w-full object-cover" />
                                          ) : (
                                            <User className="h-6 w-6" />
                                          )}
                                        </div>
                                        <div>
                                          <h4 className="font-extrabold text-[#0f172a] text-sm sm:text-base">
                                            {ahmName}
                                          </h4>
                                          <p className="text-xs text-gray-400 font-bold">
                                            {ahmDesig}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold text-left whitespace-pre-line">
                                        {ahmExcerpt}
                                      </p>
                                      
                                      <div className="text-left">
                                        <button
                                          onClick={() => {
                                            setIsAhmSpeechExpanded(true);
                                          }}
                                          className="text-[#0593dd] hover:text-blue-700 font-extrabold text-xs sm:text-sm cursor-pointer transition-colors hover:underline flex items-center gap-0.5"
                                        >
                                          {lang === 'bn' ? 'বিস্তারিত »' : 'Read More »'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()
                          )
                        },
                        {
                          id: 'features',
                          node: (
                            <div className="space-y-6">
                              {/* Core Features Grid */}
                              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs p-6 space-y-4">
                                <div className="border-b border-gray-150 pb-3 text-left">
                                  <h3 className="text-base sm:text-lg font-black text-[#0f172a] flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
                                    <span>{lang === 'bn' ? (frontendData?.sectionsList?.find((s: any) => s.id === 'features')?.nameBn || 'আমাদের মূল বৈশিষ্ট্যসমূহ') : (frontendData?.sectionsList?.find((s: any) => s.id === 'features')?.nameEn || 'Our Core Features & Strengths')}</span>
                                  </h3>
                                  <p className="text-xs text-gray-405 font-bold mt-1">
                                    {lang === 'bn' 
                                      ? 'স্টুডেন্টস কেয়ার মডেল স্কুলের অনন্য বৈশিষ্ট্য ও সাফল্যের চালিকাশক্তি' 
                                      : 'The foundation of our student care and academic success'}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  {coreFeatures
                                    .filter((item: any) => item.status !== 'inactive')
                                    .sort((a: any, b: any) => (Number(a.order) || 99) - (Number(b.order) || 99))
                                    .map((item: any, idx: number) => {
                                      const itemIcon = item.icon || (idx === 0 ? 'GraduationCap' : idx === 1 ? 'ShieldCheck' : idx === 2 ? 'Sparkles' : 'GraduationCap');
                                      const itemColor = item.color || (idx === 0 ? 'emerald' : idx === 1 ? 'rose' : idx === 2 ? 'sky' : 'emerald');
                                      
                                      const colorClasses = 
                                        itemColor === 'emerald' ? { bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-50/50' } :
                                        itemColor === 'rose' ? { bg: 'bg-rose-50 text-rose-600', border: 'border-rose-100 hover:border-rose-200 hover:shadow-rose-50/50' } :
                                        itemColor === 'sky' ? { bg: 'bg-sky-50 text-sky-600', border: 'border-sky-100 hover:border-sky-200 hover:shadow-sky-50/50' } :
                                        itemColor === 'blue' ? { bg: 'bg-blue-50 text-blue-600', border: 'border-blue-100 hover:border-blue-200 hover:shadow-blue-50/50' } :
                                        itemColor === 'amber' ? { bg: 'bg-amber-50 text-amber-600', border: 'border-amber-100 hover:border-amber-200 hover:shadow-amber-50/50' } :
                                        itemColor === 'violet' ? { bg: 'bg-violet-50 text-[#8b5cf6]', border: 'border-violet-100 hover:border-violet-200 hover:shadow-violet-50/50' } :
                                        { bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-50/50' };

                                      return (
                                        <div 
                                          key={item.id} 
                                          className={`bg-white border rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-md flex flex-col items-start gap-4 ${colorClasses.border}`}
                                        >
                                          <div className={`p-3 rounded-2xl shrink-0 ${colorClasses.bg}`}>
                                            {renderIcon(itemIcon, "h-6 w-6")}
                                          </div>
                                          <div className="space-y-1">
                                            <h4 className="font-extrabold text-[#0f172a] text-sm sm:text-base tracking-tight leading-snug">
                                              {lang === 'bn' ? item.titleBn : item.titleEn}
                                            </h4>
                                            <p className="text-gray-500 text-xs font-semibold leading-relaxed">
                                              {lang === 'bn' ? item.descBn : item.descEn}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Card 1: শিক্ষার্থীদের কর্নার (Pink Header) */}
                                <div id="students-corner-card" className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs flex flex-col">
                                  <div className="bg-[#e11d48] text-white font-extrabold text-sm sm:text-base px-5 py-3 flex items-center gap-2 text-left">
                                    <Users className="h-4 w-4" />
                                    <span>{lang === 'bn' ? 'শিক্ষার্থীদের কর্নার' : 'Students Corner'}</span>
                                  </div>
                                  <div className="p-5 text-left bg-[#fffefd] space-y-2.5">
                                    {[
                                      { bn: "৬ষ্ঠ শ্রেণী", en: "Class 6" },
                                      { bn: "৭ম শ্রেণী", en: "Class 7" },
                                      { bn: "৮ম শ্রেণী", en: "Class 8" },
                                      { bn: "৯ম শ্রেণী", en: "Class 9" },
                                      { bn: "১০ম শ্রেণী", en: "Class 10" }
                                    ].map((item, idx) => (
                                      <div 
                                        key={idx} 
                                        onClick={() => setActiveTab('portal')}
                                        className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 font-extrabold hover:text-[#e11d48] cursor-pointer transition-colors pb-2 border-b border-rose-100/30 last:border-b-0"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                                        <span>{lang === 'bn' ? item.bn : item.en}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Card 2: শিক্ষকমণ্ডলীর কর্নার (Green Header) */}
                                <div id="teachers-corner-card" className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs flex flex-col">
                                  <div className="bg-[#009a68] text-white font-extrabold text-sm sm:text-base px-5 py-3 flex items-center gap-2 text-left">
                                    <Users className="h-4 w-4" />
                                    <span>{lang === 'bn' ? 'Respected Teachers' : 'Respected Teachers'}</span>
                                  </div>
                                  <div className="p-5 text-left bg-[#fafdfb] space-y-2.5">
                                    {[
                                      { bn: "বাংলা ডিপার্টমেন্ট", en: "Bangla Department" },
                                      { bn: "ইংলিশ ডিপার্টমেন্ট", en: "English Department" },
                                      { bn: "বিজ্ঞান ডিপার্টমেন্ট", en: "Science Department" },
                                      { bn: "স্টাফ", en: "Office Staff" }
                                    ].map((item, idx) => (
                                      <div 
                                        key={idx}
                                        onClick={() => {
                                          const el = document.getElementById('academic-staff-divider');
                                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 font-extrabold hover:text-[#009a68] cursor-pointer transition-colors pb-2 border-b border-emerald-100/30 last:border-b-0"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#009a68]" />
                                        <span>{lang === 'bn' ? item.bn : item.en}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        },
                        {
                          id: 'service',
                          node: (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Card 3: সকল ডাউনলোড (Orange Header) */}
                              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs flex flex-col">
                                <div className="bg-[#e27103] text-white font-extrabold text-sm sm:text-base px-5 py-3 flex items-center gap-2 text-left">
                                  <Download className="h-4 w-4" />
                                  <span>{lang === 'bn' ? (frontendData?.sectionsList?.find((s: any) => s.id === 'service')?.nameBn || 'সকল ডাউনলোড') : (frontendData?.sectionsList?.find((s: any) => s.id === 'service')?.nameEn || 'All Downloads')}</span>
                                </div>
                                <div className="p-5 text-left bg-[#fffefc] space-y-2.5">
                                  {[
                                    { bn: "ডাউনলোড", en: "Downloads" },
                                    { bn: "পরীক্ষার রুটিন", en: "Exam Routine" },
                                    { bn: "ভর্তি ফরম", en: "Admission Form" },
                                    { bn: "সিলেবাস", en: "Academic Syllabus" }
                                  ].map((item, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={() => {
                                        if (item.bn === "ভর্তি ফরম") setActiveTab('admissions');
                                        else setActiveTab('portal');
                                      }}
                                      className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 font-extrabold hover:text-[#e27103] cursor-pointer transition-colors pb-2 border-b border-amber-100/30 last:border-b-0"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#e27103]" />
                                      <span>{lang === 'bn' ? item.bn : item.en}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Card 4: একাডেমিক তথ্য (Purple Header) */}
                              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs flex flex-col">
                                <div className="bg-[#8b5cf6] text-white font-extrabold text-sm sm:text-base px-5 py-3 flex items-center gap-2 text-left">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{lang === 'bn' ? 'একাডেমিক তথ্য' : 'Academic Info'}</span>
                                </div>
                                <div className="p-5 text-left bg-[#faf9ff] space-y-2.5">
                                  {[
                                    { bn: "নোটিশ", en: "Latest Notices" },
                                    { bn: "ছুটির দিন", en: "Holidays Calendar" },
                                    { bn: "একাডেমিক ক্যালেন্ডার", en: "Academic Calendar" },
                                    { bn: "ক্লাস রুটিন", en: "Weekly Class Routine" }
                                  ].map((item, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={() => {
                                        if (item.bn === "নোটিশ") setActiveTab('notices');
                                        else setActiveTab('portal');
                                      }}
                                      className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 font-extrabold hover:text-[#8b5cf6] cursor-pointer transition-colors pb-2 border-b border-purple-100/30 last:border-b-0"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                                      <span>{lang === 'bn' ? item.bn : item.en}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        }
                      ];

                      // Define orders and active statuses mapping safely
                      const orders = (frontendData?.sectionsList || []).reduce((acc: any, s: any) => {
                        if (s && s.id) {
                          acc[s.id] = { order: Number(s.order), status: s.status };
                        }
                        return acc;
                      }, {});

                      const sortedAndFiltered = blocks
                        .filter(b => {
                          const conf = orders[b.id];
                          // By default, if configuration hasn't loaded yet, show everything
                          return conf ? conf.status : true;
                        })
                        .sort((a, b) => {
                          const orderA = orders[a.id]?.order ?? 99;
                          const orderB = orders[b.id]?.order ?? 99;
                          return orderA - orderB;
                        });

                      return sortedAndFiltered.map(b => (
                        <div key={b.id} className="w-full">
                          {b.node}
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Right Column (Sidebar - lg:col-span-4) */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Notice Board Card */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs">
                      <div className="bg-[#0f172a] text-white font-extrabold text-sm sm:text-base px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-left">
                          <ClipboardList className="h-4.5 w-4.5 text-emerald-400" />
                          <span>{lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('notices')}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-black cursor-pointer transition-colors"
                        >
                          {lang === 'bn' ? 'সকল »' : 'All »'}
                        </button>
                      </div>

                      <div className="p-4 bg-white space-y-3">
                        {[
                          { bn: "বার্ষিক ক্রীড়া প্রতিযোগিতা", en: "Annual Sports and Athletics Event", notice: t.noticesList[2] },
                          { bn: "ডিজিটাল আইডি কার্ড বিতরণ", en: "Digital Student ID Card Distribution", notice: t.noticesList[1] }
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (item.notice) setHomeSelectedNotice(item.notice);
                            }}
                            className="flex items-center gap-3 py-2 px-2 hover:bg-slate-50/75 rounded-lg border border-transparent hover:border-slate-100 transition-all cursor-pointer group text-left"
                          >
                            <FileText className="h-4 w-4 text-sky-600 shrink-0 group-hover:scale-105 transition-transform" />
                            <span className="text-xs sm:text-sm text-slate-800 font-extrabold group-hover:text-[#0593dd] transition-colors leading-relaxed">
                              {lang === 'bn' ? item.bn : item.en}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fast Links Card */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs">
                      <div className="bg-[#0f172a] text-white font-extrabold text-sm sm:text-base px-5 py-3.5 flex items-center gap-2">
                        <ArrowRight className="h-4.5 w-4.5 text-emerald-400 rotate-45" />
                        <span>{lang === 'bn' ? 'ফাস্ট লিংক' : 'Fast Links'}</span>
                      </div>
                      
                      <div className="p-4 bg-white space-y-2">
                        {[
                          { bn: "পরীক্ষার ফলাফল", en: "Exam Results", action: () => setActiveTab('portal') },
                          { bn: "নোটিশ", en: "Latest Notices", action: () => setActiveTab('notices') },
                          { bn: "কৃতি শিক্ষার্থী", en: "Brilliant Students", action: () => setActiveTab('portal') },
                          { bn: "ছুটির দিন", en: "Holidays List", action: () => setActiveTab('portal') },
                          { bn: "যোগাযোগ", en: "Contact Us", action: () => {
                            const el = document.getElementById('footer-contact-details') || document.querySelector('footer');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                        ].map((link, idx) => (
                          <div
                            key={idx}
                            onClick={link.action}
                            className="bg-white hover:bg-slate-50 border border-gray-200/80 rounded-xl py-2 px-3.5 text-left cursor-pointer transition-all duration-200 font-extrabold text-xs sm:text-sm text-gray-700 flex items-center justify-between group"
                          >
                            <span>{lang === 'bn' ? link.bn : link.en}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#0593dd] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Facebook Integration Container */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs">
                      <div className="bg-[#0f172a] text-white font-extrabold text-sm sm:text-base px-5 py-3.5 flex items-center gap-2">
                        <Facebook className="h-4.5 w-4.5 text-emerald-400" />
                        <span>{lang === 'bn' ? 'ফেসবুকে আমরা' : 'We are on Facebook'}</span>
                      </div>
                      <div className="p-6 bg-slate-50/50 flex flex-col items-center justify-center gap-3 border-t border-gray-100">
                        <div className="h-12 w-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shadow-3xs cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open('https://facebook.com', '_blank')}>
                          <Facebook className="h-6 w-6 fill-current" />
                        </div>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Facebook Page Plugin</span>
                      </div>
                    </div>

                    {/* Important External Government Links */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-xs">
                      <div className="bg-[#0f172a] text-white font-extrabold text-sm sm:text-base px-5 py-3.5 flex items-center gap-2">
                        <ArrowRight className="h-4.5 w-4.5 text-emerald-400" />
                        <span>{lang === 'bn' ? 'গুরুত্বপূর্ণ লিংক' : 'Important Links'}</span>
                      </div>
                      <div className="p-4 bg-white space-y-2 text-left">
                        {[
                          { bn: "থিমসবাজার", en: "ThemesBazar", url: "https://www.themesbazar.com" },
                          { bn: "ব্যানেরবেইস", en: "BANBEIS", url: "http://www.banbeis.gov.bd" },
                          { bn: "শিক্ষা মন্ত্রণালয়", en: "Ministry of Education", url: "http://www.moedu.gov.bd" },
                          { bn: "মাউশি", en: "DSHE", url: "http://www.dshe.gov.bd" }
                        ].map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-extrabold hover:text-[#0593dd] hover:translate-x-0.5 transition-all py-1.5 border-b border-gray-100 last:border-b-0"
                          >
                            <ArrowRight className="h-3.5 w-3.5 text-[#0593dd]" />
                            <span>{lang === 'bn' ? link.bn : link.en}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* 6.1. Governing Body (Director Panel) & Teacher Panel Sliding Layouts */}
                {directorPanelPosition === 1 && (
                  <div id="governing-body-section" className="space-y-12 pt-8">
                  
                  {/* Divider Line with Badge */}
                  <div className="relative py-4 text-center">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-200 animate-pulse"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-slate-50 px-4 text-xs font-black uppercase tracking-widest text-[#0f172a] flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-emerald-500" />
                        {lang === 'bn' ? 'পরিচালনা পর্ষদ ও শিক্ষক প্যানেল' : 'Governing Body & Academic Faculty'}
                      </span>
                    </div>
                  </div>

                  {/* DIRECTOR PANEL (পরিচালনা পর্ষদ) */}
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                          {lang === 'bn' ? 'স্কুল ডিরেক্টর প্যানেল' : 'School Director Panel'}
                        </h3>
                        <p className="text-xs text-gray-400 font-bold mt-1">
                          {lang === 'bn' ? 'আমাদের গভর্নিং বডির সম্মানিত সদস্যবৃন্দ' : 'Respected members of our Governing Body'}
                        </p>
                      </div>

                      {/* Slider Navigation Controls */}
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setDirectorSlideIdx((prev) => (prev <= 0 ? Math.max(0, 3 - visibleDirectors) : prev - 1))}
                          className="p-2 rounded-full border border-gray-200 bg-white hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer shadow-3xs"
                          aria-label="Previous Director"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDirectorSlideIdx((prev) => (prev >= Math.max(0, 3 - visibleDirectors) ? 0 : prev + 1))}
                          className="p-2 rounded-full border border-gray-200 bg-white hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer shadow-3xs"
                          aria-label="Next Director"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sliding Viewport */}
                    <div className="overflow-hidden w-full relative py-2">
                      <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{
                          transform: `translateX(-${directorSlideIdx * (100 / visibleDirectors)}%)`,
                        }}
                      >
                        {directorsList.map((director) => (
                          <div
                            key={director.id}
                            className={`shrink-0 px-3 transition-all duration-300 ${
                              visibleDirectors === 3 ? 'w-1/3' : visibleDirectors === 2 ? 'w-1/2' : 'w-full'
                            }`}
                          >
                            <div className="relative bg-emerald-950 text-white rounded-3xl overflow-hidden shadow-lg border border-emerald-900/50 p-6 sm:p-8 flex flex-col items-center text-center justify-between min-h-[300px] group hover:border-emerald-500/50 transition-all duration-300">
                              {/* Decorative Background Accents */}
                              <div className="absolute inset-0 bg-radial-gradient from-emerald-900/40 via-transparent to-transparent opacity-50 pointer-events-none" />
                              <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-emerald-800/10 blur-2xl pointer-events-none" />
                              <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full bg-emerald-800/10 blur-2xl pointer-events-none" />

                              <div className="relative space-y-4 flex flex-col items-center w-full">
                                {/* Director Image */}
                                <div className="relative">
                                  <div className="absolute -inset-1 bg-emerald-400/20 rounded-2xl blur-xs pointer-events-none" />
                                  <img
                                    src={director.image}
                                    alt={lang === 'bn' ? director.nameBn : director.nameEn}
                                    className="relative h-28 w-28 object-cover rounded-2xl border-2 border-emerald-400/40 shadow-md bg-emerald-900"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>

                                {/* Director Speech Quote */}
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/20">
                                  <Award className="h-3 w-3 text-emerald-400" />
                                  {lang === 'bn' ? 'পরিচালনা পর্ষদের বাণী' : 'Governing Board Message'}
                                </span>
                                <p className="text-xs sm:text-sm text-emerald-100 italic leading-relaxed font-medium">
                                  "{lang === 'bn' ? director.quoteBn : director.quoteEn}"
                                </p>
                              </div>

                              <div className="relative mt-5 pt-4 border-t border-white/5 w-full">
                                <h4 className="font-extrabold text-white text-sm sm:text-base">
                                  {lang === 'bn' ? director.nameBn : director.nameEn}
                                </h4>
                                <p className="text-xs text-emerald-400 font-extrabold tracking-wide uppercase mt-0.5">
                                  {lang === 'bn' ? director.designationBn : director.designationEn}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress dots for Directors */}
                    {3 - visibleDirectors > 0 && (
                      <div className="flex justify-center gap-1.5 pt-1">
                        {Array.from({ length: 4 - visibleDirectors }).map((_, dIdx) => (
                          <button
                            key={dIdx}
                            onClick={() => setDirectorSlideIdx(dIdx)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              directorSlideIdx === dIdx ? 'w-8 bg-emerald-600' : 'w-2 bg-gray-200 hover:bg-gray-300'
                            }`}
                            aria-label={`Go to slide ${dIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* TEACHER PANEL (শিক্ষকমণ্ডলী) */}
                  <div className="space-y-8 pt-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <div className="text-center sm:text-left">
                        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          {lang === 'bn' ? 'আমাদের শিক্ষকমণ্ডলী' : 'Our Academic Staff'}
                        </span>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
                          {lang === 'bn' ? 'শিক্ষক প্যানেল' : 'Academic Teacher Panel'}
                        </h3>
                      </div>

                      {/* Slider Navigation Controls */}
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setTeacherSlideIdx((prev) => (prev <= 0 ? Math.max(0, 7 - visibleTeachers) : prev - 1))}
                          className="p-2 rounded-full border border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer shadow-3xs"
                          aria-label="Previous Teacher"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setTeacherSlideIdx((prev) => (prev >= Math.max(0, 7 - visibleTeachers) ? 0 : prev + 1))}
                          className="p-2 rounded-full border border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer shadow-3xs"
                          aria-label="Next Teacher"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Premium Dark Emerald background matching Director Panel Slider */}
                    <div className="relative bg-emerald-950 text-white rounded-3xl overflow-hidden shadow-lg border border-emerald-900/50 p-6 sm:p-10">
                      {/* Decorative Background Accents */}
                      <div className="absolute inset-0 bg-radial-gradient from-emerald-900/40 via-transparent to-transparent opacity-50 pointer-events-none" />
                      <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-800/10 blur-2xl pointer-events-none" />
                      <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-emerald-800/10 blur-2xl pointer-events-none" />

                      {/* Sliding Viewport */}
                      <div className="overflow-hidden w-full relative">
                        <div
                          className="flex transition-transform duration-500 ease-out"
                          style={{
                            transform: `translateX(-${teacherSlideIdx * (100 / visibleTeachers)}%)`,
                          }}
                        >
                          {extendedTeachersList.map((teacher) => (
                            <div
                              key={teacher.id}
                              className={`shrink-0 px-3 transition-all duration-300 ${
                                visibleTeachers === 4 ? 'w-1/4' : visibleTeachers === 3 ? 'w-1/3' : visibleTeachers === 2 ? 'w-1/2' : 'w-full'
                              }`}
                            >
                              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:shadow-lg hover:bg-white/10 hover:border-emerald-500/30 transition-all text-left flex flex-col justify-between h-full min-h-[190px] group">
                                <div className="p-5 flex items-center gap-4">
                                  <div className="relative shrink-0">
                                    <div className="absolute -inset-1 bg-emerald-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xs pointer-events-none" />
                                    <img
                                      src={teacher.image}
                                      alt={lang === 'bn' ? teacher.nameBn : teacher.nameEn}
                                      className="relative h-16 w-16 object-cover rounded-xl border border-white/10 bg-slate-900"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors">
                                      {lang === 'bn' ? teacher.nameBn : teacher.nameEn}
                                    </h4>
                                    <p className="text-xs font-bold text-emerald-100/75">
                                      {lang === 'bn' ? teacher.designationBn : teacher.designationEn}
                                    </p>
                                    <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-400/20">
                                      {lang === 'bn' ? teacher.subjectBn : teacher.subjectEn}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="bg-emerald-950/40 px-5 py-3.5 border-t border-white/5 flex justify-between items-center mt-auto">
                                  <span className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-wider">ID: {teacher.id}</span>
                                  <span className="text-[10px] text-emerald-400 font-extrabold hover:underline cursor-pointer flex items-center gap-0.5">
                                    {lang === 'bn' ? 'বিস্তারিত প্রোফাইল' : 'Full Profile'}
                                    <ArrowRight className="h-3 w-3" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress dots for Teachers */}
                    {7 - visibleTeachers > 0 && (
                      <div className="flex justify-center gap-1.5 pt-1">
                        {Array.from({ length: 8 - visibleTeachers }).map((_, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => setTeacherSlideIdx(tIdx)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              teacherSlideIdx === tIdx ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200 hover:bg-gray-300'
                            }`}
                            aria-label={`Go to slide ${tIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>
                )}

                {/* 7. Facilities block */}
                <div className="space-y-8 pt-6">
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full border border-slate-300">
                      {lang === 'bn' ? 'কেন আমরা সেরা?' : 'Why SCMS?'}
                    </span>
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-3">
                      {lang === 'bn' ? 'আমাদের আধুনিক সুযোগ-সুবিধা ও ক্যাম্পাস বৈশিষ্ট্য' : 'Modern Campus Facilities & Features'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs text-center space-y-3">
                      <div className="h-11 w-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
                        <BookOpen className="h-5.5 w-5.5" />
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-base">{lang === 'bn' ? 'স্মার্ট ও মাল্টিমিডিয়া ক্লাসরুম' : 'Fully AC Smart Classrooms'}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        {lang === 'bn' ? 'শ্রেণীকক্ষগুলো শীতাতপ নিয়ন্ত্রিত এবং পাঠদানের জন্য মাল্টিমিডিয়া প্রজেক্টর সমৃদ্ধ।' : 'All classrooms are air-conditioned and fitted with digital projection, ensuring quality visuals.'}
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs text-center space-y-3">
                      <div className="h-11 w-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                        <Sparkles className="h-5.5 w-5.5" />
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-base">{lang === 'bn' ? 'সমৃদ্ধ বিজ্ঞান ও কম্পিউটার ল্যাব' : 'Physics, Chemistry & ICT Labs'}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        {lang === 'bn' ? 'হাতে-কলমে পরীক্ষা নিরীক্ষার জন্য আমাদের রয়েছে আধুনিক রসায়ন, পদার্থ এবং আইসিটি কম্পিউটার ল্যাব।' : 'Hands-on experiments with computer labs, high-tech chemistry instruments, and science tools.'}
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs text-center space-y-3">
                      <div className="h-11 w-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto">
                        <Calendar className="h-5.5 w-5.5" />
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-base">{lang === 'bn' ? 'খেলার মাঠ ও সাংস্কৃতিক সহশিক্ষা' : 'Extensive Playgrounds & Cultural Club'}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        {lang === 'bn' ? 'নিয়মিত শারীরিকচর্চা, ফুটবল টুর্নামেন্ট, বার্ষিক মেলা এবং সাংস্কৃতিক ক্লাবের মাধ্যমে মেধার বিকাশ।' : 'Coached sports leagues, secure fenced playground, and cultural club activities.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7.1. Masterpiece Student Section */}
                <div id="brilliant-students-section" className="space-y-8 pt-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-wider uppercase">
                        {lang === 'bn' ? 'অসাধারণ কৃতী শিক্ষার্থী' : 'Masterpiece Student'}
                      </h3>
                      <p className="text-xs text-gray-400 font-bold mt-1">
                        {lang === 'bn' ? 'আমাদের অত্যন্ত প্রতিভাবান কৃতী শিক্ষার্থীবৃন্দ' : 'Our highly talented star students and achievers'}
                      </p>
                    </div>
                    
                    {/* Sliding Navigation Controls */}
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => setStudentSlideIdx((prev) => (prev <= 0 ? Math.max(0, 4 - visibleStudents) : prev - 1))}
                        className="p-2 rounded-full border border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer shadow-3xs"
                        aria-label="Previous Student"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setStudentSlideIdx((prev) => (prev >= Math.max(0, 4 - visibleStudents) ? 0 : prev + 1))}
                        className="p-2 rounded-full border border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer shadow-3xs"
                        aria-label="Next Student"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Viewport */}
                  <div className="overflow-hidden w-full relative py-2">
                    <div 
                      className="flex transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${studentSlideIdx * (100 / visibleStudents)}%)`
                      }}
                    >
                      {[
                        {
                          name: "Sumaiya Aktar",
                          nameBn: "সুমাইয়া আক্তার",
                          achievement: "Talent Pool - JSC",
                          achievementBn: "ট্যালেন্টপুল - জেএসসি",
                          image: studentSumaiya
                        },
                        {
                          name: "Tanvir Rahman",
                          nameBn: "তানভীর রহমান",
                          achievement: "GPA 5.00 - SSC 2024",
                          achievementBn: "জিপিএ ৫.০০ - এসএসসি ২০২৪",
                          image: studentTanvir
                        },
                        {
                          name: "Mitu Khatun",
                          nameBn: "মিতু খাতুন",
                          achievement: "Sub-Captain - Class 9",
                          achievementBn: "সাব-ক্যাপ্টেন - ৯ম শ্রেণী",
                          image: studentMitu
                        },
                        {
                          name: "Rashed Hossain",
                          nameBn: "রাশেদ হোসেন",
                          achievement: "GPA 5.00 - SSC 2025",
                          achievementBn: "জিপিএ ৫.০০ - এসএসসি ২০২৫",
                          image: studentRashed
                        }
                      ].map((st, idx) => (
                        <div
                          key={st.name}
                          className={`shrink-0 px-3 transition-all duration-300 ${
                            visibleStudents === 4 ? 'w-1/4' : visibleStudents === 3 ? 'w-1/3' : visibleStudents === 2 ? 'w-1/2' : 'w-full'
                          }`}
                        >
                          <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white border border-gray-200/80 rounded-3xl p-6 text-center flex flex-col items-center justify-between shadow-xs hover:shadow-md transition-all border-b-4 border-b-transparent hover:border-b-blue-500 h-full min-h-[240px]"
                          >
                            {/* Circle student headshot */}
                            <div className="relative w-28 h-28 mb-4">
                              <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-105" />
                              <img
                                src={st.image}
                                alt={st.name}
                                className="w-full h-full object-cover rounded-full border-4 border-white shadow-sm bg-slate-50"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="space-y-1.5 mt-auto">
                              <h4 className="font-extrabold text-gray-900 text-sm">
                                {lang === 'bn' ? st.nameBn : st.name}
                              </h4>
                              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-full border border-emerald-100">
                                {lang === 'bn' ? st.achievementBn : st.achievement}
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tiny progress dots */}
                  {4 - visibleStudents > 0 && (
                    <div className="flex justify-center gap-1.5 pt-1">
                      {Array.from({ length: 5 - visibleStudents }).map((_, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => setStudentSlideIdx(sIdx)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            studentSlideIdx === sIdx ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200 hover:bg-gray-300'
                          }`}
                          aria-label={`Go to slide ${sIdx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {directorPanelPosition === 4 && renderGoverningBodySection()}

                {/* 7.2. Blog Section */}
                <div className="space-y-8 pt-8">
                  <div className="text-center relative">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-wider uppercase">
                      {lang === 'bn' ? 'ব্লগ ও খবর' : 'BLOG'}
                    </h3>
                    <div className="h-1 w-16 bg-emerald-600 mx-auto mt-2 rounded-full"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {[
                      {
                        id: "blog-1",
                        titleBn: "শিক্ষাঙ্গনে আলো ছড়াচ্ছে নতুন কার্যক্রমসমূহ",
                        titleEn: "New Activities Spreading Light of Education",
                        descBn: "স্টুডেন্টস কেয়ার মডেল স্কুলের আধুনিকায়ন এবং নতুন পাঠ্যক্রমের চমৎকার বিবরণী যা আমাদের শিক্ষাদানকে করেছে আনন্দময় ও আকর্ষণীয়।",
                        descEn: "Details of modernization and unique curricula making teaching at SCMS delightful.",
                        image: bannerImage,
                        date: "০৫ জুলাই, ২০২৬",
                        author: "ইমরান হোসেন"
                      },
                      {
                        id: "blog-2",
                        titleBn: "ডিজিটাল ক্লাসরুম: ভবিষ্যতের শিক্ষা",
                        titleEn: "Digital Classroom: Education of Future",
                        descBn: "উন্নত মাল্টিমিডিয়া প্রজেক্টর ও অত্যাধুনিক কম্পিউটার ল্যাবের মাধ্যমে শিক্ষার্থীদের বাস্তবমুখী প্রযুক্তিভিত্তিক শিক্ষা সেশন।",
                        descEn: "Hands-on technological session for students using advanced projectors and computer labs.",
                        image: labImage,
                        date: "২৮ জুন, ২০২৬",
                        author: "শামীমা সুলতানা"
                      },
                      {
                        id: "blog-3",
                        titleBn: "বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬",
                        titleEn: "Annual Sports Competition 2026",
                        descBn: "বিদ্যালয়ের বিশাল মাঠ প্রাঙ্গণে উৎসবমুখর পরিবেশে সম্পন্ন হল বার্ষিক ক্রীড়া প্রতিযোগিতা ও আকর্ষণীয় সাংস্কৃতিক অনুষ্ঠান ২০২৬।",
                        descEn: "Colorful celebration of sports activities and games with prize distribution.",
                        image: blogBasketball,
                        date: "১৫ মে, ২০২৬",
                        author: "আব্দুল হাই"
                      }
                    ].map((blog) => (
                      <div
                        key={blog.id}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-video overflow-hidden bg-gray-100">
                            <img
                              src={blog.image}
                              alt={blog.titleBn}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-3 left-3 bg-slate-900/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {blog.date}
                            </div>
                          </div>
                          <div className="p-5 space-y-2">
                            <h4 className="font-extrabold text-[#0f172a] text-sm group-hover:text-emerald-600 transition-colors leading-snug">
                              {lang === 'bn' ? blog.titleBn : blog.titleEn}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 font-semibold">
                              {lang === 'bn' ? blog.descBn : blog.descEn}
                            </p>
                          </div>
                        </div>
                        <div className="p-5 pt-0 border-t border-gray-50 flex justify-between items-center bg-slate-50/40">
                          <span className="text-[10px] text-gray-400 font-bold">{lang === 'bn' ? `লেখক: ${blog.author}` : `By: ${blog.author}`}</span>
                          <span 
                            onClick={() => {
                              alert(lang === 'bn' ? `${blog.titleBn}\n\n${blog.descBn}` : `${blog.titleEn}\n\n${blog.descEn}`);
                            }}
                            className="text-xs text-red-600 hover:text-red-700 font-extrabold cursor-pointer flex items-center gap-0.5"
                          >
                            {lang === 'bn' ? 'বিস্তারিত...' : 'Read More...'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7.3. Interactive Bottom Widgets (Suggestion Box & Homework Upload side-by-side) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
                  
                  {/* Left: Suggestion Box */}
                  <div className="bg-white border border-gray-200/90 p-6 sm:p-8 rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="text-center mb-6">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-extrabold rounded-full border border-blue-100">
                          <Heart className="h-3 w-3 text-red-500" />
                          {lang === 'bn' ? 'আপনার মতামত আমাদের জন্য গুরুত্বপূর্ণ' : 'Your Opinion Matters'}
                        </span>
                        <h4 className="text-xl font-extrabold text-gray-900 mt-2">
                          {lang === 'bn' ? 'পরামর্শ বক্স' : 'Suggestion Box'}
                        </h4>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">
                          {lang === 'bn' ? 'প্রতিষ্ঠানকে সুচারুভাবে চালাতে পরামর্শ পাঠান' : 'Help us improve the institution'}
                        </p>
                      </div>

                      {suggestionSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2 my-6"
                        >
                          <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                          <h5 className="font-extrabold text-sm">{lang === 'bn' ? 'পরামর্শটি সফলভাবে পাঠানো হয়েছে!' : 'Submitted Successfully!'}</h5>
                          <p className="text-xs text-emerald-600 font-semibold">{lang === 'bn' ? 'আপনার মূল্যবান পরামর্শের জন্য আপনাকে ধন্যবাদ।' : 'Thank you for your valuable feedback.'}</p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                          <div>
                            <input
                              type="text"
                              value={suggestionForm.name}
                              onChange={(e) => setSuggestionForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder={lang === 'bn' ? 'আপনার নাম লিখুন...' : 'Enter your name...'}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold"
                            />
                          </div>
                          <div>
                            <textarea
                              rows={4}
                              value={suggestionForm.suggestion}
                              onChange={(e) => setSuggestionForm(prev => ({ ...prev, suggestion: e.target.value }))}
                              placeholder={lang === 'bn' ? 'এসে আপনার মতামত লিখুন...' : 'Write your suggestion here...'}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold"
                              required
                            />
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                            <span>0/500</span>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                            >
                              {lang === 'bn' ? 'পাঠান' : 'Send'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Right: Homework Upload Form */}
                  <div className="bg-white border border-gray-200/90 p-6 sm:p-8 rounded-3xl shadow-xs space-y-4">
                    <div className="text-center mb-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 text-[11px] font-extrabold rounded-full border border-amber-100">
                        <BookOpen className="h-3 w-3 text-amber-500" />
                        {lang === 'bn' ? 'সহজে সাবমিট করুন বাড়ির কাজ' : 'Submit Homework Easily'}
                      </span>
                      <h4 className="text-xl font-extrabold text-gray-900 mt-2">
                        {lang === 'bn' ? '📚 বাড়ির কাজ জমা দিন (Homework Upload)' : 'Homework Upload Form'}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">
                        {lang === 'bn' ? 'আপনার বাড়ির কাজ ফাইল সহ আপলোড করুন' : 'Upload homework file with note'}
                      </p>
                    </div>

                    {homeworkSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2"
                      >
                        <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                        <h5 className="font-extrabold text-sm">{lang === 'bn' ? 'বাড়ির কাজ সফলভাবে জমা দেওয়া হয়েছে!' : 'Homework Submitted Successfully!'}</h5>
                        <p className="text-xs text-emerald-600 font-semibold">{lang === 'bn' ? 'শিক্ষক শিগগিরই আপনার কাজ পর্যালোচনা করবেন।' : 'Your teacher will review your homework shortly.'}</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleHomeworkSubmit} className="space-y-4 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">{lang === 'bn' ? 'ছাত্র/ছাত্রীর নাম' : 'Student Name'}</label>
                            <input
                              type="text"
                              value={homeworkForm.studentName}
                              onChange={(e) => setHomeworkForm(prev => ({ ...prev, studentName: e.target.value }))}
                              placeholder={lang === 'bn' ? 'নাম লিখুন...' : 'Enter name...'}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">{lang === 'bn' ? 'রোল নম্বর' : 'Roll Number'}</label>
                            <input
                              type="text"
                              value={homeworkForm.rollNo}
                              onChange={(e) => setHomeworkForm(prev => ({ ...prev, rollNo: e.target.value }))}
                              placeholder={lang === 'bn' ? 'উদা. ১২' : 'e.g., 12'}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">{lang === 'bn' ? 'শ্রেণি নির্বাচন করুন' : 'Select Class'}</label>
                            <select
                              value={homeworkForm.studentClass}
                              onChange={(e) => setHomeworkForm(prev => ({ ...prev, studentClass: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold cursor-pointer"
                              required
                            >
                              <option value="">{lang === 'bn' ? '-- শ্রেণি নির্বাচন করুন --' : '-- Select Class --'}</option>
                              {["Play", "Nursery", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">{lang === 'bn' ? 'সেকশন' : 'Section'}</label>
                            <input
                              type="text"
                              value={homeworkForm.section}
                              onChange={(e) => setHomeworkForm(prev => ({ ...prev, section: e.target.value }))}
                              placeholder={lang === 'bn' ? 'উদা. এ (A)' : 'e.g., A'}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">{lang === 'bn' ? 'মোবাইল নং' : 'Mobile Number'}</label>
                            <input
                              type="tel"
                              value={homeworkForm.phone}
                              onChange={(e) => setHomeworkForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder={lang === 'bn' ? 'উদা. ০১৮...' : 'e.g., 018...'}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">{lang === 'bn' ? 'বিষয় (Subject)' : 'Subject'}</label>
                            <input
                              type="text"
                              value={homeworkForm.subject}
                              onChange={(e) => setHomeworkForm(prev => ({ ...prev, subject: e.target.value }))}
                              placeholder={lang === 'bn' ? 'উদা. গণিত' : 'e.g., Mathematics'}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">{lang === 'bn' ? 'বার্তা / Note' : 'Message / Note'}</label>
                          <textarea
                            rows={2}
                            value={homeworkForm.note}
                            onChange={(e) => setHomeworkForm(prev => ({ ...prev, note: e.target.value }))}
                            placeholder={lang === 'bn' ? 'বার্তা / Note...' : 'Message / Note...'}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-gray-800 font-semibold"
                          />
                        </div>

                        {/* File Upload selection mock */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">{lang === 'bn' ? 'ফাইল সংযুক্ত করুন' : 'Attach File'}</label>
                          <div className="flex items-center gap-3">
                            <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-extrabold cursor-pointer transition-all border border-gray-200">
                              {lang === 'bn' ? 'ফাইল নির্বাচন করুন' : 'Choose File'}
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setHomeworkForm(prev => ({ ...prev, fileName: file.name }));
                                  }
                                }}
                              />
                            </label>
                            <span className="text-xs text-gray-400 truncate max-w-[200px] font-semibold">
                              {homeworkForm.fileName || (lang === 'bn' ? 'কোন ফাইল নির্বাচন করা হয়নি' : 'No file selected')}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 text-right">
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                          >
                            {lang === 'bn' ? 'জমা দিন' : 'Submit'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                </div>

              </div>

              {/* Institutions History Interactive Pop-up Modal */}
              <AnimatePresence>
                {isHistoryExpanded && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsHistoryExpanded(false)}
                      className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                    />

                    {/* Modal Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 z-10 flex flex-col max-h-[90vh] text-left"
                    >
                      {/* Dark blue modal header */}
                      <div className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-emerald-400" />
                          <span className="font-extrabold text-sm sm:text-base">প্রতিষ্ঠানের ইতিহাস (বিস্তারিত বিবরণী)</span>
                        </div>
                        <button
                          onClick={() => setIsHistoryExpanded(false)}
                          className="text-gray-400 hover:text-white transition-colors text-lg font-bold cursor-pointer h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Content body */}
                      <div className="p-6 overflow-y-auto space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                        <img
                          src={bannerImage}
                          alt="Detailed banner view"
                          className="w-full h-48 object-cover rounded-2xl mb-4 border border-gray-150"
                          referrerPolicy="no-referrer"
                        />
                        <p>
                          চট্টগ্রাম জেলার কর্ণফুলী উপজেলার চরলক্ষ্যা ইউনিয়নের বুকে শিক্ষার আলো ছড়িয়ে দেওয়ার এক মহান ব্রত নিয়ে <strong className="text-gray-900">২০১৮ সালে</strong> প্রতিষ্ঠিত হয় <strong className="text-gray-900">স্টুডেন্টস কেয়ার মডেল স্কুল</strong>। চরলক্ষ্যা ও এর আশেপাশের অঞ্চলের শিক্ষার্থীদের জন্য একটি আধুনিক, নৈতিক এবং মানসম্মত শিক্ষার পরিবেশ নিশ্চিত করার লক্ষ্যেই এই শিক্ষাপ্রতিষ্ঠানটির যাত্রা শুরু হয়েছিল। এলাকার সন্তানদের সুশিক্ষায় শিক্ষিত করে আদর্শ নাগরিক হিসেবে গড়ে তোলাই ছিল এর মূল প্রেরণা।
                        </p>
                        <p>
                          ২০১৮ সালে একঝাঁক অভিজ্ঞ, মেধাবী ও নিবেদিতপ্রাণ শিক্ষকের ঐকান্তিক প্রচেষ্টায় এই শিক্ষালয়ের কার্যক্রম আনুষ্ঠানিকভাবে শুরু হয়। বিদ্যালয়টি শুরু থেকেই শিক্ষার্থীদের শুধুমাত্র পুথিগত বিদ্যাতেই সীমাবদ্ধ না রেখে বাস্তবভিত্তিক ও নৈতিক শিক্ষার চর্চা শুরু করে। আধুনিক প্রযুক্তির ছোঁয়ায় আমাদের প্রতিটি শ্রেণীকক্ষ ও ল্যাব সুসজ্জিত করা হয়েছে।
                        </p>
                        <p>
                          আমাদের প্রধান লক্ষ্য হচ্ছে জ্ঞানমুখী শিক্ষার পাশাপাশি শিক্ষার্থীদের মানবিক মূল্যবোধের বিকাশ ঘটানো। পড়ালেখার পাশাপাশি খেলাধুলা, বিতর্ক প্রতিযোগিতা, সাংস্কৃতিক অনুষ্ঠান এবং মেধা অন্বেষণমূলক কার্যকলাপে শিক্ষার্থীদের নিয়মিত যুক্ত করা হয়। যার ফলশ্রুতিতে প্রতি বছর আমরা শতভাগ পাশের হার ও চট্টগ্রাম শিক্ষাবোর্ডের অধীনে অসাধারণ সাফল্য অর্জন করে চলেছি।
                        </p>
                      </div>

                      {/* Modal Footer */}
                      <div className="border-t border-gray-100 px-6 py-4 flex justify-end bg-gray-50">
                        <button
                          onClick={() => setIsHistoryExpanded(false)}
                          className="px-5 py-2 bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl cursor-pointer transition-colors"
                        >
                          বন্ধ করুন
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Headmaster Speech Modal */}
              <AnimatePresence>
                {isHmSpeechExpanded && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsHmSpeechExpanded(false)}
                      className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                    />

                    {/* Modal Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 z-10 flex flex-col max-h-[90vh] text-left"
                    >
                      {/* Modal header */}
                      <div className="bg-[#025644] text-white px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-emerald-400" />
                          <span className="font-extrabold text-sm sm:text-base">
                            {lang === 'bn' ? 'প্রধান শিক্ষকের বাণী' : "Headmaster's Message"}
                          </span>
                        </div>
                        <button
                          onClick={() => setIsHmSpeechExpanded(false)}
                          className="text-white hover:text-gray-200 transition-colors text-lg font-bold cursor-pointer h-8 w-8 rounded-full bg-[#01352a] flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Content body */}
                      <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed font-semibold">
                        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-gray-100 pb-5">
                          <div className="h-24 w-24 bg-[#dbeafe] text-[#2563eb] rounded-2xl overflow-hidden shrink-0 border border-blue-150 shadow-xs flex items-center justify-center">
                            {frontendData?.speech?.headmasterPhoto ? (
                              <img src={frontendData?.speech?.headmasterPhoto} alt="Headmaster" className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-10 w-10 text-[#2563eb]" />
                            )}
                          </div>
                          <div className="text-center sm:text-left">
                            <h4 className="font-extrabold text-[#0f172a] text-lg sm:text-xl">
                              {lang === 'bn' ? (frontendData?.speech?.speakerNameBn || t.headmasterName) : (frontendData?.speech?.speakerNameEn || 'Morshed Nur')}
                            </h4>
                            <p className="text-xs sm:text-sm text-emerald-600 font-bold mt-1">
                              {lang === 'bn' ? (frontendData?.speech?.designationBn || t.headmasterDesig) : (frontendData?.speech?.designationEn || 'Headmaster')}
                            </p>
                          </div>
                        </div>

                        <div className="whitespace-pre-line text-slate-600 leading-relaxed font-semibold">
                          {lang === 'bn' ? (frontendData?.speech?.contentBn || t.headmasterText) : (frontendData?.speech?.contentEn || t.headmasterText)}
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="border-t border-gray-100 px-6 py-4 flex justify-end bg-gray-50">
                        <button
                          onClick={() => setIsHmSpeechExpanded(false)}
                          className="px-5 py-2 bg-[#025644] hover:bg-[#01352a] text-white font-extrabold text-sm rounded-xl cursor-pointer transition-colors"
                        >
                          {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Assistant Headmaster Speech Modal */}
              <AnimatePresence>
                {isAhmSpeechExpanded && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsAhmSpeechExpanded(false)}
                      className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                    />

                    {/* Modal Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 z-10 flex flex-col max-h-[90vh] text-left"
                    >
                      {/* Modal header */}
                      <div className="bg-[#1e3a8a] text-white px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-emerald-400" />
                          <span className="font-extrabold text-sm sm:text-base">
                            {lang === 'bn' ? 'সহকারী প্রধান শিক্ষকের বাণী' : "Assistant Headmaster's Message"}
                          </span>
                        </div>
                        <button
                          onClick={() => setIsAhmSpeechExpanded(false)}
                          className="text-white hover:text-gray-200 transition-colors text-lg font-bold cursor-pointer h-8 w-8 rounded-full bg-[#172554] flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Content body */}
                      <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed font-semibold">
                        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-gray-100 pb-5">
                          <div className="h-24 w-24 bg-[#dbeafe] text-[#2563eb] rounded-2xl overflow-hidden shrink-0 border border-blue-150 shadow-xs flex items-center justify-center">
                            {frontendData?.speech?.asstHeadmasterPhoto ? (
                              <img src={frontendData?.speech?.asstHeadmasterPhoto} alt="Asst Headmaster" className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-10 w-10 text-[#2563eb]" />
                            )}
                          </div>
                          <div className="text-center sm:text-left">
                            <h4 className="font-extrabold text-[#0f172a] text-lg sm:text-xl">
                              {lang === 'bn' ? (frontendData?.speech?.asstSpeakerNameBn || t.asstHeadmasterName) : (frontendData?.speech?.asstSpeakerNameEn || 'Md. Toyub Hosen')}
                            </h4>
                            <p className="text-xs sm:text-sm text-blue-600 font-bold mt-1">
                              {lang === 'bn' ? (frontendData?.speech?.asstDesignationBn || t.asstHeadmasterDesig) : (frontendData?.speech?.asstDesignationEn || 'Assistant Headmaster')}
                            </p>
                          </div>
                        </div>

                        <div className="whitespace-pre-line text-slate-600 leading-relaxed font-semibold">
                          {lang === 'bn' ? (frontendData?.speech?.asstContentBn || t.asstHeadmasterText) : (frontendData?.speech?.asstContentEn || t.asstHeadmasterText)}
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="border-t border-gray-100 px-6 py-4 flex justify-end bg-gray-50">
                        <button
                          onClick={() => setIsAhmSpeechExpanded(false)}
                          className="px-5 py-2 bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold text-sm rounded-xl cursor-pointer transition-colors"
                        >
                          {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Notice Detail Modal for Home View Slider */}
              <AnimatePresence>
                {homeSelectedNotice && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setHomeSelectedNotice(null)}
                      className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                    />

                    {/* Modal Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 z-10 flex flex-col text-left"
                    >
                      {/* Accent Header */}
                      <div className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-emerald-400" />
                          <span className="font-extrabold text-sm sm:text-base">
                            {lang === 'bn' ? 'ঘোষণা ও নোটিশ' : 'Announcement Notice'}
                          </span>
                        </div>
                        <button
                          onClick={() => setHomeSelectedNotice(null)}
                          className="text-gray-400 hover:text-white transition-colors text-lg font-bold cursor-pointer h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Content */}
                      <div className="p-6 sm:p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="flex flex-wrap items-center gap-2">
                          {homeSelectedNotice.urgent && (
                            <span className="flex items-center gap-1 bg-rose-50 text-rose-600 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-wider animate-pulse">
                              <AlertCircle className="h-3 w-3" /> {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                            </span>
                          )}
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border bg-blue-50 text-blue-700 border-blue-100">
                            {homeSelectedNotice.category}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug">
                          {homeSelectedNotice.title}
                        </h3>

                        {/* Date and Author info */}
                        <div className="flex flex-wrap gap-4 text-[11px] text-gray-400 border-y border-gray-50 py-2.5 font-bold uppercase">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {lang === 'bn' ? 'প্রকাশের তারিখ' : 'Published Date'}: {homeSelectedNotice.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {lang === 'bn' ? 'কর্তৃপক্ষ' : 'Authority'}: {homeSelectedNotice.author}
                          </span>
                        </div>

                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-semibold whitespace-pre-line">
                          {homeSelectedNotice.content}
                        </p>
                      </div>

                      {/* Modal Footer */}
                      <div className="border-t border-gray-150 px-6 py-4 flex justify-between items-center bg-slate-50/50">
                        <button
                          onClick={() => {
                            setHomeSelectedNotice(null);
                            setActiveTab('notices');
                          }}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-extrabold flex items-center gap-0.5 cursor-pointer"
                        >
                          {lang === 'bn' ? 'সব নোটিশ বোর্ডে দেখুন' : 'View all notices'} <ArrowRight className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setHomeSelectedNotice(null)}
                          className="px-5 py-2 bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                        >
                          {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ==================== ACADEMICS VIEW ==================== */}
          {activeTab === 'academics' && (
            <motion.div
              key="academics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-left"
            >
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {lang === 'bn' ? 'শিক্ষাদানের রূপরেখা' : 'Academic Outlines'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
                  {lang === 'bn' ? 'আমাদের শিক্ষাদান বিভাগ ও পাঠ্যক্রমসমূহ' : 'Academic Divisions & Curriculums'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {lang === 'bn' ? 'প্লে থেকে এসএসসি লেভেল পর্যন্ত সাজানো আমাদের বিশেষ শিক্ষাদান পদ্ধতি জানুন।' : 'Explore our programs customized carefully for Nursery up to HSC College levels'}
                </p>
              </div>

              {/* Programs Details Stack */}
              <div className="space-y-10">
                {academicPrograms.map((prog, index) => {
                  const isBn = lang === 'bn';
                  const gradesText = isBn 
                    ? (prog.grades.includes("Nursery") ? "নার্সারি থেকে ৫ম শ্রেণী" : prog.grades.includes("Class VI") ? "৬ষ্ঠ থেকে ১০ম শ্রেণী" : "১১শ ও ১২শ শ্রেণী")
                    : prog.grades;

                  const levelText = isBn
                    ? (prog.level.includes("Primary") ? "প্রাথমিক শাখা (নার্সারি - ৫ম শ্রেণী)" : prog.level.includes("Secondary") ? "মাধ্যমিক শাখা (৬ষ্ঠ - ১০ম শ্রেণী)" : "উচ্চ মাধ্যমিক শাখা (১১শ - ১২শ শ্রেণী)")
                    : prog.level;

                  const descText = isBn
                    ? (prog.level.includes("Primary") 
                        ? "একটি যত্নশীল ও ক্রীড়াময় শিক্ষণ পরিবেশ যা শিশুর বুদ্ধিবৃত্তিক বিকাশ, প্রাথমিক শিক্ষা, সংখ্যা জ্ঞান এবং সামাজিক সমন্বয়ের উপর দৃষ্টি আকর্ষণ করে।" 
                        : prog.level.includes("Secondary") 
                          ? " can transition students into deeper analytical thinking and self-discovery. Preparation for Secondary School Certificate (SSC) examinations under NCTB." 
                          : "উচ্চ মাধ্যমিক পরীক্ষার জন্য কঠোর শিক্ষায়তনিক প্রস্তুতি এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার বিশেষ গাইডলাইন ও নিবিড় ল্যাব কার্যপরিচালনা।")
                    : prog.description;

                  const coordinatorText = isBn
                    ? (prog.coordinator.includes("Shamima") ? "মিসেস শামিমা সুলতানা, এম.এড" : prog.coordinator.includes("Abdul Hye") ? "জনাব আবদুল হাই, এম.এসসি (পদার্থবিজ্ঞান)" : "ড. ফারহানা রহমান, রসায়নে পিএইচডি")
                    : prog.coordinator;

                  const subjectsList = isBn
                    ? (prog.level.includes("Primary") 
                        ? ["ইংরেজি ভাষা", "বাংলা ভাষা", "গণিত", "প্রাথমিক বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "চারু ও কারুকলা", "নৈতিক শিক্ষা"]
                        : prog.level.includes("Secondary")
                          ? ["বাংলা সাহিত্য ও ব্যাকরণ", "ইংরেজি সাহিত্য ও রচনা", "সাধারণ গণিত", "উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "হিসাববিজ্ঞান", "ব্যবসায় উদ্যোগ", "আইসিটি"]
                          : ["বাংলা", "ইংরেজি", "আইসিটি", "পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত", "জীববিজ্ঞান", "হিসাববিজ্ঞান"])
                    : prog.subjects;

                  const activitiesList = isBn
                    ? (prog.level.includes("Primary") 
                        ? ["বানান প্রতিযোগিতা", "গল্প বলা", "চিত্রাঙ্কন ক্লাব", "যোগব্যায়াম", "সঙ্গীত ক্লাস"]
                        : prog.level.includes("Secondary")
                          ? ["বিজ্ঞান ও রোবোটিক্স ক্লাব", "ডিবেটিং সোসাইটি", "স্কাউটস ও গার্লস গাইড", "স্কুল ব্যান্ড", "ফুটবল ও ক্রিকেট টিম"]
                          : ["এইচএসসি বুস্টার সেশন", "অলিম্পিয়াড প্রোগ্রামিং গ্রুপ", "মডেল ইউনাইটেড নেশনস (MUN)", "সমাজসেবা ক্লাব"])
                    : prog.activities;

                  return (
                    <div
                      id={`academic-prog-${index}`}
                      key={index}
                      className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left"
                    >
                      <div className="lg:col-span-5 space-y-4">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                          {gradesText}
                        </span>
                        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{levelText}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-semibold">{descText}</p>
                        <div className="pt-2 text-xs text-gray-400 font-bold uppercase">
                          {lang === 'bn' ? 'সমন্বয়ক:' : 'Coordinator:'} <span className="text-gray-700">{coordinatorText}</span>
                        </div>
                      </div>

                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-gray-100/60 text-left">
                        <div>
                          <h4 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <BookOpen className="h-4.5 w-4.5 text-emerald-600" /> {lang === 'bn' ? 'মূল পাঠ্যক্রমসমূহ' : 'Core Syllabus Courses'}
                          </h4>
                          <ul className="space-y-1.5">
                            {subjectsList.map((sub, i) => (
                              <li key={i} className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {sub}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Award className="h-4.5 w-4.5 text-emerald-600" /> {lang === 'bn' ? 'সহশিক্ষা ও ল্যাব' : 'Co-Curricular & Labs'}
                          </h4>
                          <ul className="space-y-1.5">
                            {activitiesList.map((act, i) => (
                              <li key={i} className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Faculty Directory list */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{lang === 'bn' ? 'আমাদের শ্রদ্ধেয় শিক্ষকমণ্ডলী' : 'Our Respected Academic Directors'}</h3>
                  <p className="text-sm text-gray-500 mt-1">{lang === 'bn' ? 'শিক্ষার্থীদের ভবিষ্যৎ গড়তে নিবেদিতপ্রাণ বিভাগীয় প্রধান ও উপদেষ্টাবৃন্দ' : 'Meet our highly credentialed department leads and advisors'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teachers.slice(1).map((teacher) => {
                    const isBn = lang === 'bn';
                    const teacherName = isBn
                      ? (teacher.id === "T002" ? "মিসেস শামিমা সুলতানা" : teacher.id === "T003" ? "জনাব আবদুল হাই" : teacher.id === "T004" ? "ড. ফারহানা রহমান" : "জনাব রফিকুল ইসলাম")
                      : teacher.name;

                    const teacherDesig = isBn
                      ? (teacher.id === "T002" ? "সহকারী প্রধান শিক্ষিকা ও প্রাথমিক শাখা প্রধান" : teacher.id === "T003" ? "সিনিয়র শিক্ষক (পদার্থবিজ্ঞান)" : teacher.id === "T004" ? "সহকারী অধ্যাপক (রসায়ন)" : "সিনিয়র ইন্সট্রাক্টর (গণিত)")
                      : teacher.designation;

                    const teacherDept = isBn
                      ? (teacher.id === "T002" ? "প্রাথমিক বিভাগ" : teacher.id === "T003" ? "মাধ্যমিক বিভাগ" : teacher.id === "T004" ? "উচ্চ মাধ্যমিক বিভাগ" : "গণিত বিভাগ")
                      : teacher.department;

                    const teacherQual = isBn
                      ? (teacher.id === "T002" ? "এম.এড (আইইআর, ঢাবি), বি.এড" : teacher.id === "T003" ? "এম.এসসি এবং বি.এসসি (পদার্থবিজ্ঞান, জাবি)" : teacher.id === "T004" ? "রসায়নে পিএইচডি (রাবি), সাবেক গবেষক" : "এম.এসসি (ফলিত গণিত, ঢাবি)")
                      : teacher.qualification;

                    return (
                      <div id={`teacher-card-${teacher.id}`} key={teacher.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs text-center space-y-3">
                        <img
                          src={teacher.image}
                          alt={teacherName}
                          className="h-24 w-24 object-cover rounded-full mx-auto border-2 border-emerald-100 shadow-sm"
                        />
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm">{teacherName}</h4>
                          <p className="text-xs text-emerald-700 font-bold mt-0.5">{teacherDesig}</p>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1">{teacherDept}</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-normal bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-100/50 font-semibold">
                          {teacherQual}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== NOTICE BOARD VIEW ==================== */}
          {activeTab === 'notices' && (
            <motion.div
              key="notices"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
            >
              <NoticeBoard 
                lang={lang} 
                selectedNoticeFromSearch={selectedNoticeFromSearch} 
                setSelectedNoticeFromSearch={setSelectedNoticeFromSearch} 
              />
            </motion.div>
          )}

          {/* ==================== ADMISSIONS VIEW ==================== */}
          {activeTab === 'admissions' && (
            <motion.div
              key="admissions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full text-left"
            >
              <AdmissionForm lang={lang} onBack={() => setActiveTab('home')} />
            </motion.div>
          )}

          {/* ==================== GALLERY VIEW ==================== */}
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-left">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    {lang === 'bn' ? 'ক্যাম্পাস লাইফ' : 'Campus Life'}
                  </span>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
                    {lang === 'bn' ? 'ফটো ও চিত্র গ্যালারি' : 'SCMS Photo Gallery'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {lang === 'bn' ? 'সাংস্কৃতিক অনুষ্ঠান, বার্ষিক ক্রীড়া প্রতিযোগিতা এবং ল্যাব সেশনের কিছু স্মরণীয় মুহূর্ত।' : 'Glimpses of cultural events, sports leagues, and lab activities'}
                  </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
                  {galleryCategories.map((cat) => {
                    const catLabel = lang === 'bn'
                      ? (cat === 'All' ? 'সব চিত্র' : cat === 'Academic' ? 'শিক্ষাদানের তথ্য' : cat === 'Lab' ? 'ল্যাব কার্যক্রম' : cat === 'Sports' ? 'ক্রীড়াক্ষেত্র' : 'সাংস্কৃতিক')
                      : cat;
                    return (
                      <button
                        id={`gallery-filter-${cat}`}
                        key={cat}
                        onClick={() => setGalleryFilter(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          galleryFilter === cat
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {catLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => {
                  const isBn = lang === 'bn';
                  const title = isBn
                    ? (item.id === "G001" ? "আন্তর্জাতিক মাতৃভাষা দিবস উদযাপন" : item.id === "G002" ? "বিজ্ঞান ও প্রযুক্তি মেলা" : item.id === "G003" ? "বার্ষিক ক্রীড়া প্রতিযোগিতা" : item.id === "G004" ? "পদার্থবিজ্ঞান ল্যাব সেশন" : item.id === "G005" ? "বার্ষিক পুরস্কার বিতরণী" : "আইসিটি কম্পিউটার ল্যাব")
                    : item.title;

                  const description = isBn
                    ? (item.id === "G001" ? "২১শে ফেব্রুয়ারিতে নির্মিত শহীদ মিনারে ভাষা শহীদদের প্রতি বিনম্র শ্রদ্ধা নিবেদন।" : item.id === "G002" ? "বিজ্ঞান মেলায় শিক্ষার্থীদের তৈরি পরিবেশ-বান্ধব সোলার গ্রিড প্রজেক্ট প্রদর্শন।" : item.id === "G003" ? "বার্ষিক ক্রীড়া প্রতিযোগিতার ১০০ মিটার দৌড় প্রতিযোগিতার রোমাঞ্চকর মুহূর্ত।" : item.id === "G004" ? "পদার্থবিজ্ঞান গবেষণাগারে অপটিক্যাল বেঞ্চ ব্যবহার করে শিক্ষার্থীদের পরীক্ষা-নিয়ন্ত্রণ।" : item.id === "G005" ? "শ্রেণীতে কৃতিত্ব অর্জনকারী ও সহশিক্ষা বিজয়ীদের হাতে ট্রফি তুলে দিচ্ছেন অতিথিবৃন্দ।" : "কম্পিউটার ল্যাবে আধুনিক কোডিং ক্লাসে শিক্ষার্থীদের স্বতঃস্ফূর্ত অংশগ্রহণ।")
                    : item.description;

                  const categoryLabel = isBn
                    ? (item.category === 'Academic' ? 'শিক্ষাদানের তথ্য' : item.category === 'Lab' ? 'ল্যাব কার্যক্রম' : item.category === 'Sports' ? 'ক্রীড়াক্ষেত্র' : 'সাংস্কৃতিক')
                    : item.category;

                  return (
                    <motion.div
                      id={`gallery-item-${item.id}`}
                      key={item.id}
                      layout
                      whileHover={{ y: -4 }}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs cursor-pointer group"
                      onClick={() => setZoomedImage(item.image)}
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 bg-slate-900/80 text-white backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {categoryLabel}
                        </span>
                      </div>
                      <div className="p-4 space-y-1 text-left">
                        <h4 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-emerald-600 transition-colors">
                          {title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-semibold">
                          {description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Gallery Zoom Lightbox */}
              <AnimatePresence>
                {zoomedImage && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-xs"
                      onClick={() => setZoomedImage(null)}
                    />
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl bg-black border border-white/10 z-10"
                    >
                      <img src={zoomedImage} alt="Zoomed view" className="max-w-full h-auto object-contain max-h-[80vh] rounded-2xl" />
                      <button
                        onClick={() => setZoomedImage(null)}
                        className="absolute right-4 top-4 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                      >
                        ✕
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ==================== CONTACT VIEW ==================== */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-left"
            >
              {/* Top Contact Segment */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Physical details block */}
                <div className="lg:col-span-4 space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      {lang === 'bn' ? 'যোগাযোগ ডেস্ক' : 'Contact Desk'}
                    </span>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
                      {lang === 'bn' ? 'যোগাযোগ করুন' : 'Get In Touch'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {lang === 'bn' ? 'আমাদের ক্যাম্পাসে সরাসরি চলে আসতে পারেন অথবা ইমেইল করুন।' : 'Visit our administrative campus or drop us an email'}
                    </p>
                  </div>

                  <div className="space-y-4 text-sm text-gray-700 bg-white border border-gray-100 p-6 rounded-3xl shadow-xs text-left">
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-gray-900">{lang === 'bn' ? 'ক্যাম্পাসের ঠিকানা' : 'Campus Address'}</h5>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-semibold">
                          {lang === 'bn' ? 'আশিয়ানা টাউন, দক্ষিণখান, উত্তরা, ঢাকা-১২৩০' : schoolInfo.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-gray-900">{lang === 'bn' ? 'হটলাইন নম্বরসমূহ' : 'Contact Hotlines'}</h5>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">{schoolInfo.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Mail className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-gray-900">{lang === 'bn' ? 'সাধারণ তথ্যের ইমেইল' : 'General Information Email'}</h5>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">{schoolInfo.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-gray-900">{lang === 'bn' ? 'দাপ্তরিক ও অফিস সময়' : 'Administrative Hours'}</h5>
                        <p className="text-xs text-gray-500 mt-0.5 font-semibold">
                          {lang === 'bn' ? 'রবিবার - বৃহস্পতিবার: সকাল ৮:০০ থেকে বিকাল ৪:০০' : 'Sunday - Thursday: 8:00 AM to 4:00 PM'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Message Form */}
                <div className="lg:col-span-8 bg-white border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-xs">
                  <h3 className="font-extrabold text-xl text-gray-900 mb-6">
                    {lang === 'bn' ? 'আপনার জিজ্ঞাসা ও মতামত পাঠান' : 'Send an Administrative Query'}
                  </h3>
                  
                  {!contactSubmitted ? (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            {lang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                          </label>
                          <input
                            id="contact-name-input"
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder={lang === 'bn' ? 'উদা. ইমরান হোসেন' : 'e.g., Imran Hosen'}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-800 font-semibold"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            {lang === 'bn' ? 'আপনার ইমেইল *' : 'Your Email *'}
                          </label>
                          <input
                            id="contact-email-input"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder={lang === 'bn' ? 'উদা. imran@example.com' : 'e.g., imran@example.com'}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-800"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          {lang === 'bn' ? 'বিষয়' : 'Subject'}
                        </label>
                        <input
                          id="contact-subject-input"
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder={lang === 'bn' ? 'উদা. একাদশ শ্রেণীতে ভর্তি সংক্রান্ত তথ্য' : 'e.g., Admission Inquiry regarding Class XI'}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-800 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          {lang === 'bn' ? 'বার্তার বিষয়বস্তু *' : 'Message Content *'}
                        </label>
                        <textarea
                          id="contact-message-input"
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder={lang === 'bn' ? 'এখানে আপনার বার্তাটি বিস্তারিত লিখুন...' : 'Write your query clearly here...'}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-800 font-semibold"
                          required
                        />
                      </div>

                      {contactError && (
                        <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> {contactError}
                        </p>
                      )}

                      <button
                        id="contact-submit-btn"
                        type="submit"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 transition-colors cursor-pointer"
                      >
                        {lang === 'bn' ? 'বার্তা পাঠান' : 'Submit Query'}
                      </button>
                    </form>
                  ) : (
                    <motion.div
                      id="contact-success-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 space-y-4"
                    >
                      <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {lang === 'bn' ? 'বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Query Submitted Successfully!'}
                      </h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto font-semibold">
                        {lang === 'bn' 
                          ? 'আমাদের সাথে যোগাযোগ করার জন্য আপনাকে ধন্যবাদ। খুব শীঘ্রই প্রশাসনিক ডেস্ক থেকে আপনার ইমেইলে যোগাযোগ করা হবে।' 
                          : 'Thank you for reaching out. An administrative desk executive will reply to your email address shortly.'}
                      </p>
                      <button
                        id="contact-reset-btn"
                        onClick={() => setContactSubmitted(false)}
                        className="text-xs font-extrabold text-emerald-600 hover:underline cursor-pointer"
                      >
                        {lang === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Submit Another Message'}
                      </button>
                    </motion.div>
                  )}
                </div>

              </div>

              {/* FAQs Accordion segment */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {lang === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQs)' : 'Frequently Asked Questions'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {lang === 'bn' ? 'ভর্তি, একাডেমিক পদ্ধতি এবং নিয়মাবলী সংক্রান্ত সাধারণ প্রশ্নোত্তরসমূহ।' : 'Common answers regarding admissions, systems, and guidelines'}
                  </p>
                </div>

                <div className="space-y-3 max-w-3xl">
                  {faqs.map((faq) => {
                    const isOpen = faqOpenId === faq.id;
                    const isBn = lang === 'bn';
                    const faqQuestion = isBn
                      ? (faq.id === "F001" ? "ভর্তি পরীক্ষার পাঠ্যসূচি কী এবং কীভাবে আবেদন করব?" : faq.id === "F002" ? "আপনাদের এখানে কি কোনো মাসিক বা বাৎসরিক বৃত্তির ব্যবস্থা আছে?" : faq.id === "F003" ? "বিদ্যালয়ের ক্লাস ও যাতায়াত ব্যবস্থা কেমন?" : "অভিভাবকগণ কীভাবে শিক্ষার্থীর অগ্রগতি ট্র্যাক করতে পারবেন?")
                      : faq.question;

                    const faqAnswer = isBn
                      ? (faq.id === "F001" ? "ভর্তির আবেদন ফরমটি আমাদের ওয়েবসাইট থেকে অনলাইনেই পূরণ করা যাবে। ১ম থেকে ৯ম শ্রেণীর জন্য বাংলা, ইংরেজি ও গণিত বিষয়ের উপর ৫০ নম্বরের এমসিকিউ এবং লিখিত পরীক্ষা নেওয়া হয়ে থাকে।" : faq.id === "F002" ? "হ্যাঁ, প্রতি বছর মেধাবী ও অসচ্ছল শিক্ষার্থীদের জন্য বিশেষ বৃত্তির ব্যবস্থা রয়েছে। জেএসসি এবং বোর্ড পরীক্ষার ফলাফলের উপর ভিত্তি করে বেতন মওকুফসহ ১০০% পর্যন্ত স্কলারশিপ প্রদান করা হয়।" : faq.id === "F003" ? "আমাদের ক্লাস প্রতি রবিবার থেকে বৃহস্পতিবার সকাল ৮:০০ টা থেকে দুপুর ২:০০ টা পর্যন্ত চলে। এছাড়া ঢাকা শহরের প্রধান রুটগুলোতে শিক্ষার্থীদের যাতায়াতের জন্য নিজস্ব নিরাপদ পরিবহন (বাস) ব্যবস্থা রয়েছে।" : "আমাদের আধুনিক অনলাইন স্টুডেন্ট পোর্টালের মাধ্যমে অভিভাবক ও শিক্ষার্থীরা যেকোনো সময় পরীক্ষার ফলাফল, ক্লাসের বাড়ির কাজ (Homework), ক্লাসরুটিন এবং দৈনিক উপস্থিতির তথ্য দেখতে পাবেন।")
                      : faq.answer;

                    return (
                      <div
                        id={`faq-item-${faq.id}`}
                        key={faq.id}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs text-left"
                      >
                        <button
                          onClick={() => setFaqOpenId(isOpen ? null : faq.id)}
                          className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                          <span className="font-extrabold text-gray-900 text-sm sm:text-base">{faqQuestion}</span>
                          <ChevronDown className={`h-4.5 w-4.5 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 font-semibold text-left">
                                {faqAnswer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* ==================== DYNAMIC CUSTOM CONTENT VIEW ==================== */}
          {!['home', 'academics', 'notices', 'admissions', 'gallery', 'contact', 'portal'].includes(activeTab) && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left"
            >
              {(() => {
                const customPages = frontendData?.customPages || [];
                const currentPage = customPages.find((p: any) => p.slug === activeTab || p.id === activeTab);
                if (!currentPage || currentPage.status !== 'active') {
                  return (
                    <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center space-y-6 max-w-xl mx-auto shadow-xs">
                      <span className="text-5xl">📄</span>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        {lang === 'bn' ? 'পেজটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
                      </h2>
                      <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                        {lang === 'bn' 
                          ? 'দুঃখিত, আপনি যে লিংকটি খুঁজছেন তা এই মুহূর্তে উপলব্ধ নয় অথবা নিষ্ক্রিয় করা আছে।' 
                          : 'Sorry, the dynamic page you are looking for is currently unavailable or disabled by admin.'}
                      </p>
                      <button 
                        onClick={() => setActiveTab('home')} 
                        className="px-6 py-2.5 bg-[#025644] text-white rounded-xl font-bold hover:bg-[#014133] transition-colors cursor-pointer"
                      >
                        {lang === 'bn' ? 'প্রচ্ছদে ফিরে যান' : 'Back to Home'}
                      </button>
                    </div>
                  );
                }
                return (
                  <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
                    <div>
                      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        {lang === 'bn' ? 'তথ্য ও বিবরণী' : 'Information & Details'}
                      </span>
                      <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 pb-6 border-b border-gray-100">
                        {lang === 'bn' ? currentPage.titleBn : currentPage.titleEn}
                      </h2>
                    </div>
                    <div className="text-sm sm:text-base text-gray-750 leading-relaxed font-semibold whitespace-pre-wrap">
                      {lang === 'bn' ? currentPage.contentBn : currentPage.contentEn}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ==================== MOCK STUDENT PORTAL VIEW ==================== */}
          {activeTab === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full text-left"
            >
              <StudentPortal lang={lang} onBackToHome={() => setActiveTab('home')} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Shared Footer */}
      {activeTab !== 'portal' && (
        <Footer setActiveTab={setActiveTab} lang={lang} settings={settings} frontendData={frontendData} />
      )}

    </div>
  );
}
