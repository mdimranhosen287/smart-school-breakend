import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

interface Student {
  id: string;
  name: string;
  roll: string;
  room: string;
  status: 'cleared' | 'pending';
}

interface SeatPlanProps {
  students?: Student[];
}

const SeatPlan: React.FC<SeatPlanProps> = ({ students: propStudents }) => {
  const [filters, setFilters] = useState({ 
    term: 'Annual', 
    class: '8', 
    section: 'A',
    room: 'Room 101',
    layoutType: 'Full Page'
  });
  const printRef = useRef<HTMLDivElement>(null);

  // Use props if provided, otherwise mock data
  const students: Student[] = propStudents || Array.from({ length: 12 }, (_, i) => ({
    id: `${i}`,
    name: `Student ${i + 1}`,
    roll: `${100 + i}`,
    room: i < 10 ? 'Room 101' : 'Room 102',
    status: i % 3 === 0 ? 'pending' : 'cleared'
  }));

  const filteredStudents = students.filter(s => s.room === filters.room);
  const isCapacityExceeded = filteredStudents.length > 10;

  const handleDownload = async () => {
    // Call API to save seat plan
    try {
      const response = await fetch('/api/seat-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            examTerm: filters.term,
            class: filters.class,
            section: filters.section,
            roomNumber: filters.room,
            layoutType: filters.layoutType
        })
      });
      const data = await response.json();
      console.log('Seat plan saved:', data);
    } catch (error) {
      console.error('Error saving seat plan:', error);
    }

    const element = printRef.current;
    if (!element) return;

    const opt = {
      margin: 0.2,
      filename: `seat-plan-${filters.class}-${filters.section}.pdf`,
      image: { type: 'jpeg' as any, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    } as any;

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6">
      {/* Filter Panel */}
      <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500">Exam Term</label>
          <select className="w-full p-2 border rounded" value={filters.term} onChange={e => setFilters({...filters, term: e.target.value})}>
            <option value="Annual">Annual</option>
            <option value="Half-Yearly">Half-Yearly</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500">Class</label>
          <select className="w-full p-2 border rounded" value={filters.class} onChange={e => setFilters({...filters, class: e.target.value})}>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500">Section</label>
          <select className="w-full p-2 border rounded" value={filters.section} onChange={e => setFilters({...filters, section: e.target.value})}>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500">Room</label>
          <select className="w-full p-2 border rounded" value={filters.room} onChange={e => setFilters({...filters, room: e.target.value})}>
            <option value="Room 101">Room 101</option>
            <option value="Room 102">Room 102</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-500">Layout</label>
          <select className="w-full p-2 border rounded" value={filters.layoutType} onChange={e => setFilters({...filters, layoutType: e.target.value})}>
            <option value="Bench Slip">Bench Slip</option>
            <option value="Full Page">Full Page</option>
          </select>
        </div>
        <div className="md:col-span-5">
          <button 
            onClick={handleDownload}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold transition-colors"
          >
            Generate & Download PDF
          </button>
        </div>
      </div>

      {isCapacityExceeded && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold">
          Warning: Room {filters.room} capacity exceeded! Current students: {filteredStudents.length} / Max: 10
        </div>
      )}

      {/* Seat Cards Grid for PDF */}
      <div className="hidden">
        <div ref={printRef} className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredStudents.map(student => (
              <div key={student.id} className={`border-2 p-4 rounded-lg flex flex-col justify-between ${student.status === 'cleared' ? 'border-custom-green-500' : 'border-custom-red-500'}`} style={{ pageBreakInside: 'avoid', height: '3.5in' }}>
                <h3 className="text-custom-green-500 font-bold text-center text-lg uppercase">STUDENTS CARE MODEL SCHOOL</h3>
                <div className="mt-2 space-y-1 text-sm border-t border-b border-gray-100 py-2">
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Class:</strong> {filters.class}</p>
                  <p><strong>Roll:</strong> {student.roll}</p>
                  <p><strong>Room:</strong> {student.room}</p>
                  <p><strong>Term:</strong> {filters.term}</p>
                  <p><strong>Status:</strong> <span className={`font-bold ${student.status === 'cleared' ? 'text-custom-green-500' : 'text-custom-red-500'}`}>{student.status.toUpperCase()}</span></p>
                </div>
                <p className="mt-2 text-[10px] text-gray-500 text-center uppercase">INSTRUCTION: Bring your Admit Card daily</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Preview for UI */}
      <div className="p-8 bg-white rounded-xl border border-gray-150 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-6">Seat Plan Preview - {filters.room}</h3>
        <div className="grid grid-cols-4 gap-4">
            {filteredStudents.map((student, i) => (
                <div key={student.id} className={`border p-3 rounded text-center ${student.status === 'cleared' ? 'bg-custom-green-50 border-custom-green-200' : 'bg-custom-red-50 border-custom-red-200'}`}>
                    <p className="text-[10px] text-gray-500">Row {Math.floor(i/2) + 1} Col {i%2 + 1}</p>
                    <p className="font-bold text-gray-800">{student.roll}</p>
                    <p className="text-xs text-gray-600 truncate">{student.name}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SeatPlan;
