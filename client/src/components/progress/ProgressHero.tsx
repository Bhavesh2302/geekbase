import React from 'react';
import { Trophy, Sparkles, ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export interface ProgressHeroProps {
  totalProblems: number;
  completedProblems: number;
  remainingProblems: number;
  completionPercentage: number;
  continueProblemTitle?: string;
  continueProblemSlug?: string;
}

export const ProgressHero: React.FC<ProgressHeroProps> = ({
  totalProblems,
  completedProblems,
  remainingProblems,
  completionPercentage,
  continueProblemTitle,
}) => {
  const isZeroProgress = completedProblems === 0;
  const isFullyCompleted = totalProblems > 0 && completedProblems === totalProblems;

  // Circular progress calculations for SVG ring gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Background glow effects */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isFullyCompleted
            ? 'bg-amber-400'
            : isZeroProgress
            ? 'bg-brand-500'
            : 'bg-emerald-500'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
        {/* Left: Overall Circular Progress Gauge */}
        <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 128 128"
              aria-hidden="true"
            >
              {/* Track circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-800/80"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="url(#progressGradient)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                fill="transparent"
              />
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={isFullyCompleted ? '#f59e0b' : '#6366f1'}
                  />
                  <stop
                    offset="100%"
                    stopColor={isFullyCompleted ? '#fbbf24' : '#10b981'}
                  />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {completionPercentage}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Completed
              </span>
            </div>
          </div>

          {/* Core Numbers */}
          <div className="text-center sm:text-left space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Overall Progress
              </h3>
              {isFullyCompleted ? (
                <Badge variant="warning" size="sm" hasDot>
                  Mastered
                </Badge>
              ) : isZeroProgress ? (
                <Badge variant="neutral" size="sm" hasDot>
                  Not Started
                </Badge>
              ) : (
                <Badge variant="brand" size="sm" hasDot>
                  In Progress
                </Badge>
              )}
            </div>

            <p className="text-sm text-slate-300 font-medium">
              <span className="text-emerald-400 font-bold">{completedProblems}</span> of{' '}
              <span className="text-white font-bold">{totalProblems}</span> DSA problems solved
            </p>

            <p className="text-xs text-slate-400">
              {remainingProblems === 0 ? (
                'Zero problems remaining! Full curriculum covered.'
              ) : (
                <>
                  <span className="text-brand-300 font-semibold">{remainingProblems}</span> problems remaining to complete sheet.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: State-Specific Call-To-Action / Celebration */}
        <div className="w-full md:w-auto md:max-w-md flex flex-col items-center md:items-end justify-center text-center md:text-right">
          {isFullyCompleted ? (
            /* Fully Completed State */
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2.5 max-w-sm">
              <div className="flex items-center justify-center md:justify-end gap-2 text-amber-400 font-bold text-sm">
                <Trophy className="w-5 h-5" />
                <span>Curriculum Mastered!</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Outstanding dedication! You have successfully completed all available DSA problems. Keep practicing on your Study Calendar for spaced revision.
              </p>
              <Link to="/calendar" className="inline-block">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 border-amber-500/40 text-slate-950 font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Review on Calendar
                </Button>
              </Link>
            </div>
          ) : isZeroProgress ? (
            /* Zero-Progress State */
            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-200 space-y-2.5 max-w-sm">
              <div className="flex items-center justify-center md:justify-end gap-2 text-brand-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>Kickstart Your Journey</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Start your DSA mastery today. Check off your first problem to unlock personalized difficulty breakdowns and learning momentum.
              </p>
              <Link to="/problems" className="inline-block">
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Browse DSA Sheet
                </Button>
              </Link>
            </div>
          ) : (
            /* In-Progress State */
            <div className="space-y-3 w-full sm:w-auto">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <Target className="w-3.5 h-3.5 text-brand-400" />
                  <span>Next Recommended Target</span>
                </div>
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {continueProblemTitle || 'Next Unsolved Problem'}
                </p>
              </div>

              <Link to="/problems" className="inline-block w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue Learning
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Linear Progress Bar at bottom */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <ProgressBar
          value={completionPercentage}
          max={100}
          size="sm"
          variant={isFullyCompleted ? 'success' : 'gradient'}
          aria-label="Overall curriculum completion percentage"
        />
      </div>
    </div>
  );
};
