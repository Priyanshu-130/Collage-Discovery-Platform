'use client';
import React, { ElementType } from 'react';
import { Search } from 'lucide-react';
interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: ElementType;
    actionText?: string;
    onAction?: () => void;
}
export default function EmptyState({ title = "No results found", description = "We couldn't find any colleges matching your active search filters. Try adjusting your fields or search query.", icon: Icon = Search, actionText, onAction, }: EmptyStateProps) {
    return (<div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-5 shadow-sm">
        <Icon className="h-8 w-8"/>
      </div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">{title}</h3>
      <p className="max-w-md text-xs font-semibold leading-relaxed text-slate-500 mb-6">{description}</p>
      
      {actionText && onAction && (<button onClick={onAction} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:shadow-lg transition-all">
          {actionText}
        </button>)}
    </div>);
}
