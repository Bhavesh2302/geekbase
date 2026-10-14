import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  isCircle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  isCircle = false,
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={`
        animate-pulse bg-slate-800/80
        ${isCircle ? 'rounded-full' : 'rounded-lg'}
        ${className}
      `}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-12" />
      </div>
      <SkeletonText lines={3} />
      <div className="pt-2 flex justify-end gap-2">
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div
      className={`w-full bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 ${className}`}
    >
      <div className="flex gap-4 border-b border-slate-800 pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
