'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  GitCompare, 
  Bookmark, 
  Info, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { colleges } from '@/data/colleges';
import { useApp } from '@/context/AppContext';
import { College } from '@/types';

interface PredictionResult {
  college: College;
  chance: 'High' | 'Medium' | 'Low' | 'Unlikely';
  cutoffRank: number;
  reason: string;
}

// Helper to calculate branch-wise prediction chances based on base cutoff rank
interface BranchCutoff {
  branchName: string;
  cutoffRank: number;
  chance: 'High' | 'Medium' | 'Low' | 'Unlikely';
}

function getBranchPredictions(exam: string, rank: number, baseCutoff: number): BranchCutoff[] {
  let branches: { name: string; multiplier: number }[] = [];

  if (exam === 'CAT') {
    branches = [
      { name: 'MBA Finance', multiplier: 0.4 },
      { name: 'MBA Business Analytics', multiplier: 0.65 },
      { name: 'MBA Marketing', multiplier: 0.95 },
      { name: 'MBA Human Resources', multiplier: 1.1 },
      { name: 'MBA Operations & Supply Chain', multiplier: 1.3 },
    ];
  } else if (exam === 'GATE') {
    branches = [
      { name: 'M.Tech Computer Science & Eng', multiplier: 0.45 },
      { name: 'M.Tech VLSI & Microelectronics', multiplier: 0.7 },
      { name: 'M.Tech Data Science & AI', multiplier: 0.8 },
      { name: 'M.Tech Power Systems Engineering', multiplier: 1.15 },
      { name: 'M.Tech Structural Engineering', multiplier: 1.35 },
    ];
  } else {
    // Default Engineering Exams
    branches = [
      { name: 'Computer Science & Engineering (CSE)', multiplier: 0.22 },
      { name: 'Information Technology (IT)', multiplier: 0.4 },
      { name: 'Electronics & Communication (ECE)', multiplier: 0.6 },
      { name: 'Electrical Engineering (EE)', multiplier: 0.85 },
      { name: 'Mechanical Engineering (ME)', multiplier: 1.1 },
      { name: 'Civil Engineering (CE)', multiplier: 1.35 },
    ];
  }

  return branches.map((b) => {
    const branchCutoff = Math.round(baseCutoff * b.multiplier);
    let chance: 'High' | 'Medium' | 'Low' | 'Unlikely' = 'Unlikely';

    if (rank <= branchCutoff * 0.7) {
      chance = 'High';
    } else if (rank <= branchCutoff * 1.0) {
      chance = 'Medium';
    } else if (rank <= branchCutoff * 1.25) {
      chance = 'Low';
    } else {
      chance = 'Unlikely';
    }

    return {
      branchName: b.name,
      cutoffRank: branchCutoff,
      chance
    };
  });
}

const EXAMS_LIST = [
  { id: 'JEE Advanced', name: 'JEE Advanced', description: 'IIT Admissions', placeholder: 'e.g. 2500' },
  { id: 'JEE Main', name: 'JEE Main', description: 'NITs, IIITs, GFTIs, DTU', placeholder: 'e.g. 15000' },
  { id: 'BITSAT', name: 'BITSAT', description: 'BITS Pilani Campuses', placeholder: 'e.g. 3500' },
  { id: 'CAT', name: 'CAT', description: 'IIMs & Premier B-Schools', placeholder: 'e.g. 850' },
  { id: 'GATE', name: 'GATE', description: 'M.Tech Programs', placeholder: 'e.g. 1200' },
  { id: 'KCET', name: 'KCET', description: 'Karnataka Engineering', placeholder: 'e.g. 4500' },
  { id: 'COMEDK', name: 'COMEDK', description: 'Karnataka Private Engineering', placeholder: 'e.g. 8000' },
  { id: 'MHT CET', name: 'MHT CET', description: 'Maharashtra Engineering', placeholder: 'e.g. 5000' },
  { id: 'TNEA', name: 'TNEA', description: 'Tamil Nadu Engineering', placeholder: 'e.g. 6000' },
  { id: 'WBJEE', name: 'WBJEE', description: 'West Bengal Engineering (JU)', placeholder: 'e.g. 1500' },
  { id: 'VITEEE', name: 'VITEEE', description: 'VIT Campuses Admission', placeholder: 'e.g. 20000' },
  { id: 'MET', name: 'MET', description: 'Manipal Campuses Admission', placeholder: 'e.g. 10000' },
  { id: 'BCECE', name: 'BCECE', description: 'Bihar State Engineering (MIT)', placeholder: 'e.g. 4000' }
];

