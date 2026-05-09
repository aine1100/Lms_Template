"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', formData);
      const { accessToken, refreshToken, user } = res.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'Librarian') {
        router.push('/librarian/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-leaf text-white rounded-2xl mb-4">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-xs mt-1">Enter your credentials to access your portal</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password"  className="text-[10px] font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-leaf text-white py-3.5 rounded-xl font-bold text-xs hover:bg-leaf/90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
