import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Chapter, Topic, Problem, ProblemDifficulty } from '../types/catalog';

export interface ProblemsQueryFilters {
  topicId?: string;
  difficulty?: ProblemDifficulty;
  search?: string;
  page?: number;
  limit?: number;
}

export const useChapters = () => {
  return useQuery<{ chapters: Chapter[] }, Error>({
    queryKey: ['chapters'],
    queryFn: async () => {
      return api.get<{ chapters: Chapter[] }>('/chapters');
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (static catalog)
  });
};

export const useTopics = (chapterId?: string) => {
  return useQuery<{ topics: Topic[] }, Error>({
    queryKey: ['topics', { chapterId }],
    queryFn: async () => {
      const url = chapterId ? `/topics?chapterId=${chapterId}` : '/topics';
      return api.get<{ topics: Topic[] }>(url);
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useProblems = (filters: ProblemsQueryFilters = {}) => {
  const { topicId, difficulty, search, page = 1, limit = 100 } = filters;

  return useQuery<{ problems: Problem[]; pagination: unknown }, Error>({
    queryKey: ['problems', { topicId, difficulty, search, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (topicId) params.append('topicId', topicId);
      if (difficulty) params.append('difficulty', difficulty);
      if (search) params.append('search', search);
      if (page) params.append('page', String(page));
      if (limit) params.append('limit', String(limit));

      const queryString = params.toString();
      const url = queryString ? `/problems?${queryString}` : '/problems';
      return api.get<{ problems: Problem[]; pagination: unknown }>(url);
    },
    staleTime: 1000 * 60 * 5,
  });
};
