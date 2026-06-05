'use client';
import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, GitCompare, MapPin, Briefcase, Building, Award, Calendar, Users, Maximize, ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';
import { colleges } from '@/data/colleges';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatLPA } from '@/lib/utils';
import RatingBadge from '@/components/RatingBadge';
import EmptyState from '@/components/EmptyState';
interface CollegeDetailsProps {
    params: Promise<{
        id: string;
    }>;
}
export default function CollegeDetails({ params }: CollegeDetailsProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const { isSaved, toggleSaveCollege, isComparing, toggleCompareCollege, addToRecentlyViewed } = useApp();
    const college = colleges.find((c) => c.id === id);
    useEffect(() => {
        if (college) {
            addToRecentlyViewed(college.id);
        }
    }, [college, addToRecentlyViewed]);
    if (!college) {
        return (<div className="flex-1 flex flex-col justify-center items-center py-12">
        <EmptyState title="College Profile Not Found" description="We couldn't resolve a college profile matching this identifier. It may have been relocated or removed." icon={Building} actionText="Back to Explorer" onAction={() => router.push('/colleges')}/>
      </div>);
    }
    const saved = isSaved(college.id);
    const comparing = isComparing(college.id);
    const averageFee = (college.feesRange.min + college.feesRange.max) / 2;
    const roiScore = (college.placement.averagePackage * 100000) / averageFee;
    return (<div className="space-y-8 flex-1 flex flex-col justify-start">
      
      <div>
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
          <ArrowLeft className="h-4 w-4"/>
          <span>Back</span>
        </button>
      </div>

      
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-64 w-full md:h-80">
          
          <img src={college.image} alt={college.name} className="h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"/>
          
          
          <div className="absolute bottom-6 left-6 right-6 text-white md:left-8 md:right-8">
            <div className="flex flex-wrap gap-2.5 mb-3">
              {college.nirfRank && (<span className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                  NIRF #{college.nirfRank}
                </span>)}
              <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                {college.type}
              </span>
              <span className="rounded-lg bg-white/25 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                {college.accreditation}
              </span>
            </div>

            <h2 className="text-2xl font-black md:text-3xl tracking-tight leading-tight">
              {college.name}
            </h2>

            <p className="mt-2 text-xs font-bold text-slate-200 flex items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0 text-slate-300"/>
              <span>{college.location}</span>
            </p>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Institutional Rating</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Award className="h-5 w-5"/>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{college.rating.toFixed(1)}</span>
              <RatingBadge rating={college.rating} showCount={false}/>
            </div>
            <span className="text-xs font-semibold text-slate-400">Based on {college.reviewsCount} verified reviews</span>
          </div>
        </div>

        
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Placements Analytics</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Briefcase className="h-5 w-5"/>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {formatLPA(college.placement.averagePackage)}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Highest package: <strong className="text-slate-700">{formatLPA(college.placement.highestPackage)}</strong>
            </span>
          </div>
        </div>

        
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ROI index</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Users className="h-5 w-5"/>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{roiScore.toFixed(1)}x</span>
              <span className="text-xs font-bold text-emerald-600 px-1 rounded bg-emerald-50">High Return</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Est. Annual: <strong className="text-slate-700">{formatCurrency(college.feesRange.min)} - {formatCurrency(college.feesRange.max)}</strong>
            </span>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight border-b border-slate-100 pb-3 mb-4">
              About the Institute
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              {college.description}
            </p>
          </div>

          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight border-b border-slate-100 pb-3 mb-4">
              Student Reviews Sub-Ratings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
            { label: 'Academics & Faculty', score: college.subRatings.academics, color: 'bg-emerald-500' },
            { label: 'Placements & Internships', score: college.subRatings.placements, color: 'bg-indigo-500' },
            { label: 'Infrastructure & Facilities', score: college.subRatings.infra, color: 'bg-violet-500' },
            { label: 'Campus Life & Socials', score: college.subRatings.campusLife, color: 'bg-amber-500' },
        ].map((sub) => (<div key={sub.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>{sub.label}</span>
                    <span className="text-slate-800">{sub.score.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                    <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${(sub.score / 5) * 100}%` }}/>
                  </div>
                </div>))}
            </div>
          </div>

          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight border-b border-slate-100 pb-3 mb-4">
              Courses Offered & Curriculum Fees
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Course Structure</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Annual Fee</th>
                    <th className="py-3 px-4 text-right">Placement</th>
                  </tr>
                </thead>
                <tbody>
                  {college.courses.map((course) => (<tr key={course.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-700">{course.name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-500">{course.duration}</td>
                      <td className="py-3 px-4 font-bold text-indigo-600">{formatCurrency(course.fees)}</td>
                      <td className="py-3 px-4 font-bold text-slate-700 text-right">{course.placementRate}%</td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>

          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight border-b border-slate-100 pb-3 mb-4">
              Prominent Recruiters
            </h3>
            <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
              Top corporate hiring partners offering placements
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {college.placement.topRecruiters.map((recruiter) => (<div key={recruiter} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 font-bold text-slate-700 hover:border-indigo-100 shadow-sm">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500"/>
                  <span className="text-xs truncate">{recruiter}</span>
                </div>))}
            </div>
          </div>
        </div>

        
        <div className="space-y-6">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3.5">
            <button onClick={() => toggleSaveCollege(college.id)} className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all border shadow-sm cursor-pointer ${saved
            ? 'bg-rose-500 border-rose-500 text-white shadow-rose-100'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <Bookmark className={`h-4.5 w-4.5 ${saved ? 'fill-current' : ''}`}/>
              <span>{saved ? 'Saved in Bookmarks' : 'Save to Bookmarks'}</span>
            </button>

            <button onClick={() => toggleCompareCollege(college.id)} className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all border shadow-sm cursor-pointer ${comparing
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <GitCompare className="h-4.5 w-4.5"/>
              <span>{comparing ? 'Added to Compare List' : 'Compare Side-by-Side'}</span>
            </button>
          </div>

          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 tracking-tight border-b border-slate-100 pb-3 mb-4">
              Campus Profile Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                  <Calendar className="h-4 w-4 text-slate-400"/>
                  <span>Founded</span>
                </span>
                <span className="font-bold text-slate-700">{college.founded}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                  <Users className="h-4 w-4 text-slate-400"/>
                  <span>Student Faculty</span>
                </span>
                <span className="font-bold text-slate-700">{college.studentFacultyRatio}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                  <Maximize className="h-4 w-4 text-slate-400"/>
                  <span>Campus Size</span>
                </span>
                <span className="font-bold text-slate-700">{college.campusSize}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                  <Award className="h-4 w-4 text-slate-400"/>
                  <span>Accreditation</span>
                </span>
                <span className="font-bold text-slate-700">{college.accreditation}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                  <GraduationCap className="h-4 w-4 text-slate-400"/>
                  <span>Accepted Exams</span>
                </span>
                <span className="font-bold text-slate-700 text-right">{college.acceptedExams.join(', ')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
                  <Building className="h-4 w-4 text-slate-400"/>
                  <span>Institution type</span>
                </span>
                <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  {college.type}
                </span>
              </div>
            </div>
          </div>

          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 tracking-tight border-b border-slate-100 pb-3 mb-4">
              Infrastructure & Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {college.facilities.map((facility) => (<span key={facility} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  {facility}
                </span>))}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
