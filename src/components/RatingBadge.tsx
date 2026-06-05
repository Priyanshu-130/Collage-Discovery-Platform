import React from 'react';
import { Star } from 'lucide-react';
interface RatingBadgeProps {
    rating: number;
    reviewsCount?: number;
    size?: 'sm' | 'md' | 'lg';
    showCount?: boolean;
}
export default function RatingBadge({ rating, reviewsCount, size = 'md', showCount = true }: RatingBadgeProps) {
    const sizeClasses = {
        sm: 'text-xs gap-1',
        md: 'text-sm gap-1.5',
        lg: 'text-base gap-2',
    };
    const starSizes = {
        sm: 'h-3.5 w-3.5',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };
    return (<div className={`flex items-center ${sizeClasses[size]}`}>
      <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-amber-600 font-semibold border border-amber-100">
        <Star className={`${starSizes[size]} fill-amber-500 stroke-amber-500`}/>
        <span>{rating.toFixed(1)}</span>
      </div>
      {showCount && reviewsCount !== undefined && (<span className="text-slate-400">({reviewsCount.toLocaleString()} reviews)</span>)}
    </div>);
}
