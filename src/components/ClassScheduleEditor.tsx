import React, { useState } from 'react';
import { Copy, Clock, AlertCircle, Save } from 'lucide-react';

// Mock data structures
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

const AVAILABLE_SUBJECTS = ['Math', 'Physics', 'English', 'History', 'Chemistry'];
const AVAILABLE_TEACHERS = ['Mr. Rahim', 'Ms. Salma', 'Mr. John', 'Ms. Rina', 'Dr. Kabir'];

const ClassScheduleEditor: React.FC = () => {
  const [schedules, setSchedules] = useState<any>(() => {
    const saved = localStorage.getItem('school_class_schedule');
    return saved ? JSON.parse(saved) : {};
  });

  const [periods, setPeriods] = useState([
    { id: 1, name: 'Period 1', time: '08:00 - 08:45' },
    { id: 2, name: 'Period 2', time: '08:45 - 09:30' },
    { id: 3, name: 'Period 3', time: '09:30 - 10:15' },
    { id: 'break', name: 'Break', time: '10:15 - 10:30', isBreakRow: true },
    { id: 4, name: 'Period 4', time: '10:30 - 11:15' },
    { id: 5, name: 'Period 5', time: '11:15 - 12:00' },
    { id: 6, name: 'Period 6', time: '12:00 - 12:45' },
  ]);

  const handleSaveSchedule = () => {
    localStorage.setItem('school_class_schedule', JSON.stringify(schedules));
    console.log('Saved schedules:', schedules);
    alert('Schedule saved successfully!');
  };

  const handlePeriodTimeChange = (id: number | string, newTime: string) => {
    setPeriods(prev => prev.map(p => p.id === id ? { ...p, time: newTime } : p));
  };

  const handleCellChange = (day: string, periodId: number, field: string, value: string) => {
    setSchedules((prev: any) => {
      const newSchedules = {
        ...prev,
        [`${day}-${periodId}`]: {
          ...(prev[`${day}-${periodId}`] || {}),
          [field]: value
        }
      };
      return newSchedules;
    });
  };

  const markBreak = (day: string, periodId: number) => {
      setSchedules((prev: any) => ({
        ...prev,
        [`${day}-${periodId}`]: { isBreak: true }
      }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Header and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-2xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 w-full md:w-64">
            <option>Select Class</option>
            <option>Class 10 - A</option>
          </select>
          <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 w-full md:w-64">
            <option>Copy Schedule To</option>
            <option>Class 10 - B</option>
          </select>
          <button className="bg-[#005c53] hover:bg-[#004d44] text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
            <Copy size={16} /> Copy Schedule
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-4 border border-gray-100 font-semibold text-left">Day</th>
              {periods.map((p) => (
                <th key={p.id} className="p-4 border border-gray-100 font-semibold text-left">
                  {p.name}
                  <input
                    type="text"
                    value={p.time}
                    onChange={(e) => handlePeriodTimeChange(p.id, e.target.value)}
                    className="block text-xs font-normal text-gray-400 w-24 border rounded mt-1"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS_OF_WEEK.map((day) => (
              <tr key={day}>
                <td className="p-4 border border-gray-100 font-semibold text-gray-700">{day}</td>
                {periods.map((period) => {
                  const cell = schedules[`${day}-${period.id}`] || {};
                  const isConflict = false; // Add conflict logic here
                  if (period.isBreakRow) {
                    return <td key={period.id} className="p-2 border border-gray-100 bg-gray-50 text-center italic text-gray-400">Break</td>;
                  }
                  return (
                    <td key={period.id} className={`p-2 border border-gray-100 ${isConflict ? 'border-red-500' : ''}`}>
                      {cell.isBreak ? (
                         <div className="text-center italic text-gray-400">Break</div>
                      ) : (
                        <div className="space-y-2">
                          <select 
                            className="w-full text-xs border rounded p-1" 
                            value={cell.subject || ""}
                            onChange={(e) => handleCellChange(day, period.id as number, 'subject', e.target.value)}
                          >
                            <option value="">Subject</option>
                            {AVAILABLE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <select 
                            className="w-full text-xs border rounded p-1" 
                            value={cell.teacher || ""}
                            onChange={(e) => handleCellChange(day, period.id as number, 'teacher', e.target.value)}
                          >
                            <option value="">Teacher</option>
                            {AVAILABLE_TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <input 
                            type="text" 
                            placeholder="Room" 
                            value={cell.room || ""}
                            className="w-full text-xs border rounded p-1" 
                            onChange={(e) => handleCellChange(day, period.id as number, 'room', e.target.value)} 
                          />
                          <button onClick={() => markBreak(day, period.id as number)} className="text-[10px] text-emerald-700 underline">Mark Break</button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSaveSchedule} className="bg-[#005c53] hover:bg-[#004d44] text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
            <Save size={18} /> Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ClassScheduleEditor;
