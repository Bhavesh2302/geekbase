import React from 'react';
import { Trophy, CheckCircle2, CircleDashed, Flame } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface OverallProgressBannerProps {
  totalProblems: number;
  completedProblems: number;
  remainingProblems: number;
  completionPercentage: number;
}

export const OverallProgressBanner: React.FC<OverallProgressBannerProps> = ({
  totalProblems,
  completedProblems,
  remainingProblems,
  completionPercentage,
}) => {
  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-brand-950/20 shadow-xl overflow-hidden relative">
      {/* Background glow accent */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardContent className="p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-brand-500/10 text-brand-400">
                <Flame className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Overall Roadmap Progress
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Curriculum Mastery
            </h2>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              {completionPercentage}%
            </span>
            <span className="text-xs text-slate-400 font-medium">Completed</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <ProgressBar
            value={completionPercentage}
            size="lg"
            variant="gradient"
            className="shadow-sm"
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Level 1: Fundamentals</span>
            <span>{completedProblems} of {totalProblems} Solved</span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Completed</p>
              <p className="text-lg font-bold text-slate-100 font-mono mt-0.5">
                {completedProblems}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <CircleDashed className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Remaining</p>
              <p className="text-lg font-bold text-slate-100 font-mono mt-0.5">
                {remainingProblems}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Available</p>
              <p className="text-lg font-bold text-slate-100 font-mono mt-0.5">
                {totalProblems}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
