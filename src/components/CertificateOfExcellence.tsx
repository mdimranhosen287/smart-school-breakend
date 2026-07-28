import React, { useState } from 'react';

const CertificateOfExcellence = () => {
  const [data, setData] = useState({
    studentName: 'Nusrat Jahan Prity',
    fatherName: 'Father Name',
    motherName: 'Mother Name',
    roll: '00',
    regNo: '00',
    session: '2024-2025',
    classExam: 'Class Eight',
    gpa: '1st Position',
    description: 'Obtains 1st Position in Class Eight in the Annual Examination 2024',
    wishes: 'We wish for a successful a glorious career in future',
    fontSize: 14,
    fontColor: '#000000',
    backgroundImage: null as string | null,
    studentPhoto: null as string | null
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-xl border border-gray-150 shadow-sm">
      {/* Input Form */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="font-bold text-gray-900 mb-4">Certificate Setup</h3>
        <input type="text" placeholder="Student Name" value={data.studentName} onChange={e => setData({...data, studentName: e.target.value})} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Class/Exam" value={data.classExam} onChange={e => setData({...data, classExam: e.target.value})} className="w-full p-2 border rounded" />
        <textarea placeholder="Achievement" value={data.description} onChange={e => setData({...data, description: e.target.value})} className="w-full p-2 border rounded" rows={3} />
        <textarea placeholder="Wishes Message" value={data.wishes} onChange={e => setData({...data, wishes: e.target.value})} className="w-full p-2 border rounded" rows={3} />
        <label className="block text-xs font-bold text-gray-500">Student Photo</label>
        <input type="file" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setData(prev => ({ ...prev, studentPhoto: reader.result as string }));
                reader.readAsDataURL(file);
            }
        }} className="w-full p-2 border rounded" />
        <button onClick={() => window.print()} className="w-full py-2 bg-blue-600 text-white rounded font-bold">Generate & Print</button>
      </div>

      {/* Preview */}
      <div className="lg:col-span-8 p-10 bg-white border-2 border-gray-300 shadow-xl print:shadow-none" style={{ 
          backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : 'none', 
          backgroundSize: 'cover', 
          fontSize: `${data.fontSize}px`, 
          color: data.fontColor,
          minHeight: '700px'
      }}>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-wider">STUDENTS CARE MODEL SCHOOL</h1>
          <p className="text-sm">1 NO CHARLAKSHYA, BOARD BAZAR, KARNAPHULI, CHATTOGRAM</p>
          <h2 className="text-3xl font-bold text-amber-700 underline py-4">CERTIFICATE OF EXCELLENCE</h2>
          
          <div className="flex justify-center my-6">
              <div className="w-32 h-40 border-2 border-gray-400 bg-gray-50 flex items-center justify-center overflow-hidden">
                {data.studentPhoto ? (
                    <img src={data.studentPhoto} alt="Student" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400">Photo</span>
                )}
              </div>
          </div>

          <div className="text-center space-y-4 mt-6">
            <p className="text-xl">This is to certify that</p>
            <p className="text-5xl font-bold text-blue-900">{data.studentName}</p>
            <p className="text-lg text-justify">{data.description}</p>
            <p className="text-xl font-bold text-green-700">{data.wishes}</p>
          </div>
        </div>
        
        {/* Footer Signature */}
        <div className="flex justify-between items-end mt-20">
            <div className="text-center border-t-2 border-gray-800 px-4 pt-1 text-sm font-bold">Exam Controller</div>
            <div className="w-20 h-20 bg-amber-100 rounded-full border-4 border-amber-300 flex items-center justify-center font-bold text-xs">LOGO</div>
            <div className="text-center border-t-2 border-gray-800 px-4 pt-1 text-sm font-bold">HEAD TEACHER</div>
        </div>
      </div>
    </div>
  );
};

export default CertificateOfExcellence;
