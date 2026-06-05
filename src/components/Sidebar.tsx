'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Compass, 
  GitCompare, 
  Bookmark, 
  X, 
  GraduationCap, 
  MapPin, 
  Briefcase,
  Sparkles,
  LogIn,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AuthModal from './AuthModal';
import { colleges } from '../data/colleges';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { savedColleges, compareColleges, user, logout } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Explore Colleges', href: '/colleges', icon: Compass },
    { name: 'Predictor Tool', href: '/predictor', icon: Sparkles },
    { 
      name: 'Compare', 
      href: '/compare', 
      icon: GitCompare,
      badge: compareColleges.length > 0 ? compareColleges.length : undefined 
    },
    { 
      name: 'Saved Bookmarks', 
      href: '/saved', 
      icon: Bookmark,
      badge: savedColleges.length > 0 ? savedColleges.length : undefined 
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-200 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Colla</span>
              <span className="text-xs block font-semibold text-indigo-600 uppercase tracking-wider -mt-1">Discovery</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="mt-10 flex-1 space-y-1">
          {navigation.map((item) => {
            const ActiveIcon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ActiveIcon
                    className={`h-5 w-5 transition-colors ${
                      active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                      active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Analytics Summary Preview Widget */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Platform Stats</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Colleges Indexed</span>
                <span className="text-sm font-bold text-slate-800">{colleges.length} Colleges</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Cities Covered</span>
                <span className="text-sm font-bold text-slate-800">
                  {new Set(colleges.map((c) => c.city)).size} Cities
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Highest Package</span>
                <span className="text-sm font-bold text-slate-800">
                  {Math.round(Math.max(...colleges.map((c) => c.placement.highestPackage || 0)))} LPA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Footer */}
        {user ? (
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-semibold text-slate-800 truncate leading-snug">{user.name}</span>
                <span className="inline-block rounded-md bg-indigo-50 border border-indigo-100 px-1 py-0.5 text-[9px] font-bold text-indigo-600 uppercase tracking-wider scale-95 origin-left mt-0.5">
                  Premium
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-600 transition-colors shadow-sm"
            >
              <LogIn className="h-4.5 w-4.5" />
              <span>Sign In / Sign Up</span>
            </button>
          </div>
        )}
      </aside>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
