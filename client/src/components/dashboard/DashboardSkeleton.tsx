import React from 'react';
import { Skeleton, SkeletonCard } from '../ui/Skeleton';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading dashboard...">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Progress Banner Skeleton */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-56" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>

      {/* Continue Learning Skeleton */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 w-full lg:w-2/3">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-12 w-44 rounded-xl shrink-0" />
      </div>

      {/* Two Column Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-64" />
      </div>

      {/* Chapter Grid Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="h-36" />
          ))}
        </div>
      </div>
    </div>
  );
};
