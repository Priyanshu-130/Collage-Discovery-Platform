'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell, Bookmark, GitCompare, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AuthModal from './AuthModal';

interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { savedColleges, compareColleges, user, logout } = useApp();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (<header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/70 px-6 backdrop-blur-md">
      
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden">
          <Menu className="h-5 w-5"/>
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">College Discovery</h1>
        </div>
      </div>

      
      <div className="flex items-center gap-3">
        
        <Link href="/compare" className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors" title="Compare Colleges">
          <GitCompare className="h-4.5 w-4.5"/>
          {compareColleges.length > 0 && (<span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {compareColleges.length}
            </span>)}
        </Link>

        
        <Link href="/saved" className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors" title="Saved Bookmarks">
          <Bookmark className="h-4.5 w-4.5"/>
          {savedColleges.length > 0 && (<span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {savedColleges.length}
            </span>)}
        </Link>

        
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
          <Bell className="h-4.5 w-4.5"/>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"/>
        </button>

        
        {user ? (<div className="relative flex items-center gap-2 pl-1.5 border-l border-slate-200 ml-1.5">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} title="User Menu" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white text-sm shadow-sm ring-2 ring-white hover:scale-105 active:scale-95 transition-all">
              {user.name.charAt(0).toUpperCase()}
            </button>

            {dropdownOpen && (<>
                <div className="fixed inset-0 z-35" onClick={() => setDropdownOpen(false)}/>
                <div className="absolute right-0 top-11 z-40 w-56 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl animate-fade-in space-y-2">
                  <div className="border-b border-slate-100 pb-2.5 px-1">
                    <span className="block text-xs font-bold text-slate-800 leading-snug">{user.name}</span>
                    <span className="block text-[10px] font-semibold text-slate-400 truncate mt-0.5">{user.email}</span>
                    <span className="inline-block rounded-md bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wider mt-1.5">
                      Premium Member
                    </span>
                  </div>
                  <div className="space-y-1 py-1">
                    <Link href="/saved" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                      <Bookmark className="h-4 w-4 text-slate-400"/>
                      <span>Saved Bookmarks</span>
                    </Link>
                    <Link href="/compare" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                      <GitCompare className="h-4 w-4 text-slate-400"/>
                      <span>Compare Matrix</span>
                    </Link>
                  </div>
                  <button onClick={() => {
                setDropdownOpen(false);
                logout();
            }} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors">
                    <LogOut className="h-4 w-4 text-rose-400 shrink-0"/>
                    <span>Sign Out</span>
                  </button>
                </div>
              </>)}
          </div>) : (<div className="pl-1.5 border-l border-slate-200 ml-1.5">
            <button onClick={() => setIsAuthOpen(true)} className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-900 bg-slate-900 px-3.5 text-xs font-bold text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all active:scale-[0.97]">
              <User className="h-3.5 w-3.5"/>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          </div>)}
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)}/>
    </header>);
}
