import React, { ElementType } from 'react';
import { cn } from '../lib/utils';
interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ElementType;
    description?: string;
    trend?: {
        value: string;
        type: 'positive' | 'negative' | 'neutral';
    };
    color?: 'indigo' | 'emerald' | 'amber' | 'rose';
}
export default function StatsCard({ title, value, icon: Icon, description, trend, color = 'indigo', }: StatsCardProps) {
    const colorSchemes = {
        indigo: {
            bg: 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100',
            iconBg: 'bg-indigo-100 text-indigo-600',
            glow: 'shadow-indigo-50/30'
        },
        emerald: {
            bg: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100',
            iconBg: 'bg-emerald-100 text-emerald-600',
            glow: 'shadow-emerald-50/30'
        },
        amber: {
            bg: 'bg-amber-50/50 hover:bg-amber-50 border-amber-100',
            iconBg: 'bg-amber-100 text-amber-600',
            glow: 'shadow-amber-50/30'
        },
        rose: {
            bg: 'bg-rose-50/50 hover:bg-rose-50 border-rose-100',
            iconBg: 'bg-rose-100 text-rose-600',
            glow: 'shadow-rose-50/30'
        }
    };
    const scheme = colorSchemes[color] || colorSchemes.indigo;
    return (<div className={cn("relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md", scheme.glow)}>
      
      <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-slate-50 opacity-50 blur-2xl transition-all group-hover:scale-125"/>

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</span>
            {trend && (<span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-md", trend.type === 'positive' && "bg-emerald-100 text-emerald-700", trend.type === 'negative' && "bg-rose-100 text-rose-700", trend.type === 'neutral' && "bg-slate-100 text-slate-600")}>
                {trend.value}
              </span>)}
          </div>
          {description && (<p className="text-xs font-medium text-slate-500">{description}</p>)}
        </div>

        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-all shadow-inner", scheme.iconBg)}>
          <Icon className="h-6 w-6"/>
        </div>
      </div>
    </div>);
}
