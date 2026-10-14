import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';

interface ChapterProgressProps {
  completedCount: number;
  totalCount: number;
  percentage?: number;
}

export const ChapterProgress: React.FC<ChapterProgressProps> = ({
  completedCount,
  totalCount,
  percentage,
}) => {
  const calculatedPercentage =
    percentage !== undefined
      ? percentage
      : totalCount > 0
        ? Math.round((completedCount / totalCount) * 100 * 10) / 10
        : 0;

  const isComplete = totalCount > 0 && completedCount >= totalCount;
  const isInProgress = completedCount > 0 && !isComplete;

  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex flex-col items-end gap-1 w-28">
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400">
          <span>{completedCount} / {totalCount}</span>
          <span className="font-mono text-slate-300 font-semibold">
            {calculatedPercentage}%
          </span>
        </div>
        <ProgressBar
          value={calculatedPercentage}
          size="sm"
          variant={isComplete ? 'success' : 'brand'}
        />
      </div>

      <div className="shrink-0">
        {isComplete ? (
          <Badge variant="success" size="sm" hasDot>
            Complete
          </Badge>
        ) : isInProgress ? (
          <Badge variant="brand" size="sm" hasDot>
            In Progress
          </Badge>
        ) : (
          <Badge variant="neutral" size="sm">
            Not Started
          </Badge>
        )}
      </div>
    </div>
  );
};
