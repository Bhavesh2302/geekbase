import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { DashboardSummary } from '../types/dashboard';

export const DASHBOARD_QUERY_KEY = ['dashboard', 'summary'] as const;

export const useDashboard = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      return api.get<DashboardSummary>('/dashboard/summary');
    },
  });
};
