"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface BorrowedBook {
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  dueDate: string;
  issueDate: string;
  genre?: string;
}

interface StudentBooks {
  student: {
    id: string;
    email: string;
    name: string;
  };
  books: BorrowedBook[];
}

export default function MyBooksPage() {
  const [books, setBooks] = useState<BorrowedBook[]>([]);
  const [student, setStudent] = useState<StudentBooks['student'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        setLoading(true);
        // Call the new endpoint that returns current user's borrowed books
        const response = await api.get(`/books/my-borrowed`);
        setBooks(response.data.books || []);
        setStudent(response.data.student);
      } catch (err) {
        console.error('Error fetching borrowed books:', err);
        setError('Failed to load your borrowed books');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const getStatusInfo = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysLeft < 0) {
      return {
        status: 'overdue',
        message: `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''}`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: AlertCircle,
      };
    } else if (daysLeft <= 3) {
      return {
        status: 'due-soon',
        message: `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: Clock,
      };
    } else {
      return {
        status: 'ok',
        message: `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: CheckCircle,
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Borrowed Books</h1>
        <p className="text-slate-500">Track your borrowed books and their due dates</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* No Books Message */}
      {!loading && books.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No Books Borrowed</h3>
          <p className="text-slate-500 mb-4">You haven't borrowed any books yet</p>
          <a 
            href="/student/all-books" 
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Browse Library
          </a>
        </motion.div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book, index) => {
          const statusInfo = getStatusInfo(book.dueDate);
          const StatusIcon = statusInfo.icon;

          return (
            <motion.div
              key={book.bookId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
            >
              {/* Status Badge */}
              <div className={`inline-block ${statusInfo.bgColor} ${statusInfo.color} rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-3`}>
                {statusInfo.status === 'overdue' && '⚠️ Overdue'}
                {statusInfo.status === 'due-soon' && '⏰ Due Soon'}
                {statusInfo.status === 'ok' && '✓ On Time'}
              </div>

              {/* Book Info */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-1">{book.title}</h3>
                <p className="text-xs text-slate-500 mb-2">{book.author}</p>
                {book.isbn && (
                  <p className="text-[10px] text-slate-400">ISBN: {book.isbn}</p>
                )}
              </div>

              {/* Due Date */}
              <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Borrowed</span>
                  <span className="text-xs text-slate-500">
                    {new Date(book.issueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Due Date</span>
                  <span className={`text-xs font-bold ${statusInfo.color}`}>
                    {new Date(book.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status Message */}
              <div className={`flex items-center gap-2 mt-4 p-2 rounded-lg ${statusInfo.bgColor}`}>
                <StatusIcon size={14} className={statusInfo.color} />
                <span className={`text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.message}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
