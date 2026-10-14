import React, { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { ProblemRow } from './ProblemRow';
import type { Topic, Problem } from '../../types/catalog';

interface TopicSectionProps {
  topic: Topic;
  problems: Problem[];
  completedProblemIds: Set<string>;
  defaultExpanded?: boolean;
}

export const TopicSection: React.FC<TopicSectionProps> = ({
  topic,
  problems,
  completedProblemIds,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const completedInTopic = problems.filter((p) =>
    completedProblemIds.has(p._id)
  ).length;

  const isAllCompleted =
    problems.length > 0 && completedInTopic === problems.length;

  return (
    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
      {/* Topic Header Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-slate-900/60 hover:bg-slate-900/90 flex items-center justify-between gap-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
          />
          <BookOpen className="w-4 h-4 text-brand-400 shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-200 truncate">
              {topic.title}
            </h4>
            {topic.description && (
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                {topic.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span
            className={`font-mono font-medium ${
              isAllCompleted ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {completedInTopic} / {problems.length} solved
          </span>
        </div>
      </button>

      {/* Problems List */}
      {isExpanded && (
        <div className="divide-y divide-slate-800/60">
          {problems.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">
              No problems found matching active filters.
            </p>
          ) : (
            problems.map((problem, index) => (
              <ProblemRow
                key={problem._id}
                problem={problem}
                isCompleted={completedProblemIds.has(problem._id)}
                index={index + 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
