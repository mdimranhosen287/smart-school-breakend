import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';

export default function AdmitCardTemplate() {
  const [formData, setFormData] = useState({
    branch: '',
    admitCardName: '',
    pageWidth: '',
    pageHeight: '',
    qrCodeText: '',
    userPhotoStyle: 'Square',
    photoSize: '',
    topSpace: '',
    bottomSpace: '',
    rightSpace: '',
    leftSpace: '',
    certificateContent: '',
  });

  const placeholders = ['{name}', '{gender}', '{father_name}', '{mother_name}', '{student_photo}', '{register_no}', '{roll}', '{admission_date}', '{class}', '{section}', '{category}', '{caste}', '{exam_name}', '{subject_list_table}', '{religion}', '{blood_group}', '{birthday}', '{email}', '{mobileno}', '{present_address}', '{permanent_address}', '{logo}', '{signature}', '{qr_code}', '{institute_name}', '{institute_email}', '{institute_address}', '{institute_mobile_no}', '{print_date}'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const insertTag = (tag: string) => {
    setFormData({ ...formData, certificateContent: formData.certificateContent + tag });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admit Card Template</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
          <select name="branch" value={formData.branch} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
            <option value="">Select</option>
            <option value="main">Main Branch</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admit Card Name *</label>
          <input type="text" name="admitCardName" value={formData.admitCardName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Layout *</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Layout Width (mm)" name="pageWidth" value={formData.pageWidth} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Layout Height (mm)" name="pageHeight" value={formData.pageHeight} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">QR Code Text</label>
          <select name="qrCodeText" value={formData.qrCodeText} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
            <option value="">Select</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Photo Style *</label>
          <div className="grid grid-cols-2 gap-2">
            <select name="userPhotoStyle" value={formData.userPhotoStyle} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg">
              <option value="Square">Square</option>
              <option value="Circle">Circle</option>
            </select>
            <input type="text" placeholder="Photo Size (px)" name="photoSize" value={formData.photoSize} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Layout Spacing *</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Top Space (px)" name="topSpace" value={formData.topSpace} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Bottom Space (px)" name="bottomSpace" value={formData.bottomSpace} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Right Space (px)" name="rightSpace" value={formData.rightSpace} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Left Space (px)" name="leftSpace" value={formData.leftSpace} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <label className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Upload size={18} /> Signature Image
          <input type="file" className="hidden" />
        </label>
        <label className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Upload size={18} /> Logo Image
          <input type="file" className="hidden" />
        </label>
        <label className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Upload size={18} /> Background Image
          <input type="file" className="hidden" />
        </label>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Content *</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Simulated Toolbar */}
            <div className="bg-gray-100 border-b p-2 flex gap-2 items-center flex-wrap">
                <span className="text-xs text-gray-500 px-2 bg-white border rounded">Arial</span>
                <span className="text-xs text-gray-500 px-2 bg-white border rounded">14</span>
                <button className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                <button className="p-1 hover:bg-gray-200 rounded italic">I</button>
                <button className="p-1 hover:bg-gray-200 rounded underline">U</button>
                <div className="h-4 w-px bg-gray-400 mx-1"></div>
                <button className="p-1 hover:bg-gray-200 rounded">≡</button>
                <button className="p-1 hover:bg-gray-200 rounded">≣</button>
            </div>
            <textarea 
              value={formData.certificateContent} 
              onChange={(e) => setFormData({ ...formData, certificateContent: e.target.value })} 
              className="w-full h-40 p-3"
              placeholder="Enter certificate content here..."
            />
        </div>
        {/* Placeholder Tags */}
        <div className="mt-4 grid grid-cols-5 gap-2">
            {placeholders.map(tag => (
                <button key={tag} onClick={() => insertTag(tag)} className="text-xs bg-gray-50 p-1 rounded border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors">
                    {tag}
                </button>
            ))}
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-[#005c53] text-white py-3 rounded-lg font-bold hover:bg-[#004a42]">
        <Save size={20} /> Save Template
      </button>
    </div>
  );
}
