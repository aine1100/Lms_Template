"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/librarian/dashboard' },
  { name: 'Books', icon: BookOpen, path: '/librarian/books' },
  { name: 'Members', icon: Users, path: '/librarian/students' },
  { name: 'Lending', icon: ArrowLeftRight, path: '/librarian/lending' },
  { name: 'Notifications', icon: Bell, path: '/librarian/notifications' },
  { name: 'Settings', icon: Settings, path: '/librarian/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <BookOpen size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-leaf">LeafLMS</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-leaf'}
              `}>
                <item.icon size={20} className={isActive ? 'text-primary' : 'text-slate-400 group-hover:text-leaf'} />
                <span className="text-xs">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="ml-auto w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Logged in as</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-leaf/10 flex items-center justify-center text-leaf font-bold text-[10px]">
              LA
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Librarian Admin</p>
              <p className="text-[10px] text-slate-500">Librarian Portal</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 text-xs font-bold"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
