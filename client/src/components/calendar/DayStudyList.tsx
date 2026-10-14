import React from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Trash2,
  Edit2,
  BookOpen,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusBadge, DifficultyBadge } from '../ui/Badge';
import { formatCanonicalToDisplay, getTodayCanonical } from '../../utils/date';
import {
  useUpdateStudyPlan,
  useDeleteStudyPlan,
} from '../../hooks/useStudyPlans';
import type { StudyPlan, StudyPlanStatus } from '../../types/studyPlan';

export interface DayStudyListProps {
  selectedDate: string; // YYYY-MM-DD
  plans: StudyPlan[];
  onAddPlan: (date: string) => void;
  onSelectPlan: (plan: StudyPlan) => void;
  onEditPlan: (plan: StudyPlan) => void;
}

export const DayStudyList: React.FC<DayStudyListProps> = ({
  selectedDate,
  plans,
  onAddPlan,
  onSelectPlan,
  onEditPlan,
}) => {
  const updateMutation = useUpdateStudyPlan();
  const deleteMutation = useDeleteStudyPlan();

  const isToday = selectedDate === getTodayCanonical();

  // Filter plans scheduled strictly on this date
  const dayPlans = plans.filter((p) => p.scheduledDate === selectedDate);

  const handleQuickStatus = async (
    e: React.MouseEvent,
    plan: StudyPlan,
    newStatus: StudyPlanStatus
  ) => {
    e.stopPropagation();
    if (plan.status === newStatus || updateMutation.isPending) return;
    await updateMutation.mutateAsync({
      planId: plan._id,
      data: { status: newStatus },
    });
  };

  const handleDelete = async (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    if (deleteMutation.isPending) return;
    if (window.confirm('Are you sure you want to delete this study plan?')) {
      await deleteMutation.mutateAsync({ planId });
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col h-full space-y-4">
      {/* Date Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              {formatCanonicalToDisplay(selectedDate, 'full')}
            </h3>
            {isToday && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Today
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {dayPlans.length === 0
              ? 'No study sessions scheduled'
              : `${dayPlans.length} ${
                  dayPlans.length === 1 ? 'problem' : 'problems'
                } scheduled`}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onAddPlan(selectedDate)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Plan
        </Button>
      </div>

      {/* List of Scheduled Items */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[480px]">
        {dayPlans.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">
                No problems scheduled for this date
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Plan ahead by scheduling a problem to maintain your daily streak.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddPlan(selectedDate)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Schedule for {formatCanonicalToDisplay(selectedDate, 'short')}
            </Button>
          </div>
        ) : (
          dayPlans.map((plan) => {
            const problem =
              typeof plan.problemId === 'object' && plan.problemId !== null
                ? plan.problemId
                : null;

            return (
              <div
                key={plan._id}
                onClick={() => onSelectPlan(plan)}
                className={`
                  group p-3.5 rounded-xl border transition-all duration-150 cursor-pointer
                  ${
                    plan.status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                      : plan.status === 'skipped'
                      ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-70'
                      : 'bg-slate-950/60 border-slate-800/90 hover:border-brand-500/40 hover:bg-slate-900/50'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-semibold text-slate-100 truncate ${
                          plan.status === 'completed'
                            ? 'line-through text-emerald-300/80'
                            : plan.status === 'skipped'
                            ? 'line-through text-slate-400'
                            : ''
                        }`}
                      >
                        {problem?.title || 'DSA Problem'}
                      </span>
                      {problem && (
                        <DifficultyBadge
                          difficulty={problem.difficulty}
                          size="sm"
                        />
                      )}
                    </div>

                    {plan.notes && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                        "{plan.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      title={
                        plan.status === 'completed'
                          ? 'Mark as planned'
                          : 'Mark as completed'
                      }
                      onClick={(e) =>
                        handleQuickStatus(
                          e,
                          plan,
                          plan.status === 'completed' ? 'planned' : 'completed'
                        )
                      }
                      className={`
                        p-1.5 rounded-lg border transition-colors
                        ${
                          plan.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-emerald-300 hover:border-emerald-500/40'
                        }
                      `}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Edit plan"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPlan(plan);
                      }}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Delete plan"
                      onClick={(e) => handleDelete(e, plan._id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/60">
                  <StatusBadge status={plan.status} size="sm" />
                  <span className="text-[11px] text-slate-500 ml-auto">
                    Click to view details
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