export default function PredictorPage() {
  const router = useRouter();
  const { toggleSaveCollege, isSaved, toggleCompareCollege, isComparing } = useApp();
  
  const [selectedExam, setSelectedExam] = useState('JEE Main');
  const [rankInput, setRankInput] = useState('');
  const [hasPredicted, setHasPredicted] = useState(false);
  const [history, setHistory] = useState<{ exam: string; rank: number; count: number }[]>([]);
  const [expandedColleges, setExpandedColleges] = useState<Record<string, boolean>>({});

  const toggleExpandCollege = (id: string) => {
    setExpandedColleges((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Realistic cutoff rank matching engine
  const predictions = useMemo<PredictionResult[]>(() => {
    if (!hasPredicted || !rankInput || isNaN(Number(rankInput))) return [];
    
    const rank = Number(rankInput);
    const results: PredictionResult[] = [];

    // Base target cutoffs mapping based on the college prestige
    const getBaseCutoff = (id: string, exam: string): number => {
      // Find the college object
      const col = colleges.find((c) => c.id === id);
      const rating = col ? col.rating : 4.0;
      
      // Calculate a rating multiplier
      // Higher rating (elite) -> Lower multiplier (harder to get in, lower cutoff rank)
      // Lower rating (mid-tier) -> Higher multiplier (easier to get in, higher cutoff rank)
      let ratingFactor = 1.0;
      if (rating >= 4.8) ratingFactor = 0.35;      // Top-tier elite (cutoff: top 15k JEE)
      else if (rating >= 4.5) ratingFactor = 0.75;  // Elite (cutoff: top 30k JEE)
      else if (rating >= 4.2) ratingFactor = 1.35;  // Mid-high (cutoff: top 50k JEE)
      else if (rating >= 4.0) ratingFactor = 2.45;  // Mid-tier (cutoff: top 85k-100k JEE)
      else ratingFactor = 3.6;                      // Lower mid-tier (cutoff: top 120k+ JEE)

      // 1. JEE Advanced (IITs)
      if (exam === 'JEE Advanced') {
        switch (id) {
          case 'iit-madras': return 5000;
          case 'iit-bombay': return 4500;
          case 'iit-delhi': return 4800;
          case 'iit-kharagpur': return 7000;
          case 'iit-roorkee': return 8000;
          case 'iit-guwahati': return 8500;
          case 'iit-patna': return 12000;
          default: return Math.round(10000 * ratingFactor);
        }
      }
      // 2. JEE Main (NITs, DTU, NSUT, IIITs)
      if (exam === 'JEE Main') {
        switch (id) {
          case 'nit-trichy': return 18000;
          case 'nit-surathkal': return 20000;
          case 'nit-warangal': return 22000;
          case 'dtu-delhi': return 32000;
          case 'nsut-delhi': return 28000;
          case 'iiit-delhi': return 25000;
          case 'nit-calicut': return 30000;
          case 'mnit-jaipur': return 35000;
          case 'nit-rourkela': return 24000;
          case 'mnnit-allahabad': return 25000;
          case 'nit-kurukshetra': return 36000;
          case 'manit-bhopal': return 40000;
          case 'vnit-nagpur': return 34000;
          case 'nit-jalandhar': return 45000;
          case 'nit-patna': return 50000;
          case 'nit-raipur': return 55000;
          case 'mit-muzaffarpur': return 95000;
          case 'lpu-jalandhar': return 180000;
          case 'cu-mohali': return 160000;
          case 'amity-noida': return 150000;
          case 'dypcoe-pune': return 120000;
          case 'scoe-pune': return 140000;
          case 'heritage-kolkata': return 90000;
          case 'haldia-tech': return 110000;
          case 'veltech-chennai': return 150000;
          case 'skcet-coimbatore': return 95000;
          case 'dce-darbhanga': return 180000;
          default: return Math.round(45000 * ratingFactor);
        }
      }
      // 3. BITSAT (BITS)
      if (exam === 'BITSAT') {
        switch (id) {
          case 'bits-pilani': return 3000;
          case 'bits-goa': return 5000;
          case 'bits-hyderabad': return 6500;
          default: return Math.round(5000 * ratingFactor);
        }
      }
      // 4. CAT (IIMs, FMS, SPJIMR, etc)
      if (exam === 'CAT') {
        switch (id) {
          case 'iim-ahmedabad': return 250;
          case 'iim-bangalore': return 380;
          case 'iim-calcutta': return 480;
          case 'fms-delhi': return 650;
          case 'spjimr-mumbai': return 850;
          case 'mdi-gurgaon': return 1200;
          case 'iim-ranchi': return 2200;
          case 'nirma-university': return 5000;
          case 'lpu-jalandhar': return 15000;
          case 'cu-mohali': return 12000;
          case 'amity-noida': return 14000;
          default: return Math.round(3000 * ratingFactor);
        }
      }
      // 5. MET (Manipal)
      if (exam === 'MET') {
        switch (id) {
          case 'mit-manipal': return 10000;
          case 'muj-jaipur': return 18000;
          case 'smit-sikkim': return 25000;
          default: return Math.round(15000 * ratingFactor);
        }
      }
      // 6. KCET / COMEDK
      if (exam === 'KCET' || exam === 'COMEDK') {
        const factor = exam === 'COMEDK' ? 1.5 : 1.0;
        switch (id) {
          case 'rvce-bangalore': return Math.round(5000 * factor);
          case 'bmsce-bangalore': return Math.round(8000 * factor);
          case 'pes-bangalore': return Math.round(11000 * factor);
          case 'bmsit-bangalore': return Math.round(20000 * factor);
          case 'rnsit-bangalore': return Math.round(28000 * factor);
          case 'nmit-bangalore': return Math.round(32000 * factor);
          case 'reva-bangalore': return Math.round(55000 * factor);
          case 'alliance-bangalore': return Math.round(65000 * factor);
          case 'acharya-tech': return Math.round(75000 * factor);
          default: return Math.round(25000 * factor * ratingFactor);
        }
      }
      // 7. MHT CET
      if (exam === 'MHT CET') {
        switch (id) {
          case 'coep-pune': return 4000;
          case 'vjti-mumbai': return 3800;
          case 'spit-mumbai': return 6500;
          case 'pict-pune': return 8500;
          case 'vit-pune': return 12000;
          case 'dypcoe-pune': return 60000;
          case 'scoe-pune': return 75000;
          default: return Math.round(10000 * ratingFactor);
        }
      }
      // 8. TNEA
      if (exam === 'TNEA') {
        switch (id) {
          case 'ceg-guindy': return 4500;
          case 'anna-university': return 5500;
          case 'psg-tech': return 8000;
          case 'cit-coimbatore': return 13000;
          case 'veltech-chennai': return 70000;
          case 'skcet-coimbatore': return 40000;
          default: return Math.round(10000 * ratingFactor);
        }
      }
      // 9. WBJEE
      if (exam === 'WBJEE') {
        switch (id) {
          case 'jadavpur-university': return 3200;
          case 'techno-saltlake': return 25000;
          case 'heritage-kolkata': return 35000;
          case 'haldia-tech': return 45000;
          default: return Math.round(8000 * ratingFactor);
        }
      }
      // 10. VITEEE
      if (exam === 'VITEEE') {
        return Math.round(35000 * ratingFactor);
      }
      // 11. BCECE
      if (exam === 'BCECE') {
        switch (id) {
          case 'mit-muzaffarpur': return 5000;
          case 'gce-gaya': return 10000;
          case 'dce-darbhanga': return 12000;
          default: return Math.round(4500 * ratingFactor);
        }
      }
      return Math.round(5000 * ratingFactor);
    };

    // Filter and map eligible colleges
    colleges.forEach((col) => {
      // Check if college accepts the selected exam
      const accepts = col.acceptedExams.some(
        (ex) => ex.toLowerCase() === selectedExam.toLowerCase()
      );

      if (accepts) {
        const cutoff = getBaseCutoff(col.id, selectedExam);
        let chance: 'High' | 'Medium' | 'Low' | 'Unlikely' = 'Low';
        let reason = '';

        if (rank <= cutoff * 0.4) {
          chance = 'High';
          reason = `Excellent standing. Your rank is well within the top-bracket cutoff history for core disciplines (Computer Science, Electronics).`;
        } else if (rank <= cutoff * 1.0) {
          chance = 'Medium';
          reason = `Strong competitive match. Admission is highly probable in core-allied and specialization tracks.`;
        } else if (rank <= cutoff * 1.35) {
          chance = 'Low';
          reason = `Reach target. May secure admission during final/spot counseling rounds or in core mechanical/civil branches.`;
        } else {
          chance = 'Unlikely';
          reason = `Rank exceeds historical average cutoff for core courses. Regular rounds are highly unlikely, but direct admission or spot rounds may apply.`;
        }

        results.push({
          college: col,
          chance,
          cutoffRank: cutoff,
          reason
        });
      }
    });

    // Sort by chance (High > Medium > Low > Unlikely) and NIRF Rank
    return results.sort((a, b) => {
      const chanceOrder = { High: 0, Medium: 1, Low: 2, Unlikely: 3 };
      if (chanceOrder[a.chance] !== chanceOrder[b.chance]) {
        return chanceOrder[a.chance] - chanceOrder[b.chance];
      }
      return (a.college.nirfRank || 999) - (b.college.nirfRank || 999);
    });
  }, [hasPredicted, rankInput, selectedExam]);

  // Aggregated branch-wise matching summary across all matched colleges
  const branchSummary = useMemo(() => {
    if (!hasPredicted || !rankInput || isNaN(Number(rankInput))) return [];

    const rank = Number(rankInput);
    const summary: Record<string, { collegeName: string; collegeId: string; chance: 'High' | 'Medium' | 'Low' | 'Unlikely' }[]> = {};

    predictions.forEach((p) => {
      const branches = getBranchPredictions(selectedExam, rank, p.cutoffRank);
      branches.forEach((br) => {
        if (!summary[br.branchName]) {
          summary[br.branchName] = [];
        }
        summary[br.branchName].push({
          collegeName: p.college.shortName,
          collegeId: p.college.id,
          chance: br.chance
        });
      });
    });

    return Object.entries(summary).map(([branchName, collegesList]) => {
      const chanceValue = { High: 0, Medium: 1, Low: 2, Unlikely: 3 };
      const sortedColleges = collegesList.sort((a, b) => chanceValue[a.chance] - chanceValue[b.chance]);
      
      // Filter out Unlikely to keep the quick summary clean, unless all are Unlikely
      const viableColleges = sortedColleges.filter(c => c.chance !== 'Unlikely');
      
      return {
        branchName,
        colleges: viableColleges.length > 0 ? viableColleges : sortedColleges.slice(0, 3)
      };
    });
  }, [predictions, selectedExam, rankInput, hasPredicted]);

  const handlePredictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = Number(rankInput);
    if (!rankInput || isNaN(rankNum) || rankNum <= 0) return;

    setHasPredicted(true);

    // Calculate match count synchronously to avoid race condition with state update
    const matchCount = colleges.filter((col) =>
      col.acceptedExams.some((ex) => ex.toLowerCase() === selectedExam.toLowerCase())
    ).length;

    // Save search to history logs
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.exam !== selectedExam || h.rank !== rankNum);
      return [{ exam: selectedExam, rank: rankNum, count: matchCount }, ...filtered].slice(0, 5);
    });
  };

  const handleHistoryClick = (exam: string, rank: number) => {
    setSelectedExam(exam);
    setRankInput(rank.toString());
    setHasPredicted(true);
  };

  return (
    <div className="space-y-8 flex-1 flex flex-col justify-start">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-xl md:px-10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 border border-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Admission Matcher</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">College Cutoff Predictor</h2>
          <p className="text-sm font-semibold text-slate-300 leading-relaxed max-w-xl">
            Input your entrance exam rank to discover list matches with high, medium, or spot-round admission probabilities based on official statistics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Form Controls */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 tracking-tight mb-5">Configure Search Log</h3>
            <form onSubmit={handlePredictSubmit} className="space-y-5">
              
              {/* Exam Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Entrance Exam</label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 border border-slate-100 rounded-xl p-1 bg-slate-50 shadow-inner">
                  {EXAMS_LIST.map((exam) => (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => {
                        setSelectedExam(exam.id);
                        setHasPredicted(false);
                      }}
                      className={`flex items-center justify-between rounded-lg p-2.5 text-left transition-all ${
                        selectedExam === exam.id
                          ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:bg-white/50 hover:text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-bold">{exam.name}</span>
                        <span className="block text-[10px] text-slate-400 font-semibold">{exam.description}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${selectedExam === exam.id ? 'translate-x-0.5' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Rank Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Enter Your Rank</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">Rank</span>
                  <input
                    type="number"
                    min="1"
                    max="999999"
                    value={rankInput}
                    onChange={(e) => {
                      setRankInput(e.target.value);
                      setHasPredicted(false);
                    }}
                    placeholder={EXAMS_LIST.find((e) => e.id === selectedExam)?.placeholder || 'e.g. 5000'}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-14 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-inner outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-indigo-600 active:scale-[0.98] transition-all"
              >
                Find Matching Colleges
              </button>
            </form>
          </div>

          {/* History widget */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="h-4.5 w-4.5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Prediction Logs</h4>
              </div>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <button
                    key={`history-${i}`}
                    onClick={() => handleHistoryClick(h.exam, h.rank)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left hover:bg-slate-50 hover:border-slate-200 transition-all"
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-700">{h.exam}</span>
                      <span className="block text-[10px] font-semibold text-slate-400">Rank: {h.rank.toLocaleString()}</span>
                    </div>
                    <span className="rounded-md bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600">
                      {h.count} matches
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Prediction results */}
        <div className="space-y-6 lg:col-span-2">
          {hasPredicted ? (
            predictions.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Predictions Result</h3>
                    <p className="text-xs text-slate-500 font-semibold">Matched {predictions.length} colleges for {selectedExam} Rank {Number(rankInput).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <Info className="h-3.5 w-3.5" />
                      <span>Cutoffs are illustrative</span>
                    </span>
                  </div>
                </div>

                {/* Branch Admission Summary Widget */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4.5 w-4.5 text-indigo-600 font-bold" />
                    <h4 className="text-sm font-bold text-slate-850 tracking-tight">Branch-wise Availability Summary</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Based on your rank of <span className="text-slate-900 font-bold">{Number(rankInput).toLocaleString()}</span>, here are your chances across different engineering/management branches. Click any college pill to scroll directly to its full profile and expand its details:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {branchSummary.map((b) => {
                      return (
                        <div 
                          key={`branch-sum-${b.branchName}`}
                          className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 hover:border-indigo-100 hover:bg-slate-50 transition-all shadow-sm"
                        >
                          <span className="block text-xs font-bold text-slate-800">{b.branchName}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {b.colleges.length > 0 ? (
                              b.colleges.map((c) => {
                                const badgeStyles = {
                                  High: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
                                  Medium: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100',
                                  Low: 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100',
                                  Unlikely: 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200/50'
                                };
                                return (
                                  <button
                                    key={`branch-sum-${b.branchName}-${c.collegeId}`}
                                    onClick={() => {
                                      const el = document.getElementById(`prediction-${c.collegeId}`);
                                      if (el) {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        setExpandedColleges(prev => ({ ...prev, [c.collegeId]: true }));
                                      }
                                    }}
                                    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all shadow-sm ${badgeStyles[c.chance]}`}
                                    title={`Click to view details. Chance: ${c.chance}`}
                                  >
                                    <span>{c.collegeName}</span>
                                    {c.chance !== 'Unlikely' ? (
                                      <span className="text-[8px] font-bold uppercase shrink-0">({c.chance[0]})</span>
                                    ) : (
                                      <span className="text-[8px] font-bold uppercase shrink-0">(U)</span>
                                    )}
                                  </button>
                                );
                              })
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold italic">No colleges available for this branch</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {predictions.map((p) => {
                    const chanceStyles = {
                      High: 'bg-emerald-50 border-emerald-100 text-emerald-700 tag-green',
                      Medium: 'bg-amber-50 border-amber-100 text-amber-700 tag-amber',
                      Low: 'bg-rose-50 border-rose-100 text-rose-700 tag-rose',
                      Unlikely: 'bg-slate-50 border-slate-200 text-slate-500'
                    };
                    const col = p.college;
                    const branchResults = getBranchPredictions(selectedExam, Number(rankInput), p.cutoffRank);
                    const eligibleBranches = branchResults.filter(b => b.chance !== 'Unlikely');
                    const isExpanded = !!expandedColleges[col.id];

                    return (
                      <div 
                        key={`prediction-${col.id}`}
                        id={`prediction-${col.id}`}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all group relative overflow-hidden"
                      >
                        {/* Status bar marker */}
                        <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                          p.chance === 'High' ? 'bg-emerald-500' : p.chance === 'Medium' ? 'bg-amber-500' : p.chance === 'Low' ? 'bg-rose-500' : 'bg-slate-350'
                        }`} />

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pl-2">
                          <div className="flex items-start gap-4">
                            {/* Logo representation */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 font-extrabold text-slate-700 shadow-sm border border-slate-200 text-sm">
                              {col.logo}
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${chanceStyles[p.chance]}`}>
                                  {p.chance} Chance
                                </span>
                                {col.nirfRank && (
                                  <span className="rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                    NIRF #{col.nirfRank}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-base text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                                {col.name}
                              </h4>
                              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                <span>{col.location}</span>
                              </p>

                              {/* Eligible branches quick preview */}
                              <div className="mt-3">
                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Eligible Branches</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {eligibleBranches.length > 0 ? (
                                    eligibleBranches.slice(0, 3).map((br) => {
                                      const miniBadgeStyles = {
                                        High: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                                        Medium: 'bg-amber-50 text-amber-700 border-amber-100',
                                        Low: 'bg-rose-50 text-rose-700 border-rose-100'
                                      };
                                      return (
                                        <span 
                                          key={`mini-branch-${br.branchName}`}
                                          className={`inline-block rounded-lg border px-2 py-0.5 text-[10px] font-bold ${miniBadgeStyles[br.chance as 'High' | 'Medium' | 'Low']}`}
                                        >
                                          {br.branchName.split(' (')[0]}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-semibold italic">No direct branch matches (Reach target)</span>
                                  )}
                                  {eligibleBranches.length > 3 && (
                                    <span className="inline-block rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                      +{eligibleBranches.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Action panel */}
                          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end justify-start">
                            <button
                              onClick={() => router.push(`/college/${col.id}`)}
                              className="inline-flex items-center gap-1 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                            >
                              <span>View Profile</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleCompareCollege(col.id)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                  isComparing(col.id)
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                                title={isComparing(col.id) ? "Comparing" : "Add to Compare"}
                              >
                                <GitCompare className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => toggleSaveCollege(col.id)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                  isSaved(col.id)
                                    ? 'bg-red-500 border-red-500 text-white shadow'
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                                title={isSaved(col.id) ? "Bookmarked" : "Bookmark"}
                              >
                                <Bookmark className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Analysis Box */}
                        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 leading-normal pl-2 font-medium flex gap-2">
                          <HelpCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-700 block mb-0.5">Matching Reason:</span>
                            {p.reason}
                          </div>
                        </div>

                        {/* Toggle branch breakups */}
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between pl-2">
                          <button
                            type="button"
                            onClick={() => toggleExpandCollege(col.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            {isExpanded ? (
                              <>
                                <span>Hide Branch-wise Cutoffs</span>
                                <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                <span>View Branch-wise Cutoffs</span>
                                <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </div>

                        {/* Detailed branch-wise cutoffs table */}
                        {isExpanded && (
                          <div className="mt-4 rounded-2xl border border-slate-150 overflow-hidden pl-2 shadow-inner bg-slate-50/30">
                            <table className="min-w-full divide-y divide-slate-250">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Branch/Specialization</th>
                                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Cutoff</th>
                                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Admission Chance</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 bg-white">
                                {branchResults.map((br) => {
                                  const tableBadgeStyles = {
                                    High: 'bg-emerald-50 border-emerald-100 text-emerald-700',
                                    Medium: 'bg-amber-50 border-amber-100 text-amber-700',
                                    Low: 'bg-rose-50 border-rose-100 text-rose-700',
                                    Unlikely: 'bg-slate-100 border-slate-200 text-slate-500'
                                  };
                                  return (
                                    <tr key={`tbl-branch-${br.branchName}`} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-4 py-3.5 text-xs font-bold text-slate-700">{br.branchName}</td>
                                      <td className="px-4 py-3.5 text-xs font-semibold text-slate-500">{br.cutoffRank.toLocaleString()}</td>
                                      <td className="px-4 py-3.5">
                                        <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${tableBadgeStyles[br.chance]}`}>
                                          {br.chance === 'Unlikely' ? 'Unlikely' : `${br.chance} Chance`}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4 shadow-inner">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Admission Matches Found</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1 leading-normal max-w-sm">
                  Your rank of {Number(rankInput).toLocaleString()} exceeds the cutoff thresholds for all indexed colleges accepting {selectedExam}. Try searching for other exams or enter a lower rank.
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 px-6 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-50 to-indigo-100 border border-indigo-100 text-indigo-600 mb-5 shadow-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Ready for Admission Prediction</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1.5 leading-normal max-w-md">
                Configure your entrance exam and input your scorecard rank on the left sidebar to run the matching engine against cutoff statistics.
              </p>
              
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 text-left max-w-md w-full">
                <div className="flex gap-3 rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-700">Real Cutoffs Logic</span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5 leading-normal">Matches rank against actual historical cutoffs from Collegedunia database.</span>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-700">Admission Probability</span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5 leading-normal">Flags chances as High (Safe target), Medium (Competitive match), or Low (Spot rounds).</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
