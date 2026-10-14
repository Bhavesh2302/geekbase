import React from 'react';
import { ChevronDown, FolderOpen, Layers } from 'lucide-react';
import { ChapterProgress } from './ChapterProgress';
import { TopicSection } from './TopicSection';
import type { Chapter, Topic, Problem } from '../../types/catalog';

interface ChapterAccordionProps {
  chapter: Chapter;
  topics: Topic[];
  problemsByTopicId: Record<string, Problem[]>;
  completedProblemIds: Set<string>;
  completedCount: number;
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ChapterAccordion: React.FC<ChapterAccordionProps> = ({
  chapter,
  topics,
  problemsByTopicId,
  completedProblemIds,
  completedCount,
  totalCount,
  isExpanded,
  onToggle,
}) => {
  // Total matching problems in this chapter after any active filters
  const chapterProblemsCount = topics.reduce((sum, topic) => {
    return sum + (problemsByTopicId[topic._id]?.length || 0);
  }, 0);

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/80 shadow-lg transition-all duration-200">
      {/* Chapter Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 bg-slate-900 hover:bg-slate-850 flex items-center justify-between gap-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-expanded={isExpanded}
      >
        {/* Left: Chevron, Sequence, Title, Description */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
          />

          <span className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300 flex items-center justify-center font-mono text-xs font-bold shrink-0">
            #{chapter.order}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight truncate">
                {chapter.title}
              </h3>
            </div>
            {chapter.description && (
              <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xl">
                {chapter.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Chapter Progress */}
        <div className="shrink-0">
          <ChapterProgress
            completedCount={completedCount}
            totalCount={totalCount}
          />
        </div>
      </button>

      {/* Accordion Content: Topic Sections */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-slate-800/80 space-y-4 bg-slate-950/30">
          {topics.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              <Layers className="w-5 h-5 mx-auto mb-1 text-slate-600" />
              <span>No topics available for this chapter.</span>
            </div>
          ) : chapterProblemsCount === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              <FolderOpen className="w-5 h-5 mx-auto mb-1 text-slate-600" />
              <span>No problems in this chapter match your search criteria.</span>
            </div>
          ) : (
            topics.map((topic) => {
              const topicProblems = problemsByTopicId[topic._id] || [];
              if (topicProblems.length === 0) return null;

              return (
                <TopicSection
                  key={topic._id}
                  topic={topic}
                  problems={topicProblems}
                  completedProblemIds={completedProblemIds}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
