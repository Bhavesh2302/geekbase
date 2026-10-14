import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StudyPlanDialog } from '../components/calendar/StudyPlanDialog';
import { DayStudyList } from '../components/calendar/DayStudyList';
import { CalendarEvent } from '../components/calendar/CalendarEvent';
import { api } from '../api/client';
import { useToastStore } from '../store/toastStore';
import type { StudyPlan } from '../types/studyPlan';
import {
  STUDY_PLANS_QUERY_KEY,
  useUpdateStudyPlan,
  useDeleteStudyPlan,
} from '../hooks/useStudyPlans';

// Mock API client
vi.mock('../api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock useCatalog hooks
vi.mock('../hooks/useCatalog', () => ({
  useChapters: () => ({
    data: {
      chapters: [
        { _id: 'chap-1', title: 'Arrays & Hashing', problemCount: 5 },
      ],
    },
    isLoading: false,
  }),
  useTopics: () => ({
    data: {
      topics: [{ _id: 'topic-1', chapterId: 'chap-1', title: 'Two Pointers' }],
    },
    isLoading: false,
  }),
  useProblems: () => ({
    data: {
      problems: [
        {
          _id: 'prob-1',
          title: 'Two Sum',
          difficulty: 'Easy',
          slug: 'two-sum',
        },
        {
          _id: 'prob-2',
          title: '3Sum',
          difficulty: 'Medium',
          slug: '3sum',
        },
      ],
    },
    isLoading: false,
  }),
}));

const mockStudyPlan: StudyPlan = {
  _id: 'plan-101',
  userId: 'user-1',
  problemId: {
    _id: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
  },
  scheduledDate: '2026-10-15',
  status: 'planned',
  notes: 'Revision notes for two pointer technique',
  createdAt: '2026-10-14T10:00:00.000Z',
  updatedAt: '2026-10-14T10:00:00.000Z',
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

describe('Study Calendar Components & Operations', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
    useToastStore.setState({ toasts: [] });
  });

  describe('1. CalendarEvent Component', () => {
    it('renders event with title and planned status styling', () => {
      render(<CalendarEvent plan={mockStudyPlan} />);
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('E')).toBeInTheDocument(); // Easy badge
    });

    it('renders event with completed styling and strike-through text', () => {
      const completedPlan: StudyPlan = {
        ...mockStudyPlan,
        status: 'completed',
      };
      const { container } = render(<CalendarEvent plan={completedPlan} />);
      expect(screen.getByText('Two Sum')).toHaveClass('line-through');
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders event with skipped styling', () => {
      const skippedPlan: StudyPlan = {
        ...mockStudyPlan,
        status: 'skipped',
      };
      render(<CalendarEvent plan={skippedPlan} />);
      expect(screen.getByText('Two Sum')).toHaveClass('line-through');
    });
  });

  describe('2. DayStudyList Component', () => {
    it('displays scheduled problems for the selected date', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DayStudyList
            selectedDate="2026-10-15"
            plans={[mockStudyPlan]}
            onAddPlan={vi.fn()}
            onSelectPlan={vi.fn()}
            onEditPlan={vi.fn()}
          />
        </QueryClientProvider>
      );

      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText(/1 problem scheduled/i)).toBeInTheDocument();
      expect(screen.getByText(/"Revision notes for two pointer technique"/i)).toBeInTheDocument();
    });

    it('displays empty state when no problems scheduled for that date', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DayStudyList
            selectedDate="2026-10-20"
            plans={[mockStudyPlan]}
            onAddPlan={vi.fn()}
            onSelectPlan={vi.fn()}
            onEditPlan={vi.fn()}
          />
        </QueryClientProvider>
      );

      expect(
        screen.getByText('No problems scheduled for this date')
      ).toBeInTheDocument();
    });

    it('supports quick marking plan as completed', async () => {
      vi.mocked(api.patch).mockResolvedValueOnce({
        plan: { ...mockStudyPlan, status: 'completed' },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <DayStudyList
            selectedDate="2026-10-15"
            plans={[mockStudyPlan]}
            onAddPlan={vi.fn()}
            onSelectPlan={vi.fn()}
            onEditPlan={vi.fn()}
          />
        </QueryClientProvider>
      );

      const checkBtn = screen.getByTitle('Mark as completed');
      fireEvent.click(checkBtn);

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith(
          '/study-plans/plan-101',
          expect.objectContaining({ status: 'completed' })
        );
      });
    });
  });

  describe('3. StudyPlanDialog & Creation Flow', () => {
    it('allows creating a new study plan with problem selection and date', async () => {
      const createdPlan: StudyPlan = {
        _id: 'plan-new',
        userId: 'user-1',
        problemId: {
          _id: 'prob-1',
          title: 'Two Sum',
          slug: 'two-sum',
          difficulty: 'Easy',
        },
        scheduledDate: '2026-10-16',
        status: 'planned',
        notes: 'Practice fast pointers',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(api.post).mockResolvedValueOnce({ plan: createdPlan });
      const onPlanSaved = vi.fn();
      const onClose = vi.fn();

      render(
        <QueryClientProvider client={queryClient}>
          <StudyPlanDialog
            isOpen={true}
            mode="create"
            date="2026-10-16"
            onClose={onClose}
            onPlanSaved={onPlanSaved}
          />
        </QueryClientProvider>
      );

      expect(screen.getByText('Schedule Study Session')).toBeInTheDocument();

      // Select chapter
      const chapterSelect = screen.getByLabelText(/Chapter/i);
      fireEvent.change(chapterSelect, { target: { value: 'chap-1' } });

      // Select topic
      const topicSelect = screen.getByLabelText(/Topic/i);
      fireEvent.change(topicSelect, { target: { value: 'topic-1' } });

      // Select problem
      const problemSelect = screen.getByLabelText(/Problem/i);
      fireEvent.change(problemSelect, { target: { value: 'prob-1' } });

      // Enter notes
      const notesInput = screen.getByPlaceholderText(/Focus on two-pointer pattern/i);
      fireEvent.change(notesInput, { target: { value: 'Practice fast pointers' } });

      // Submit
      const submitBtn = screen.getByRole('button', { name: /Schedule Session/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/study-plans', {
          problemId: 'prob-1',
          scheduledDate: '2026-10-16',
          status: 'planned',
          notes: 'Practice fast pointers',
        });
        expect(onPlanSaved).toHaveBeenCalledWith(createdPlan);
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('4. Editing and Rescheduling Flow', () => {
    it('allows editing notes and rescheduling a study plan to a new date', async () => {
      const rescheduledPlan: StudyPlan = {
        ...mockStudyPlan,
        scheduledDate: '2026-10-22',
        notes: 'Rescheduled for weekend revision',
      };

      vi.mocked(api.patch).mockResolvedValueOnce({ plan: rescheduledPlan });
      const onPlanSaved = vi.fn();
      const onClose = vi.fn();

      render(
        <QueryClientProvider client={queryClient}>
          <StudyPlanDialog
            isOpen={true}
            mode="edit"
            plan={mockStudyPlan}
            onClose={onClose}
            onPlanSaved={onPlanSaved}
          />
        </QueryClientProvider>
      );

      expect(screen.getByText('Edit / Reschedule Session')).toBeInTheDocument();

      // Change scheduled date
      const dateInput = screen.getByLabelText(/Scheduled Date/i);
      fireEvent.change(dateInput, { target: { value: '2026-10-22' } });

      // Update notes
      const notesInput = screen.getByPlaceholderText(/Focus on two-pointer pattern/i);
      fireEvent.change(notesInput, {
        target: { value: 'Rescheduled for weekend revision' },
      });

      // Save changes
      const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith('/study-plans/plan-101', {
          scheduledDate: '2026-10-22',
          status: 'planned',
          notes: 'Rescheduled for weekend revision',
        });
        expect(onPlanSaved).toHaveBeenCalledWith(rescheduledPlan);
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('5. Details View & Deleting Flow', () => {
    it('shows plan details and handles deletion with confirmation', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({
        deletedId: 'plan-101',
        message: 'Deleted successfully',
      });

      const onPlanDeleted = vi.fn();
      const onClose = vi.fn();

      render(
        <QueryClientProvider client={queryClient}>
          <StudyPlanDialog
            isOpen={true}
            mode="view"
            plan={mockStudyPlan}
            onClose={onClose}
            onPlanDeleted={onPlanDeleted}
          />
        </QueryClientProvider>
      );

      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(
        screen.getByText('Revision notes for two pointer technique')
      ).toBeInTheDocument();

      // Click delete button to show confirmation
      const deleteBtn = screen.getByRole('button', { name: /Delete/i });
      fireEvent.click(deleteBtn);

      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();

      // Click confirm delete
      const confirmDeleteBtn = screen.getByRole('button', {
        name: 'Delete Plan',
      });
      fireEvent.click(confirmDeleteBtn);

      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/study-plans/plan-101');
        expect(onPlanDeleted).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('6. Optimistic Updates and Restoring on Error', () => {
    it('optimistically removes deleted plan from cache and restores it when API fails', async () => {
      queryClient.setQueryData(STUDY_PLANS_QUERY_KEY, [mockStudyPlan]);

      vi.mocked(api.delete).mockRejectedValueOnce(
        new Error('Network error deleting study plan')
      );

      const ConsumerComponent = () => {
        const { mutate } = useDeleteStudyPlan();
        return (
          <button onClick={() => mutate({ planId: 'plan-101' })}>
            Trigger Delete
          </button>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <ConsumerComponent />
        </QueryClientProvider>
      );

      // Trigger mutation
      fireEvent.click(screen.getByText('Trigger Delete'));

      // Check rollback occurs after failure
      await waitFor(() => {
        const currentData = queryClient.getQueryData<StudyPlan[]>(
          STUDY_PLANS_QUERY_KEY
        );
        expect(currentData).toBeDefined();
        expect(currentData?.length).toBe(1);
        expect(currentData?.[0]._id).toBe('plan-101');
      });
    });

    it('optimistically updates plan status and restores previous state when API fails', async () => {
      queryClient.setQueryData(STUDY_PLANS_QUERY_KEY, [mockStudyPlan]);

      vi.mocked(api.patch).mockRejectedValueOnce(
        new Error('Server error updating study plan')
      );

      const ConsumerComponent = () => {
        const { mutate } = useUpdateStudyPlan();
        return (
          <button
            onClick={() =>
              mutate({
                planId: 'plan-101',
                data: { status: 'completed' },
              })
            }
          >
            Trigger Update
          </button>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <ConsumerComponent />
        </QueryClientProvider>
      );

      fireEvent.click(screen.getByText('Trigger Update'));

      // Rollback to original status 'planned'
      await waitFor(() => {
        const currentData = queryClient.getQueryData<StudyPlan[]>(
          STUDY_PLANS_QUERY_KEY
        );
        expect(currentData?.[0].status).toBe('planned');
      });
    });
  });
});
