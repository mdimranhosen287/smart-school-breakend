import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

interface Student {
  id: string;
  name: string;
  roll: string;
  room: string;
}

const SeatPlanGenerator: React.FC = () => {
  const [filters, setFilters] = useState({ term: '', class: '', section: '' });
  const printRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app, fetch this based on filters
  const students: Student[] = Array.from({ length: 12 }, (_, i) => ({
    id: `${i}`,
    name: `Student ${i + 1}`,
    roll: `${100 + i}`,
    room: `Hall ${101 + Math.floor(i / 6)}`
  }));

  const handleDownload = () => {
    const element = printRef.current;
    if (!element) return;

    const opt = {
      margin: 0.2,
      filename: 'seat-plan.pdf',
      image: { type: 'jpeg' as any, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all', before: '.page-break' }
    } as any;

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6">
      {/* Filter Panel */}
      <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500">Exam Term</label>
          <select className="w-full p-2 border rounded" value={filters.term} onChange={e => setFilters({...filters, term: e.target.value})}>
            <option value="">Select Term</option>
            <option value="annual">Annual</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500">Class</label>
          <select className="w-full p-2 border rounded" value={filters.class} onChange={e => setFilters({...filters, class: e.target.value})}>
            <option value="">Select Class</option>
            <option value="8">Class 8</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500">Section</label>
          <select className="w-full p-2 border rounded" value={filters.section} onChange={e => setFilters({...filters, section: e.target.value})}>
            <option value="">Select Section</option>
            <option value="A">Section A</option>
          </select>
        </div>
        <button 
          onClick={handleDownload}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold transition-colors"
        >
          Generate & Download PDF
        </button>
      </div>

      {/* Seat Cards Grid for PDF */}
      <div className="hidden">
        <div ref={printRef} className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {students.map(student => (
              <div key={student.id} className="border-2 border-gray-300 p-4 rounded-lg" style={{ pageBreakInside: 'avoid' }}>
                <h3 className="text-green-700 font-bold text-center text-lg">STUDENTS CARE MODEL SCHOOL</h3>
                <div className="mt-4 space-y-1 text-sm">
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Class:</strong> {filters.class || 'N/A'}</p>
                  <p><strong>Roll:</strong> {student.roll}</p>
                  <p><strong>Room:</strong> {student.room}</p>
                  <p><strong>Term:</strong> {filters.term || 'N/A'}</p>
                </div>
                <p className="mt-4 text-[10px] text-gray-500 text-center uppercase">INSTRUCTION: Bring your Admit Card daily</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Preview for UI */}
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        Preview will appear in the generated PDF.
      </div>
    </div>
  );
};

export default SeatPlanGenerator;
