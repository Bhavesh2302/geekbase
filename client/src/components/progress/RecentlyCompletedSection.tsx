import React from 'react';
import { CheckCircle2, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { DifficultyBadge } from '../ui/Badge';
import type { RecentlyCompletedItem } from '../../types/dashboard';

export interface RecentlyCompletedSectionProps {
  recentlyCompleted: RecentlyCompletedItem[];
}

export const RecentlyCompletedSection: React.FC<RecentlyCompletedSectionProps> = ({
  recentlyCompleted,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <CardTitle>Recently Completed Problems</CardTitle>
        </div>
        <span className="text-xs text-slate-400">
          {recentlyCompleted.length} {recentlyCompleted.length === 1 ? 'record' : 'records'}
        </span>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {recentlyCompleted.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">
                No completed problems yet
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs mx-auto">
                Mark problems as completed in the DSA Sheet to track your recent accomplishment milestones here.
              </p>
            </div>
            <Link to="/problems" className="inline-block pt-1">
              <span className="text-xs text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-4">
                Explore Problems
              </span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {recentlyCompleted.map((item) => (
              <div
                key={item.problemId}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-100 group-hover:text-brand-300 transition-colors truncate">
                      {item.title}
                    </span>
                    <DifficultyBadge difficulty={item.difficulty} size="sm" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>Completed on {formatDate(item.completedAt)}</span>
                  </div>
                </div>

                <Link
                  to="/problems"
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors shrink-0"
                  title="View problem in DSA Sheet"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
