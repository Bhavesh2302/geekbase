import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { UserProgressResponseData, ProgressSummary } from '../types/progress';

export const useUserProgress = () => {
  return useQuery<UserProgressResponseData, Error>({
    queryKey: ['progress'],
    queryFn: async () => {
      return api.get<UserProgressResponseData>('/progress');
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useProgressSummary = () => {
  return useQuery<ProgressSummary, Error>({
    queryKey: ['progress', 'summary'],
    queryFn: async () => {
      return api.get<ProgressSummary>('/progress/summary');
    },
    staleTime: 1000 * 60 * 2,
  });
};
