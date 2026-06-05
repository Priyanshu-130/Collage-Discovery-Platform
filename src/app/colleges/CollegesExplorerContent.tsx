'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { FilterState } from '@/types';
import { colleges } from '@/data/colleges';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import CollegeCard from '@/components/CollegeCard';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';

const ITEMS_PER_PAGE = 9;

export default function CollegesExplorerContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  // Initial Filter State
  const defaultFilters: FilterState = {
    search: initialSearch,
    city: '',
    course: '',
    type: '',
    maxFees: 1500000,
    minRating: 0,
    minNirf: 0,
    exam: '',
    sortBy: 'rating',
    sortOrder: 'desc',
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.search,
    filters.city,
    filters.course,
    filters.type,
    filters.maxFees,
    filters.minRating,
    filters.minNirf,
    filters.exam,
    filters.sortBy,
    filters.sortOrder
  ]);

  // Simulate premium dynamic skeleton loading on filter adjustment
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [filters]);

  // Sync search URL query with local state
  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal !== null) {
      setFilters((prev) => ({ ...prev, search: searchVal }));
    }
  }, [searchParams]);

  // Reset filters helper
  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filter & Sort core logic
  const filteredColleges = useMemo(() => {
    let result = [...colleges];

    // Search query filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.shortName.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query) ||
          c.state.toLowerCase().includes(query)
      );
    }

    // City filter
    if (filters.city) {
      result = result.filter((c) => c.city === filters.city);
    }

    // College type filter (Public/Private)
    if (filters.type) {
      result = result.filter((c) => c.type === filters.type);
    }

    // Minimum rating filter
    if (filters.minRating > 0) {
      result = result.filter((c) => c.rating >= filters.minRating);
    }

    // Max annual fees filter
    if (filters.maxFees < 1500000) {
      result = result.filter((c) => c.feesRange.min <= filters.maxFees);
    }

    // Entrance exam filter
    if (filters.exam) {
      result = result.filter((c) => c.acceptedExams && c.acceptedExams.includes(filters.exam));
    }

    // NIRF rank filter
    if (filters.minNirf > 0) {
      result = result.filter((c) => c.nirfRank !== undefined && c.nirfRank <= filters.minNirf);
    }

    // Field of study (course name matching) filter
    if (filters.course) {
      result = result.filter((c) => {
        const cat = filters.course;
        return c.courses.some((course) => {
          const courseName = course.name.toLowerCase();
          if (cat === 'engineering') {
            return courseName.includes('b.tech') || courseName.includes('b.e.') || courseName.includes('m.tech');
          }
          if (cat === 'management') {
            return courseName.includes('mba') || courseName.includes('pgdm') || courseName.includes('management') || courseName.includes('economics');
          }
          if (cat === 'science') {
            return courseName.includes('science') || courseName.includes('research') || courseName.includes('b.sc');
          }
          return true;
        });
      });
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'rating') {
        comparison = b.rating - a.rating;
      } else if (filters.sortBy === 'fees') {
        // Sort by minimum range fees
        comparison = a.feesRange.min - b.feesRange.min;
      } else if (filters.sortBy === 'placement') {
        comparison = b.placement.averagePackage - a.placement.averagePackage;
      }

      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [filters]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);
  
  const paginatedColleges = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredColleges.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredColleges, currentPage]);

  return (
    <div className="flex-1 space-y-6 flex flex-col justify-start">
      {/* Explorer Heading & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Explore Colleges</h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Discover academic details, fees, placements, and ratings
          </p>
        </div>
        
        {/* Toggle Filters Mobile Trigger & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto max-w-md">
          <div className="flex-1">
            <SearchBar
              value={filters.search}
              onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
              placeholder="Search colleges, cities..."
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex h-11 items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 lg:hidden shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content Split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 items-start">
        {/* Desktop Filter Panel (Left Column) */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterPanel 
            filters={filters} 
            onChange={setFilters} 
            onReset={handleResetFilters} 
          />
        </div>

        {/* Mobile Filters Drawer Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* Panel Drawer */}
            <div className="relative z-50 w-full max-w-sm overflow-y-auto bg-white p-5 shadow-xl flex flex-col h-full">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <span className="font-bold text-slate-800">Filters Selection</span>
                <button 
                  onClick={() => setShowMobileFilters(false)} 
                  className="rounded-lg border px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
              <FilterPanel 
                filters={filters} 
                onChange={setFilters} 
                onReset={handleResetFilters} 
              />
            </div>
          </div>
        )}

        {/* Colleges Grid Display (Right Column) */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <LoadingState type="grid" count={6} />
          ) : paginatedColleges.length > 0 ? (
            <>
              {/* Colleges Count Banner */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Showing {filteredColleges.length} Matching Institutes</span>
                <span>Page {currentPage} of {totalPages || 1}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedColleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState 
              title="No matching colleges" 
              description="No colleges fit the active location, budget, rating, and study fields. Try resetting filters."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
