"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BookOpen,
  ArrowUpDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  totalQuantity: string;
  availableQuantity: string;
}

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    totalQuantity: '1',
    availableQuantity: '1'
  });

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books/report');
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', newBook);
      setShowAddModal(false);
      setNewBook({ title: '', author: '', isbn: '', genre: '', totalQuantity: '1', availableQuantity: '1' });
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add book');
    }
  };

  const handleDeleteBook = async (id:any) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Library Catalog</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage and track your library's collection.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-leaf hover:bg-leaf/90 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={16} />
          Add New Book
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-primary/20 outline-none transition-all text-xs text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors text-xs border border-slate-100">
            <Filter size={14} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors text-xs border border-slate-100">
            <ArrowUpDown size={14} />
            Sort
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Book Details</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Genre</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400 text-xs italic">Loading collection...</td></tr>
              ) : filteredBooks.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400 text-xs italic">No books found matching your search.</td></tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 border border-slate-100 relative">
                          <BookOpen size={20} />
                          {parseInt(book.availableQuantity) === 0 && (
                            <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
                              <span className="text-red-500 text-[8px] font-bold px-1 py-0.5 rounded border border-red-200">OUT</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{book.title}</p>
                          <p className="text-xs text-slate-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                        {book.genre || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                      {book.isbn}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                          <div 
                            className={`h-full rounded-full ${parseInt(book.availableQuantity) > 5 ? 'bg-primary' : parseInt(book.availableQuantity) > 0 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${(parseInt(book.availableQuantity) / parseInt(book.totalQuantity)) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{book.availableQuantity}/{book.totalQuantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Add New Book</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddBook} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Book Title</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary/30 focus:bg-white text-xs"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Author</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary/30 focus:bg-white text-xs"
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ISBN</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary/30 focus:bg-white text-xs"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Genre</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary/30 focus:bg-white text-xs"
                      value={newBook.genre}
                      onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Qty</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary/30 focus:bg-white text-xs"
                      value={newBook.totalQuantity}
                      onChange={(e) => setNewBook({...newBook, totalQuantity: e.target.value, availableQuantity: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-leaf text-white py-3 rounded-xl font-bold text-xs mt-2 hover:bg-leaf/90 transition-all">
                  Save Book to Library
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BooksPage;
