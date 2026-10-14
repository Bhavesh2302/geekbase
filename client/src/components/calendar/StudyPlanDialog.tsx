import React from 'react';
import { Dialog } from '../ui/Dialog';
import { StudyPlanForm } from './StudyPlanForm';
import { StudyPlanDetails } from './StudyPlanDetails';
import { formatCanonicalToDisplay } from '../../utils/date';
import type { StudyPlan } from '../../types/studyPlan';

export type StudyPlanDialogMode = 'create' | 'view' | 'edit';

export interface StudyPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: StudyPlanDialogMode;
  date?: string;
  plan?: StudyPlan | null;
  onPlanSaved?: (plan: StudyPlan) => void;
  onPlanDeleted?: () => void;
  onSwitchToEdit?: (plan: StudyPlan) => void;
}

export const StudyPlanDialog: React.FC<StudyPlanDialogProps> = ({
  isOpen,
  onClose,
  mode,
  date,
  plan,
  onPlanSaved,
  onPlanDeleted,
  onSwitchToEdit,
}) => {
  const title =
    mode === 'create'
      ? 'Schedule Study Session'
      : mode === 'edit'
      ? 'Edit / Reschedule Session'
      : 'Study Session Details';

  const description =
    mode === 'create' && date
      ? `Assign a DSA problem to ${formatCanonicalToDisplay(date, 'full')}`
      : mode === 'edit'
      ? 'Modify scheduled date, notes, or target problem status'
      : undefined;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth={mode === 'create' ? 'lg' : 'md'}
    >
      {mode === 'create' && (
        <StudyPlanForm
          initialDate={date}
          onSuccess={(newPlan) => {
            onPlanSaved?.(newPlan);
            onClose();
          }}
          onCancel={onClose}
        />
      )}

      {mode === 'edit' && plan && (
        <StudyPlanForm
          initialPlan={plan}
          initialDate={plan.scheduledDate}
          onSuccess={(updated) => {
            onPlanSaved?.(updated);
            onClose();
          }}
          onCancel={onClose}
        />
      )}

      {mode === 'view' && plan && (
        <StudyPlanDetails
          plan={plan}
          onEdit={(targetPlan) => {
            onSwitchToEdit?.(targetPlan);
          }}
          onDeleted={() => {
            onPlanDeleted?.();
            onClose();
          }}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};
