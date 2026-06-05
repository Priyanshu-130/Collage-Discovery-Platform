'use client';
import React from 'react';
import { Search, X } from 'lucide-react';
interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
export default function SearchBar({ value, onChange, placeholder = "Search colleges by name or city..." }: SearchBarProps) {
    return (<div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
        <Search className="h-5 w-5"/>
      </div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="block w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder={placeholder}/>
      {value ? (<button onClick={() => onChange('')} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600">
          <X className="h-4 w-4"/>
        </button>) : (<div className="absolute inset-y-0 right-0 hidden sm:flex items-center pr-4 text-slate-300">
          <kbd className="rounded-lg border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold bg-slate-50 uppercase">/</kbd>
        </div>)}
    </div>);
}
