import React from 'react';
import { CheckCircle2, ShieldAlert, Flame, Filter } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import type { ProblemDifficulty } from '../../types/catalog';
import type { DifficultyProgressStat } from '../../types/progress';

export interface DifficultyBreakdownProps {
  difficultyStats: Record<ProblemDifficulty, DifficultyProgressStat>;
  activeDifficultyFilter?: ProblemDifficulty | 'all';
  onSelectDifficulty?: (difficulty: ProblemDifficulty | 'all') => void;
}

export const DifficultyBreakdown: React.FC<DifficultyBreakdownProps> = ({
  difficultyStats,
  activeDifficultyFilter = 'all',
  onSelectDifficulty,
}) => {
  const configs: Array<{
    difficulty: ProblemDifficulty;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    progressVariant: 'success' | 'warning' | 'brand';
    cardBg: string;
    borderActive: string;
  }> = [
    {
      difficulty: 'Easy',
      icon: CheckCircle2,
      accentColor: 'text-emerald-400',
      progressVariant: 'success',
      cardBg: 'from-emerald-950/20 to-slate-900/60',
      borderActive: 'border-emerald-500/60 ring-1 ring-emerald-500/40',
    },
    {
      difficulty: 'Medium',
      icon: ShieldAlert,
      accentColor: 'text-amber-400',
      progressVariant: 'warning',
      cardBg: 'from-amber-950/20 to-slate-900/60',
      borderActive: 'border-amber-500/60 ring-1 ring-amber-500/40',
    },
    {
      difficulty: 'Hard',
      icon: Flame,
      accentColor: 'text-rose-400',
      progressVariant: 'brand',
      cardBg: 'from-rose-950/20 to-slate-900/60',
      borderActive: 'border-rose-500/60 ring-1 ring-rose-500/40',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Difficulty Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real completion statistics segmented by problem complexity level
          </p>
        </div>

        {activeDifficultyFilter !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectDifficulty?.('all')}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/80 transition-colors"
          >
            <Filter className="w-3 h-3 text-brand-400" />
            <span>Clear Filter</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {configs.map(
          ({
            difficulty,
            icon: Icon,
            accentColor,
            progressVariant,
            cardBg,
            borderActive,
          }) => {
            const stat = difficultyStats[difficulty] || {
              total: 0,
              completed: 0,
              percentage: 0,
            };
            const isFilterActive = activeDifficultyFilter === difficulty;

            return (
              <div
                key={difficulty}
                onClick={() => {
                  if (onSelectDifficulty) {
                    onSelectDifficulty(isFilterActive ? 'all' : difficulty);
                  }
                }}
                className={`
                  p-5 rounded-2xl border transition-all duration-200 select-none cursor-pointer
                  bg-gradient-to-br ${cardBg}
                  ${
                    isFilterActive
                      ? borderActive + ' shadow-lg scale-[1.01]'
                      : 'border-slate-800 hover:border-slate-700 hover:shadow-md'
                  }
                `}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDifficulty?.(isFilterActive ? 'all' : difficulty);
                  }
                }}
                aria-label={`Filter by ${difficulty} problems. ${stat.completed} of ${stat.total} completed (${stat.percentage}%)`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg bg-slate-900/80 flex items-center justify-center border border-slate-800 ${accentColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {stat.completed} / {stat.total} Solved
                      </span>
                    </div>
                  </div>

                  <span className="text-lg font-extrabold text-white">
                    {stat.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <ProgressBar
                  value={stat.completed}
                  max={Math.max(1, stat.total)}
                  size="sm"
                  variant={progressVariant}
                  aria-label={`${difficulty} progress: ${stat.percentage}%`}
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-800/60">
                  <span>
                    {stat.total - stat.completed === 0
                      ? 'All Solved'
                      : `${stat.total - stat.completed} Remaining`}
                  </span>
                  <span className="text-slate-500 hover:text-slate-300">
                    {isFilterActive ? 'Active Filter (Click to reset)' : 'Click to filter'}
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
