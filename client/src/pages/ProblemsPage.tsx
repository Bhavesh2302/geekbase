import React, { useState, useMemo } from 'react';
import { Code2, Sparkles } from 'lucide-react';
import { useChapters, useTopics, useProblems } from '../hooks/useCatalog';
import { useUserProgress, useProgressSummary } from '../hooks/useProgress';
import { ChapterAccordion, SheetFilters } from '../components/dsa-sheet';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Badge } from '../components/ui/Badge';
import type { ProblemDifficulty, Problem, Topic } from '../types/catalog';

export const ProblemsPage: React.FC = () => {
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | 'All'>('All');
  const [expandedChapterIds, setExpandedChapterIds] = useState<Set<string>>(new Set());

  // Queries
  const {
    data: chaptersData,
    isLoading: isChaptersLoading,
    isError: isChaptersError,
    error: chaptersError,
    refetch: refetchChapters,
  } = useChapters();

  const {
    data: topicsData,
    isLoading: isTopicsLoading,
    isError: isTopicsError,
    error: topicsError,
    refetch: refetchTopics,
  } = useTopics();

  const {
    data: problemsData,
    isLoading: isProblemsLoading,
    isError: isProblemsError,
    error: problemsError,
    refetch: refetchProblems,
  } = useProblems({ limit: 100 });

  const {
    data: progressData,
    isLoading: isProgressLoading,
    refetch: refetchProgress,
  } = useUserProgress();

  const {
    data: summaryData,
    refetch: refetchSummary,
  } = useProgressSummary();

  const isLoading =
    isChaptersLoading || isTopicsLoading || isProblemsLoading || isProgressLoading;

  const isError = isChaptersError || isTopicsError || isProblemsError;
  const firstError = chaptersError || topicsError || problemsError;

  const refetchAll = () => {
    refetchChapters();
    refetchTopics();
    refetchProblems();
    refetchProgress();
    refetchSummary();
  };

  // Set of completed problem IDs for O(1) membership check
  const completedProblemIds = useMemo(() => {
    return new Set(progressData?.completedProblemIds || []);
  }, [progressData]);

  // Filter problems based on search query and difficulty
  const filteredProblems = useMemo(() => {
    const list = problemsData?.problems || [];
    return list.filter((problem) => {
      // Difficulty match
      if (selectedDifficulty !== 'All' && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      // Title search match
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = problem.title.toLowerCase().includes(query);
        const matchesSlug = problem.slug.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSlug) {
          return false;
        }
      }

      return true;
    });
  }, [problemsData, selectedDifficulty, searchQuery]);

  // Group filtered problems by topicId
  const problemsByTopicId = useMemo(() => {
    const map: Record<string, Problem[]> = {};
    for (const problem of filteredProblems) {
      if (!map[problem.topicId]) {
        map[problem.topicId] = [];
      }
      map[problem.topicId].push(problem);
    }
    return map;
  }, [filteredProblems]);

  // Group topics by chapterId
  const topicsByChapterId = useMemo(() => {
    const map: Record<string, Topic[]> = {};
    const topics = topicsData?.topics || [];
    for (const topic of topics) {
      if (!map[topic.chapterId]) {
        map[topic.chapterId] = [];
      }
      map[topic.chapterId].push(topic);
    }
    return map;
  }, [topicsData]);

  // Map chapter stats from summary for progress breakdown
  const chapterStatsMap = useMemo(() => {
    const map = new Map<string, { total: number; completed: number; percentage: number }>();
    if (summaryData?.chapterStats) {
      for (const stat of summaryData.chapterStats) {
        map.set(stat.chapterId, {
          total: stat.totalProblems,
          completed: stat.completedProblems,
          percentage: stat.completionPercentage,
        });
      }
    }
    return map;
  }, [summaryData]);

  // Total and completed counters
  const totalProblemsCount = problemsData?.problems?.length || 0;
  const completedProblemsCount = completedProblemIds.size;
  const completionPercentage =
    totalProblemsCount > 0
      ? Math.round((completedProblemsCount / totalProblemsCount) * 100 * 10) / 10
      : 0;

  const chapters = chaptersData?.chapters || [];

  const handleToggleChapter = (chapterId: string) => {
    setExpandedChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const handleExpandAll = (expand: boolean) => {
    if (expand) {
      setExpandedChapterIds(new Set(chapters.map((c) => c._id)));
    } else {
      setExpandedChapterIds(new Set());
    }
  };

  const allExpanded =
    chapters.length > 0 && expandedChapterIds.size === chapters.length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-label="Loading DSA Sheet...">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
          <div className="space-y-2">
            <SkeletonText lines={2} className="w-64" />
          </div>
          <SkeletonText lines={1} className="w-32" />
        </div>

        <SkeletonCard className="h-28" />

        <div className="space-y-4 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <ErrorState
          title="Unable to load DSA Sheet"
          message={
            firstError?.message ||
            'Failed to retrieve the problem catalog. Please verify your connection.'
          }
          onRetry={refetchAll}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Complete Curriculum
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1 flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-brand-400" />
            DSA Problem Sheet
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Structured roadmap of algorithmic concepts, core patterns, and interview questions.
          </p>
        </div>

        {/* Global Progress Chip */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <Badge variant="brand" size="md" hasDot className="shadow-sm">
            <span className="font-mono">{completedProblemsCount}</span> /{' '}
            <span className="font-mono">{totalProblemsCount}</span> Solved ({completionPercentage}%)
          </Badge>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <SheetFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        onToggleExpandAll={handleExpandAll}
        allExpanded={allExpanded}
        filteredCount={filteredProblems.length}
        totalCount={totalProblemsCount}
      />

      {/* Chapters Accordion List */}
      <div className="space-y-4 pt-1">
        {chapters.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
            No chapters are currently active.
          </div>
        ) : (
          chapters.map((chapter) => {
            const topics = topicsByChapterId[chapter._id] || [];
            const stat = chapterStatsMap.get(chapter._id);

            // Compute chapter-specific problems matching current filter
            const chapterTotalProblems = stat?.total || chapter.problemCount || 0;
            const chapterCompletedProblems = stat?.completed || 0;

            // Expanded if in set OR default Chapter 1 expanded initially if set is empty
            const isChapterExpanded =
              expandedChapterIds.has(chapter._id) ||
              (expandedChapterIds.size === 0 && chapter.order === 1);

            return (
              <ChapterAccordion
                key={chapter._id}
                chapter={chapter}
                topics={topics}
                problemsByTopicId={problemsByTopicId}
                completedProblemIds={completedProblemIds}
                completedCount={chapterCompletedProblems}
                totalCount={chapterTotalProblems}
                isExpanded={isChapterExpanded}
                onToggle={() => handleToggleChapter(chapter._id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;
