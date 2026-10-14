import React from 'react';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

export const ProgressPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-400" />
            My Progress
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Detailed completion metrics, difficulty breakdown, and chapter-wise progress.
          </p>
        </div>
        <div>
          <Badge variant="neutral" size="md">
            Module Ready
          </Badge>
        </div>
      </div>

      <EmptyState
        icon={<BarChart3 className="w-6 h-6 text-brand-400" />}
        title="Progress Analytics Foundation"
        description="The progress contracts and progress bar components are initialized. Visual chapter breakdown and detailed metrics will be rendered here."
      />
    </div>
  );
};
