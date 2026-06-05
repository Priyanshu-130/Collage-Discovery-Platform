'use client';
import React, { useState } from 'react';
import { X, GraduationCap, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}
export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const { login, signup } = useApp();
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    if (!isOpen)
        return null;
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        if (mode === 'signup' && !name.trim()) {
            setError('Please enter your full name.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (mode === 'login') {
            const defaultName = email.split('@')[0];
            const displayName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
            login(displayName, email);
        }
        else {
            signup(name, email);
        }
        onClose();
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose}/>
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300">
        
        <div className="bg-slate-900 px-6 py-8 text-white relative">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl"/>
          
          <button onClick={onClose} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="h-4.5 w-4.5"/>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow text-white shrink-0">
              <GraduationCap className="h-6 w-6"/>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Colla Account</h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Simulated Premium SaaS Discovery License</p>
            </div>
          </div>
        </div>

        
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
          <button onClick={() => {
            setMode('login');
            setError('');
        }} className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-200 ${mode === 'login'
            ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
            : 'text-slate-500 hover:text-slate-800'}`}>
            Sign In
          </button>
          <button onClick={() => {
            setMode('signup');
            setError('');
        }} className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-200 ${mode === 'signup'
            ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
            : 'text-slate-500 hover:text-slate-800'}`}>
            Create Account
          </button>
        </div>

        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (<div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs font-semibold text-red-600 leading-normal">
              {error}
            </div>)}

          {mode === 'signup' && (<div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4.5 w-4.5"/>
                </span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priyanshu Ranjan" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-inner outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"/>
              </div>
            </div>)}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4.5 w-4.5"/>
              </span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. user@domain.com" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-inner outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4.5 w-4.5"/>
              </span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-inner outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"/>
            </div>
          </div>

          
          <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 p-3.5">
            <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5"/>
            <div>
              <span className="block text-xs font-bold text-indigo-900 leading-none">Instant Premium Access</span>
              <span className="block text-[11px] text-indigo-600 font-semibold mt-1 leading-normal">
                Signing in unlocks matching predictors, unlimited comparison slots, and accounts bookmarks sync.
              </span>
            </div>
          </div>

          <button type="submit" className="w-full rounded-xl bg-slate-900 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-slate-900/10 hover:bg-indigo-600 hover:shadow-indigo-600/10 active:scale-[0.98] transition-all">
            {mode === 'login' ? 'Sign In to Premium' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>);
}
