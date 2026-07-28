import React, { useState } from 'react';
import { Search, ChevronDown, CheckCircle, XCircle, Save } from 'lucide-react';

const mockStudents = [
  { roll: '101', previousRoll: '901', name: 'Rahim Ahmed', marks: '85%', status: 'Pass', merit: 1 },
  { roll: '102', previousRoll: '902', name: 'Salma Begum', marks: '92%', status: 'Pass', merit: 2 },
  { roll: '103', previousRoll: '903', name: 'John Doe', marks: '35%', status: 'Fail', merit: 3 },
  { roll: '104', previousRoll: '904', name: 'Rina Islam', marks: '78%', status: 'Pass', merit: 4 },
];

const StudentPromotion: React.FC = () => {
  const [students, setStudents] = useState(mockStudents);

  return (
    <div className="space-y-6">
      {/* Promotion Criteria Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Promotion Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Current Class</option>
            <option>Class 9</option>
            <option>Class 10</option>
          </select>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Current Session</option>
            <option>2025-2026</option>
          </select>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Promote to Class</option>
            <option>Class 10</option>
            <option>Class 11</option>
          </select>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Promote to Session</option>
            <option>2026-2027</option>
          </select>
        </div>
        <button className="bg-[#005c53] hover:bg-[#004d44] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
          <Search size={16} /> Search Students
        </button>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Previous Roll</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Total Marks/GPA</th>
              <th className="p-4">Merit Position</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.roll} className="hover:bg-gray-50">
                <td className="p-4">{student.previousRoll}</td>
                <td className="p-4 font-medium text-gray-900">{student.name}</td>
                <td className="p-4">{student.marks}</td>
                <td className="p-4">{student.merit}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Pass' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {student.status === 'Pass' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {student.status}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 outline-none"
                    defaultValue={student.status === 'Pass' ? 'promote' : 'detain'}
                  >
                    <option value="promote">Promote</option>
                    <option value="detain">Detain/Repeat</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Process Button */}
      <div className="flex justify-end">
        <button className="bg-[#005c53] hover:bg-[#004d44] text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm">
            <Save size={18} /> Process Promotion
        </button>
      </div>
    </div>
  );
};

export default StudentPromotion;
