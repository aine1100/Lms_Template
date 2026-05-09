"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  User, 
  Book as BookIcon, 
  Calendar, 
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Loader2,
  ChevronDown
} from 'lucide-react';
import api from '@/lib/api';

const LendingPage = () => {
  const [activeTab, setActiveTab] = useState<'issue' | 'return'>('issue');
  const [loading, setLoading] = useState(false);
  
  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [studentResults, setStudentResults] = useState([]);
  const [bookResults, setBookResults] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    bookId: '',
    bookTitle: '',
    days: '14',
    transactionId: ''
  });

  // Search Students
  useEffect(() => {
    const searchStudents = async () => {
      if (studentSearch.length < 2) {
        setStudentResults([]);
        return;
      }
      try {
        const res = await api.get('/users/students'); // Reusing existing list, in real world use search endpoint
        const filtered = res.data.filter((s: any) => 
          s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
          s.email.toLowerCase().includes(studentSearch.toLowerCase())
        );
        setStudentResults(filtered);
        setShowStudentDropdown(true);
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(searchStudents, 300);
    return () => clearTimeout(timer);
  }, [studentSearch]);

  // Search Books
  useEffect(() => {
    const searchBooks = async () => {
      if (bookSearch.length < 2) {
        setBookResults([]);
        return;
      }
      try {
        const res = await api.get('/books/report');
        const filtered = res.data.filter((b: any) => 
          b.title.toLowerCase().includes(bookSearch.toLowerCase()) || 
          b.isbn.includes(bookSearch)
        );
        setBookResults(filtered);
        setShowBookDropdown(true);
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(searchBooks, 300);
    return () => clearTimeout(timer);
  }, [bookSearch]);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.bookId) {
      alert('Please select a student and a book from the list.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/books/lend', {
        userId: formData.userId,
        bookId: formData.bookId,
        days: parseInt(formData.days)
      });
      alert('Book issued successfully!');
      setFormData({ ...formData, userId: '', userName: '', bookId: '', bookTitle: '' });
      setStudentSearch('');
      setBookSearch('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/books/return', {
        transactionId: formData.transactionId
      });
      alert('Book returned successfully!');
      setFormData({ ...formData, transactionId: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Lending Management</h1>
        <p className="text-slate-500 text-xs mt-0.5">Issue books by searching for students and titles.</p>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('issue')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'issue' ? 'bg-white text-leaf border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ArrowUpRight size={14} />
          Issue Book
        </button>
        <button 
          onClick={() => setActiveTab('return')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'return' ? 'bg-white text-leaf border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ArrowDownLeft size={14} />
          Return Book
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <form onSubmit={activeTab === 'issue' ? handleIssue : handleReturn} className="space-y-5">
            {activeTab === 'issue' ? (
              <>
                {/* Student Search */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Student</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      autoComplete="off"
                      type="text"
                      placeholder="Type student name or email..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs"
                      value={formData.userName || studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                        setFormData({...formData, userName: '', userId: ''});
                      }}
                    />
                  </div>
                  {showStudentDropdown && studentResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                      {studentResults.map((s: any) => (
                        <button
                          key={s.id}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs flex justify-between items-center"
                          onClick={() => {
                            setFormData({...formData, userId: s.id, userName: s.name});
                            setShowStudentDropdown(false);
                            setStudentSearch(s.name);
                          }}
                        >
                          <div>
                            <p className="font-bold text-slate-800">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.email}</p>
                          </div>
                          <span className="text-[8px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded">SELECT</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Book Search */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Book</label>
                  <div className="relative">
                    <BookIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      autoComplete="off"
                      type="text"
                      placeholder="Type book title or ISBN..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs"
                      value={formData.bookTitle || bookSearch}
                      onChange={(e) => {
                        setBookSearch(e.target.value);
                        setFormData({...formData, bookTitle: '', bookId: ''});
                      }}
                    />
                  </div>
                  {showBookDropdown && bookResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                      {bookResults.map((b: any) => (
                        <button
                          key={b.id}
                          type="button"
                          disabled={parseInt(b.availableQuantity) === 0}
                          className={`w-full text-left px-4 py-3 hover:bg-slate-50 text-xs flex justify-between items-center ${parseInt(b.availableQuantity) === 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                          onClick={() => {
                            setFormData({...formData, bookId: b.id, bookTitle: b.title});
                            setShowBookDropdown(false);
                            setBookSearch(b.title);
                          }}
                        >
                          <div>
                            <p className="font-bold text-slate-800">{b.title}</p>
                            <p className="text-[10px] text-slate-400">ISBN: {b.isbn}</p>
                          </div>
                          {parseInt(b.availableQuantity) === 0 ? (
                            <span className="text-[8px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded">OUT</span>
                          ) : (
                            <span className="text-[8px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded">SELECT</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration (Days)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      required
                      type="number"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs"
                      value={formData.days}
                      onChange={(e) => setFormData({...formData, days: e.target.value})}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction ID</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    required
                    type="text"
                    placeholder="Enter transaction ID to return..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                  />
                </div>
              </div>
            )}

            <button 
              disabled={loading || (activeTab === 'issue' && (!formData.userId || !formData.bookId))}
              type="submit"
              className="w-full bg-leaf text-white py-3.5 rounded-xl font-bold text-xs hover:bg-leaf/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : activeTab === 'issue' ? 'Issue Book' : 'Process Return'}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" />
            Librarian Guidelines
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3 text-[11px] text-slate-500 leading-relaxed">
              <div className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5 font-mono">1</div>
              <p>Type the first few letters of a student's name to select them from the dropdown.</p>
            </div>
            <div className="flex gap-3 text-[11px] text-slate-500 leading-relaxed">
              <div className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5 font-mono">2</div>
              <p>Search for books by title or ISBN. Books that are out of stock cannot be issued.</p>
            </div>
            <div className="flex gap-3 text-[11px] text-slate-500 leading-relaxed">
              <div className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5 font-mono">3</div>
              <p>Standard lending duration is 14 days, but can be adjusted manually.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LendingPage;
