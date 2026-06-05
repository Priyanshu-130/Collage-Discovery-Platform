'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, GitCompare, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { colleges } from '@/data/colleges';
import { College } from '@/types';
import CollegeCard from '@/components/CollegeCard';
import EmptyState from '@/components/EmptyState';

export default function SavedCollegesPage() {
  const router = useRouter();
  const { 
    savedColleges, 
    savedComparisons, 
    deleteComparisonSet, 
    clearCompare, 
    toggleCompareCollege 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'colleges' | 'comparisons'>('colleges');

  // Resolve saved colleges metadata from static dataset
  const savedCollegesList = useMemo(() => {
    return savedColleges
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean) as College[];
  }, [savedColleges]);

  // Load a saved comparison configuration and navigate to compare page
  const handleLoadComparison = (collegeIds: string[]) => {
    clearCompare();
    // Re-populate comparison list
    collegeIds.forEach((id) => {
      toggleCompareCollege(id);
    });
    router.push('/compare');
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-start">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-indigo-600 fill-indigo-50" />
            <span>Bookmarks Shelf</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Your premium saved academic institutions and comparison benchmarks.
          </p>
        </div>
      </div>

      {/* Tabs Selector Toggle */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('colleges')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
            activeTab === 'colleges'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Saved Colleges ({savedCollegesList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('comparisons')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
            activeTab === 'comparisons'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <GitCompare className="h-4 w-4" />
          <span>Saved Comparisons ({savedComparisons.length})</span>
        </button>
      </div>

      {/* Active Tab Views */}
      {activeTab === 'colleges' ? (
        savedCollegesList.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedCollegesList.map((college) => (
              <CollegeCard key={`saved-${college.id}`} college={college} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Bookmarked Colleges"
            description="Your bookmarks shelf is currently empty. Explore colleges, review details, and bookmark them to keep them tracked here."
            icon={Bookmark}
            actionText="Browse Colleges Explorer"
            onAction={() => router.push('/colleges')}
          />
        )
      ) : (
        savedComparisons.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {savedComparisons.map((set) => {
              // Resolve college names inside set
              const matchedColleges = set.collegeIds
                .map((id) => colleges.find((c) => c.id === id))
                .filter(Boolean) as College[];

              return (
                <div
                  key={`comparison-set-${set.id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-bold text-base text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                        {set.name}
                      </h4>
                      <button
                        onClick={() => deleteComparisonSet(set.id)}
                        title="Delete set"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Meta information */}
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Saved on {new Date(set.timestamp).toLocaleDateString()}</span>
                    </div>

                    {/* Mini comparison details */}
                    <div className="flex items-center gap-3 pt-2">
                      {matchedColleges.map((col, index) => (
                        <React.Fragment key={`mini-col-${col.id}`}>
                          {index > 0 && <span className="text-xs font-bold text-slate-300">vs</span>}
                          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                            <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-[9px] font-extrabold text-slate-700 uppercase">
                              {col.logo}
                            </div>
                            <span className="truncate max-w-[120px]">{col.shortName}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-50 mt-4">
                    <button
                      onClick={() => handleLoadComparison(set.collegeIds)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white hover:bg-indigo-600 transition-all shadow-sm"
                    >
                      <span>Load Comparison Matrix</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Saved Comparisons"
            description="You haven't saved any comparison sets yet. Navigate to the Compare page, add colleges side-by-side, and save your custom matrix configuration."
            icon={GitCompare}
            actionText="Go to Compare Page"
            onAction={() => router.push('/compare')}
          />
        )
      )}
    </div>
  );
}
