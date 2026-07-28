import React from 'react';
import { Printer, X, Download } from 'lucide-react';

interface StudentData {
  name: string;
  id: string;
  classSection: string;
  roll: string;
  guardian: string;
  contact: string;
}

interface AdmitCardModalProps {
  student: StudentData;
  onClose: () => void;
}

const AdmitCardModal: React.FC<AdmitCardModalProps> = ({ student, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Official Admit Card Print Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <Printer size={16} />
              Print / Download
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div id="printable-admit-card" className="flex-grow overflow-y-auto p-6 bg-gray-100">
          <div className="bg-white p-8 border rounded-lg shadow-sm mx-auto max-w-2xl min-h-[600px] relative overflow-hidden print:shadow-none print:border-none print:p-0">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 rotate-45 pointer-events-none text-6xl font-black text-gray-900 select-none">
              STUDENTS CARE
            </div>

            {/* School Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-emerald-700 tracking-tight">STUDENTS CARE MODEL SCHOOL</h1>
              <p className="text-gray-600 text-sm mt-1">123, Education Road, Dhaka | EIIN: 123456</p>
              <div className="inline-block bg-gray-900 text-white text-xs font-bold px-4 py-1 mt-4 rounded-full">
                ADMIT CARD - HALF-YEARLY EXAM 2026
              </div>
            </div>

            {/* Student Info */}
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-3 w-2/3">
                {[
                  { label: 'Student Name', value: student.name },
                  { label: 'Student ID', value: student.id },
                  { label: 'Class / Section', value: student.classSection },
                  { label: 'Roll Number', value: student.roll },
                  { label: 'Guardian', value: student.guardian },
                  { label: 'Contact No', value: student.contact },
                ].map((item) => (
                  <div key={item.label} className="flex gap-2">
                    <span className="text-gray-500 text-sm w-32">{item.label}:</span>
                    <span className="font-semibold text-gray-900 border-b border-gray-300 w-full">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="w-28 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                OFFICIAL PHOTO STAMP
              </div>
            </div>

            {/* Routine Table */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-3 border-b-2 border-emerald-600 pb-1">EXAMINATION ROUTINE & SUBJECTS</h3>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">DATE</th>
                    <th className="p-2 border">SUBJECT NAME</th>
                    <th className="p-2 border">TIMING</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '10/08/2026', subject: 'Mathematics', time: '10:00 AM - 01:00 PM' },
                    { date: '12/08/2026', subject: 'English', time: '10:00 AM - 01:00 PM' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 border">{row.date}</td>
                      <td className="p-2 border">{row.subject}</td>
                      <td className="p-2 border">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded text-xs text-gray-600">
              <p className="font-bold text-gray-800 mb-2">INSTRUCTIONS TO THE CANDIDATES</p>
              <ul className="list-decimal list-inside space-y-1">
                <li>Candidates must reach the exam hall 15 minutes before time.</li>
                <li>Bring your ID card and necessary stationery items.</li>
                <li>No electronic devices (phones, smartwatches) allowed in the hall.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmitCardModal;
