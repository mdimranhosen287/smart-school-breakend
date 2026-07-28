import React, { useState } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';

interface Assignment {
  id: number;
  exam: string;
  room: string;
  date: string;
  shift: string;
  teacher: string;
}

const teachers = ['Mr. Abdul Hye', 'Dr. Farhana Rahman', 'Mr. Rafiqul Islam', 'Mrs. Tasnim Jahan', 'Mrs. Shamima Sultana', 'Mr. Imran Hosen'];
const rooms = ['301', '302', '204', 'Lab 1', 'Hall 1'];
const exams = ['Mid Term', 'Annual Exam', 'Pre-Test'];

export default function ExamHallDuty() {
  const [exam, setExam] = useState('');
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('Morning');
  const [teacher, setTeacher] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [warning, setWarning] = useState<string | null>(null);

  const handleAssign = () => {
    if (!exam || !room || !date || !teacher) {
      setWarning('Please fill in all fields!');
      return;
    }

    // Conflict Check: Teacher already assigned in same date and shift?
    const conflict = assignments.find(
      (a) => a.teacher === teacher && a.date === date && a.shift === shift
    );

    if (conflict) {
      setWarning(`⚠️ Warning: ${teacher} is already assigned to Room ${conflict.room} on this ${shift} shift!`);
      return;
    }

    const newAssignment = {
      id: Date.now(),
      exam,
      room,
      date,
      shift,
      teacher
    };

    setAssignments([...assignments, newAssignment]);
    setWarning(null);
  };

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#005c53] mb-6">Exam Hall Duty Allocation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">1. Input & Selection Panel</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam</label>
              <select value={exam} onChange={(e) => setExam(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">Select Exam</option>
                {exams.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Room</label>
              <select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">Select Room</option>
                {rooms.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Shift</label>
                <select value={shift} onChange={(e) => setShift(e.target.value)} className="w-full p-2 border rounded-lg">
                  <option value="Morning">Morning</option>
                  <option value="Day">Day</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teacher</label>
              <select value={teacher} onChange={(e) => setTeacher(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button onClick={handleAssign} className="w-full bg-[#005c53] text-white py-2 rounded-lg font-bold hover:bg-[#004a42]">
              Assign Duty
            </button>
            {warning && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {warning}
              </div>
            )}
          </div>
        </div>

        {/* Assignment Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">2. Smart Assignment Panel</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2">Teacher</th>
                  <th className="p-2">Room</th>
                  <th className="p-2">Exam/Shift/Date</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">{a.teacher}</td>
                    <td className="p-2">{a.room}</td>
                    <td className="p-2 text-xs text-gray-500">{a.exam} | {a.shift} | {a.date}</td>
                    <td className="p-2">
                      <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
