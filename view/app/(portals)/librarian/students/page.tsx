"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, UserCheck, UserX, History, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [history, setHistory] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/users/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (id: string) => {
    try {
      const res = await api.get(`/users/students/${id}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await api.put(`/users/students/${id}/status`, { status: newStatus });
      fetchStudents();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredStudents = students.filter((s: any) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Directory</h1>
          <p className="text-slate-500 text-xs mt-0.5">Monitor member activity and manage account statuses.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl focus:border-primary/20 outline-none text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50">
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Status</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400 text-xs italic">Loading directory...</td></tr>
            ) : filteredStudents.map((student: any) => (
              <tr key={student.id} className="hover:bg-slate-50/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                      {student.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${student.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setSelectedStudent(student);
                        fetchHistory(student.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      title="View History"
                    >
                      <History size={16} />
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(student.id, student.status)}
                      className={`p-1.5 rounded-lg transition-all ${student.status === 'Active' ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-green-500 hover:bg-green-50'}`}
                      title={student.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                    >
                      {student.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-leaf text-white flex items-center justify-center font-bold">
                    {selectedStudent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedStudent.name}</h3>
                    <p className="text-[10px] text-slate-500 font-medium tracking-tight">Borrowing History</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-8">No transaction history found for this student.</p>
                ) : (
                  <div className="space-y-4">
                    {history.map((h: any) => (
                      <div key={h.transactionId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{h.bookTitle}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Issued: {new Date(h.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${h.status === 'Returned' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {h.status}
                          </span>
                          <p className="text-[9px] text-slate-400 mt-1">Due: {new Date(h.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsPage;
