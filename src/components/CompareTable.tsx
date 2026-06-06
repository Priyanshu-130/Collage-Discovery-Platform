'use client';
import React from 'react';
import Link from 'next/link';
import { X, Trash2, ArrowRight, Trophy } from 'lucide-react';
import { College } from '../types';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatLPA } from '../lib/utils';
import RatingBadge from './RatingBadge';
interface CompareTableProps {
    collegesToCompare: College[];
}
export default function CompareTable({ collegesToCompare }: CompareTableProps) {
    const { removeFromCompare, clearCompare } = useApp();
    if (collegesToCompare.length === 0)
        return null;
    const focusSearchInput = () => {
        const searchInput = document.getElementById('compare-search-input');
        if (searchInput) {
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            searchInput.focus();
        }
    };

    const renderRow = (label: string, accessor: (c: College) => React.ReactNode, highlightBetter?: boolean, betterValueSelector?: (c: College) => number) => {
        let betterIndex = -1;
        if (highlightBetter && collegesToCompare.length === 2 && betterValueSelector) {
            const val0 = betterValueSelector(collegesToCompare[0]);
            const val1 = betterValueSelector(collegesToCompare[1]);
            if (val0 > val1)
                betterIndex = 0;
            else if (val1 > val0)
                betterIndex = 1;
        }
        return (<tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
        <td className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4">
          {label}
        </td>
        {collegesToCompare.map((college, idx) => {
                const isWinner = idx === betterIndex;
                return (<td key={college.id} className={`py-4 px-6 text-sm font-semibold text-slate-700 ${isWinner ? 'bg-indigo-50/30 text-slate-800' : ''}`}>
              <div className="flex items-center gap-1.5">
                {accessor(college)}
                {isWinner && (<span title="Higher Metric">
                    <Trophy className="h-4 w-4 shrink-0 text-amber-500 fill-amber-100"/>
                  </span>)}
              </div>
            </td>);
            })}
        
        {collegesToCompare.length === 1 && (<td onClick={focusSearchInput} className="py-4 px-6 text-sm text-slate-400 italic bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 hover:text-indigo-600 font-semibold transition-colors">
            Select another college to compare
          </td>)}
      </tr>);
    };
    return (<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      
      <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 px-5 py-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Comparing {collegesToCompare.length} {collegesToCompare.length === 1 ? 'College' : 'Colleges'}
        </span>
        <button onClick={clearCompare} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors">
          <Trash2 className="h-4 w-4"/>
          <span>Clear Selection</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/30">
              <th className="py-5 px-5 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4">
                Summary
              </th>
              {collegesToCompare.map((college) => (<th key={college.id} className="py-5 px-6 relative min-w-[280px]">
                  
                  <button onClick={() => removeFromCompare(college.id)} className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm" title="Remove from comparison">
                    <X className="h-4 w-4"/>
                  </button>

                  <div className="flex flex-col gap-3 pr-6">
                    
                    <img src={college.image} alt={college.name} className="h-24 w-full rounded-xl object-cover border border-slate-100"/>
                    <div>
                      <span className="inline-block rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600 mb-1">
                        {college.type} &bull; {college.accreditation}
                      </span>
                      <h4 className="font-bold text-slate-800 line-clamp-1 leading-snug">
                        {college.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">{college.location}</p>
                    </div>
                    <Link href={`/college/${college.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-1">
                      <span>View details</span>
                      <ArrowRight className="h-3 w-3"/>
                    </Link>
                  </div>
                </th>))}
              
              {collegesToCompare.length === 1 && (<th onClick={focusSearchInput} className="py-5 px-6 text-center bg-slate-50/50 min-w-[280px] cursor-pointer hover:bg-slate-100/70 transition-colors group/add-col">
                  <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 border-2 border-dashed border-slate-200 mb-3 text-slate-350 text-xl font-bold group-hover/add-col:border-indigo-300 group-hover/add-col:bg-indigo-50 group-hover/add-col:text-indigo-600 transition-all">
                      +
                    </div>
                    <p className="text-sm font-bold mb-1 text-slate-500 group-hover/add-col:text-indigo-600 transition-all">Add College</p>
                    <p className="text-xs text-slate-400 max-w-[180px] font-semibold">
                      Search and choose another college to compare side-by-side.
                    </p>
                  </div>
                </th>)}

            </tr>
          </thead>
          <tbody>
            
            {renderRow('Rating', (c) => <RatingBadge rating={c.rating} reviewsCount={c.reviewsCount}/>, true, (c) => c.rating)}

            
            {renderRow('NIRF Ranking', (c) => c.nirfRank ? <span className="font-bold text-slate-800">#{c.nirfRank}</span> : <span className="text-slate-400">N/A</span>, true, (c) => c.nirfRank ? -c.nirfRank : -9999)}

            
            {renderRow('Academics Rating', (c) => <span className="font-semibold text-slate-700">{c.subRatings.academics.toFixed(1)} / 5.0</span>, true, (c) => c.subRatings.academics)}
            {renderRow('Placements Rating', (c) => <span className="font-semibold text-slate-700">{c.subRatings.placements.toFixed(1)} / 5.0</span>, true, (c) => c.subRatings.placements)}
            {renderRow('Infrastructure Rating', (c) => <span className="font-semibold text-slate-700">{c.subRatings.infra.toFixed(1)} / 5.0</span>, true, (c) => c.subRatings.infra)}
            {renderRow('Campus Life Rating', (c) => <span className="font-semibold text-slate-700">{c.subRatings.campusLife.toFixed(1)} / 5.0</span>, true, (c) => c.subRatings.campusLife)}

            
            {renderRow('Founded Year', (c) => c.founded)}

            
            {renderRow('Accepted Exams', (c) => <span className="font-medium text-slate-600">{c.acceptedExams.join(', ')}</span>)}

            
            {renderRow('Est. Annual Fees', (c) => (<span className="font-bold text-slate-800">
                  {formatCurrency(c.feesRange.min)} - {formatCurrency(c.feesRange.max)}
                </span>))}

            
            {renderRow('Average Salary Package', (c) => <span className="font-extrabold text-slate-800">{formatLPA(c.placement.averagePackage)}</span>, true, (c) => c.placement.averagePackage)}

            
            {renderRow('Highest Salary Package', (c) => <span className="font-extrabold text-slate-800">{formatLPA(c.placement.highestPackage)}</span>, true, (c) => c.placement.highestPackage)}

            
            {renderRow('Placement Rate', (c) => (<div className="flex w-full items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.placement.placementRate}%` }}/>
                  </div>
                  <span className="font-bold text-slate-800">{c.placement.placementRate}%</span>
                </div>), true, (c) => c.placement.placementRate)}

            
            {renderRow('Campus Size', (c) => c.campusSize)}
            {renderRow('Student-Faculty', (c) => c.studentFacultyRatio)}

            
            {renderRow('Key Facilities', (c) => (<div className="flex flex-wrap gap-1">
                {c.facilities.slice(0, 5).map((fac) => (<span key={fac} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {fac}
                  </span>))}
                {c.facilities.length > 5 && (<span className="text-[10px] font-bold text-slate-400 align-middle px-1">
                    +{c.facilities.length - 5}
                  </span>)}
              </div>))}

            
            {renderRow('Popular Courses Offered', (c) => (<div className="space-y-1 max-w-[240px]">
                {c.courses.map((course) => (<div key={course.name} className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                    <span className="font-medium text-slate-600 line-clamp-1 pr-2">{course.name}</span>
                    <span className="font-bold text-slate-700 shrink-0">{formatCurrency(course.fees)}</span>
                  </div>))}
              </div>))}

            
            {renderRow('Top Recruiters', (c) => (<div className="flex flex-wrap gap-1.5 max-w-[240px]">
                {c.placement.topRecruiters.map((rec) => (<span key={rec} className="rounded bg-slate-50 border border-slate-150 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    {rec}
                  </span>))}
              </div>))}
          </tbody>
        </table>
      </div>
    </div>);
}
