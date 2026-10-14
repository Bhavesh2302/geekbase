import React from 'react';
import type { ProblemDifficulty } from '../../types/catalog';
import type { StudyPlanStatus } from '../../types/studyPlan';

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  brand: {
    container: 'bg-brand-500/10 text-brand-300 border-brand-500/30',
    dot: 'bg-brand-400',
  },
  success: {
    container: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  warning: {
    container: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  danger: {
    container: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
  },
  neutral: {
    container: 'bg-slate-800 text-slate-300 border-slate-700/60',
    dot: 'bg-slate-400',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  hasDot = false,
  className = '',
  ...props
}) => {
  const styles = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border tracking-wide select-none
        ${styles.container}
        ${sizeClasses}
        ${className}
      `}
      {...props}
    >
      {hasDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${styles.dot}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export const DifficultyBadge: React.FC<{
  difficulty: ProblemDifficulty;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ difficulty, size = 'md', className = '' }) => {
  const variant: BadgeVariant =
    difficulty === 'Easy'
      ? 'success'
      : difficulty === 'Medium'
        ? 'warning'
        : 'danger';

  return (
    <Badge variant={variant} size={size} hasDot className={className}>
      {difficulty}
    </Badge>
  );
};

export const StatusBadge: React.FC<{
  status: StudyPlanStatus;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ status, size = 'md', className = '' }) => {
  const variant: BadgeVariant =
    status === 'completed'
      ? 'success'
      : status === 'planned'
        ? 'brand'
        : 'neutral';

  const label =
    status === 'completed'
      ? 'Completed'
      : status === 'planned'
        ? 'Planned'
        : 'Skipped';

  return (
    <Badge variant={variant} size={size} hasDot className={className}>
      {label}
    </Badge>
  );
};
