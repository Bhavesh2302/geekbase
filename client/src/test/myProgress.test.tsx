import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProgressPage } from '../pages/ProgressPage';
import { ProgressHero } from '../components/progress/ProgressHero';
import { DifficultyBreakdown } from '../components/progress/DifficultyBreakdown';
import { ChapterProgressCard } from '../components/progress/ChapterProgressCard';
import { RecentlyCompletedSection } from '../components/progress/RecentlyCompletedSection';
import { ContinueLearningCard } from '../components/progress/ContinueLearningCard';
import { api } from '../api/client';
import type { ProgressSummary } from '../types/progress';
import type { DashboardSummary } from '../types/dashboard';

// Mock API client
vi.mock('../api/client', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockProgressSummary: ProgressSummary = {
  totalProblems: 20,
  completedProblems: 8,
  remainingProblems: 12,
  completionPercentage: 40,
  difficultyStats: {
    Easy: { total: 8, completed: 5, percentage: 62.5 },
    Medium: { total: 8, completed: 3, percentage: 37.5 },
    Hard: { total: 4, completed: 0, percentage: 0 },
  },
  chapterStats: [
    {
      chapterId: 'chap-1',
      title: 'Arrays & Hashing',
      slug: 'arrays-and-hashing',
      order: 1,
      totalProblems: 10,
      completedProblems: 6,
      completionPercentage: 60,
    },
    {
      chapterId: 'chap-2',
      title: 'Two Pointers',
      slug: 'two-pointers',
      order: 2,
      totalProblems: 10,
      completedProblems: 2,
      completionPercentage: 20,
    },
  ],
};

const mockDashboardSummary: DashboardSummary = {
  totalProblems: 20,
  completedProblems: 8,
  remainingProblems: 12,
  completionPercentage: 40,
  chapterStats: mockProgressSummary.chapterStats,
  recentlyCompleted: [
    {
      problemId: 'prob-10',
      title: 'Valid Palindrome',
      slug: 'valid-palindrome',
      difficulty: 'Easy',
      completedAt: '2026-10-14T10:00:00.000Z',
    },
    {
      problemId: 'prob-11',
      title: 'Two Sum II',
      slug: 'two-sum-ii',
      difficulty: 'Medium',
      completedAt: '2026-10-13T15:30:00.000Z',
    },
  ],
  upcomingStudyPlans: [],
  continueLearning: {
    problem: {
      _id: 'prob-12',
      title: '3Sum',
      slug: '3sum',
      difficulty: 'Medium',
      topicId: 'topic-2',
      chapterTitle: 'Two Pointers',
      topicTitle: 'Medium Multi-pointer',
    },
    reason: 'Continue unfinished chapter Two Pointers to maintain consistency.',
  },
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

describe('My Progress Analytics & Page States', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  describe('1. Zero-Progress State', () => {
    it('displays onboarding call-to-action and 0% metrics when student has zero completions', () => {
      render(
        <MemoryRouter>
          <ProgressHero
            totalProblems={25}
            completedProblems={0}
            remainingProblems={25}
            completionPercentage={0}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText(/DSA problems solved/i)).toHaveTextContent('0 of 25 DSA problems solved');
      expect(screen.getByText(/Kickstart Your Journey/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Browse DSA Sheet/i })).toBeInTheDocument();
      expect(screen.getByText('Not Started')).toBeInTheDocument();
    });

    it('renders empty recently completed section gracefully for new students', () => {
      render(
        <MemoryRouter>
          <RecentlyCompletedSection recentlyCompleted={[]} />
        </MemoryRouter>
      );

      expect(screen.getByText(/No completed problems yet/i)).toBeInTheDocument();
      expect(screen.getByText(/Explore Problems/i)).toBeInTheDocument();
    });
  });

  describe('2. Partially Completed State', () => {
    it('displays accurate completion rate, remaining count, and difficulty stats', () => {
      render(
        <MemoryRouter>
          <ProgressHero
            totalProblems={20}
            completedProblems={8}
            remainingProblems={12}
            completionPercentage={40}
            continueProblemTitle="3Sum"
          />
        </MemoryRouter>
      );

      expect(screen.getByText('40%')).toBeInTheDocument();
      expect(screen.getByText(/DSA problems solved/i)).toHaveTextContent('8 of 20 DSA problems solved');
      expect(screen.getByText(/problems remaining/i)).toHaveTextContent('12 problems remaining to complete sheet');
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('3Sum')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue Learning/i })).toBeInTheDocument();
    });

    it('renders difficulty cards with correct counts, percentages, and progress bars', () => {
      render(
        <DifficultyBreakdown
          difficultyStats={mockProgressSummary.difficultyStats}
        />
      );

      // Easy
      expect(screen.getByText('Easy')).toBeInTheDocument();
      expect(screen.getByText('5 / 8 Solved')).toBeInTheDocument();
      expect(screen.getByText('62.5%')).toBeInTheDocument();

      // Medium
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('3 / 8 Solved')).toBeInTheDocument();
      expect(screen.getByText('37.5%')).toBeInTheDocument();

      // Hard
      expect(screen.getByText('Hard')).toBeInTheDocument();
      expect(screen.getByText('0 / 4 Solved')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('renders recently completed list with problem names and timestamps', () => {
      render(
        <MemoryRouter>
          <RecentlyCompletedSection
            recentlyCompleted={mockDashboardSummary.recentlyCompleted}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Valid Palindrome')).toBeInTheDocument();
      expect(screen.getByText('Two Sum II')).toBeInTheDocument();
      expect(screen.getAllByText(/Completed on/i).length).toBe(2);
    });
  });

  describe('3. Fully Completed State', () => {
    it('renders congratulatory celebration banner and Mastered badge when 100% complete', () => {
      render(
        <MemoryRouter>
          <ProgressHero
            totalProblems={50}
            completedProblems={50}
            remainingProblems={0}
            completionPercentage={100}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText(/DSA problems solved/i)).toHaveTextContent('50 of 50 DSA problems solved');
      expect(screen.getByText(/Curriculum Mastered!/i)).toBeInTheDocument();
      expect(screen.getByText('Mastered')).toBeInTheDocument();
      expect(screen.getByText(/Review on Calendar/i)).toBeInTheDocument();
    });

    it('renders 100% chapter card with Mastered badge', () => {
      render(
        <MemoryRouter>
          <ChapterProgressCard
            stat={{
              chapterId: 'chap-complete',
              title: 'Binary Search',
              slug: 'binary-search',
              order: 3,
              totalProblems: 6,
              completedProblems: 6,
              completionPercentage: 100,
            }}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Binary Search')).toBeInTheDocument();
      expect(screen.getByText('Mastered')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText(/All problems completed/i)).toBeInTheDocument();
    });
  });

  describe('4. Continue Learning Recommendation', () => {
    it('displays next recommended problem title, difficulty, and reasoning', () => {
      render(
        <MemoryRouter>
          <ContinueLearningCard
            recommendation={mockDashboardSummary.continueLearning}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('3Sum')).toBeInTheDocument();
      expect(screen.getByText(/Two Pointers • Medium Multi-pointer/i)).toBeInTheDocument();
      expect(
        screen.getByText(/"Continue unfinished chapter Two Pointers to maintain consistency."/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Resume Practice/i })).toBeInTheDocument();
    });
  });

  describe('5. Full ProgressPage Integration & Filtering', () => {
    it('fetches and displays progress summary and dashboard data', async () => {
      vi.mocked(api.get).mockImplementation((url: string) => {
        if (url.includes('/progress/summary')) {
          return Promise.resolve(mockProgressSummary);
        }
        if (url.includes('/dashboard/summary')) {
          return Promise.resolve(mockDashboardSummary);
        }
        return Promise.resolve({});
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ProgressPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      // Verify page title and metrics
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2, name: /My Progress/i })).toBeInTheDocument();
        expect(screen.getByText('40%')).toBeInTheDocument();
        expect(screen.getByText('Arrays & Hashing')).toBeInTheDocument();
        expect(screen.getByText('Two Pointers')).toBeInTheDocument();
      });
    });

    it('filters chapter list by search keyword and resets correctly', async () => {
      vi.mocked(api.get).mockImplementation((url: string) => {
        if (url.includes('/progress/summary')) {
          return Promise.resolve(mockProgressSummary);
        }
        if (url.includes('/dashboard/summary')) {
          return Promise.resolve(mockDashboardSummary);
        }
        return Promise.resolve({});
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ProgressPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Arrays & Hashing')).toBeInTheDocument();
        expect(screen.getByText('Two Pointers')).toBeInTheDocument();
      });

      // Filter by searching "Arrays"
      const searchInput = screen.getByPlaceholderText(/Search chapters by title.../i);
      fireEvent.change(searchInput, { target: { value: 'Arrays' } });

      expect(screen.getByText('Arrays & Hashing')).toBeInTheDocument();
      expect(screen.queryByText('Two Pointers')).not.toBeInTheDocument();

      // Reset filters
      const resetBtn = screen.getByRole('button', { name: /Reset Filters/i });
      fireEvent.click(resetBtn);

      expect(screen.getByText('Arrays & Hashing')).toBeInTheDocument();
      expect(screen.getByText('Two Pointers')).toBeInTheDocument();
    });

    it('filters chapter list by chapter dropdown selection', async () => {
      vi.mocked(api.get).mockImplementation((url: string) => {
        if (url.includes('/progress/summary')) {
          return Promise.resolve(mockProgressSummary);
        }
        if (url.includes('/dashboard/summary')) {
          return Promise.resolve(mockDashboardSummary);
        }
        return Promise.resolve({});
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ProgressPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Arrays & Hashing')).toBeInTheDocument();
      });

      const chapterSelect = screen.getByLabelText(/Filter by chapter/i);
      fireEvent.change(chapterSelect, { target: { value: 'chap-2' } });

      expect(screen.queryByText('Arrays & Hashing')).not.toBeInTheDocument();
      expect(screen.getByText('Two Pointers')).toBeInTheDocument();
    });
  });
});
