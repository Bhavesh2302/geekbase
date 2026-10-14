import { QueryClient } from '@tanstack/react-query';
import { AppApiError } from '../api/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
      gcTime: 1000 * 60 * 10,   // 10 minutes garbage collection
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Do not retry authorization or bad request client errors
        if (error instanceof AppApiError) {
          if ([400, 401, 403, 404].includes(error.statusCode)) {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
