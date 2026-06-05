'use client';

import React from 'react';

interface LoadingStateProps {
  type?: 'card' | 'grid' | 'details' | 'dashboard';
  count?: number;
}

const CardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-0 animate-pulse">
    {/* Banner Area */}
    <div className="h-48 w-full bg-slate-100" />
    {/* Content Area */}
    <div className="p-5 flex-1 flex flex-col space-y-4">
      {/* Rating and Founded row */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-16 bg-slate-100 rounded-lg" />
        <div className="h-4 w-12 bg-slate-100 rounded" />
      </div>
      {/* Title */}
      <div className="h-6 w-3/4 bg-slate-100 rounded-lg" />
      {/* Location */}
      <div className="h-4 w-1/2 bg-slate-100 rounded" />
      {/* Highlights block */}
      <div className="h-14 w-full bg-slate-50 border border-slate-100 rounded-xl" />
      {/* Footer buttons row */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="h-8 w-20 bg-slate-100 rounded-lg" />
        <div className="h-4 w-12 bg-slate-100 rounded" />
      </div>
    </div>
  </div>
);

const GridSkeleton = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, idx) => (
      <CardSkeleton key={`skeleton-${idx}`} />
    ))}
  </div>
);

const DetailsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Hero section skeleton */}
    <div className="h-64 w-full bg-slate-100 rounded-2xl" />
    {/* Metric Cards row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-28 bg-slate-100 rounded-2xl" />
      <div className="h-28 bg-slate-100 rounded-2xl" />
      <div className="h-28 bg-slate-100 rounded-2xl" />
    </div>
    {/* Main layout skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
      <div className="lg:col-span-2 h-96 bg-slate-100 rounded-2xl" />
      <div className="h-96 bg-slate-100 rounded-2xl" />
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Metrics Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="h-28 bg-slate-100 rounded-2xl" />
      <div className="h-28 bg-slate-100 rounded-2xl" />
      <div className="h-28 bg-slate-100 rounded-2xl" />
      <div className="h-28 bg-slate-100 rounded-2xl" />
    </div>
    {/* Split section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-8 w-48 bg-slate-100 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-100 rounded-2xl" />
          <div className="h-80 bg-slate-100 rounded-2xl" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-100 rounded-lg" />
        <div className="h-80 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default function LoadingState({ type = 'grid', count = 6 }: LoadingStateProps) {
  if (type === 'card') return <CardSkeleton />;
  if (type === 'details') return <DetailsSkeleton />;
  if (type === 'dashboard') return <DashboardSkeleton />;
  return <GridSkeleton count={count} />;
}
