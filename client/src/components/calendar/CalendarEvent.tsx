import React from 'react';
import { CheckCircle2, Clock, SkipForward } from 'lucide-react';
import type { StudyPlan } from '../../types/studyPlan';

export interface CalendarEventProps {
  plan: StudyPlan;
  isCompact?: boolean;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({
  plan,
  isCompact = false,
}) => {
  const problemTitle =
    typeof plan.problemId === 'object' && plan.problemId !== null
      ? plan.problemId.title
      : 'DSA Problem';

  const difficulty =
    typeof plan.problemId === 'object' && plan.problemId !== null
      ? plan.problemId.difficulty
      : undefined;

  const status = plan.status || 'planned';

  const statusStyles = {
    planned: {
      container:
        'bg-brand-500/15 hover:bg-brand-500/25 border-brand-500/40 text-brand-200 shadow-sm',
      dot: 'bg-brand-400',
      icon: <Clock className="w-3 h-3 text-brand-400 shrink-0" />,
    },
    completed: {
      container:
        'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-200 shadow-sm',
      dot: 'bg-emerald-400',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />,
    },
    skipped: {
      container:
        'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 text-slate-400',
      dot: 'bg-slate-400',
      icon: <SkipForward className="w-3 h-3 text-slate-400 shrink-0" />,
    },
  }[status];

  const difficultyDot = {
    Easy: 'bg-emerald-400',
    Medium: 'bg-amber-400',
    Hard: 'bg-rose-400',
  }[difficulty || 'Medium'];

  if (isCompact) {
    return (
      <div
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border font-medium truncate cursor-pointer transition-colors ${statusStyles.container}`}
        title={`${problemTitle} (${status})`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${difficultyDot}`}
          aria-hidden="true"
        />
        <span className="truncate flex-1">{problemTitle}</span>
        {status === 'completed' && (
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center justify-between gap-1.5 px-2 py-1 rounded-md text-xs border font-medium cursor-pointer transition-all duration-150 ${statusStyles.container}`}
      title={`${problemTitle} - ${status}`}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        {statusStyles.icon}
        <span
          className={`truncate ${
            status === 'completed'
              ? 'line-through text-emerald-300/80'
              : status === 'skipped'
              ? 'line-through text-slate-400'
              : 'text-slate-100'
          }`}
        >
          {problemTitle}
        </span>
      </div>

      {difficulty && (
        <span
          className={`text-[10px] px-1 py-0.2 rounded font-semibold border ${
            difficulty === 'Easy'
              ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
              : difficulty === 'Medium'
              ? 'text-amber-300 border-amber-500/30 bg-amber-500/10'
              : 'text-rose-300 border-rose-500/30 bg-rose-500/10'
          }`}
        >
          {difficulty[0]}
        </span>
      )}
    </div>
  );
};
