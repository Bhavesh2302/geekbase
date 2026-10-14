import React from 'react';
import { Search, X } from 'lucide-react';
import type { ProblemDifficulty } from '../../types/catalog';
import type { ChapterProgressStat } from '../../types/progress';

export interface ProgressFiltersProps {
  chapters: ChapterProgressStat[];
  selectedChapterId: string; // 'all' or chapterId
  selectedDifficulty: ProblemDifficulty | 'all';
  searchQuery: string;
  onChapterChange: (chapterId: string) => void;
  onDifficultyChange: (difficulty: ProblemDifficulty | 'all') => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export const ProgressFilters: React.FC<ProgressFiltersProps> = ({
  chapters,
  selectedChapterId,
  selectedDifficulty,
  searchQuery,
  onChapterChange,
  onDifficultyChange,
  onSearchChange,
  onReset,
}) => {
  const hasActiveFilters =
    selectedChapterId !== 'all' ||
    selectedDifficulty !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chapters by title..."
            className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-500 text-xs rounded-lg border border-slate-800 pl-9 pr-3 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Chapter Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedChapterId}
              onChange={(e) => onChapterChange(e.target.value)}
              aria-label="Filter by chapter"
              className="w-full sm:w-auto bg-slate-950/80 text-slate-200 text-xs rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Chapters ({chapters.length})</option>
              {chapters.map((ch) => (
                <option key={ch.chapterId} value={ch.chapterId}>
                  Ch. {ch.order}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) =>
                onDifficultyChange(e.target.value as ProblemDifficulty | 'all')
              }
              aria-label="Filter by difficulty"
              className="w-full sm:w-auto bg-slate-950/80 text-slate-200 text-xs rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
