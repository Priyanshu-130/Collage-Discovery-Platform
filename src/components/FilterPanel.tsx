'use client';
import React from 'react';
import { SlidersHorizontal, RotateCcw, MapPin, Award, BookOpen, Building, CircleDollarSign, GraduationCap } from 'lucide-react';
import { FilterState } from '../types';
import { colleges } from '../data/colleges';
import { formatCurrency } from '../lib/utils';
interface FilterPanelProps {
    filters: FilterState;
    onChange: (updater: (prev: FilterState) => FilterState) => void;
    onReset: () => void;
}
export default function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
    const cities = Array.from(new Set(colleges.map((c) => c.city))).sort();
    const entranceExams = Array.from(new Set(colleges.flatMap((c) => c.acceptedExams || []))).sort();
    const courseCategories = [
        { value: '', label: 'All Courses' },
        { value: 'engineering', label: 'Engineering (B.Tech/BE)' },
        { value: 'management', label: 'Management (MBA/PGDM)' },
        { value: 'science', label: 'Science (B.Sc/Research)' },
    ];
    const ratingOptions = [
        { value: 0, label: 'All Ratings' },
        { value: 4.0, label: '4.0+ Stars' },
        { value: 4.5, label: '4.5+ Stars' },
        { value: 4.8, label: '4.8+ Stars' },
    ];
    const nirfOptions = [
        { value: 0, label: 'All Ranks' },
        { value: 10, label: 'Top 10 NIRF' },
        { value: 50, label: 'Top 50 NIRF' },
        { value: 100, label: 'Top 100 NIRF' },
        { value: 200, label: 'Top 200 NIRF' },
    ];
    const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onChange((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    return (<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-600"/>
          <span>Filters & Sort</span>
        </div>
        <button onClick={onReset} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
          <RotateCcw className="h-3 w-3"/>
          <span>Reset All</span>
        </button>
      </div>

      <div className="space-y-5">
        
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <BookOpen className="h-3.5 w-3.5 text-slate-400"/>
            <span>Field of Study</span>
          </label>
          <select value={filters.course} onChange={(e) => handleFilterChange('course', e.target.value)} className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            {courseCategories.map((cat) => (<option key={cat.value} value={cat.value}>
                {cat.label}
              </option>))}
          </select>
        </div>

        
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-slate-400"/>
            <span>Location (City)</span>
          </label>
          <select value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">All Cities</option>
            {cities.map((city) => (<option key={city} value={city}>
                {city}
              </option>))}
          </select>
        </div>

        
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <GraduationCap className="h-3.5 w-3.5 text-slate-400"/>
            <span>Accepted Exam</span>
          </label>
          <select value={filters.exam} onChange={(e) => handleFilterChange('exam', e.target.value)} className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value="">All Entrance Exams</option>
            {entranceExams.map((examName) => (<option key={examName} value={examName}>
                {examName}
              </option>))}
          </select>
        </div>

        
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Award className="h-3.5 w-3.5 text-slate-400"/>
            <span>NIRF Ranking Range</span>
          </label>
          <select value={filters.minNirf} onChange={(e) => handleFilterChange('minNirf', parseInt(e.target.value))} className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            {nirfOptions.map((opt) => (<option key={opt.value} value={opt.value}>
                {opt.label}
              </option>))}
          </select>
        </div>

        
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Building className="h-3.5 w-3.5 text-slate-400"/>
            <span>College Type</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['', 'Public', 'Private'].map((type) => (<button key={type} type="button" onClick={() => handleFilterChange('type', type)} className={`rounded-xl border py-2 text-xs font-bold transition-all ${filters.type === type
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                {type || 'All'}
              </button>))}
          </div>
        </div>

        
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Award className="h-3.5 w-3.5 text-slate-400"/>
            <span>Minimum Rating</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ratingOptions.map((opt) => (<button key={opt.value} type="button" onClick={() => handleFilterChange('minRating', opt.value)} className={`rounded-xl border py-2 text-xs font-bold transition-all ${filters.minRating === opt.value
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                {opt.label}
              </button>))}
          </div>
        </div>

        
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <CircleDollarSign className="h-3.5 w-3.5 text-slate-400"/>
              <span>Max Annual Fees</span>
            </span>
            <span className="text-indigo-600 lowercase font-semibold">
              {filters.maxFees >= 1500000 ? 'Any' : `< ${formatCurrency(filters.maxFees)}`}
            </span>
          </div>
          <input type="range" min="10000" max="1500000" step="50000" value={filters.maxFees} onChange={(e) => handleFilterChange('maxFees', parseInt(e.target.value))} className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-200 accent-indigo-600 appearance-none focus:outline-none"/>
          <div className="mt-1 flex justify-between text-[10px] font-semibold text-slate-400">
            <span>₹10 K</span>
            <span>₹7.5 L</span>
            <span>₹15 L+</span>
          </div>
        </div>

        
        <div className="border-t border-slate-100 pt-4">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Sort Results By
          </label>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[
            { value: 'rating', label: 'Rating' },
            { value: 'fees', label: 'Fees' },
            { value: 'placement', label: 'Placements' },
        ].map((sortOption) => (<button key={sortOption.value} type="button" onClick={() => handleFilterChange('sortBy', sortOption.value as 'rating' | 'fees' | 'placement')} className={`rounded-xl border py-2 text-xs font-bold transition-all ${filters.sortBy === sortOption.value
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                  {sortOption.label}
                </button>))}
            </div>
            
            
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => handleFilterChange('sortOrder', 'asc')} className={`rounded-xl border py-1.5 text-xs font-bold transition-all ${filters.sortOrder === 'asc'
            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-600'
            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                Ascending
              </button>
              <button type="button" onClick={() => handleFilterChange('sortOrder', 'desc')} className={`rounded-xl border py-1.5 text-xs font-bold transition-all ${filters.sortOrder === 'desc'
            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-600'
            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                Descending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
