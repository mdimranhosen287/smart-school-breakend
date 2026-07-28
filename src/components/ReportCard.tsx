import React from 'react';
import { Printer, FileDown, Info } from 'lucide-react';

const reportData = {
  schoolName: "STUDENTS CARE MODEL SCHOOL",
  address: "123 Main Road, Dhaka, Bangladesh",
  eiin: "123456",
  examName: "Annual Examination 2026",
  badge: "Academic Progress Report",
  student: {
    name: "John Doe",
    father_name: "Jane Doe",
    mother_name: "Janet Doe",
    dob: "01/01/2015",
    id: "SC2026001",
    class: "VIII",
    section: "A",
    roll: "05",
    session: "2026",
    "blood Group": "O+",
  },
  results: [
    { subject: "Bangla", theory: 80, mcq: 15, practical: 0, highest: 98, total: 95, grade: "A+", gp: 5.0, combined: true, papers: ["Bangla 1st", "Bangla 2nd"] },
    { subject: "English", theory: 75, mcq: 0, practical: 0, highest: 90, total: 75, grade: "A", gp: 4.0, combined: false },
    { subject: "Mathematics", theory: 90, mcq: 0, practical: 0, highest: 100, total: 90, grade: "A+", gp: 5.0, combined: false },
  ],
  gradingScale: [
      { range: "80-100", grade: "A+", gp: 5.0 },
      { range: "70-79", grade: "A", gp: 4.0 },
      { range: "60-69", grade: "A-", gp: 3.5 },
  ],
  summary: { totalMarks: 260, gpa: 4.67, merit: 2, finalResult: "Passed" },
  attendance: { working: 220, present: 211, percentage: 96, grade: "A" },
  remarks: "Keep the good work and maintain consistency."
};

export default function ReportCard() {
  const handlePrintOrPdf = () => {
    window.print();
  };

  return (
    <>
      {/* Top Action Control Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden text-left">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            Report Card Print & PDF Controls
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Click print or download. In the print dialog, select <strong className="text-emerald-700">"Save as PDF"</strong> as the destination to download a high-resolution PDF.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handlePrintOrPdf}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Report Card
          </button>
          <button 
            onClick={handlePrintOrPdf}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div id="printable-report-card" className="bg-white p-6 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border-[2px] border-[#1b5e20]">
        {/* Header */}
      <header className="grid grid-cols-[100px_1fr_auto] gap-4 items-center mb-4 border-b-2 border-emerald-600 pb-2">
        <div className="w-20 h-20 bg-gray-200 border flex items-center justify-center rounded-full">Logo</div>
        <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{reportData.schoolName}</h1>
            <p className="text-xs text-gray-500 mt-0.5">EIIN: {reportData.eiin} | {reportData.address}</p>
            <span className="inline-block mt-1 px-3 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold">{reportData.badge} - {reportData.examName}</span>
        </div>
        <div className="text-[10px] justify-self-end">
            <table className="text-center w-full border border-gray-300 border-collapse">
                <thead>
                    <tr>
                        <th className="px-1 border border-gray-300 font-bold">Marks</th>
                        <th className="px-1 border border-gray-300 font-bold">Grade</th>
                        <th className="px-1 border border-gray-300 font-bold">Point</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.gradingScale.map((s, i) => (
                        <tr key={i}>
                            <td className="px-1 border border-gray-300">{s.range}</td>
                            <td className={`px-1 border border-gray-300 font-bold ${s.grade === 'A+' ? 'text-green-600' : s.grade === 'F' ? 'text-red-600' : 'text-gray-900'}`}>{s.grade}</td>
                            <td className="px-1 border border-gray-300">{s.gp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </header>

      {/* Profile */}
      <div className="grid grid-cols-4 gap-6 mb-6 border p-4 bg-gray-50">
        <div className="col-span-3 grid grid-cols-2 gap-y-2 text-sm">
          {Object.entries(reportData.student).map(([key, value]) => (
            <p key={key}><span className="font-bold capitalize">{key.replace('_', ' ')}:</span> {value}</p>
          ))}
        </div>
        <div className="border-2 border-gray-300 w-24 h-32 ml-auto flex items-center justify-center bg-gray-100">Photo</div>
      </div>

      {/* Results Table */}
      <table className="w-full text-left mb-6 border-collapse text-sm">
        <thead className="bg-emerald-800 text-white">
          <tr>
            <th className="p-3 border">Subject Name</th>
            <th className="p-3 border">Theory</th>
            <th className="p-3 border">MCQ</th>
            <th className="p-3 border">Practical</th>
            <th className="p-3 border">Highest Mark</th>
            <th className="p-3 border">Total</th>
            <th className="p-3 border">Grade</th>
            <th className="p-3 border">GP</th>
          </tr>
        </thead>
        <tbody>
          {reportData.results.map((res, i) => (
            <React.Fragment key={i}>
              <tr className="border-b">
                <td className={`p-3 border font-bold ${res.combined ? 'text-gray-900' : ''}`}>{res.subject} {res.combined && "(Combined)"}</td>
                <td className="p-3 border">{res.theory}</td>
                <td className="p-3 border">{res.mcq}</td>
                <td className="p-3 border">{res.practical}</td>
                <td className="p-3 border">{res.highest}</td>
                <td className="p-3 border font-bold">{res.total}</td>
                <td className="p-3 border font-bold">{res.grade}</td>
                <td className="p-3 border font-bold">{res.gp}</td>
              </tr>
              {res.combined && res.papers?.map((p, j) => (
                <tr key={j} className="bg-gray-50 text-xs border">
                  <td className="p-2 pl-8 text-gray-600 border">{p}</td>
                  <td className="p-2 border" colSpan={7}></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Summary Boxes */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {['Total Marks', 'GPA', 'Merit', 'Final Result'].map((label, i) => (
          <div key={label} className={`border p-3 text-center ${i === 3 ? 'bg-emerald-800 text-white' : 'bg-white'}`}>
            <p className="text-xs font-bold uppercase opacity-80">{label}</p>
            <p className="text-xl font-extrabold mt-1">{i === 0 ? reportData.summary.totalMarks : i === 1 ? reportData.summary.gpa : i === 2 ? reportData.summary.merit : reportData.summary.finalResult}</p>
          </div>
        ))}
      </div>

      {/* New Sections: Attendance, Behavior, QR */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="border p-4">
            <h4 className="font-bold text-emerald-900 mb-2">Attendance Summary</h4>
            <p>Working Days: {reportData.attendance.working}</p>
            <p>Present Days: {reportData.attendance.present}</p>
            <p>Percentage: {reportData.attendance.percentage}%</p>
            <p className="font-bold mt-2">Attendance Grade: {reportData.attendance.grade}</p>
        </div>
        <div className="border p-4 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-200 border flex items-center justify-center">QR Code</div>
            <p className="text-[10px] mt-2 text-center">Digital Verification Stamp</p>
        </div>
      </div>
      
      {/* Teacher Remarks */}
      <div className="mb-8 border p-4">
        <h4 className="font-bold text-emerald-900 mb-1">Teacher's Remarks</h4>
        <p className="text-sm bg-gray-50 p-3 border">{reportData.remarks}</p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 mt-10 pt-6 border-t border-gray-300">
        <p className="text-center font-bold border-t-2 border-gray-800 pt-2 text-xs">Class Teacher</p>
        <p className="text-center font-bold border-t-2 border-gray-800 pt-2 text-xs">Exam Controller</p>
        <p className="text-center font-bold border-t-2 border-gray-800 pt-2 text-xs">Principal</p>
      </div>
      </div>
    </>
  );
}
