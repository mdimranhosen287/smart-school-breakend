/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Mail, Facebook, Youtube, Linkedin } from 'lucide-react';
import { translations } from '../data/translations';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  lang: 'bn' | 'en';
  settings?: any;
  frontendData?: any;
}

export default function Footer({ setActiveTab, lang, settings, frontendData }: FooterProps) {
  const t = translations[lang];

  const handleHistoryClick = () => {
    setActiveTab('home');
    setTimeout(() => {
      const element = document.getElementById('school-history-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleTeachersClick = () => {
    setActiveTab('academics');
    setTimeout(() => {
      const element = document.getElementById('teachers-section') || document.getElementById('academic-staff-divider');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleGoverningClick = () => {
    setActiveTab('home');
    setTimeout(() => {
      const element = document.getElementById('governing-body-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleBrilliantClick = () => {
    setActiveTab('home');
    setTimeout(() => {
      const element = document.getElementById('brilliant-students-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleAdmissionClick = () => {
    setActiveTab('admissions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNoticesClick = () => {
    setActiveTab('notices');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadClick = () => {
    setActiveTab('academics');
    setTimeout(() => {
      const element = document.getElementById('student-corner-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleGalleryClick = () => {
    setActiveTab('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventsClick = () => {
    setActiveTab('home');
    setTimeout(() => {
      const element = document.getElementById('events-section') || document.getElementById('notices-board-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handlePortalClick = () => {
    setActiveTab('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="school-footer" className="bg-[#0b1329] text-slate-300 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          
          {/* Col 1: Important Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-extrabold text-sm sm:text-base tracking-wide relative pb-2 border-b border-white/10 mb-4">
              {lang === 'bn' ? 'গুরুত্বপূর্ণ লিংক' : 'Important Links'}
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm font-semibold">
              <button 
                onClick={handleHistoryClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'প্রতিষ্ঠানের ইতিহাস' : 'Institutions History'}
              </button>
              <button 
                onClick={handleTeachersClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'শিক্ষকমণ্ডলী' : 'Respected Faculty'}
              </button>
              <button 
                onClick={handleGoverningClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'পরিচালক পর্ষদ' : 'Governing Body'}
              </button>
              <button 
                onClick={handleBrilliantClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'কৃতি শিক্ষার্থী' : 'Brilliant Students'}
              </button>
              <button 
                onClick={handleAdmissionClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'ভর্তি তথ্য' : 'Admission Info'}
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-extrabold text-sm sm:text-base tracking-wide relative pb-2 border-b border-white/10 mb-4">
              {lang === 'bn' ? 'কুইক লিংক' : 'Quick Links'}
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm font-semibold">
              <button 
                onClick={handleNoticesClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'নোটিশ' : 'Notice'}
              </button>
              <button 
                onClick={handleDownloadClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
              </button>
              <button 
                onClick={handleGalleryClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery'}
              </button>
              <button 
                onClick={handleEventsClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300"
              >
                {lang === 'bn' ? 'আসন্ন ইভেন্ট' : 'Upcoming Events'}
              </button>
              <button 
                onClick={handlePortalClick}
                className="hover:text-[#0593dd] text-left transition-colors cursor-pointer text-slate-300 font-bold"
              >
                {lang === 'bn' ? 'পোর্টাল লগইন' : 'Portal Login'}
              </button>
            </div>
          </div>

          {/* Col 3: Contact Information */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-extrabold text-sm sm:text-base tracking-wide relative pb-2 border-b border-white/10 mb-4">
              {lang === 'bn' ? 'যোগাযোগের ঠিকানা' : 'Contact Information'}
            </h4>
            <div className="flex flex-col space-y-3.5 text-sm font-semibold">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  {lang === 'bn' ? (settings?.addressBn || 'কর্ণফুলী, চট্টগ্রাম, বাংলাদেশ') : (settings?.addressEn || 'Karnaphuli, Chittagong, Bangladesh')}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-sky-400 shrink-0" />
                <span className="text-slate-300 font-mono">{settings?.helpline || '+880 1711 234 567'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-sky-400 shrink-0" />
                <span className="text-slate-300 font-mono">{settings?.email || 'info@studentscare.edu.bd'}</span>
              </div>

              {/* Codes Badge */}
              <div className="flex items-center gap-4 text-xs font-black pt-2">
                <span className="text-sky-400">EIIN - {settings?.eiin || '123456'}</span>
                <span className="text-emerald-400">School Code - {settings?.eiin || '7890'}</span>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-[#131e36] hover:bg-[#0593dd] text-white p-2 rounded-full transition-all duration-300 w-9 h-9 flex items-center justify-center cursor-pointer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-[#131e36] hover:bg-rose-600 text-white p-2 rounded-full transition-all duration-300 w-9 h-9 flex items-center justify-center cursor-pointer"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-[#131e36] hover:bg-[#0077b5] text-white p-2 rounded-full transition-all duration-300 w-9 h-9 flex items-center justify-center cursor-pointer"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Find Us (Map widget) */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-extrabold text-sm sm:text-base tracking-wide relative pb-2 border-b border-white/10 mb-4">
              Find Us
            </h4>
            <div className="space-y-3">
              <div className="relative w-full h-[120px] rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
                <iframe 
                  title="School Location Map" 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=91.815%2C22.285%2C91.855%2C22.315&amp;layer=mapnik" 
                  className="w-full h-full border-0 absolute inset-0"
                  style={{ filter: 'grayscale(0.1) contrast(1.1) invert(0.05)' }}
                  loading="lazy"
                ></iframe>
              </div>
              <p className="text-xs text-slate-400 font-bold">
                কর্ণফুলী, চট্টগ্রাম • বাংলাদেশ
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#060b18] border-t border-slate-950 text-slate-400 font-bold py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>
            {frontendData?.footerCopyright || (lang === 'bn' ? `© 2026 ${settings?.siteNameBn || 'স্টুডেন্টস কেয়ার মডেল স্কুল'} — সর্বস্বত্ব সংরক্ষিত` : `© 2026 ${settings?.siteNameEn || 'Students Care Model School'} — All rights reserved`)}
          </div>
          <div className="text-right">
            {lang === 'bn' 
              ? 'সফটওয়্যার তৈরি ও রক্ষণাবেক্ষণে: মো. ইমরান হোসেন, সিনিয়র শিক্ষক, স্টুডেন্টস কেয়ার মডেল স্কুল (01814913049)'
              : 'Software Development & Maintenance: Md. Imran Hosen, Senior Teacher, Students Care Model School (01814913049)'}
          </div>
        </div>
      </div>
    </footer>
  );
}
