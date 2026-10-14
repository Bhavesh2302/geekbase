import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { ProgressHero } from '../components/progress/ProgressHero';
import { DifficultyBreakdown } from '../components/progress/DifficultyBreakdown';
import { ChapterProgressCard } from '../components/progress/ChapterProgressCard';
import { RecentlyCompletedSection } from '../components/progress/RecentlyCompletedSection';
import { ContinueLearningCard } from '../components/progress/ContinueLearningCard';
import { ProgressFilters } from '../components/progress/ProgressFilters';
import { useProgressSummary } from '../hooks/useProgress';
import { useDashboard } from '../hooks/useDashboard';
import type { ProblemDifficulty } from '../types/catalog';

export const ProgressPage: React.FC = () => {
  // Queries
  const {
    data: progressSummary,
    isLoading: loadingSummary,
    isError: errorSummary,
    refetch: refetchSummary,
  } = useProgressSummary();

  const {
    data: dashboardSummary,
    isLoading: loadingDashboard,
    isError: errorDashboard,
    refetch: refetchDashboard,
  } = useDashboard();

  // Filters State
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    ProblemDifficulty | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isLoading = loadingSummary || loadingDashboard;
  const isError = errorSummary || errorDashboard;

  // Filtered chapters computation
  const chapterStatsList = progressSummary?.chapterStats;

  const filteredChapters = useMemo(() => {
    if (!chapterStatsList) return [];

    return chapterStatsList.filter((chapter) => {
      // Chapter filter
      if (selectedChapterId !== 'all' && chapter.chapterId !== selectedChapterId) {
        return false;
      }

      // Search query filter
      if (
        searchQuery.trim() &&
        !chapter.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      ) {
        return false;
      }

      return true;
    });
  }, [chapterStatsList, selectedChapterId, searchQuery]);

  const handleResetFilters = () => {
    setSelectedChapterId('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        <Skeleton className="h-52 w-full rounded-2xl" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !progressSummary) {
    return (
      <div className="py-8">
        <ErrorState
          title="Failed to Load Progress Analytics"
          message="We could not retrieve your progress and completion statistics from the server. Please check your connection and try again."
          onRetry={() => {
            refetchSummary();
            refetchDashboard();
          }}
        />
      </div>
    );
  }

  const {
    totalProblems,
    completedProblems,
    remainingProblems,
    completionPercentage,
    difficultyStats,
    chapterStats,
  } = progressSummary;

  const continueProblem = dashboardSummary?.continueLearning?.problem;
  const recentlyCompleted = dashboardSummary?.recentlyCompleted || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-400" />
            My Progress
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Detailed completion metrics, difficulty breakdown, and chapter-wise progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/problems">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Go to DSA Sheet
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Completion Banner (Overall Progress + Zero/Full State Handling) */}
      <ProgressHero
        totalProblems={totalProblems}
        completedProblems={completedProblems}
        remainingProblems={remainingProblems}
        completionPercentage={completionPercentage}
        continueProblemTitle={continueProblem?.title}
        continueProblemSlug={continueProblem?.slug}
      />

      {/* Difficulty Breakdown (Real Problem & Progress Data) */}
      <DifficultyBreakdown
        difficultyStats={difficultyStats}
        activeDifficultyFilter={selectedDifficulty}
        onSelectDifficulty={(diff) => setSelectedDifficulty(diff)}
      />

      {/* Main Grid: Chapter-Wise Progress on left, Side widgets on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chapter-Wise Progress & Filters */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Chapter-Wise Completion
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredChapters.length} of {chapterStats.length} chapters
            </span>
          </div>

          {/* Chapter Search and Filters */}
          <ProgressFilters
            chapters={chapterStats}
            selectedChapterId={selectedChapterId}
            selectedDifficulty={selectedDifficulty}
            searchQuery={searchQuery}
            onChapterChange={setSelectedChapterId}
            onDifficultyChange={setSelectedDifficulty}
            onSearchChange={setSearchQuery}
            onReset={handleResetFilters}
          />

          {/* Chapter Progress Cards Grid */}
          {filteredChapters.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                No chapters match your filter criteria
              </p>
              <p className="text-xs text-slate-500">
                Try searching with a different keyword or reset your active filters.
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredChapters.map((chapter) => (
                <ChapterProgressCard
                  key={chapter.chapterId}
                  stat={chapter}
                  isSelected={selectedChapterId === chapter.chapterId}
                  onSelect={(id) => {
                    setSelectedChapterId(
                      selectedChapterId === id ? 'all' : id
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Continue Learning & Recently Completed */}
        <div className="lg:col-span-4 space-y-6">
          {dashboardSummary?.continueLearning && (
            <ContinueLearningCard
              recommendation={dashboardSummary.continueLearning}
            />
          )}

          <RecentlyCompletedSection
            recentlyCompleted={recentlyCompleted}
          />
        </div>
      </div>
    </div>
  );
};
