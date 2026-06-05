'use client';

import React, { useState, useMemo } from 'react';
import { GitCompare, Search, Plus, MapPin, Save, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { colleges } from '@/data/colleges';
import { College } from '@/types';
import { useRouter } from 'next/navigation';
import CompareTable from '@/components/CompareTable';
import EmptyState from '@/components/EmptyState';
import AuthModal from '@/components/AuthModal';

export default function CompareCollegesPage() {
  const router = useRouter();
  const { compareColleges, toggleCompareCollege, user, saveComparisonSet } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Modal and state variables
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [comparisonName, setComparisonName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Map IDs to college items
  const collegesToCompare = useMemo(() => {
    return compareColleges
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean) as College[];
  }, [compareColleges]);

  // Filter available suggestions (matching query, not already being compared)
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return colleges.filter(
      (c) =>
        !compareColleges.includes(c.id) &&
        (c.name.toLowerCase().includes(query) ||
          c.shortName.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query))
    );
  }, [searchQuery, compareColleges]);

  const handleAddCollege = (id: string) => {
    toggleCompareCollege(id);
    setSearchQuery('');
    setIsFocused(false);
    setSaveSuccess('');
  };

  const handleSaveComparisonClick = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    const defaultName = collegesToCompare.map((c) => c.shortName).join(' vs ');
    setComparisonName(defaultName);
    setIsSaveModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comparisonName.trim()) return;

    saveComparisonSet(comparisonName.trim(), compareColleges);
    setIsSaveModalOpen(false);
    setSaveSuccess(`Comparison set "${comparisonName.trim()}" successfully saved! Check it in Saved tab.`);
    
    // Auto clear success message
    setTimeout(() => {
      setSaveSuccess('');
    }, 5000);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-start">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <GitCompare className="h-6 w-6 text-indigo-600" />
            <span>Compare Colleges</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Select two institutions and benchmark them side-by-side
          </p>
        </div>
        {collegesToCompare.length >= 2 && (
          <button
            onClick={handleSaveComparisonClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 shadow hover:shadow-indigo-600/10 transition-all active:scale-[0.97] self-start sm:self-center"
          >
            <Save className="h-4 w-4" />
            <span>Save Comparison</span>
          </button>
        )}
      </div>

      {/* Success alert banner */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-bold text-emerald-700 shadow-sm animate-fade-in">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Select Box - show when comparison is under-capacity (less than 2) */}
      {compareColleges.length < 2 && (
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3.5 relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Search and Add College for Comparison ({compareColleges.length} of 2 added)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow clicks
              className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Type college name, abbreviation, or city..."
            />
          </div>

          {/* Autocomplete suggestions dropdown */}
          {isFocused && searchQuery && (
            <div className="absolute left-5 right-5 z-25 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-100/50">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddCollege(item.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0"
                  >
                    <div className="min-w-0 pr-4">
                      <span className="block text-sm font-bold text-slate-800 truncate leading-snug">{item.name}</span>
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{item.location} &bull; {item.type}</span>
                      </span>
                    </div>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                      <Plus className="h-4 w-4" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs font-semibold text-slate-400">
                  No match found (or already in comparison list)
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Table view */}
      {collegesToCompare.length > 0 ? (
        <CompareTable collegesToCompare={collegesToCompare} />
      ) : (
        <EmptyState
          title="Comparison List is Empty"
          description="You haven't selected any institutes to compare yet. Add colleges using the explorer search or details checklist."
          icon={GitCompare}
          actionText="Browse Colleges Explorer"
          onAction={() => router.push('/colleges')}
        />
      )}

      {/* Save Comparison Set Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setIsSaveModalOpen(false)} />
          <form 
            onSubmit={handleSaveSubmit}
            className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-slate-800">Name Your Comparison Set</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1 leading-normal">
                Save this configuration to your account for quick access in the Saved Bookmarks tab.
              </p>
            </div>
            <input
              type="text"
              value={comparisonName}
              onChange={(e) => setComparisonName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-800 font-semibold shadow-inner outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              required
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition-all"
              >
                Save Set
              </button>
            </div>
          </form>
        </div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
