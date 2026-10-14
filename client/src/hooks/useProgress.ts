import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useToastStore } from '../store/toastStore';
import { DASHBOARD_QUERY_KEY } from './useDashboard';
import type { ProblemDifficulty } from '../types/catalog';
import type { DashboardSummary } from '../types/dashboard';
import type {
  UserProgressItem,
  UserProgressResponseData,
  ProgressSummary,
} from '../types/progress';

export const PROGRESS_QUERY_KEY = ['progress'] as const;
export const PROGRESS_SUMMARY_QUERY_KEY = ['progress', 'summary'] as const;

export const useUserProgress = () => {
  return useQuery<UserProgressResponseData, Error>({
    queryKey: PROGRESS_QUERY_KEY,
    queryFn: async () => {
      return api.get<UserProgressResponseData>('/progress');
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useProgressSummary = () => {
  return useQuery<ProgressSummary, Error>({
    queryKey: PROGRESS_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      return api.get<ProgressSummary>('/progress/summary');
    },
    staleTime: 1000 * 60 * 2,
  });
};

export interface UpdateProgressVariables {
  problemId: string;
  isCompleted: boolean;
  chapterId?: string;
  problemTitle?: string;
  difficulty?: ProblemDifficulty;
  slug?: string;
}

export interface ProgressMutationContext {
  previousProgress?: UserProgressResponseData;
  previousSummary?: ProgressSummary;
  previousDashboard?: DashboardSummary;
}

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { progress: UserProgressItem },
    Error,
    UpdateProgressVariables,
    ProgressMutationContext
  >({
    mutationFn: async ({ problemId, isCompleted }: UpdateProgressVariables) => {
      return api.put<{ progress: UserProgressItem }>(`/progress/${problemId}`, {
        isCompleted,
      });
    },

    onMutate: async ({
      problemId,
      isCompleted,
      chapterId,
      difficulty,
      problemTitle,
      slug,
    }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: PROGRESS_QUERY_KEY }),
        queryClient.cancelQueries({ queryKey: PROGRESS_SUMMARY_QUERY_KEY }),
        queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY }),
      ]);

      const previousProgress =
        queryClient.getQueryData<UserProgressResponseData>(PROGRESS_QUERY_KEY);
      const previousSummary =
        queryClient.getQueryData<ProgressSummary>(PROGRESS_SUMMARY_QUERY_KEY);
      const previousDashboard =
        queryClient.getQueryData<DashboardSummary>(DASHBOARD_QUERY_KEY);

      if (previousProgress) {
        const currentCompletedSet = new Set(previousProgress.completedProblemIds);
        const wasCompleted = currentCompletedSet.has(problemId);

        if (isCompleted !== wasCompleted) {
          if (isCompleted) {
            currentCompletedSet.add(problemId);
          } else {
            currentCompletedSet.delete(problemId);
          }

          const updatedIds = Array.from(currentCompletedSet);
          const nowIso = new Date().toISOString();
          const existingIdx = previousProgress.progress.findIndex(
            (p) => p.problemId === problemId
          );
          const nextProgressList = [...previousProgress.progress];

          if (existingIdx >= 0) {
            nextProgressList[existingIdx] = {
              ...nextProgressList[existingIdx],
              isCompleted,
              completedAt: isCompleted ? nowIso : null,
              updatedAt: nowIso,
            };
          } else {
            nextProgressList.push({
              _id: `temp-${problemId}`,
              problemId,
              isCompleted,
              completedAt: isCompleted ? nowIso : null,
              updatedAt: nowIso,
            });
          }

          queryClient.setQueryData<UserProgressResponseData>(PROGRESS_QUERY_KEY, {
            ...previousProgress,
            completedProblemIds: updatedIds,
            totalCompleted: updatedIds.length,
            progress: nextProgressList,
          });
        }
      }
      if (previousSummary) {
        const delta = isCompleted ? 1 : -1;
        const newCompleted = Math.max(
          0,
          Math.min(
            previousSummary.totalProblems,
            previousSummary.completedProblems + delta
          )
        );
        const newRemaining = Math.max(0, previousSummary.totalProblems - newCompleted);
        const newPercentage =
          previousSummary.totalProblems > 0
            ? Math.round((newCompleted / previousSummary.totalProblems) * 100 * 10) / 10
            : 0;

        const updatedChapterStats = previousSummary.chapterStats.map((stat) => {
          if (chapterId && stat.chapterId === chapterId) {
            const chCompleted = Math.max(
              0,
              Math.min(stat.totalProblems, stat.completedProblems + delta)
            );
            const chPercentage =
              stat.totalProblems > 0
                ? Math.round((chCompleted / stat.totalProblems) * 100 * 10) / 10
                : 0;
            return {
              ...stat,
              completedProblems: chCompleted,
              completionPercentage: chPercentage,
            };
          }
          return stat;
        });

        let updatedDifficultyStats = previousSummary.difficultyStats;
        if (difficulty && updatedDifficultyStats?.[difficulty]) {
          const diffStat = updatedDifficultyStats[difficulty];
          const diffCompleted = Math.max(
            0,
            Math.min(diffStat.total, diffStat.completed + delta)
          );
          const diffPercentage =
            diffStat.total > 0
              ? Math.round((diffCompleted / diffStat.total) * 100 * 10) / 10
              : 0;
          updatedDifficultyStats = {
            ...updatedDifficultyStats,
            [difficulty]: {
              ...diffStat,
              completed: diffCompleted,
              percentage: diffPercentage,
            },
          };
        }

        queryClient.setQueryData<ProgressSummary>(PROGRESS_SUMMARY_QUERY_KEY, {
          ...previousSummary,
          completedProblems: newCompleted,
          remainingProblems: newRemaining,
          completionPercentage: newPercentage,
          chapterStats: updatedChapterStats,
          difficultyStats: updatedDifficultyStats,
        });
      }

      if (previousDashboard) {
        const delta = isCompleted ? 1 : -1;
        const newCompleted = Math.max(
          0,
          Math.min(
            previousDashboard.totalProblems,
            previousDashboard.completedProblems + delta
          )
        );
        const newRemaining = Math.max(0, previousDashboard.totalProblems - newCompleted);
        const newPercentage =
          previousDashboard.totalProblems > 0
            ? Math.round((newCompleted / previousDashboard.totalProblems) * 100 * 10) / 10
            : 0;

        const updatedChapterStats = previousDashboard.chapterStats.map((stat) => {
          if (chapterId && stat.chapterId === chapterId) {
            const chCompleted = Math.max(
              0,
              Math.min(stat.totalProblems, stat.completedProblems + delta)
            );
            const chPercentage =
              stat.totalProblems > 0
                ? Math.round((chCompleted / stat.totalProblems) * 100 * 10) / 10
                : 0;
            return {
              ...stat,
              completedProblems: chCompleted,
              completionPercentage: chPercentage,
            };
          }
          return stat;
        });

        let updatedRecentlyCompleted = [...previousDashboard.recentlyCompleted];
        if (isCompleted && problemTitle) {
          const existingIdx = updatedRecentlyCompleted.findIndex(
            (item) => item.problemId === problemId
          );
          if (existingIdx >= 0) {
            updatedRecentlyCompleted.splice(existingIdx, 1);
          }
          updatedRecentlyCompleted.unshift({
            problemId,
            title: problemTitle,
            slug: slug || '',
            difficulty: difficulty || 'Medium',
            completedAt: new Date().toISOString(),
          });
          if (updatedRecentlyCompleted.length > 5) {
            updatedRecentlyCompleted = updatedRecentlyCompleted.slice(0, 5);
          }
        } else if (!isCompleted) {
          updatedRecentlyCompleted = updatedRecentlyCompleted.filter(
            (item) => item.problemId !== problemId
          );
        }

        queryClient.setQueryData<DashboardSummary>(DASHBOARD_QUERY_KEY, {
          ...previousDashboard,
          completedProblems: newCompleted,
          remainingProblems: newRemaining,
          completionPercentage: newPercentage,
          chapterStats: updatedChapterStats,
          recentlyCompleted: updatedRecentlyCompleted,
        });
      }

      return { previousProgress, previousSummary, previousDashboard };
    },

    onError: (err, variables, context) => {
      if (context?.previousProgress) {
        queryClient.setQueryData(PROGRESS_QUERY_KEY, context.previousProgress);
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(PROGRESS_SUMMARY_QUERY_KEY, context.previousSummary);
      }
      if (context?.previousDashboard) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previousDashboard);
      }

      const problemName = variables.problemTitle
        ? `"${variables.problemTitle}"`
        : 'problem';
      const errorMsg = err.message || 'Server error occurred.';
      useToastStore
        .getState()
        .showToast(
          `Failed to update ${problemName}: ${errorMsg}. Changes rolled back.`,
          'error'
        );
    },

    onSuccess: (_, variables) => {
      const action = variables.isCompleted
        ? 'marked as completed'
        : 'marked as incomplete';
      const problemName = variables.problemTitle
        ? `"${variables.problemTitle}"`
        : 'Problem';
      useToastStore.getState().showToast(`${problemName} ${action}.`, 'success');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROGRESS_SUMMARY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};
