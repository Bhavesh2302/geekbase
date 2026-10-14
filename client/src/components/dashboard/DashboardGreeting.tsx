import React from 'react';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getTimeOfDayGreeting, formatDate } from '../../lib/formatters';

interface DashboardGreetingProps {
  completedProblems: number;
  totalProblems: number;
}

export const DashboardGreeting: React.FC<DashboardGreetingProps> = ({
  completedProblems,
  totalProblems,
}) => {
  const { user } = useAuthStore();
  const greeting = getTimeOfDayGreeting();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';
  const todayFormatted = formatDate(new Date().toISOString().slice(0, 10));

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            DSA Learning Trajectory
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          {greeting}, {firstName}!
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {completedProblems === 0
            ? 'Start your algorithm mastery journey today by tackling your first problem.'
            : completedProblems >= totalProblems
              ? 'Incredible work! You have solved every available problem in the curriculum.'
              : `You've conquered ${completedProblems} of ${totalProblems} problems. Keep up the consistency!`}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-medium">
        <CalendarIcon className="w-4 h-4 text-brand-400 shrink-0" />
        <span>{todayFormatted}</span>
      </div>
    </div>
  );
};
