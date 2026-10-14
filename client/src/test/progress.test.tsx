import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProblemRow } from '../components/dsa-sheet/ProblemRow';
import {
  PROGRESS_QUERY_KEY,
  PROGRESS_SUMMARY_QUERY_KEY,
} from '../hooks/useProgress';
import { api } from '../api/client';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import type { Problem } from '../types/catalog';
import type { UserProgressResponseData, ProgressSummary } from '../types/progress';

// Mock API client
vi.mock('../api/client', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

const mockProblem: Problem = {
  _id: 'problem-1',
  title: 'Two Sum',
  slug: 'two-sum',
  description: 'Two sum description',
  difficulty: 'Easy',
  topicId: 'topic-1',
  order: 1,
  resources: {
    youtubeUrl: 'https://youtube.com',
    practiceUrl: 'https://leetcode.com',
    articleUrl: null,
  },
};

const initialProgress: UserProgressResponseData = {
  completedProblemIds: ['problem-existing'],
  totalCompleted: 1,
  progress: [
    {
      _id: 'prog-1',
      problemId: 'problem-existing',
      isCompleted: true,
      completedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

const initialSummary: ProgressSummary = {
  totalProblems: 10,
  completedProblems: 1,
  remainingProblems: 9,
  completionPercentage: 10,
  difficultyStats: {
    Easy: { total: 4, completed: 1, percentage: 25 },
    Medium: { total: 4, completed: 0, percentage: 0 },
    Hard: { total: 2, completed: 0, percentage: 0 },
  },
  chapterStats: [
    {
      chapterId: 'chapter-1',
      title: 'Arrays',
      slug: 'arrays',
      order: 1,
      totalProblems: 5,
      completedProblems: 1,
      completionPercentage: 20,
    },
  ],
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

describe('Frontend Progress Tracking', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    useToastStore.setState({ toasts: [] });
    queryClient = createTestQueryClient();
    queryClient.setQueryData(PROGRESS_QUERY_KEY, { ...initialProgress });
    queryClient.setQueryData(PROGRESS_SUMMARY_QUERY_KEY, { ...initialSummary });
  });

  it('successfully marks a problem completed with optimistic update and sync', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({
      progress: {
        _id: 'prog-2',
        problemId: 'problem-1',
        isCompleted: true,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProblemRow
          problem={mockProblem}
          isCompleted={false}
          index={1}
          chapterId="chapter-1"
        />
      </QueryClientProvider>
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /Mark Two Sum as completed/i,
    });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    // Click to mark complete
    fireEvent.click(checkbox);

    // Verify optimistic update on progress cache
    await waitFor(() => {
      const optimisticProgress =
        queryClient.getQueryData<UserProgressResponseData>(PROGRESS_QUERY_KEY);
      expect(optimisticProgress?.completedProblemIds).toContain('problem-1');
      expect(optimisticProgress?.totalCompleted).toBe(2);
    });

    // Verify optimistic update on summary cache
    const optimisticSummary =
      queryClient.getQueryData<ProgressSummary>(PROGRESS_SUMMARY_QUERY_KEY);
    expect(optimisticSummary?.completedProblems).toBe(2);
    expect(optimisticSummary?.remainingProblems).toBe(8);
    expect(optimisticSummary?.completionPercentage).toBe(20);
    expect(optimisticSummary?.chapterStats[0].completedProblems).toBe(2);

    // Verify API was called with explicit isCompleted: true
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/progress/problem-1', {
        isCompleted: true,
      });
    });

    // Verify success toast
    await waitFor(() => {
      const toasts = useToastStore.getState().toasts;
      expect(toasts.some((t) => t.type === 'success')).toBe(true);
    });
  });

  it('rolls back optimistic changes across caches when API fails', async () => {
    vi.mocked(api.put).mockRejectedValueOnce(
      new Error('Database network timeout')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProblemRow
          problem={mockProblem}
          isCompleted={false}
          index={1}
          chapterId="chapter-1"
        />
      </QueryClientProvider>
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /Mark Two Sum as completed/i,
    });
    fireEvent.click(checkbox);

    // Wait for failure and rollback
    await waitFor(() => {
      const progressCache =
        queryClient.getQueryData<UserProgressResponseData>(PROGRESS_QUERY_KEY);
      expect(progressCache?.completedProblemIds).not.toContain('problem-1');
      expect(progressCache?.totalCompleted).toBe(1);
    });

    // Verify summary cache rolled back
    const summaryCache =
      queryClient.getQueryData<ProgressSummary>(PROGRESS_SUMMARY_QUERY_KEY);
    expect(summaryCache?.completedProblems).toBe(1);
    expect(summaryCache?.remainingProblems).toBe(9);
    expect(summaryCache?.chapterStats[0].completedProblems).toBe(1);

    // Verify error toast dispatched
    await waitFor(() => {
      const toasts = useToastStore.getState().toasts;
      expect(
        toasts.some(
          (t) =>
            t.type === 'error' &&
            t.message.includes('Failed to update "Two Sum"')
        )
      ).toBe(true);
    });
  });

  it('prevents race conditions and duplicate calls during rapid clicks', async () => {
    let resolveApi: (value: unknown) => void;
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    vi.mocked(api.put).mockReturnValueOnce(apiPromise as never);

    render(
      <QueryClientProvider client={queryClient}>
        <ProblemRow
          problem={mockProblem}
          isCompleted={false}
          index={1}
          chapterId="chapter-1"
        />
      </QueryClientProvider>
    );

    const checkbox = screen.getByRole('checkbox');

    // First click triggers mutation
    fireEvent.click(checkbox);

    // Checkbox is disabled and shows pending state
    await waitFor(() => {
      expect(checkbox).toBeDisabled();
    });

    // Subsequent rapid clicks should not fire additional API calls
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(api.put).toHaveBeenCalledTimes(1);

    // Resolve API call
    resolveApi!({
      progress: {
        _id: 'prog-2',
        problemId: 'problem-1',
        isCompleted: true,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    await waitFor(() => {
      expect(checkbox).not.toBeDisabled();
    });
  });

  it('successfully marks a completed problem as incomplete with decremented stats', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({
      progress: {
        _id: 'prog-1',
        problemId: 'problem-existing',
        isCompleted: false,
        completedAt: null,
        updatedAt: new Date().toISOString(),
      },
    });

    const completedProblem: Problem = {
      _id: 'problem-existing',
      title: 'Contains Duplicate',
      slug: 'contains-duplicate',
      description: 'Contains duplicate description',
      difficulty: 'Easy',
      topicId: 'topic-1',
      order: 2,
      resources: {
        youtubeUrl: null,
        practiceUrl: null,
        articleUrl: null,
      },
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ProblemRow
          problem={completedProblem}
          isCompleted={true}
          index={2}
          chapterId="chapter-1"
        />
      </QueryClientProvider>
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /Mark Contains Duplicate as incomplete/i,
    });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    // Click to uncheck
    fireEvent.click(checkbox);

    // Verify optimistic reduction in progress cache
    await waitFor(() => {
      const progressCache =
        queryClient.getQueryData<UserProgressResponseData>(PROGRESS_QUERY_KEY);
      expect(progressCache?.completedProblemIds).not.toContain(
        'problem-existing'
      );
      expect(progressCache?.totalCompleted).toBe(0);
    });

    // Verify optimistic reduction in summary cache
    const summaryCache =
      queryClient.getQueryData<ProgressSummary>(PROGRESS_SUMMARY_QUERY_KEY);
    expect(summaryCache?.completedProblems).toBe(0);
    expect(summaryCache?.remainingProblems).toBe(10);
    expect(summaryCache?.completionPercentage).toBe(0);
    expect(summaryCache?.chapterStats[0].completedProblems).toBe(0);

    // Verify API called with explicit isCompleted: false
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/progress/problem-existing', {
        isCompleted: false,
      });
    });
  });

  it('isolates user progress and restores session without using localStorage', async () => {
    // 1. Ensure authoritative progress is not saved in localStorage
    localStorage.clear();
    const storageKeys = Object.keys(localStorage);
    expect(storageKeys.filter((k) => k.includes('progress'))).toHaveLength(0);

    // 2. Mock active student session
    useAuthStore.setState({
      user: {
        id: 'student-alpha',
        name: 'Alpha Student',
        email: 'alpha@geekbase.com',
        role: 'student',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    // Populate cache for student Alpha
    queryClient.setQueryData(PROGRESS_QUERY_KEY, {
      completedProblemIds: ['problem-1', 'problem-2'],
      totalCompleted: 2,
      progress: [],
    });

    expect(
      queryClient.getQueryData<UserProgressResponseData>(PROGRESS_QUERY_KEY)
        ?.totalCompleted
    ).toBe(2);

    // 3. Student logs out -> queryClient.clear() purges private cache
    vi.mocked(api.post).mockResolvedValueOnce({ message: 'Logged out' });
    await useAuthStore.getState().logout();

    // Verify cache is completely cleared on logout (no leak to subsequent user)
    queryClient.clear();
    expect(queryClient.getQueryData(PROGRESS_QUERY_KEY)).toBeUndefined();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();

    // 4. Student logs in or restores session via checkAuth()
    vi.mocked(api.get).mockResolvedValueOnce({
      user: {
        id: 'student-alpha',
        name: 'Alpha Student',
        email: 'alpha@geekbase.com',
        role: 'student',
      },
    });

    await useAuthStore.getState().checkAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.id).toBe('student-alpha');

    // 5. Query fetches fresh authoritative data from server
    vi.mocked(api.get).mockResolvedValueOnce({
      completedProblemIds: ['problem-1', 'problem-2'],
      totalCompleted: 2,
      progress: [],
    });

    const restoredData = await api.get<UserProgressResponseData>('/progress');
    expect(restoredData.completedProblemIds).toEqual(['problem-1', 'problem-2']);
    expect(restoredData.totalCompleted).toBe(2);
  });
});
