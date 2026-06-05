'use client';
import React, { Suspense } from 'react';
import CollegesExplorerContent from './CollegesExplorerContent';
export default function CollegesExplorer() {
    return (<Suspense fallback={<div className="flex flex-1 items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-sm"/>
            <span className="text-xs font-semibold text-slate-500 animate-pulse">
              Loading platform explorer...
            </span>
          </div>
        </div>}>
      <CollegesExplorerContent />
    </Suspense>);
}
