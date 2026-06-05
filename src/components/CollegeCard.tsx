'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, GitCompare, MapPin, ArrowRight } from 'lucide-react';
import { College } from '../types';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatLPA } from '../lib/utils';
import RatingBadge from './RatingBadge';

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { isSaved, toggleSaveCollege, isComparing, toggleCompareCollege } = useApp();

  const saved = isSaved(college.id);
  const comparing = isComparing(college.id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Banner / Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={college.image}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {college.nirfRank && (
            <span className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              NIRF #{college.nirfRank}
            </span>
          )}
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 backdrop-blur-sm shadow-sm">
            {college.accreditation}
          </span>
          <span className="rounded-lg bg-indigo-600/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm shadow-sm">
            {college.type}
          </span>
        </div>

        {/* Save Bookmark button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveCollege(college.id);
          }}
          className={`absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md transition-all border shadow-sm ${
            saved
              ? 'bg-rose-500 border-rose-500 text-white'
              : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
          }`}
          title={saved ? 'Remove Bookmark' : 'Save College'}
        >
          <Bookmark className={`h-4.5 w-4.5 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* College Info Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <RatingBadge rating={college.rating} reviewsCount={college.reviewsCount} showCount={false} />
          <span className="text-xs font-semibold text-slate-400">Est. {college.founded}</span>
        </div>

        <Link href={`/college/${college.id}`} className="group-hover:text-indigo-600 transition-colors">
          <h3 className="font-bold text-slate-800 line-clamp-1 leading-snug tracking-tight text-lg">
            {college.name}
          </h3>
        </Link>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-1 text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="text-xs font-semibold line-clamp-1">{college.location}</span>
        </div>

        {/* Description Snippet */}
        <p className="mt-3 text-xs font-medium leading-relaxed text-slate-500 line-clamp-2">
          {college.description}
        </p>

        {/* Highlights Block */}
        <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Placement</span>
            <span className="text-sm font-bold text-slate-800">{formatLPA(college.placement.averagePackage)}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Fees Range</span>
            <span className="text-xs font-bold text-slate-800 line-clamp-1">
              {formatCurrency(college.feesRange.min)} - {formatCurrency(college.feesRange.max)}
            </span>
          </div>
        </div>

        {/* Recruiters strip */}
        <div className="mt-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Top Placement Recruiters</span>
          <div className="flex flex-wrap gap-1.5">
            {college.placement.topRecruiters.slice(0, 3).map((recruiter) => (
              <span key={recruiter} className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {recruiter}
              </span>
            ))}
            {college.placement.topRecruiters.length > 3 && (
              <span className="text-[10px] font-bold text-slate-400 self-center pl-0.5">
                +{college.placement.topRecruiters.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            onClick={() => toggleCompareCollege(college.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all ${
              comparing
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>{comparing ? 'Comparing' : 'Compare'}</span>
          </button>

          <Link
            href={`/college/${college.id}`}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
