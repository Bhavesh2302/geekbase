import React from 'react';

export type ProgressVariant = 'brand' | 'success' | 'warning' | 'gradient';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
}

const variantStyles: Record<ProgressVariant, string> = {
  brand: 'bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  gradient: 'bg-gradient-to-r from-brand-500 via-indigo-400 to-emerald-400',
};

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'gradient',
  size = 'md',
  showLabel = false,
  label,
  className = '',
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100 * 10) / 10));

  return (
    <div className={`w-full space-y-1.5 ${className}`} {...props}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <span>{label || 'Progress'}</span>
          <span>{percentage}%</span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress bar'}
        className={`w-full bg-slate-800/90 rounded-full overflow-hidden border border-slate-750 p-0.5 ${sizeStyles[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
