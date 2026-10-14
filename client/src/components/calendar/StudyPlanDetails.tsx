import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  SkipForward,
  Edit2,
  Trash2,
  ExternalLink,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusBadge, DifficultyBadge } from '../ui/Badge';
import { formatCanonicalToDisplay } from '../../utils/date';
import {
  useUpdateStudyPlan,
  useDeleteStudyPlan,
} from '../../hooks/useStudyPlans';
import type { StudyPlan, StudyPlanStatus } from '../../types/studyPlan';

export interface StudyPlanDetailsProps {
  plan: StudyPlan;
  onEdit: (plan: StudyPlan) => void;
  onDeleted: () => void;
  onClose: () => void;
}

export const StudyPlanDetails: React.FC<StudyPlanDetailsProps> = ({
  plan,
  onEdit,
  onDeleted,
  onClose,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const updateMutation = useUpdateStudyPlan();
  const deleteMutation = useDeleteStudyPlan();

  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const problem =
    typeof plan.problemId === 'object' && plan.problemId !== null
      ? plan.problemId
      : null;

  const handleStatusChange = async (newStatus: StudyPlanStatus) => {
    if (plan.status === newStatus || isUpdating) return;
    await updateMutation.mutateAsync({
      planId: plan._id,
      data: { status: newStatus },
    });
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    await deleteMutation.mutateAsync({ planId: plan._id });
    onDeleted();
  };

  return (
    <div className="space-y-5">
      {/* Problem Header */}
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              {problem?.title || 'Scheduled DSA Problem'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled for {formatCanonicalToDisplay(plan.scheduledDate, 'full')}
            </p>
          </div>
          {problem && (
            <DifficultyBadge difficulty={problem.difficulty} size="sm" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          <StatusBadge status={plan.status} size="sm" />

          {problem?.slug && (
            <a
              href={`/problems`}
              className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium ml-auto"
            >
              <span>View in DSA Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Quick Status Bar */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Update Calendar Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleStatusChange('planned')}
            disabled={isUpdating}
            className={`
              flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all
              ${
                plan.status === 'planned'
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }
              disabled:opacity-50
            `}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Planned</span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('completed')}
            disabled={isUpdating}
            className={`
              flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all
              ${
                plan.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }
              disabled:opacity-50
            `}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('skipped')}
            disabled={isUpdating}
            className={`
              flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all
              ${
                plan.status === 'skipped'
                  ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }
              disabled:opacity-50
            `}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skipped</span>
          </button>
        </div>
      </div>

      {/* Notes Display */}
      {plan.notes ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <FileText className="w-3.5 h-3.5" />
            <span>Study Notes</span>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {plan.notes}
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">No notes attached to this study session.</p>
      )}

      {/* Delete Confirmation Box */}
      {showConfirmDelete ? (
        <div className="p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Confirm Deletion</span>
          </div>
          <p className="text-xs text-rose-200/80">
            Are you sure you want to remove this study plan from your calendar? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              Delete Plan
            </Button>
          </div>
        </div>
      ) : (
        /* Action Buttons */
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirmDelete(true)}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onEdit(plan)}
              leftIcon={<Edit2 className="w-4 h-4" />}
            >
              Edit / Reschedule
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
