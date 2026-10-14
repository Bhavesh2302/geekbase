import React from 'react';
import { Search, X, ChevronsUpDown, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ProblemDifficulty } from '../../types/catalog';

interface SheetFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDifficulty: ProblemDifficulty | 'All';
  onDifficultyChange: (difficulty: ProblemDifficulty | 'All') => void;
  onToggleExpandAll: (expand: boolean) => void;
  allExpanded: boolean | null;
  filteredCount: number;
  totalCount: number;
}

const difficultyOptions: Array<ProblemDifficulty | 'All'> = [
  'All',
  'Easy',
  'Medium',
  'Hard',
];

export const SheetFilters: React.FC<SheetFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  onToggleExpandAll,
  allExpanded,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="space-y-3.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems by title (e.g., Two Sum, LRU, BST)..."
            className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-500 text-sm rounded-xl border border-slate-800 hover:border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 pl-10 pr-9 py-2.5 transition-colors focus:outline-none"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 rounded"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand / Collapse All Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleExpandAll(allExpanded === true ? false : true)}
            leftIcon={<ChevronsUpDown className="w-3.5 h-3.5" />}
          >
            {allExpanded === true ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>
      </div>

      {/* Difficulty Filter Tabs & Result Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium mr-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Difficulty:
          </span>
          {difficultyOptions.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            const diffColorClasses =
              diff === 'Easy'
                ? isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'hover:text-emerald-300'
                : diff === 'Medium'
                  ? isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'hover:text-amber-300'
                  : diff === 'Hard'
                    ? isSelected
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'hover:text-rose-300'
                    : isSelected
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                      : 'hover:text-brand-300';

            return (
              <button
                key={diff}
                type="button"
                onClick={() => onDifficultyChange(diff)}
                className={`
                  px-3 py-1 rounded-lg border text-xs font-semibold transition-all duration-150
                  focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500
                  ${
                    isSelected
                      ? `shadow-sm ${diffColorClasses}`
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-900'
                  }
                `}
              >
                {diff}
              </button>
            );
          })}
        </div>

        <div className="text-slate-400 font-mono text-[11px] self-end sm:self-auto">
          Showing <span className="text-slate-200 font-semibold">{filteredCount}</span> of{' '}
          <span className="text-slate-200 font-semibold">{totalCount}</span> problems
        </div>
      </div>
    </div>
  );
};
