import React, { useState } from 'react';
import { Save, Trash2, Edit2 } from 'lucide-react';

export default function SessionSettings() {
  const [session, setSession] = useState('');
  const [sessions, setSessions] = useState([
    { id: 1, name: '2021', status: 'Active', createdAt: '26.Feb.2020' },
    { id: 2, name: '2022', status: 'Active', createdAt: '26.Feb.2020' },
    { id: 3, name: '2023', status: 'Selected Session', createdAt: '26.Feb.2020' },
  ]);

  const handleAddSession = () => {
    if (session) {
      setSessions([...sessions, { id: Date.now(), name: session, status: 'Active', createdAt: new Date().toLocaleDateString() }]);
      setSession('');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Session Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Session */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Add Session</h3>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session *</label>
          <input 
            type="text" 
            value={session} 
            onChange={(e) => setSession(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg mb-4" 
            placeholder="Enter session year"
          />
          <button 
            onClick={handleAddSession}
            className="flex items-center justify-center gap-2 bg-[#005c53] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#004a42]"
          >
            <Save size={20} /> Save
          </button>
        </div>

        {/* Session List */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Sessions List</h3>
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="p-3">Session</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-3 font-medium text-gray-900">{s.name}</td>
                  <td className="p-3">{s.status}</td>
                  <td className="p-3">{s.createdAt}</td>
                  <td className="p-3 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                    <button className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
