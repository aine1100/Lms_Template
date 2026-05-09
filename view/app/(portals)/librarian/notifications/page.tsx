"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/users/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/users/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notifications</h1>
          <p className="text-slate-500 text-xs mt-0.5">Stay updated with library activities and alerts.</p>
        </div>
        <button className="text-[10px] font-bold text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-slate-300" size={24} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <Bell size={40} className="mx-auto text-slate-100 mb-4" />
            <p className="text-slate-400 text-xs italic">No notifications yet.</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${n.isRead ? 'bg-white border-slate-100' : 'bg-primary/5 border-primary/10'}`}
              >
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-slate-200' : 'bg-primary'}`} />
                <div className="flex-1">
                  <p className={`text-xs leading-relaxed ${n.isRead ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                    {!n.isRead && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <Check size={10} />
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
