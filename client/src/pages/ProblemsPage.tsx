import React from 'react';
import { Code2 } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

export const ProblemsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-brand-400" />
            DSA Sheet
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Browse structured chapters, topics, and problem sets.
          </p>
        </div>
        <div>
          <Badge variant="neutral" size="md">
            Module Ready
          </Badge>
        </div>
      </div>

      <EmptyState
        icon={<Code2 className="w-6 h-6 text-brand-400" />}
        title="DSA Problem Sheet Foundation"
        description="The catalog data layer and table components are initialized. Specific problem listings, filters, and difficulty tags will be rendered here."
      />
    </div>
  );
};
