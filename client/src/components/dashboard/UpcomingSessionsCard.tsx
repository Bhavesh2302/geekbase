import React from 'react';
import { Calendar, ArrowUpRight, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { DifficultyBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/formatters';
import type { UpcomingStudyPlanItem } from '../../types/dashboard';

interface UpcomingSessionsCardProps {
  sessions: UpcomingStudyPlanItem[];
}

export const UpcomingSessionsCard: React.FC<UpcomingSessionsCardProps> = ({
  sessions,
}) => {
  return (
    <Card className="border-slate-800 bg-slate-900/80 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-brand-500/10 text-brand-400">
              <Calendar className="w-4 h-4" />
            </span>
            <CardTitle className="text-base">Upcoming Study Plans</CardTitle>
          </div>

          <Link
            to="/calendar"
            className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Calendar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        {sessions.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                No upcoming sessions
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                Schedule problems on your calendar to stay disciplined and pace your interview preparation.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/calendar">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Schedule in Calendar
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 -my-2">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-200 text-sm truncate">
                      {session.problemId.title}
                    </span>
                    <DifficultyBadge
                      difficulty={session.problemId.difficulty}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-slate-300">
                      {formatDate(session.scheduledDate)}
                    </span>
                    {session.notes && (
                      <span className="truncate max-w-[180px] text-slate-500">
                        • {session.notes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={session.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
