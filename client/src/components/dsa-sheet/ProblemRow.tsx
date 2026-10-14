import React from 'react';
import { Check, ExternalLink, Loader2 } from 'lucide-react';
import { DifficultyBadge } from '../ui/Badge';
import { ResourceLinks } from './ResourceLinks';
import { useUpdateProgress } from '../../hooks/useProgress';
import type { Problem } from '../../types/catalog';

interface ProblemRowProps {
  problem: Problem;
  isCompleted: boolean;
  index: number;
  chapterId?: string;
}

export const ProblemRow: React.FC<ProblemRowProps> = ({
  problem,
  isCompleted,
  index,
  chapterId,
}) => {
  const { mutate: updateProgress, isPending, variables } = useUpdateProgress();

  // Guard against rapid duplicate clicks: check if this specific problem is currently mutating
  const isThisPending = isPending && variables?.problemId === problem._id;

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isThisPending) return;

    updateProgress({
      problemId: problem._id,
      isCompleted: !isCompleted,
      chapterId,
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      slug: problem.slug,
    });
  };

  return (
    <div
      className={`
        group flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/60
        transition-colors duration-150 hover:bg-slate-800/40 select-none
        ${isCompleted ? 'bg-emerald-950/5' : ''}
      `}
    >
      {/* Left: Interactive Checkbox & Problem Title */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Status Checkbox Button */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          disabled={isThisPending}
          onClick={handleToggle}
          title={
            isThisPending
              ? 'Updating progress...'
              : isCompleted
                ? 'Mark as incomplete'
                : 'Mark as completed'
          }
          aria-label={
            isCompleted
              ? `Mark ${problem.title} as incomplete`
              : `Mark ${problem.title} as completed`
          }
          className={`
            w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
            ${
              isThisPending
                ? 'opacity-70 cursor-wait border-brand-500/50 bg-brand-500/10 text-brand-400'
                : isCompleted
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950 hover:bg-emerald-400 hover:border-emerald-400 shadow-sm'
                  : 'border-slate-700 bg-slate-900/80 hover:border-emerald-500/70 hover:bg-emerald-500/10 text-transparent hover:text-emerald-400'
            }
          `}
        >
          {isThisPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check
              className={`w-3.5 h-3.5 stroke-[3] ${
                isCompleted ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
              } transition-opacity`}
            />
          )}
        </button>

        {/* Index sequence */}
        <span className="font-mono text-xs text-slate-500 w-5 text-right shrink-0">
          {index}
        </span>

        {/* Problem Title */}
        <div className="min-w-0 flex-1">
          {problem.resources.practiceUrl ? (
            <a
              href={problem.resources.practiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                text-sm font-medium transition-colors hover:text-brand-300 inline-flex items-center gap-1.5 truncate max-w-full
                focus:outline-none focus-visible:underline
                ${
                  isCompleted
                    ? 'text-slate-400 line-through decoration-slate-600'
                    : 'text-slate-200'
                }
              `}
            >
              <span className="truncate">{problem.title}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          ) : (
            <span
              className={`
                text-sm font-medium truncate block
                ${
                  isCompleted
                    ? 'text-slate-400 line-through decoration-slate-600'
                    : 'text-slate-200'
                }
              `}
            >
              {problem.title}
            </span>
          )}
        </div>
      </div>

      {/* Right: Difficulty Badge & Resource Links */}
      <div className="flex items-center gap-3 shrink-0">
        <DifficultyBadge difficulty={problem.difficulty} size="sm" />
        <ResourceLinks
          resources={problem.resources}
          problemTitle={problem.title}
        />
      </div>
    </div>
  );
};
