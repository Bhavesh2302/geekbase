import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, BookOpen, CheckCircle, Clock, SkipForward } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DifficultyBadge } from '../ui/Badge';
import { useChapters, useTopics, useProblems } from '../../hooks/useCatalog';
import { useCreateStudyPlan, useUpdateStudyPlan } from '../../hooks/useStudyPlans';
import { isValidCanonicalDate, getTodayCanonical } from '../../utils/date';
import type { StudyPlan } from '../../types/studyPlan';

const studyPlanFormSchema = z.object({
  scheduledDate: z
    .string()
    .trim()
    .refine(isValidCanonicalDate, {
      message: 'Date must follow canonical YYYY-MM-DD format',
    }),
  chapterId: z.string().optional(),
  topicId: z.string().optional(),
  problemId: z.string().min(1, 'Please select a DSA problem to schedule'),
  status: z.enum(['planned', 'completed', 'skipped']),
  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
});

type StudyPlanFormData = z.infer<typeof studyPlanFormSchema>;

export interface StudyPlanFormProps {
  initialDate?: string;
  initialPlan?: StudyPlan | null;
  onSuccess: (plan: StudyPlan) => void;
  onCancel: () => void;
}

export const StudyPlanForm: React.FC<StudyPlanFormProps> = ({
  initialDate,
  initialPlan,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!initialPlan;
  const initialProblem =
    typeof initialPlan?.problemId === 'object' && initialPlan.problemId !== null
      ? initialPlan.problemId
      : null;

  const initialProblemId =
    typeof initialPlan?.problemId === 'object' && initialPlan.problemId !== null
      ? initialPlan.problemId._id
      : (initialPlan?.problemId as string) || '';

  // Form State
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudyPlanFormData>({
    resolver: zodResolver(studyPlanFormSchema),
    defaultValues: {
      scheduledDate:
        initialPlan?.scheduledDate || initialDate || getTodayCanonical(),
      chapterId: '',
      topicId: '',
      problemId: initialProblemId,
      status: initialPlan?.status || 'planned',
      notes: initialPlan?.notes || '',
    },
  });

  const selectedChapterId = watch('chapterId');
  const selectedTopicId = watch('topicId');
  const selectedProblemId = watch('problemId');
  const currentStatus = watch('status');
  const notesValue = watch('notes') || '';

  // Catalog Queries for cascading dropdowns
  const { data: chaptersData, isLoading: loadingChapters } = useChapters();
  const { data: topicsData, isLoading: loadingTopics } = useTopics(
    selectedChapterId || undefined
  );
  const { data: problemsData, isLoading: loadingProblems } = useProblems({
    topicId: selectedTopicId || undefined,
    limit: 100,
  });

  // Mutations
  const createMutation = useCreateStudyPlan();
  const updateMutation = useUpdateStudyPlan();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Selected problem object for preview
  const activeProblem =
    problemsData?.problems?.find((p) => p._id === selectedProblemId) ||
    initialProblem;

  // Handle cascading dropdown reset
  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChapterId = e.target.value;
    setValue('chapterId', newChapterId);
    setValue('topicId', '');
    if (!isEditing) {
      setValue('problemId', '');
    }
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTopicId = e.target.value;
    setValue('topicId', newTopicId);
    if (!isEditing) {
      setValue('problemId', '');
    }
  };

  const onSubmit = async (data: StudyPlanFormData) => {
    if (isSubmitting) return; // Prevent duplicate submission

    if (isEditing && initialPlan) {
      const updated = await updateMutation.mutateAsync({
        planId: initialPlan._id,
        data: {
          scheduledDate: data.scheduledDate,
          status: data.status,
          notes: data.notes?.trim() || '',
        },
      });
      onSuccess(updated);
    } else {
      const created = await createMutation.mutateAsync({
        problemId: data.problemId,
        scheduledDate: data.scheduledDate,
        status: data.status,
        notes: data.notes?.trim() || '',
      });
      onSuccess(created);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Scheduled Date */}
      <div>
        <label
          htmlFor="plan-date-input"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Scheduled Date
        </label>
        <div className="relative">
          <Input
            id="plan-date-input"
            type="date"
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            error={errors.scheduledDate?.message}
            {...register('scheduledDate')}
          />
        </div>
      </div>

      {/* When creating: Cascading Problem Picker */}
      {!isEditing ? (
        <div className="space-y-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-800/60">
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-semibold text-slate-200">
              Select Problem
            </span>
          </div>

          {/* 1. Chapter Dropdown */}
          <div>
            <label
              htmlFor="chapter-select"
              className="block text-xs text-slate-400 mb-1 font-medium"
            >
              Chapter
            </label>
            <select
              id="chapter-select"
              value={selectedChapterId || ''}
              onChange={handleChapterChange}
              disabled={loadingChapters || isSubmitting}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            >
              <option value="">-- Choose a Chapter --</option>
              {chaptersData?.chapters?.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.title} ({ch.problemCount || 0} problems)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Topic Dropdown */}
          <div>
            <label
              htmlFor="topic-select"
              className="block text-xs text-slate-400 mb-1 font-medium"
            >
              Topic
            </label>
            <select
              id="topic-select"
              value={selectedTopicId || ''}
              onChange={handleTopicChange}
              disabled={!selectedChapterId || loadingTopics || isSubmitting}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            >
              <option value="">
                {!selectedChapterId
                  ? 'First select a chapter above'
                  : '-- Choose a Topic --'}
              </option>
              {topicsData?.topics?.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Problem Dropdown */}
          <div>
            <label
              htmlFor="problem-select"
              className="block text-xs text-slate-400 mb-1 font-medium"
            >
              Problem
            </label>
            <select
              id="problem-select"
              {...register('problemId')}
              disabled={!selectedTopicId || loadingProblems || isSubmitting}
              className="w-full bg-slate-900 text-slate-100 text-sm rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            >
              <option value="">
                {!selectedTopicId
                  ? 'First select a topic above'
                  : '-- Choose a DSA Problem --'}
              </option>
              {problemsData?.problems?.map((prob) => (
                <option key={prob._id} value={prob._id}>
                  [{prob.difficulty}] {prob.title}
                </option>
              ))}
            </select>
            {errors.problemId && (
              <p className="text-xs text-rose-400 mt-1 font-medium">
                {errors.problemId.message}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* When editing: Show static problem info */
        <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <p className="text-xs text-slate-400 font-medium mb-1">
            Target Problem
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-100 text-sm">
              {activeProblem ? activeProblem.title : 'Selected Problem'}
            </span>
            {activeProblem && (
              <DifficultyBadge difficulty={activeProblem.difficulty} size="sm" />
            )}
          </div>
        </div>
      )}

      {/* Status Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'planned', label: 'Planned', icon: Clock },
              { id: 'completed', label: 'Completed', icon: CheckCircle },
              { id: 'skipped', label: 'Skipped', icon: SkipForward },
            ] as const
          ).map(({ id, label, icon: Icon }) => {
            const isSelected = currentStatus === id;
            return (
              <button
                type="button"
                key={id}
                onClick={() => setValue('status', id)}
                className={`
                  flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all
                  ${
                    isSelected
                      ? id === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : id === 'skipped'
                        ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                        : 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="plan-notes"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Study Notes <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <span className="text-[11px] text-slate-400">
            {notesValue.length}/1000
          </span>
        </div>
        <textarea
          id="plan-notes"
          rows={3}
          placeholder="E.g. Focus on two-pointer pattern, revision after 3 days..."
          maxLength={1000}
          disabled={isSubmitting}
          {...register('notes')}
          className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm rounded-lg border border-slate-800 hover:border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 p-3 transition-colors disabled:opacity-50 resize-none"
        />
        {errors.notes && (
          <p className="text-xs text-rose-400 mt-1 font-medium">
            {errors.notes.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800/80">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditing ? 'Save Changes' : 'Schedule Session'}
        </Button>
      </div>
    </form>
  );
};
