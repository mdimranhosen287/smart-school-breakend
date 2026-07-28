import React from 'react';
import { Printer, Download, Filter } from 'lucide-react';

interface RoutineCell {
  subject: string;
  teacher: string;
  room: string;
}

interface RoutineData {
  [day: string]: RoutineCell[];
}

const routineData: RoutineData = {
  Sun: [{ subject: 'Math', teacher: 'Mr. Rahim', room: '101' }, { subject: 'Physics', teacher: 'Ms. Salma', room: 'Lab A' }, { subject: 'Break', teacher: '', room: '' }, { subject: 'English', teacher: 'Mr. John', room: '102' }, { subject: 'History', teacher: 'Ms. Rina', room: '103' }],
  Mon: [{ subject: 'Chemistry', teacher: 'Dr. Kabir', room: 'Lab B' }, { subject: 'Math', teacher: 'Mr. Rahim', room: '101' }, { subject: 'Break', teacher: '', room: '' }, { subject: 'Geography', teacher: 'Ms. Tasnim', room: '104' }, { subject: 'Physics', teacher: 'Ms. Salma', room: 'Lab A' }],
  Tue: [{ subject: 'English', teacher: 'Mr. John', room: '102' }, { subject: 'History', teacher: 'Ms. Rina', room: '103' }, { subject: 'Break', teacher: '', room: '' }, { subject: 'Chemistry', teacher: 'Dr. Kabir', room: 'Lab B' }, { subject: 'Math', teacher: 'Mr. Rahim', room: '101' }],
  Wed: [{ subject: 'Physics', teacher: 'Ms. Salma', room: 'Lab A' }, { subject: 'English', teacher: 'Mr. John', room: '102' }, { subject: 'Break', teacher: '', room: '' }, { subject: 'History', teacher: 'Ms. Rina', room: '103' }, { subject: 'Geography', teacher: 'Ms. Tasnim', room: '104' }],
  Thu: [{ subject: 'Math', teacher: 'Mr. Rahim', room: '101' }, { subject: 'Chemistry', teacher: 'Dr. Kabir', room: 'Lab B' }, { subject: 'Break', teacher: '', room: '' }, { subject: 'Physics', teacher: 'Ms. Salma', room: 'Lab A' }, { subject: 'English', teacher: 'Mr. John', room: '102' }],
};

const ClassRoutineGrid: React.FC = () => {
  return (
    <div id="printable-routine" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Header and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 print:hidden">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none w-full md:w-64">
            <option>Select Class & Section</option>
            <option>Class 10 - Section A</option>
            <option>Class 10 - Section B</option>
          </select>
          <button className="bg-[#005c53] hover:bg-[#004d44] text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all">
            View Routine
          </button>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium transition-all">
            <Printer size={18} /> Print
          </button>
          <button className="flex items-center gap-2 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium transition-all">
            <Download size={18} /> PDF
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto print:overflow-visible">
        <table className="w-full border-collapse text-sm print:text-black">
          <thead>
            <tr className="bg-gray-50 text-gray-600 print:bg-white print:border-b-2 print:border-gray-300">
              <th className="p-4 border border-gray-100 font-semibold text-left print:border-gray-300">Day</th>
              {[1, 2, 3, 4, 5].map((p) => (
                <th key={p} className="p-4 border border-gray-100 font-semibold text-left print:border-gray-300">
                  Period {p} <span className="block text-xs font-normal text-gray-400 print:text-gray-600">08:00 - 09:00</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(routineData).map(([day, cells]) => (
              <tr key={day} className="hover:bg-gray-50 transition-colors print:hover:bg-transparent">
                <td className="p-4 border border-gray-100 font-semibold text-gray-700 print:border-gray-300">{day}</td>
                {cells.map((cell, idx) => (
                  <td key={idx} className="p-4 border border-gray-100 min-w-[150px] print:border-gray-300">
                    {cell.subject === 'Break' ? (
                      <span className="text-gray-400 italic">Break</span>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-bold text-gray-900">{cell.subject}</div>
                        <div className="text-xs text-gray-500">{cell.teacher}</div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium print:bg-emerald-100 print:text-emerald-900">
                          Room {cell.room}
                        </span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassRoutineGrid;
