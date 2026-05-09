"use client";

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Lock, Bell, Save, LogOut } from 'lucide-react';
import api from '@/lib/api';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSave = () => {
    alert('Profile updated successfully!');
  };

  if (!user) return (
    <div className="flex h-64 items-center justify-center text-slate-400 text-xs italic">
      Loading profile...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-slate-500 text-xs mt-0.5">Manage your account preferences and library configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Nav */}
        <div className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'profile' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <UserIcon size={16} />
            My Profile
          </button>
          <button 
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'security' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Lock size={16} />
            Security
          </button>
          <button 
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === 'notifications' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bell size={16} />
            Notifications
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
            {activeSection === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-leaf text-white flex items-center justify-center font-bold text-xl">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{user.name}</h3>
                    <p className="text-xs text-slate-500">{user.role} Portal</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-primary/20 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                  <input type="email" defaultValue={user.email} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-primary/20 transition-all" />
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-primary/20 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-primary/20 transition-all" />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
              <button 
                onClick={handleLogout}
                className="text-red-500 text-xs font-bold flex items-center gap-2 hover:underline"
              >
                <LogOut size={14} />
                Logout Session
              </button>
              <button 
                onClick={handleSave}
                className="bg-leaf text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-leaf/90 transition-all"
              >
                <Save size={14} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
