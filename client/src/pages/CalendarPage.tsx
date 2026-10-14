import React from 'react';
import { Calendar } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-brand-400" />
            Study Calendar
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Organize problem scheduling, spaced repetition, and revision milestones.
          </p>
        </div>
        <div>
          <Badge variant="neutral" size="md">
            Module Ready
          </Badge>
        </div>
      </div>

      <EmptyState
        icon={<Calendar className="w-6 h-6 text-brand-400" />}
        title="Study Calendar Foundation"
        description="The calendar date semantics, query hooks, and dialog components are initialized. Daily problem grids and planning forms will be mounted here."
      />
    </div>
  );
};
