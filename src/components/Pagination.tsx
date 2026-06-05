'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1)
        return null;
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 2) {
                end = 3;
            }
            if (currentPage >= totalPages - 1) {
                start = totalPages - 2;
            }
            if (start > 2) {
                pages.push('...');
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
        return pages;
    };
    return (<div className="flex items-center justify-between border-t border-slate-200 px-4 py-4 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          Previous
        </button>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative ml-3 inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            Page <span className="font-bold text-slate-700">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-700">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center rounded-l-xl px-2.5 py-2 text-slate-400 hover:bg-slate-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-r border-slate-200">
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4.5 w-4.5"/>
            </button>
            
            {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === '...') {
                return (<span key={`ellipsis-${idx}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-400 border-r border-slate-200">
                    ...
                  </span>);
            }
            const active = pageNum === currentPage;
            return (<button key={`page-${pageNum}`} onClick={() => onPageChange(pageNum as number)} aria-current={active ? 'page' : undefined} className={`relative inline-flex items-center px-4 py-2 text-sm font-bold border-r border-slate-200 transition-all focus:z-20 ${active
                    ? 'z-10 bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'}`}>
                  {pageNum}
                </button>);
        })}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center rounded-r-xl px-2.5 py-2 text-slate-400 hover:bg-slate-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4.5 w-4.5"/>
            </button>
          </nav>
        </div>
      </div>
    </div>);
}
