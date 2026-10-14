import React from 'react';
import { CheckCircle2, ArrowUpRight, Code2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { DifficultyBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatRelativeTime } from '../../lib/formatters';
import type { RecentlyCompletedItem } from '../../types/dashboard';

interface RecentlyCompletedCardProps {
  completedItems: RecentlyCompletedItem[];
}

export const RecentlyCompletedCard: React.FC<RecentlyCompletedCardProps> = ({
  completedItems,
}) => {
  return (
    <Card className="border-slate-800 bg-slate-900/80 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </div>

          <Link
            to="/progress"
            className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        {completedItems.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                No completed problems yet
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                Your solved problems and completion timestamps will appear here once you start practicing.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/problems">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Start Practicing
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 -my-2">
            {completedItems.map((item) => (
              <div
                key={item.problemId}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-medium text-slate-200 text-sm truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      Completed {formatRelativeTime(item.completedAt)}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <DifficultyBadge difficulty={item.difficulty} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
