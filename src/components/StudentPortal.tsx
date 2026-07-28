import React, { useState } from 'react';
import { 
  User, 
  Search, 
  BookOpen, 
  Calendar, 
  Award, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  GraduationCap, 
  FileText 
} from 'lucide-react';
import ReportCard from './ReportCard';
import AdmitCardModal from './AdmitCardModal';
import ClassRoutineGrid from './ClassRoutineGrid';

interface StudentPortalProps {
  lang: 'bn' | 'en';
  onBackToHome: () => void;
}

export default function StudentPortal({ lang, onBackToHome }: StudentPortalProps) {
  const [studentId, setStudentId] = useState('');
  const [studentClass, setStudentClass] = useState('6');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [activePortalTab, setActivePortalTab] = useState<'profile' | 'routine' | 'result' | 'admit'>('profile');

  // Dummy found student for portal demo
  const foundStudent = {
    id: studentId || '2026001',
    nameBn: 'মোঃ সিয়াম আহমেদ',
    nameEn: 'Md. Siam Ahmed',
    class: studentClass,
    section: 'A',
    roll: '01',
    fatherName: 'মোঃ রফিকুল ইসলাম',
    motherName: 'মোছাঃ পারভীন আক্তার',
    phone: '01712345678',
    attendancePercent: '94%',
    gpa: '5.00',
    status: 'Active'
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;
    setSearchSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[70vh]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 bg-white transition-all cursor-pointer shadow-3xs"
            title={lang === 'bn' ? 'মূল পাতায় ফিরে যান' : 'Back to Home'}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-emerald-600" />
              {lang === 'bn' ? 'শিক্ষার্থী পোর্টাল' : 'Student Portal'}
            </h1>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              {lang === 'bn' ? 'ফলাফল, রুটিন, প্রবেশপত্র এবং শিক্ষার্থীর অ্যাকাডেমিক তথ্য' : 'Results, routines, admit cards and academic details'}
            </p>
          </div>
        </div>
      </div>

      {/* Student ID Search Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <Search className="h-5 w-5 text-emerald-600" />
            {lang === 'bn' ? 'শিক্ষার্থীর তথ্য অনুসন্ধান' : 'Find Student Profile'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {lang === 'bn' ? 'শ্রেণী নির্বাচন করুন' : 'Select Class'}
              </label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
              >
                <option value="6">{lang === 'bn' ? 'ষষ্ঠ শ্রেণী (Class 6)' : 'Class 6'}</option>
                <option value="7">{lang === 'bn' ? 'সপ্তম শ্রেণী (Class 7)' : 'Class 7'}</option>
                <option value="8">{lang === 'bn' ? 'অষ্টম শ্রেণী (Class 8)' : 'Class 8'}</option>
                <option value="9">{lang === 'bn' ? 'নবম শ্রেণী (Class 9)' : 'Class 9'}</option>
                <option value="10">{lang === 'bn' ? 'দশম শ্রেণী (Class 10)' : 'Class 10'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {lang === 'bn' ? 'স্টুডেন্ট আইডি / রোল নম্বর *' : 'Student ID / Roll No *'}
              </label>
              <input
                type="text"
                value={studentStudentId()}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder={lang === 'bn' ? 'উদা. 2026001 অথবা 01' : 'e.g. 2026001 or 01'}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            {lang === 'bn' ? 'প্রোফাইল অনুসন্ধান করুন' : 'Search Student Profile'}
          </button>
        </form>
      </div>

      {searchSubmitted && (
        <div className="space-y-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
            <button
              onClick={() => setActivePortalTab('profile')}
              className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activePortalTab === 'profile'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <User className="h-4 w-4" />
              {lang === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Student Profile'}
            </button>

            <button
              onClick={() => setActivePortalTab('routine')}
              className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activePortalTab === 'routine'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              {lang === 'bn' ? 'ক্লাস রুটিন' : 'Class Routine'}
            </button>

            <button
              onClick={() => setActivePortalTab('result')}
              className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activePortalTab === 'result'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Award className="h-4 w-4" />
              {lang === 'bn' ? 'পরীক্ষার ফলাফল (Report Card)' : 'Report Card'}
            </button>
          </div>

          {/* Sub Tab Contents */}
          {activePortalTab === 'profile' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                <div className="h-24 w-24 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 font-extrabold text-2xl shadow-inner">
                  {foundStudent.nameEn.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">{lang === 'bn' ? foundStudent.nameBn : foundStudent.nameEn}</h3>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">ID: {foundStudent.id}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {foundStudent.status} Student
                </span>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h4 className="font-extrabold text-gray-900 border-b border-gray-100 pb-2 text-sm uppercase tracking-wider">
                  {lang === 'bn' ? 'একাডেমিক তথ্যসমুহ' : 'Academic & Guardian Details'}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-700">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold uppercase text-[10px]">{lang === 'bn' ? 'শ্রেণী ও শাখা' : 'Class & Section'}</span>
                    <span className="font-extrabold text-gray-900 text-sm">Class {foundStudent.class} (Section {foundStudent.section})</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold uppercase text-[10px]">{lang === 'bn' ? 'রোল নম্বর' : 'Roll Number'}</span>
                    <span className="font-extrabold text-gray-900 text-sm">Roll {foundStudent.roll}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold uppercase text-[10px]">{lang === 'bn' ? 'উপস্থিতির হার' : 'Attendance Rate'}</span>
                    <span className="font-extrabold text-emerald-600 text-sm">{foundStudent.attendancePercent}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold uppercase text-[10px]">{lang === 'bn' ? 'সর্বশেষ জিপিএ' : 'Latest GPA'}</span>
                    <span className="font-extrabold text-emerald-600 text-sm">GPA {foundStudent.gpa}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold uppercase text-[10px]">{lang === 'bn' ? 'পিতার নাম' : 'Father Name'}</span>
                    <span className="font-bold text-gray-800">{foundStudent.fatherName}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block font-bold uppercase text-[10px]">{lang === 'bn' ? 'মাতার নাম' : 'Mother Name'}</span>
                    <span className="font-bold text-gray-800">{foundStudent.motherName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePortalTab === 'routine' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <ClassRoutineGrid selectedClass={studentClass} lang={lang} />
            </div>
          )}

          {activePortalTab === 'result' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <ReportCard studentId={foundStudent.id} studentClass={studentClass} lang={lang} />
            </div>
          )}
        </div>
      )}
    </div>
  );

  function studentStudentId() {
    return studentId;
  }
}
