import React from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { DifficultyBadge } from '../ui/Badge';
import { ResourceLinks } from './ResourceLinks';
import type { Problem } from '../../types/catalog';

interface ProblemRowProps {
  problem: Problem;
  isCompleted: boolean;
  index: number;
}

export const ProblemRow: React.FC<ProblemRowProps> = ({
  problem,
  isCompleted,
  index,
}) => {
  return (
    <div
      className={`
        group flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/60
        transition-colors duration-150 hover:bg-slate-800/40 select-none
        ${isCompleted ? 'bg-emerald-950/5' : ''}
      `}
    >
      {/* Left: Completion Checkbox & Problem Title */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Status Checkbox (read-only until mutation step) */}
        <div
          title={isCompleted ? 'Completed' : 'Not completed'}
          aria-label={isCompleted ? 'Problem completed' : 'Problem not completed'}
          className={`
            w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors
            ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm'
                : 'border-slate-700 bg-slate-900/80 group-hover:border-slate-500'
            }
          `}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>

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
                ${isCompleted ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200'}
              `}
            >
              <span className="truncate">{problem.title}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          ) : (
            <span
              className={`
                text-sm font-medium truncate block
                ${isCompleted ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200'}
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
        <ResourceLinks resources={problem.resources} problemTitle={problem.title} />
      </div>
    </div>
  );
};
