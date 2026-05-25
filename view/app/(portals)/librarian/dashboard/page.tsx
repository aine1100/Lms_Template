"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { ActivityChart, LineActivityChart } from '@/components/ActivityChart';

const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const booksRes = await api.get('/books/report');
        const studentsRes = await api.get('/users/students');
        const activityRes = await api.get('/books/activity/overview?days=7');
        
        const totalBooks = booksRes.data.length;
        const outOfStock = booksRes.data.filter((b: any) => parseInt(b.availableQuantity) === 0).length;
        const totalStudents = studentsRes.data.length;
        const activeStudents = studentsRes.data.filter((s: any) => s.status === 'Active').length;

        setStats([
          { name: 'Total Books', value: totalBooks, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Active Students', value: activeStudents, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { name: 'Out of Stock', value: outOfStock, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { name: 'Total Members', value: totalStudents, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' },
        ]);

        // Set activity data from backend
        setActivityData(activityRes.data || []);
      } catch (err) {
        console.error('Dashboard fetch failed', err);
        setActivityData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Librarian Dashboard</h1>
          <p className="text-slate-500 text-xs mt-1">Real-time overview of your library's operations.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat: any, index: number) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">{stat.name}</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-800">Library Activity Overview</h2>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar size={14} />
              Last 7 days
            </span>
          </div>
          <ActivityChart data={activityData} height={320} />
        </div>

        <div className="space-y-6">
          <div className="bg-leaf p-6 rounded-2xl text-white relative overflow-hidden">
            <h3 className="text-lg font-bold mb-1">Quick Issue</h3>
            <p className="text-xs text-green-100 opacity-80 mb-6">Jump directly to lending management.</p>
            <button className="bg-white text-leaf font-bold py-2.5 rounded-xl text-xs w-full">
              Open Lending Console
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">System Notifications</h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-slate-500">New student registration pending verification.</p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <p className="text-slate-500">3 books are currently overdue for return.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
