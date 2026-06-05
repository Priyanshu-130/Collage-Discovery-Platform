'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Briefcase, 
  Star, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  History 
} from 'lucide-react';
import { colleges } from '@/data/colleges';
import { useApp } from '@/context/AppContext';
import StatsCard from '@/components/StatsCard';
import CollegeCard from '@/components/CollegeCard';
import SearchBar from '@/components/SearchBar';

export default function DashboardHome() {
  const router = useRouter();
  const { recentlyViewed } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Calculate platform statistics dynamically
  const totalColleges = colleges.length;
  
  const avgPlacementVal = colleges.reduce((sum, c) => sum + c.placement.averagePackage, 0) / totalColleges;
  const avgPlacement = `${avgPlacementVal.toFixed(1)} LPA`;
  
  const topRatedCount = colleges.filter((c) => c.rating >= 4.8).length;
  const uniqueCitiesCount = new Set(colleges.map((c) => c.city)).size;

  // 2. Select featured colleges (highest ratings, slice first 3)
  const featuredColleges = colleges
    .filter((c) => c.rating >= 4.8)
    .slice(0, 3);

  // 3. Resolve recently viewed colleges list from context
  const recentlyViewedColleges = recentlyViewed
    .map((id) => colleges.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 3); // Limit to top 3 in the dashboard sidebar display

  // 4. Handle quick search submit
  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(val.trim())}`);
    }
  };

  return (
    <div className="space-y-8 flex-1 flex flex-col justify-start">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-xl md:px-12 md:py-12">
        {/* Glow styling */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>Discover Your Future</span>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Find the Perfect College for Your Aspirations.
            </h2>
            <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-xl">
              Search and filter across 50+ elite institutes in India. Compare average salaries, annual courses, academic ratings, and build your comparison checklist.
            </p>
          </div>

          <div className="max-w-lg pt-2" onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}>
            <SearchBar value={searchQuery} onChange={handleSearchSubmit} placeholder="Search engineering, management colleges, cities..." />
          </div>
        </div>
      </div>

      {/* Statistics Widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Colleges"
          value={totalColleges}
          icon={GraduationCap}
          description="Accredited institutes"
          color="indigo"
        />
        <StatsCard
          title="Average Placement"
          value={avgPlacement}
          icon={Briefcase}
          description="Salary packages offered"
          trend={{ value: "+8.2%", type: "positive" }}
          color="emerald"
        />
        <StatsCard
          title="Top Rated Colleges"
          value={topRatedCount}
          icon={Star}
          description="Colleges rated 4.8+ Stars"
          color="amber"
        />
        <StatsCard
          title="Cities Covered"
          value={uniqueCitiesCount}
          icon={MapPin}
          description="Academic hubs indexed"
          color="rose"
        />
      </div>

      {/* Main Grid: Featured & Recently Viewed */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Featured Colleges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Featured Institutes</h3>
              <p className="text-xs text-slate-500 font-semibold">Handpicked top-rated academic programs</p>
            </div>
            <button 
              onClick={() => router.push('/colleges')}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {featuredColleges.slice(0, 2).map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>

        {/* Right Column: Recently Viewed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recently Viewed</h3>
              <p className="text-xs text-slate-500 font-semibold">Your click history logs</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentlyViewedColleges.length > 0 ? (
              recentlyViewedColleges.map((college) => (
                <div 
                  key={`recent-${college?.id}`}
                  className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm hover:border-indigo-100 hover:shadow transition-all group cursor-pointer"
                  onClick={() => router.push(`/college/${college?.id}`)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={college?.image}
                    alt={college?.name}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-md bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 mb-0.5">
                      {college?.accreditation}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1 leading-snug group-hover:text-indigo-600 transition-colors">
                      {college?.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-0.5 mt-0.5">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                      <span>{college?.location}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-400">
                <p className="text-xs font-bold mb-1 text-slate-500">No recent activity</p>
                <p className="text-[11px] text-slate-400 leading-normal max-w-[200px]">
                  Explore detailed profile pages. Visited colleges will be indexed here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
