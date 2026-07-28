/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  Upload, 
  X, 
  User, 
  MapPin, 
  PlusCircle, 
  Info, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Camera, 
  GraduationCap, 
  Trash2, 
  RotateCcw, 
  Send,
  CreditCard,
  Download,
  Wallet,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AdmissionFormProps {
  lang: 'bn' | 'en';
  onBack?: () => void;
}

export default function AdmissionForm({ lang: appLang, onBack }: AdmissionFormProps) {
  const [lang, setLang] = useState<'bn' | 'en'>('en');
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    gender: 'Male',
    
    roll: '',
    section: '',
    
    presentDivision: '',
    presentDistrict: '',
    presentFullAddress: '',
    
    permanentDivision: '',
    permanentDistrict: '',
    permanentFullAddress: '',
    sameAsPresent: false,
    
    religion: '',
    nationality: 'Bangladeshi',
    phone: '',
    email: '',
    nidBirthReg: '',
    bloodGroup: '',
    guardianOccupation: '',
    maritalStatus: 'Single',
    selectedClass: '',
    
    declarationAgreed: false,
    signatureType: 'type' as 'type' | 'draw',
    signatureText: '',
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [generatedAppId, setGeneratedAppId] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'processing' | 'paid'>('unpaid');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentOtp, setPaymentOtp] = useState('');
  const [paymentPin, setPaymentPin] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<1 | 2>(1);

  // Signature drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const divisions = [
    { bn: 'বরিশাল', en: 'Barishal' },
    { bn: 'চট্টগ্রাম', en: 'Chattogram' },
    { bn: 'ঢাকা', en: 'Dhaka' },
    { bn: 'খুলনা', en: 'Khulna' },
    { bn: 'ময়মনসিংহ', en: 'Mymensingh' },
    { bn: 'রাজশাহী', en: 'Rajshahi' },
    { bn: 'রংপুর', en: 'Rangpur' },
    { bn: 'সিলেট', en: 'Sylhet' }
  ];

  const districtsByDivision: Record<string, string[]> = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Manikganj', 'Munshiganj', 'Narsingdi'],
    'Chattogram': ['Chattogram', 'Cox\'s Bazar', 'Cumilla', 'Feni', 'Brahmanbaria', 'Chandpur', 'Noakhali', 'Rangamati', 'Khagrachhari', 'Bandarban'],
    'Barishal': ['Barishal', 'Bhola', 'Patuakhali', 'Barguna', 'Jhalokati', 'Pirojpur'],
    'Khulna': ['Khulna', 'Jashore', 'Satkhira', 'Bagerhat', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Chuadanga', 'Jhenaidah'],
    'Rajshahi': ['Rajshahi', 'Bogura', 'Pabna', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Sirajganj'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Mymensingh': ['Mymensingh', 'Netrokona', 'Sherpur', 'Jamalpur']
  };

  const classes = [
    'Play', 'Nursery', 'KG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
    'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'
  ];

  const religions = [
    { bn: 'ইসলাম', en: 'Islam' },
    { bn: 'হিন্দুধর্ম', en: 'Hinduism' },
    { bn: 'বৌদ্ধধর্ম', en: 'Buddhism' },
    { bn: 'খ্রিস্টধর্ম', en: 'Christianity' },
    { bn: 'অন্যান্য', en: 'Other' }
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Handle present address fields synchronization to permanent address
  useEffect(() => {
    if (formData.sameAsPresent) {
      setFormData(prev => ({
        ...prev,
        permanentDivision: prev.presentDivision,
        permanentDistrict: prev.presentDistrict,
        permanentFullAddress: prev.presentFullAddress
      }));
    }
  }, [formData.sameAsPresent, formData.presentDivision, formData.presentDistrict, formData.presentFullAddress]);

  // Handle canvas drawing setup
  useEffect(() => {
    if (formData.signatureType === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#025644';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [formData.signatureType]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    ctx.beginPath();
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.moveTo(x, y);
    setSignatureDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    
    e.preventDefault();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    if (canvasRef.current && signatureDrawn) {
      try {
        setSignatureDataUrl(canvasRef.current.toDataURL('image/png'));
      } catch (e) {
        console.warn('Could not export canvas data:', e);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDrawn(false);
    setSignatureDataUrl('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = lang === 'bn' ? "শিক্ষার্থীর নাম আবশ্যক" : "Student's Name is required";
    }
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = lang === 'bn' ? "পিতার নাম আবশ্যক" : "Father's Name is required";
    }
    if (!formData.motherName.trim()) {
      newErrors.motherName = lang === 'bn' ? "মাতার নাম আবশ্যক" : "Mother's Name is required";
    }
    if (!formData.birthDate) {
      newErrors.birthDate = lang === 'bn' ? "জন্ম তারিখ আবশ্যক" : "Date of Birth is required";
    }
    if (!formData.presentDivision) {
      newErrors.presentDivision = lang === 'bn' ? "বিভাগ নির্বাচন করুন" : "Please select present division";
    }
    if (!formData.presentDistrict) {
      newErrors.presentDistrict = lang === 'bn' ? "জেলা নির্বাচন করুন" : "Please select present district";
    }
    if (!formData.presentFullAddress.trim()) {
      newErrors.presentFullAddress = lang === 'bn' ? "বর্তমান ঠিকানা আবশ্যক" : "Present address details are required";
    }

    if (!formData.sameAsPresent) {
      if (!formData.permanentDivision) {
        newErrors.permanentDivision = lang === 'bn' ? "বিভাগ নির্বাচন করুন" : "Please select permanent division";
      }
      if (!formData.permanentDistrict) {
        newErrors.permanentDistrict = lang === 'bn' ? "জেলা নির্বাচন করুন" : "Please select permanent district";
      }
      if (!formData.permanentFullAddress.trim()) {
        newErrors.permanentFullAddress = lang === 'bn' ? "স্থায়ী ঠিকানা আবশ্যক" : "Permanent address details are required";
      }
    }

    if (!formData.religion) {
      newErrors.religion = lang === 'bn' ? "ধর্ম নির্বাচন করুন" : "Please select religion";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = lang === 'bn' ? "মোবাইল নম্বর আবশ্যক" : "Phone number is required";
    } else if (!/^(?:\+88)?01[3-9]\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = lang === 'bn' ? "সঠিক বাংলাদেশী মোবাইল নম্বর দিন" : "Provide a valid Bangladeshi mobile number";
    }
    if (!formData.selectedClass) {
      newErrors.selectedClass = lang === 'bn' ? "ভর্তির শ্রেণী নির্বাচন করুন" : "Please select class to apply for";
    }
    if (!formData.declarationAgreed) {
      newErrors.declarationAgreed = lang === 'bn' ? "ঘোষণাপত্রে অবশ্যই সম্মতি দিতে হবে" : "You must agree to the declaration";
    }

    if (formData.signatureType === 'type' && !formData.signatureText.trim()) {
      newErrors.signatureText = lang === 'bn' ? "স্বাক্ষর টাইপ করুন" : "Please type your full name as signature";
    }
    if (formData.signatureType === 'draw' && !signatureDrawn) {
      newErrors.signatureText = lang === 'bn' ? "স্বাক্ষর আঁকুন" : "Please draw your signature";
    }

    if (paymentStatus !== 'paid') {
      newErrors.payment = lang === 'bn' ? "আবেদন ফি ৫০০ টাকা পরিশোধ করা আবশ্যক" : "Admission fee payment of 500 BDT is required";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const randomId = `SCMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedAppId(randomId);

      // Create FormData to send to php backend
      const fd = new FormData();
      fd.append('name', formData.studentName);
      fd.append('roll', formData.roll || `ADM-${randomId.split('-').pop()}`);
      fd.append('class', formData.selectedClass || 'N/A');
      fd.append('section', formData.section || 'A');
      fd.append('mobile_number', formData.phone);
      fd.append('address', formData.presentFullAddress);
      
      fd.append('guardian', formData.fatherName || formData.motherName || 'N/A');
      if (photoFile) {
        fd.append('photo', photoFile);
      }

      fetch('/api/students', {
        method: 'POST',
        body: fd
      })
      .then(res => {
        if (!res.ok) {
          console.warn('Admission /api/students returned non-OK status');
        }
        return res.json().catch(() => ({}));
      })
      .then(data => {
        console.log('Admission inserted successfully via backend API:', data);
      })
      .catch(err => {
        console.error('Admission /api/students error:', err);
      });

      // Integrate with local storage to sync with Admin Panel pending admissions
      const local = localStorage.getItem('school_pending_admissions');
      let currentList = [];
      if (local) {
        try {
          currentList = JSON.parse(local);
        } catch (e) {}
      } else {
        currentList = [
          { id: '1', studentName: 'Fahim Shakir', guardianName: 'Md. Shakirul Islam', requestedClass: 'Class 9', previousGPA: '5.00', status: 'pending' },
          { id: '2', studentName: 'Nusrat Zaman', guardianName: 'Md. Zaman Akhter', requestedClass: 'Class 6', previousGPA: '4.85', status: 'pending' },
          { id: '3', studentName: 'Zubayer Al Mahmud', guardianName: 'Dr. Mahmudul Hasan', requestedClass: 'Class 11', previousGPA: '5.00', status: 'pending' }
        ];
      }

      const newAdmission = {
        id: randomId,
        studentName: formData.studentName,
        guardianName: formData.fatherName || formData.motherName || 'N/A',
        requestedClass: formData.selectedClass,
        previousGPA: 'N/A',
        status: 'pending'
      };

      currentList.push(newAdmission);
      localStorage.setItem('school_pending_admissions', JSON.stringify(currentList));

      setSubmissionSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setFormData({
      studentName: '',
      fatherName: '',
      motherName: '',
      birthDate: '',
      gender: 'Male',
      presentDivision: '',
      presentDistrict: '',
      presentFullAddress: '',
      permanentDivision: '',
      permanentDistrict: '',
      permanentFullAddress: '',
      sameAsPresent: false,
      religion: '',
      nationality: 'Bangladeshi',
      phone: '',
      email: '',
      nidBirthReg: '',
      bloodGroup: '',
      guardianOccupation: '',
      maritalStatus: 'Single',
      selectedClass: '',
      declarationAgreed: false,
      signatureType: 'type',
      signatureText: '',
    });
    setPhoto(null);
    setPhotoFile(null);
    setPhotoName('');
    setSignatureDrawn(false);
    setSignatureDataUrl('');
    setErrors({});
    setSubmissionSuccess(false);
    setPaymentMethod(null);
    setPaymentStatus('unpaid');
    setPaymentNumber('');
    setPaymentOtp('');
    setPaymentPin('');
    setCardNo('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setTransactionId('');
    setPaymentError('');
    setPaymentStep(1);
  };

  const downloadPDF = async () => {
    const element = document.getElementById('admission-receipt-print-area');
    if (!element) return;
    
    setIsPdfDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Admission_Receipt_${generatedAppId || 'SCMS'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsPdfDownloading(false);
    }
  };

  return (
    <div className="bg-[#f0f9f8] min-h-screen pb-16 flex flex-col items-center">
      
      {/* Back to Home Button Row */}
      <div className="w-full max-w-5xl px-4 sm:px-6 pt-6 flex justify-start">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#004d40] hover:text-[#025644] font-bold text-sm bg-white/80 hover:bg-white border border-emerald-100/60 px-4 py-2 rounded-full transition-all shadow-3xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === 'bn' ? "মূল পাতায় ফিরুন" : "Back to home"}
          </button>
        )}
      </div>

      {/* Hero Banner Header exactly like screenshot with language toggle */}
      <div className="w-full max-w-5xl px-4 sm:px-6 mt-6">
        <div className="bg-[#025644] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="h-16 w-16 bg-white/10 text-white rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <GraduationCap className="h-10 w-10 text-[#d0f3eb]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-extrabold tracking-widest uppercase text-[#d0f3eb] bg-white/10 px-3 py-1 rounded-full border border-white/5 inline-block">
                {lang === 'bn' ? "অনলাইন ভর্তি" : "ONLINE ADMISSION"}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
                Students Care Model School
              </h1>
              <p className="text-xs sm:text-sm text-[#d0f3eb]/95 font-medium leading-relaxed">
                {lang === 'bn' 
                  ? "শিক্ষাবর্ষ ২০২৫–২৬ • তারকা চিহ্নিত (*) সকল ঘর পূরণ করা বাধ্যতামূলক" 
                  : "Academic Year 2025–26 • All fields marked are required"}
              </p>
            </div>
          </div>
          
          {/* Premium Language Toggle */}
          <div className="shrink-0 flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/15 backdrop-blur-xs select-none">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                lang === 'en' 
                  ? 'bg-white text-[#025644] shadow-sm' 
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                lang === 'bn' 
                  ? 'bg-white text-[#025644] shadow-sm' 
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 sm:px-6 mt-8">
        {!submissionSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Card 1: Application Form intro & Photo upload */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 text-left max-w-xl">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  {lang === 'bn' ? "ভর্তি আবেদন ফরম" : "Application Form"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                  {lang === 'bn' 
                    ? "অনগ্রহ করে ফরমটি সতর্কতার সাথে সম্পূর্ণ করুন। সফলভাবে জমাদানের পর ট্র্যাকিংয়ের জন্য একটি ট্র্যাকিং আবেদন আইডি পাবেন।" 
                    : "Please complete all sections carefully. Once submitted, you will receive an application ID for tracking."}
                </p>
              </div>

              {/* Passport photo upload placeholder container */}
              <div id="field-photo" className="flex flex-col items-center gap-2 shrink-0 self-center md:self-auto">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                
                {photo ? (
                  <div className="relative h-28 w-24 rounded-xl border border-gray-200 overflow-hidden shadow-3xs group bg-gray-50">
                    <img src={photo} alt="Student passport" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoName('');
                      }}
                      className="absolute top-1 right-1 h-6 w-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-3xs"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-28 w-24 border-2 border-dashed border-teal-200 bg-[#f4faf8] hover:bg-[#eaf6f3] rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all shadow-3xs hover:border-emerald-400 group"
                  >
                    <Upload className="h-5 w-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-teal-800 leading-tight">
                      {lang === 'bn' ? "পাসপোর্ট ছবি আপলোড" : "Passport size photo"}
                    </span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 bg-[#f0f9f8] hover:bg-[#e2f5f1] text-[#025644] text-xs font-extrabold rounded-full border border-emerald-100 transition-colors cursor-pointer"
                >
                  {photo ? (lang === 'bn' ? "পরিবর্তন করুন" : "Change") : (lang === 'bn' ? "আপলোড করুন" : "Upload")}
                </button>
              </div>
            </div>

            {/* Card 2: Student & Family Information */}
            <div id="field-studentName" className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "শিক্ষার্থী ও পারিবারিক বিবরণ" : "Student & Family Information"}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {lang === 'bn' ? "আবেদনকারী এবং পিতামাতার মৌলিক তথ্যাদি" : "Basic details of the applicant and parents"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Student's Name */}
                <div id="field-studentName" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "শিক্ষার্থীর নাম" : "Student's Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "সার্টিফিকেট অনুযায়ী পূর্ণ নাম" : "Full name as per certificate"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all ${
                      errors.studentName ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.studentName && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.studentName}
                    </p>
                  )}
                </div>

                {/* Roll Number */}
                <div id="field-roll" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "রোল নম্বর" : "Roll Number"}
                  </label>
                  <input
                    type="text"
                    name="roll"
                    value={formData.roll}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "রোল নম্বর" : "Roll Number"}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* Section */}
                <div id="field-section" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "সেকশন" : "Section"}
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "সেকশন" : "Section"}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* Father's Name */}
                <div id="field-fatherName" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "পিতার নাম" : "Father's Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "পিতার পূর্ণ নাম" : "Father's Name"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all ${
                      errors.fatherName ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.fatherName && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.fatherName}
                    </p>
                  )}
                </div>

                {/* Mother's Name */}
                <div id="field-motherName" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "মাতার নাম" : "Mother's Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "মাতার পূর্ণ নাম" : "Mother's Name"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all ${
                      errors.motherName ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.motherName && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.motherName}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div id="field-birthDate" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জন্ম তারিখ" : "Date of Birth"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] focus:ring-1 focus:ring-[#025644] transition-all ${
                      errors.birthDate ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.birthDate && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.birthDate}
                    </p>
                  )}
                </div>

                {/* Gender Radio buttons */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    {lang === 'bn' ? "লিঙ্গ" : "Gender"}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['Male', 'Female', 'Other'].map((g) => {
                      const isSel = formData.gender === g;
                      const displayLabel = lang === 'bn' ? (g === 'Male' ? 'পুরুষ' : g === 'Female' ? 'মহিলা' : 'অন্যান্য') : g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#e2f5f1] border-[#025644]/30 text-[#025644] font-extrabold shadow-3xs'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSel ? 'border-[#025644] bg-[#025644] text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {isSel && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                          </div>
                          <span>{displayLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Card 3: Present Address */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "বর্তমান ঠিকানা" : "Present Address"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Division dropdown */}
                <div id="field-presentDivision" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "বিভাগ" : "Division"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="presentDivision"
                    value={formData.presentDivision}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.presentDivision ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">{lang === 'bn' ? "বিভাগ নির্বাচন করুন" : "Select division"}</option>
                    {divisions.map(d => (
                      <option key={d.en} value={d.en}>{lang === 'bn' ? d.bn : d.en}</option>
                    ))}
                  </select>
                  {errors.presentDivision && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.presentDivision}
                    </p>
                  )}
                </div>

                {/* District dropdown */}
                <div id="field-presentDistrict" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জেলা" : "District"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="presentDistrict"
                    value={formData.presentDistrict}
                    onChange={handleInputChange}
                    disabled={!formData.presentDivision}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.presentDistrict ? 'border-red-300' : 'border-gray-200'
                    } disabled:opacity-60 disabled:bg-gray-50`}
                  >
                    {!formData.presentDivision ? (
                      <option value="">{lang === 'bn' ? "প্রথমে বিভাগ নির্বাচন করুন" : "Select division first"}</option>
                    ) : (
                      <>
                        <option value="">{lang === 'bn' ? "জেলা নির্বাচন করুন" : "Select district"}</option>
                        {districtsByDivision[formData.presentDivision]?.map(dst => (
                          <option key={dst} value={dst}>{dst}</option>
                        )) || <option value="">No districts loaded</option>}
                      </>
                    )}
                  </select>
                  {errors.presentDistrict && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.presentDistrict}
                    </p>
                  )}
                </div>

                {/* Full Present Address */}
                <div id="field-presentFullAddress" className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "পূর্ণ ঠিকানা" : "Full Address"} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="presentFullAddress"
                    rows={3}
                    value={formData.presentFullAddress}
                    onChange={handleInputChange}
                    placeholder={lang === 'bn' ? "বাসা নম্বর, সড়ক নম্বর, গ্রাম, ডাকঘর ইত্যাদি" : "House, road, area, post office"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.presentFullAddress ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.presentFullAddress && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.presentFullAddress}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Card 4: Permanent Address */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "স্থায়ী ঠিকানা" : "Permanent Address"}
                </h3>
                
                {/* Same as present address checkbox exactly like screenshot */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#004d40] font-extrabold">
                  <input
                    type="checkbox"
                    name="sameAsPresent"
                    checked={formData.sameAsPresent}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                    formData.sameAsPresent ? 'bg-[#025644] border-[#025644] text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {formData.sameAsPresent && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span>{lang === 'bn' ? "বর্তমান ঠিকানার মতো" : "Same as Present Address"}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Division dropdown */}
                <div id="field-permanentDivision" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "বিভাগ" : "Division"} {!formData.sameAsPresent && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="permanentDivision"
                    value={formData.permanentDivision}
                    onChange={handleInputChange}
                    disabled={formData.sameAsPresent}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.permanentDivision ? 'border-red-300' : 'border-gray-200'
                    } disabled:opacity-60 disabled:bg-gray-50`}
                  >
                    <option value="">{lang === 'bn' ? "বিভাগ নির্বাচন করুন" : "Select division"}</option>
                    {divisions.map(d => (
                      <option key={d.en} value={d.en}>{lang === 'bn' ? d.bn : d.en}</option>
                    ))}
                  </select>
                  {!formData.sameAsPresent && errors.permanentDivision && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.permanentDivision}
                    </p>
                  )}
                </div>

                {/* District dropdown */}
                <div id="field-permanentDistrict" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জেলা" : "District"} {!formData.sameAsPresent && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="permanentDistrict"
                    value={formData.permanentDistrict}
                    onChange={handleInputChange}
                    disabled={formData.sameAsPresent || !formData.permanentDivision}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.permanentDistrict ? 'border-red-300' : 'border-gray-200'
                    } disabled:opacity-60 disabled:bg-gray-50`}
                  >
                    {!formData.permanentDivision ? (
                      <option value="">{lang === 'bn' ? "প্রথমে বিভাগ নির্বাচন করুন" : "Select division first"}</option>
                    ) : (
                      <>
                        <option value="">{lang === 'bn' ? "জেলা নির্বাচন করুন" : "Select district"}</option>
                        {districtsByDivision[formData.permanentDivision]?.map(dst => (
                          <option key={dst} value={dst}>{dst}</option>
                        )) || <option value="">No districts loaded</option>}
                      </>
                    )}
                  </select>
                  {!formData.sameAsPresent && errors.permanentDistrict && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.permanentDistrict}
                    </p>
                  )}
                </div>

                {/* Full Permanent Address */}
                <div id="field-permanentFullAddress" className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "পূর্ণ ঠিকানা" : "Full Address"} {!formData.sameAsPresent && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    name="permanentFullAddress"
                    rows={3}
                    value={formData.permanentFullAddress}
                    onChange={handleInputChange}
                    disabled={formData.sameAsPresent}
                    placeholder={lang === 'bn' ? "বাসা নম্বর, সড়ক নম্বর, গ্রাম, ডাকঘর ইত্যাদি" : "House, road, area, post office"}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.permanentFullAddress ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                    } disabled:opacity-60 disabled:bg-gray-50`}
                  />
                  {!formData.sameAsPresent && errors.permanentFullAddress && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.permanentFullAddress}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Card 5: Additional Details */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "অতিরিক্ত তথ্য ও বিবরণ" : "Additional Details"}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {lang === 'bn' ? "যোগাযোগ, জাতীয়তা, ধর্ম এবং পছন্দের শ্রেণী সংক্রান্ত তথ্য" : "Contact, identification and class preference"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                
                {/* Religion dropdown */}
                <div id="field-religion" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "ধর্ম" : "Religion"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.religion ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">{lang === 'bn' ? "ধর্ম নির্বাচন করুন" : "Select religion"}</option>
                    {religions.map(r => (
                      <option key={r.en} value={r.en}>{lang === 'bn' ? r.bn : r.en}</option>
                    ))}
                  </select>
                  {errors.religion && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.religion}
                    </p>
                  )}
                </div>

                {/* Nationality */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জাতীয়তা" : "Nationality"}
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="e.g. Bangladeshi"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div id="field-phone" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "মোবাইল নম্বর" : "Phone Number"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 01814913049"
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.phone ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "ইমেইল ঠিকানা" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* NID or Birth Registration */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং" : "National ID / Birth Reg."}
                  </label>
                  <input
                    type="text"
                    name="nidBirthReg"
                    value={formData.nidBirthReg}
                    onChange={handleInputChange}
                    placeholder="NID or Birth Registration number"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* Blood Group dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "রক্তের গ্রুপ" : "Blood Group"}
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  >
                    <option value="">{lang === 'bn' ? "রক্তের গ্রুপ নির্বাচন করুন" : "Select blood group"}</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Guardian Occupation */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "পেশা (অভিভাবক)" : "Occupation (Guardian)"}
                  </label>
                  <input
                    type="text"
                    name="guardianOccupation"
                    value={formData.guardianOccupation}
                    onChange={handleInputChange}
                    placeholder="Guardian's occupation"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all"
                  />
                </div>

                {/* Marital Status (Single / Married) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {lang === 'bn' ? "বৈবাহিক অবস্থা" : "Marital Status"}
                  </label>
                  <div className="flex gap-2">
                    {['Single', 'Married'].map((ms) => {
                      const isSel = formData.maritalStatus === ms;
                      const label = lang === 'bn' ? (ms === 'Single' ? 'অবিবাহিত' : 'বিবাহিত') : ms;
                      return (
                        <button
                          key={ms}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, maritalStatus: ms }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isSel
                              ? 'bg-[#e2f5f1] border-[#025644]/30 text-[#025644] font-extrabold shadow-3xs'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Course / Class preference */}
                <div id="field-selectedClass" className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "আবেদিত শ্রেণী" : "Course / Class"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="selectedClass"
                    value={formData.selectedClass}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                      errors.selectedClass ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">{lang === 'bn' ? "আবেদনের জন্য শ্রেণী নির্বাচন করুন" : "Select class to apply for"}</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  {errors.selectedClass && (
                    <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.selectedClass}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Card 5.5: Admission Fee Payment System */}
            <div id="field-payment" className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                    {lang === 'bn' ? "ভর্তি আবেদন ফি পরিশোধ" : "Admission Application Fee Payment"} <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    {lang === 'bn' ? "যেকোনো একটি গেটওয়ে ব্যবহার করে ৫০০ টাকা আবেদন ফি পরিশোধ করুন" : "Pay 500 BDT admission application fee using any secure gateway below"}
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl text-center shrink-0">
                  <span className="text-[10px] text-emerald-800 font-bold block leading-none">{lang === 'bn' ? "মোট প্রদেয়" : "TOTAL PAYABLE"}</span>
                  <span className="text-sm font-black text-[#025644] mt-0.5 block leading-none">500.00 BDT</span>
                </div>
              </div>

              {paymentStatus === 'paid' ? (
                /* PAYMENT SUCCESS CONTAINER */
                <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-5 text-center space-y-4">
                  <div className="h-12 w-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-3xs">
                    <Check className="h-6 w-6 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-extrabold text-gray-800">
                      {lang === 'bn' ? "পেমেন্ট সফল হয়েছে!" : "Payment Successful!"}
                    </h4>
                    <p className="text-xs text-gray-500 font-semibold">
                      {lang === 'bn' 
                        ? `আপনার ৫০০ টাকা আবেদন ফি সফলভাবে গৃহীত হয়েছে।` 
                        : `Your admission fee of 500 BDT has been successfully processed.`}
                    </p>
                  </div>

                  <div className="bg-white border border-emerald-100 rounded-xl p-3.5 max-w-sm mx-auto text-xs space-y-2 font-semibold">
                    <div className="flex justify-between text-gray-400">
                      <span>{lang === 'bn' ? "পেমেন্ট মাধ্যম:" : "Payment Method:"}</span>
                      <span className="text-gray-800 font-black uppercase">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 border-t border-gray-100 pt-2">
                      <span>{lang === 'bn' ? "লেনদেন আইডি (TxnID):" : "Transaction ID:"}</span>
                      <span className="text-emerald-800 font-black font-mono">{transactionId}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 border-t border-gray-100 pt-2">
                      <span>{lang === 'bn' ? "টাকার পরিমাণ:" : "Amount Paid:"}</span>
                      <span className="text-gray-800 font-black">500.00 BDT</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStatus('unpaid');
                      setPaymentStep(1);
                      setTransactionId('');
                      setPaymentError('');
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-extrabold underline cursor-pointer transition-colors"
                  >
                    {lang === 'bn' ? "অন্য মাধ্যমে পরিশোধ করতে চান? পেমেন্ট রিসেট করুন" : "Want to use another method? Reset payment"}
                  </button>
                </div>
              ) : (
                /* SELECT GATEWAY & INTERACTION FLOW */
                <div className="space-y-5">
                  {/* Gateway selector buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* bKash */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('bkash');
                        setPaymentStep(1);
                        setPaymentError('');
                      }}
                      className={`relative overflow-hidden p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'bkash'
                          ? 'border-[#e2125b] bg-[#e2125b]/5 text-[#e2125b] ring-2 ring-[#e2125b]/20 font-black'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 font-bold'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#e2125b] text-white flex items-center justify-center font-black text-xs">
                        b
                      </div>
                      <span className="text-xs">bKash</span>
                    </button>

                    {/* Nagad */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('nagad');
                        setPaymentStep(1);
                        setPaymentError('');
                      }}
                      className={`relative overflow-hidden p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'nagad'
                          ? 'border-[#f58220] bg-[#f58220]/5 text-[#f58220] ring-2 ring-[#f58220]/20 font-black'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 font-bold'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#f58220] text-white flex items-center justify-center font-black text-xs">
                        N
                      </div>
                      <span className="text-xs">Nagad</span>
                    </button>

                    {/* Rocket */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('rocket');
                        setPaymentStep(1);
                        setPaymentError('');
                      }}
                      className={`relative overflow-hidden p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'rocket'
                          ? 'border-[#8c338c] bg-[#8c338c]/5 text-[#8c338c] ring-2 ring-[#8c338c]/20 font-black'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 font-bold'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#8c338c] text-white flex items-center justify-center font-black text-xs">
                        R
                      </div>
                      <span className="text-xs">Rocket</span>
                    </button>

                    {/* Card */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('card');
                        setPaymentStep(1);
                        setPaymentError('');
                      }}
                      className={`relative overflow-hidden p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'border-[#1a1f71] bg-[#1a1f71]/5 text-[#1a1f71] ring-2 ring-[#1a1f71]/20 font-black'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 font-bold'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1a1f71] text-white flex items-center justify-center">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <span className="text-xs">{lang === 'bn' ? "কার্ড পেমেন্ট" : "Card"}</span>
                    </button>
                  </div>

                  {/* Gateway interactive forms */}
                  {paymentMethod && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-150 rounded-2xl p-4 bg-gray-50/50 space-y-4"
                    >
                      {paymentStatus === 'processing' ? (
                        <div className="py-6 text-center space-y-3">
                          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mx-auto" />
                          <p className="text-xs font-bold text-gray-600">
                            {lang === 'bn' ? "পেমেন্ট প্রসেসিং করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." : "Processing secure payment, please wait..."}
                          </p>
                        </div>
                      ) : paymentMethod === 'card' ? (
                        /* CARD FORM */
                        <div className="space-y-3">
                          <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase block">
                            {lang === 'bn' ? "নিরাপদ কার্ড পেমেন্ট বিবরণ" : "Secure Card Details"}
                          </span>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[11px] font-bold text-gray-600 uppercase">{lang === 'bn' ? "কার্ডধারী নাম" : "Cardholder Name"}</label>
                            <input
                              type="text"
                              placeholder="e.g. Imran Hosen"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644]"
                            />
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[11px] font-bold text-gray-600 uppercase">{lang === 'bn' ? "কার্ড নম্বর" : "Card Number"}</label>
                            <input
                              type="text"
                              maxLength={19}
                              placeholder="4123 4567 8901 2345"
                              value={cardNo}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                setCardNo(val);
                              }}
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 font-mono focus:outline-none focus:border-[#025644]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5 text-left">
                              <label className="text-[11px] font-bold text-gray-600 uppercase">{lang === 'bn' ? "মেয়াদোত্তীর্ণের তারিখ" : "Expiry (MM/YY)"}</label>
                              <input
                                type="text"
                                maxLength={5}
                                placeholder="12/28"
                                value={cardExpiry}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, '');
                                  if (val.length > 2) {
                                    val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                  }
                                  setCardExpiry(val);
                                }}
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 font-mono focus:outline-none focus:border-[#025644]"
                              />
                            </div>
                            <div className="space-y-1.5 text-left">
                              <label className="text-[11px] font-bold text-gray-600 uppercase">CVV / CVC</label>
                              <input
                                type="password"
                                maxLength={3}
                                placeholder="***"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 font-mono focus:outline-none focus:border-[#025644]"
                              />
                            </div>
                          </div>

                          {paymentError && (
                            <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                              <AlertCircle className="h-3.5 w-3.5" /> {paymentError}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (!cardName.trim() || cardNo.length < 15 || cardExpiry.length < 5 || cardCvv.length < 3) {
                                setPaymentError(lang === 'bn' ? "অনুগ্রহ করে কার্ডের সকল সঠিক তথ্য প্রদান করুন।" : "Please provide all correct card credentials.");
                                return;
                              }
                              setPaymentError('');
                              setPaymentStatus('processing');
                              setTimeout(() => {
                                setPaymentStatus('paid');
                                setTransactionId(`CARD-TXN-${Math.floor(100000 + Math.random() * 900000)}`);
                              }, 1500);
                            }}
                            className="w-full py-2.5 bg-[#1a1f71] hover:bg-[#11144a] text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            {lang === 'bn' ? "৫০০ টাকা পেমেন্ট সম্পন্ন করুন" : "Pay 500 BDT Securely"}
                          </button>
                        </div>
                      ) : (
                        /* MOBILE WALLET (bKash / Nagad / Rocket) FORM */
                        <div className="space-y-4">
                          <div className="flex items-center gap-1.5">
                            <Wallet className="h-4 w-4 text-emerald-600" />
                            <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase block">
                              {paymentMethod === 'bkash' ? 'bKash Wallet Verification' : paymentMethod === 'nagad' ? 'Nagad Wallet Verification' : 'Rocket Wallet Verification'}
                            </span>
                          </div>

                          {paymentStep === 1 ? (
                            <div className="space-y-3">
                              <div className="space-y-1.5 text-left">
                                <label className="text-[11px] font-bold text-gray-600 uppercase">
                                  {paymentMethod === 'bkash' ? 'bKash Account Number' : paymentMethod === 'nagad' ? 'Nagad Account Number' : 'Rocket Account Number'}
                                </label>
                                <input
                                  type="text"
                                  maxLength={11}
                                  placeholder="01xxxxxxxxx"
                                  value={paymentNumber}
                                  onChange={(e) => setPaymentNumber(e.target.value.replace(/\D/g, ''))}
                                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 font-mono focus:outline-none focus:border-[#025644]"
                                />
                              </div>

                              {paymentError && (
                                <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                                  <AlertCircle className="h-3.5 w-3.5" /> {paymentError}
                                </p>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  if (!/^01[3-9]\d{8}$/.test(paymentNumber)) {
                                    setPaymentError(lang === 'bn' ? "১১ ডিজিটের সঠিক বাংলাদেশী মোবাইল নম্বর দিন।" : "Please provide a valid 11-digit mobile wallet number.");
                                    return;
                                  }
                                  setPaymentError('');
                                  setPaymentStep(2);
                                }}
                                className="w-full py-2.5 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                                style={{
                                  backgroundColor: paymentMethod === 'bkash' ? '#e2125b' : paymentMethod === 'nagad' ? '#f58220' : '#8c338c'
                                }}
                              >
                                {lang === 'bn' ? "ওটিপি (OTP) ও পিন কোড দিন" : "Proceed to OTP & PIN"}
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3 text-left">
                              <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-[10px] sm:text-xs text-amber-800 font-semibold leading-relaxed">
                                {lang === 'bn' 
                                  ? `একটি ডেমো ওটিপি মোবাইল নম্বর (${paymentNumber}) এ পাঠানো হয়েছে। পরীক্ষার সুবিধার জন্য যেকোনো ওটিপি: "123456" এবং পিন ব্যবহার করুন।` 
                                  : `A simulated OTP has been sent to ${paymentNumber}. For simulation, enter any OTP (e.g. 123456) and PIN.`}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5 text-left">
                                  <label className="text-[11px] font-bold text-gray-600 uppercase">{lang === 'bn' ? "ভেরিফিকেশন কোড (OTP)" : "Enter OTP"}</label>
                                  <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="123456"
                                    value={paymentOtp}
                                    onChange={(e) => setPaymentOtp(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 font-mono text-center focus:outline-none focus:border-[#025644]"
                                  />
                                </div>
                                <div className="space-y-1.5 text-left">
                                  <label className="text-[11px] font-bold text-gray-600 uppercase">{lang === 'bn' ? "ওয়ালেট পিন (PIN)" : "Enter PIN"}</label>
                                  <input
                                    type="password"
                                    maxLength={5}
                                    placeholder="*****"
                                    value={paymentPin}
                                    onChange={(e) => setPaymentPin(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 font-mono text-center focus:outline-none focus:border-[#025644]"
                                  />
                                </div>
                              </div>

                              {paymentError && (
                                <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                                  <AlertCircle className="h-3.5 w-3.5" /> {paymentError}
                                </p>
                              )}

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPaymentStep(1)}
                                  className="px-3.5 py-2.5 bg-gray-150 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                >
                                  {lang === 'bn' ? "পিছনে যান" : "Back"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (paymentOtp.length < 4 || paymentPin.length < 4) {
                                      setPaymentError(lang === 'bn' ? "সভ্য ওটিপি (OTP) এবং পিন কোড প্রদান করুন।" : "Please provide both valid OTP and PIN.");
                                      return;
                                    }
                                    setPaymentError('');
                                    setPaymentStatus('processing');
                                    setTimeout(() => {
                                      setPaymentStatus('paid');
                                      setTransactionId(`${paymentMethod.toUpperCase()}-TXN-${Math.floor(100000 + Math.random() * 900000)}`);
                                    }, 1500);
                                  }}
                                  className="flex-1 py-2.5 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                                  style={{
                                    backgroundColor: paymentMethod === 'bkash' ? '#e2125b' : paymentMethod === 'nagad' ? '#f58220' : '#8c338c'
                                  }}
                                >
                                  {lang === 'bn' ? "৫০০ টাকা পেমেন্ট নিশ্চিত করুন" : "Confirm BDT 500 Payment"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {errors.payment && (
                <p className="text-red-600 text-xs font-bold flex items-center gap-1 pt-1">
                  <AlertCircle className="h-4 w-4" /> {errors.payment}
                </p>
              )}
            </div>

            {/* Card 6: Declaration & Signature */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs text-left space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-[#025644] tracking-tight">
                  {lang === 'bn' ? "অঙ্গীকারনামা ও স্বাক্ষর" : "Declaration & Signature"}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {lang === 'bn' ? "জমা দেওয়ার পূর্বে অঙ্গীকারনামাটি সতর্কতার সাথে পড়ুন" : "Read carefully before submitting"}
                </p>
              </div>

              {/* Declaration Statement Box */}
              <div className="bg-[#f0f9f8]/60 border border-emerald-100/60 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                {lang === 'bn' 
                  ? "আমি এতদ্বারা সজ্ঞানে ঘোষণা করছি যে উপরে প্রদত্ত সমস্ত বিবরণী সম্পূর্ণ সত্য ও আমার জ্ঞানমতে নির্ভুল। আমি স্কুলের সকল প্রচলিত বিধি-বিধান ও নিয়মাবলী শৃঙ্খলা মেনে চলব এবং যেকোনো একাডেমিক ও ভর্তি সংক্রান্ত বিষয়ে স্কুল কর্তৃপক্ষের চূড়ান্ত সিদ্ধান্ত সানন্দে মেনে নিতে বাধ্য থাকব।" 
                  : "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I will obey all the rules and regulations of the institution, maintain discipline, and accept the decisions of the school authority regarding admission and academic matters."}
              </div>

              {/* Declaration Checkbox */}
              <div id="field-declarationAgreed" className="space-y-1.5 pt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none text-xs sm:text-sm font-bold text-gray-700">
                  <input
                    type="checkbox"
                    name="declarationAgreed"
                    checked={formData.declarationAgreed}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    formData.declarationAgreed ? 'bg-[#025644] border-[#025644] text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {formData.declarationAgreed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="leading-tight">
                    {lang === 'bn' 
                      ? "আমি ঘোষণাটি মনোযোগ দিয়ে পড়েছি এবং এতে সম্পূর্ণ সম্মত আছি।" 
                      : "I have read and agree to the declaration above."}
                  </span>
                </label>
                {errors.declarationAgreed && (
                  <p className="text-red-600 text-[10px] font-bold flex items-center gap-1 pl-8">
                    <AlertCircle className="h-3 w-3" /> {errors.declarationAgreed}
                  </p>
                )}
              </div>

              {/* Signature block with Draw/Type toggles */}
              <div id="field-signatureText" className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lang === 'bn' ? "শিক্ষার্থীর স্বাক্ষর" : "Student's Signature"} <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Signature type selector */}
                  <div className="flex bg-gray-100/60 p-1 rounded-xl border border-gray-200/50">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, signatureType: 'type' }))}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        formData.signatureType === 'type'
                          ? 'bg-white text-[#025644] shadow-3xs font-extrabold'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {lang === 'bn' ? "টাইপ করুন" : "Type"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, signatureType: 'draw' }))}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        formData.signatureType === 'draw'
                          ? 'bg-white text-[#025644] shadow-3xs font-extrabold'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {lang === 'bn' ? "অঙ্কন করুন" : "Draw"}
                    </button>
                  </div>
                </div>

                {/* Conditional Signature Inputs */}
                {formData.signatureType === 'type' ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      name="signatureText"
                      value={formData.signatureText}
                      onChange={handleInputChange}
                      placeholder={lang === 'bn' ? "স্বাক্ষর হিসেবে আপনার পূর্ণ নাম টাইপ করুন" : "Type your full name as signature"}
                      className={`w-full px-4 py-3 bg-white border rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#025644] transition-all ${
                        errors.signatureText ? 'border-red-300 bg-red-50/10' : 'border-gray-200'
                      }`}
                    />
                    
                    {/* Live Signature Font Preview */}
                    {formData.signatureText.trim() && (
                      <div className="pt-2 text-left">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'bn' ? "স্বাক্ষরের নমুনা প্রিভিউ:" : "Signature Preview:"}</p>
                        <p className="font-serif italic text-2xl sm:text-3xl text-emerald-800 tracking-wide mt-1 select-none border-b border-dashed border-emerald-100 pb-2 w-max max-w-full">
                          {formData.signatureText}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden shadow-inner h-32 w-full max-w-md">
                      <canvas
                        ref={canvasRef}
                        width={448}
                        height={128}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full cursor-crosshair touch-none"
                      />
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="absolute bottom-2 right-2 p-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 rounded-lg shadow-3xs transition-all flex items-center gap-1 text-[10px] font-bold uppercase"
                        title="Clear Signature"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-red-500" />
                        {lang === 'bn' ? "মুছে ফেলুন" : "Clear"}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      {lang === 'bn' ? "মাউস দিয়ে অথবা মোবাইল স্ক্রিনে স্পর্শ করে আপনার স্বাক্ষর আঁকুন।" : "Use your mouse or touchscreen to draw your signature in the box."}
                    </p>
                  </div>
                )}

                {errors.signatureText && (
                  <p className="text-red-600 text-[10px] font-bold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.signatureText}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-extrabold text-xs sm:text-sm rounded-2xl shadow-3xs transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {lang === 'bn' ? "রিসেট করুন" : "Reset"}
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-[#025644] hover:bg-[#013f32] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {lang === 'bn' ? "আবেদন জমা দিন" : "Submit Application"}
              </button>
            </div>

          </form>
        ) : (
          
          /* ======================================================= */
          /* SUCCESS STATE - HIGH FIDELITY ADMISSION RECEIPT         */
          /* ======================================================= */
          <div className="max-w-2xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 text-center shadow-md space-y-6"
            >
              <div className="h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-3xs">
                <CheckCircle className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                  {lang === 'bn' ? "ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!" : "Application Submitted Successfully!"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                  {lang === 'bn' 
                    ? "স্টুডেন্টস কেয়ার মডেল স্কুলে আবেদন করার জন্য ধন্যবাদ। আপনার সাময়িক নিবন্ধন সম্পন্ন হয়েছে এবং তথ্যগুলো ডাটাবেজে সংরক্ষণ করা হয়েছে।" 
                    : "Thank you for choosing Students Care Model School. Your temporary registration has been verified and logged in our databases."}
                </p>
              </div>

              {/* HIGH FIDELITY ADMISSION RECEIPT PRINT AREA */}
              <div 
                id="admission-receipt-print-area" 
                className="bg-white border-2 border-emerald-800/10 rounded-3xl p-6 sm:p-8 text-left space-y-6 relative overflow-hidden"
              >
                {/* Simulated Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none rotate-12">
                  <span className="text-5xl font-black text-[#025644] uppercase tracking-widest text-center">
                    STUDENTS CARE<br />MODEL SCHOOL
                  </span>
                </div>

                {/* Official School Header Header */}
                <div className="border-b-2 border-emerald-800/40 pb-4 text-center space-y-1 relative z-10">
                  <h1 className="text-xl sm:text-2xl font-black text-[#025644] tracking-tight uppercase">
                    {lang === 'bn' ? "স্টুডেন্টস কেয়ার মডেল স্কুল" : "Students Care Model School"}
                  </h1>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-500">
                    {lang === 'bn' ? "প্রধান শাখা, ঢাকা, বাংলাদেশ | মোবাইল: +৮৮০১৯১১৮১৬০৮৩" : "Main Campus, Dhaka, Bangladesh | Phone: +8801911816083"}
                  </p>
                  <div className="bg-emerald-800 text-white text-[10px] font-extrabold px-4 py-1 rounded-full uppercase tracking-widest inline-block mt-2">
                    {lang === 'bn' ? "ভর্তি আবেদন পত্র ও রশিদ" : "ADMISSION APPLICATION & FEE RECEIPT"}
                  </div>
                </div>

                {/* Simulated Receipt Slip Card Header Details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dashed border-gray-200 pb-4 gap-3 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">{lang === 'bn' ? "আবেদন আইডি নম্বর" : "Application ID"}</span>
                    <p className="text-xl font-black text-[#025644] font-mono leading-none">{generatedAppId}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'bn' ? "তারিখ:" : "Date:"} {new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                  {photo ? (
                    <div className="h-20 w-16 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-3xs shrink-0 self-start sm:self-auto">
                      <img src={photo} alt="Receipt preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <div className="h-20 w-16 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 self-start sm:self-auto text-gray-400">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Main Student details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm border-b border-gray-100 pb-5 relative z-10">
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? "শিক্ষার্থীর নাম:" : "Student Name:"}</span>
                    <p className="font-extrabold text-gray-800">{formData.studentName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? "আবেদিত শ্রেণী:" : "Applied Class:"}</span>
                    <p className="font-extrabold text-emerald-800">{formData.selectedClass}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? "পিতার নাম:" : "Father's Name:"}</span>
                    <p className="font-extrabold text-gray-800">{formData.fatherName || 'N/A'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? "মাতার নাম:" : "Mother's Name:"}</span>
                    <p className="font-extrabold text-gray-800">{formData.motherName || 'N/A'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? "জন্ম তারিখ:" : "Date of Birth:"}</span>
                    <p className="font-extrabold text-gray-800 font-mono">{formData.birthDate || 'N/A'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? "লিঙ্গ:" : "Gender:"}</span>
                    <p className="font-extrabold text-gray-800">{formData.gender}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? "মোবাইল নম্বর:" : "Contact Mobile:"}</span>
                    <p className="font-extrabold text-gray-800 font-mono">{formData.phone}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? "রক্তের গ্রুপ:" : "Blood Group:"}</span>
                    <p className="font-extrabold text-red-600 font-mono">{formData.bloodGroup || 'N/A'}</p>
                  </div>
                </div>

                {/* Embedded Payment Verification Details Box */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-3 text-xs relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800 font-extrabold uppercase text-[10px] tracking-wider">{lang === 'bn' ? "আবেদন ফি পরিশোধ স্ট্যাটাস" : "Application Fee Status"}</span>
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-3xs">
                      {lang === 'bn' ? "পরিশোধিত" : "PAID"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2.5 border-t border-emerald-500/10 text-gray-600 font-semibold text-[11px]">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase tracking-wider">{lang === 'bn' ? "পরিশোধ মাধ্যম" : "Gateway"}</span>
                      <span className="font-extrabold text-gray-800 uppercase">{paymentMethod || 'BKASH'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase tracking-wider">{lang === 'bn' ? "টাকার পরিমাণ" : "Amount Paid"}</span>
                      <span className="font-extrabold text-gray-800">500.00 BDT</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase tracking-wider">{lang === 'bn' ? "লেনদেন আইডি (TxnID)" : "Transaction ID"}</span>
                      <span className="font-extrabold font-mono text-emerald-800 text-left">{transactionId || `BKASH-TXN-${Math.floor(100000 + Math.random() * 900000)}`}</span>
                    </div>
                  </div>
                </div>

                {/* Admissions Evaluation Schedule Banner Box */}
                <div className="border border-[#025644]/20 bg-[#025644]/5 p-4 rounded-2xl border-dashed text-center relative z-10">
                  <span className="text-[10px] font-extrabold text-[#025644] uppercase tracking-wider block mb-1">
                    {lang === 'bn' ? "ভর্তি পরীক্ষার সময়সূচী" : "Admission Evaluation Schedule"}
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900">
                    {lang === 'bn' ? "শনিবার, ২৫শে জুলাই, ২০২৬ @ সকাল ১০:০০ টা" : "Saturday, July 25th, 2026 @ 10:00 AM"}
                  </p>
                  <span className="text-[10px] text-gray-500 font-medium block mt-1">
                    {lang === 'bn' ? "স্থান: স্টুডেন্টস কেয়ার প্রধান ক্যাম্পাস অডিটোরিয়াম" : "Venue: Students Care Main Campus Auditorium"}
                  </span>
                </div>

                {/* Bottom Official stamp seal and principal sign mockups */}
                <div className="pt-6 flex justify-between items-end border-t border-gray-100 text-[10px] text-gray-400 font-bold relative z-10">
                  <div className="space-y-1.5">
                    <p className="uppercase tracking-wider">{lang === 'bn' ? "অফিসিয়াল সিলমোহর" : "OFFICIAL SEAL"}</p>
                    <div className="h-14 w-14 rounded-full border border-dashed border-emerald-600/30 bg-emerald-500/5 flex items-center justify-center text-center p-1 font-mono text-[6px] text-emerald-700 leading-none rotate-12 select-none">
                      SCMS ADMISSION OFFICE APPROVED
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-serif italic text-emerald-800 text-lg leading-none select-none">Prof. Dr. Rahman</p>
                    <div className="border-t border-gray-200 pt-1 w-28 text-right uppercase tracking-wider">
                      {lang === 'bn' ? "অধ্যক্ষের স্বাক্ষর" : "PRINCIPAL SIGNATURE"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instruction Checklist of Documents */}
              <div className="text-left space-y-2.5 p-1 border border-gray-100 rounded-2xl bg-gray-50/50 p-4">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-emerald-600" />
                  {lang === 'bn' ? "পরীক্ষার দিন প্রয়োজনীয় কাগজপত্রাদি (মূল কপি সঙ্গে আনবেন)" : "Required Documents (on Exam Day)"}
                </h4>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-5 font-semibold">
                  {lang === 'bn' ? (
                    <>
                      <li>শিক্ষার্থীর সাম্প্রতিক ৩ কপি পাসপোর্ট সাইজের রঙিন ছবি।</li>
                      <li>অনলাইন জন্ম নিবন্ধন সনদের সত্যায়িত ফটোকপি।</li>
                      <li>পূর্ববর্তী বিদ্যালয়ের ছাড়পত্র (TC) ও আসল প্রগতি পত্র (রিপোর্ট কার্ড)।</li>
                      <li>এই অনলাইন আবেদন পত্রের প্রিন্ট বা ডাউনলোডকৃত PDF কপি।</li>
                    </>
                  ) : (
                    <>
                      <li>3 Copies of Passport-sized photograph of the candidate.</li>
                      <li>Attested photocopy of candidate's Birth Registration Certificate.</li>
                      <li>Transfer Certificate (TC) & original report card from the previous institution.</li>
                      <li>Printout or downloaded PDF of this online application receipt.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Receipt Screen Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {lang === 'bn' ? "রশিদ প্রিন্ট করুন" : "Print Receipt"}
                </button>
                
                {/* Download Application Summary Button */}
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-3xs"
                >
                  <Download className="h-4 w-4" />
                  {lang === 'bn' ? "আবেদন বিবরণী ডাউনলোড (PDF)" : "Download Application Summary"}
                </button>
                
                {/* PDF Download Button */}
                <button
                  onClick={downloadPDF}
                  disabled={isPdfDownloading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-3xs disabled:opacity-50"
                >
                  {isPdfDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {lang === 'bn' ? "পিডিএফ জেনারেট হচ্ছে..." : "Generating PDF..."}
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      {lang === 'bn' ? "রশিদ ডাউনলোড করুন (PDF)" : "Download Receipt (PDF)"}
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#025644] hover:bg-[#013f32] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {lang === 'bn' ? "আরেকটি আবেদন করুন" : "Apply for Another Student"}
                </button>
              </div>
            </motion.div>

            {/* Print-only Full Application Summary Document */}
            <div
              id="printable-application-summary"
              className="hidden print:block bg-white text-black text-left p-8 font-sans space-y-6 border border-gray-300 rounded-3xl"
              style={{ color: '#000000', backgroundColor: '#ffffff', minHeight: '297mm' }}
            >
              {/* Header */}
              <div className="border-b-4 border-emerald-950 pb-4 text-center space-y-1 relative">
                <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950 uppercase">
                  Students Care Model School
                </h1>
                <p className="text-xs font-bold text-gray-700">
                  Main Campus, Dhaka, Bangladesh | Phone: +8801911816083 | Email: info@scms.edu.bd
                </p>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                  Established: 2012 | EIIN: 134567 | School Code: 2084
                </p>
                <div className="bg-emerald-900 text-white text-xs font-bold px-6 py-1 rounded-full uppercase tracking-widest inline-block mt-3">
                  Official Admission Application Summary
                </div>
              </div>

              {/* Watermark Logo Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-12">
                <span className="text-7xl font-black text-[#025644] uppercase tracking-widest text-center leading-normal">
                  STUDENTS CARE<br />MODEL SCHOOL
                </span>
              </div>

              {/* Document Meta Row */}
              <div className="flex justify-between items-center bg-gray-100 p-4 rounded-xl border border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Application ID:</span>
                    <span className="text-base font-extrabold text-emerald-900 font-mono">{generatedAppId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Submission Date:</span>
                    <span className="text-xs font-extrabold text-gray-800">{new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Academic Year:</span>
                    <span className="text-xs font-extrabold text-emerald-950">2025–2026</span>
                  </div>
                </div>

                {photo ? (
                  <div className="h-28 w-24 rounded-lg border border-gray-300 overflow-hidden bg-white shrink-0 shadow-sm">
                    <img src={photo} alt="Student" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="h-28 w-24 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center shrink-0 text-center p-2 text-gray-400">
                    <User className="h-8 w-8 mb-1" />
                    <span className="text-[8px] font-bold uppercase leading-none">Photo Here</span>
                  </div>
                )}
              </div>

              {/* 1. Student Personal Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-emerald-950 border-b border-emerald-900/30 pb-1 tracking-wider">
                  1. Student Personal Details
                </h3>
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500 w-1/3">Full Name:</td>
                      <td className="py-2 font-extrabold text-gray-900 uppercase">{formData.studentName}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Applied Class:</td>
                      <td className="py-2 font-extrabold text-emerald-900">{formData.selectedClass}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Date of Birth:</td>
                      <td className="py-2 font-extrabold text-gray-800 font-mono">{formData.birthDate || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Gender:</td>
                      <td className="py-2 font-extrabold text-gray-800">{formData.gender}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Blood Group:</td>
                      <td className="py-2 font-extrabold text-red-600 font-mono">{formData.bloodGroup || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Religion:</td>
                      <td className="py-2 font-extrabold text-gray-800">{formData.religion || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Nationality:</td>
                      <td className="py-2 font-extrabold text-gray-800">{formData.nationality || 'Bangladeshi'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">NID / Birth Reg No:</td>
                      <td className="py-2 font-extrabold text-gray-800 font-mono">{formData.nidBirthReg || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2. Parent & Guardian Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-emerald-950 border-b border-emerald-900/30 pb-1 tracking-wider">
                  2. Parent & Guardian Information
                </h3>
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500 w-1/3">Father's Name:</td>
                      <td className="py-2 font-extrabold text-gray-900">{formData.fatherName || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Mother's Name:</td>
                      <td className="py-2 font-extrabold text-gray-900">{formData.motherName || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Guardian's Occupation:</td>
                      <td className="py-2 font-extrabold text-gray-800">{formData.guardianOccupation || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Contact Number:</td>
                      <td className="py-2 font-extrabold text-gray-800 font-mono">{formData.phone}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Email Address:</td>
                      <td className="py-2 font-extrabold text-gray-800 font-mono">{formData.email || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Marital Status:</td>
                      <td className="py-2 font-extrabold text-gray-800">{formData.maritalStatus || 'Single'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3. Address Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-emerald-950 border-b border-emerald-900/30 pb-1 tracking-wider">
                  3. Address Details
                </h3>
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500 w-1/3">Present Address:</td>
                      <td className="py-2 font-extrabold text-gray-800">
                        Division: {formData.presentDivision}, District: {formData.presentDistrict}, Address: {formData.presentFullAddress}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-bold text-gray-500">Permanent Address:</td>
                      <td className="py-2 font-extrabold text-gray-800">
                        {formData.sameAsPresent 
                          ? "Same as Present Address" 
                          : `Division: ${formData.permanentDivision}, District: ${formData.permanentDistrict}, Address: ${formData.permanentFullAddress}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. Payment Verification */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase text-emerald-950 border-b border-emerald-900/30 pb-1 tracking-wider">
                  4. Payment & Fee Transaction Details
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Application Fee</span>
                    <span className="font-extrabold text-gray-800">500.00 BDT</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Payment Method</span>
                    <span className="font-extrabold text-emerald-900 uppercase">{paymentMethod || 'BKASH'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Transaction ID</span>
                    <span className="font-extrabold font-mono text-emerald-900">{transactionId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Status</span>
                    <span className="text-emerald-700 font-extrabold uppercase">SUCCESS / PAID</span>
                  </div>
                </div>
              </div>

              {/* 5. Declaration & Signature */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <p className="text-[10px] text-gray-500 font-semibold italic leading-relaxed">
                  Declaration: I hereby declare that the information provided in this application is correct and true to the best of my knowledge. I will abide by all rules and regulations of Students Care Model School.
                </p>
                <div className="flex justify-between items-end text-xs text-gray-500">
                  <div>
                    <p className="font-bold">Applicant's Signature:</p>
                    {formData.signatureType === 'type' ? (
                      <p className="font-serif italic text-xl text-emerald-900 mt-1 select-none border-b border-gray-200 pb-1 w-max">
                        {formData.signatureText}
                      </p>
                    ) : (
                      signatureDataUrl ? (
                        <div className="h-12 w-48 border-b border-gray-200 mt-1">
                          <img src={signatureDataUrl} alt="Signature" className="h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <p className="border-b border-gray-200 pb-1 w-48 mt-1 italic text-gray-400">Signed Electronically</p>
                      )
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Date of Application:</p>
                    <p className="font-extrabold text-gray-800 font-mono mt-1">{new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              </div>

              {/* 6. Office Use Only Footer */}
              <div className="pt-6 mt-8 border-t-2 border-dashed border-gray-300 flex justify-between items-center text-[10px] text-gray-500 font-bold">
                <div className="space-y-1">
                  <p className="uppercase tracking-wider">OFFICIAL ADMISSIONS SEAL</p>
                  <div className="h-16 w-16 rounded-full border-2 border-dashed border-emerald-800/30 bg-emerald-50/50 flex items-center justify-center text-center p-1 font-mono text-[7px] text-emerald-800 leading-none rotate-6 select-none">
                    SCMS OFFICE APPROVED
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="font-serif italic text-emerald-900 text-sm leading-none select-none">Prof. Dr. Rahman</p>
                  <div className="border-t border-gray-200 pt-1 w-32 uppercase tracking-wider text-center">
                    PRINCIPAL SIGNATURE
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
