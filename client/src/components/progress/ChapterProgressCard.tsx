import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import type { ChapterProgressStat } from '../../types/progress';

export interface ChapterProgressCardProps {
  stat: ChapterProgressStat;
  isSelected?: boolean;
  onSelect?: (chapterId: string) => void;
}

export const ChapterProgressCard: React.FC<ChapterProgressCardProps> = ({
  stat,
  isSelected = false,
  onSelect,
}) => {
  const isMastered =
    stat.totalProblems > 0 && stat.completedProblems === stat.totalProblems;
  const isZero = stat.completedProblems === 0;

  return (
    <div
      onClick={() => onSelect?.(stat.chapterId)}
      className={`
        p-4 sm:p-5 rounded-xl border transition-all duration-200 select-none
        ${
          isSelected
            ? 'bg-slate-900/90 border-brand-500/60 ring-1 ring-brand-500/30 shadow-lg shadow-brand-500/5'
            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
        }
        ${onSelect ? 'cursor-pointer' : ''}
      `}
      role="article"
      aria-label={`${stat.title}: ${stat.completedProblems} of ${stat.totalProblems} completed (${stat.completionPercentage}%)`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
              Chapter {stat.order}
            </span>

            {isMastered ? (
              <Badge variant="success" size="sm" hasDot>
                Mastered
              </Badge>
            ) : isZero ? (
              <Badge variant="neutral" size="sm">
                Unstarted
              </Badge>
            ) : (
              <Badge variant="brand" size="sm" hasDot>
                In Progress
              </Badge>
            )}
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {stat.title}
          </h4>
        </div>

        <div className="text-right shrink-0">
          <span className="text-base sm:text-lg font-extrabold text-white">
            {stat.completionPercentage}%
          </span>
          <p className="text-[11px] text-slate-400">
            {stat.completedProblems} / {stat.totalProblems}
          </p>
        </div>
      </div>

      {/* Chapter Progress Bar */}
      <ProgressBar
        value={stat.completedProblems}
        max={Math.max(1, stat.totalProblems)}
        size="sm"
        variant={isMastered ? 'success' : isZero ? 'brand' : 'gradient'}
        aria-label={`${stat.title} progress bar`}
      />

      {/* Card Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-xs">
        <span className="text-slate-400 text-[11px]">
          {stat.totalProblems - stat.completedProblems === 0
            ? 'All problems completed'
            : `${stat.totalProblems - stat.completedProblems} problems left`}
        </span>

        <Link
          to={`/problems`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          <span>Practice Problems</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
