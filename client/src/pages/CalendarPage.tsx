import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  CalendarCheck2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StudyCalendar } from '../components/calendar/StudyCalendar';
import { DayStudyList } from '../components/calendar/DayStudyList';
import {
  StudyPlanDialog,
  type StudyPlanDialogMode,
} from '../components/calendar/StudyPlanDialog';
import { useStudyPlans } from '../hooks/useStudyPlans';
import { getTodayCanonical } from '../utils/date';
import type { StudyPlan } from '../types/studyPlan';

export const CalendarPage: React.FC = () => {
  // Selected date defaults to local canonical today
  const [selectedDate, setSelectedDate] = useState<string>(getTodayCanonical());

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<StudyPlanDialogMode>('create');
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [dialogDate, setDialogDate] = useState<string>(selectedDate);

  // Overall plans query for day list and summary counts
  const { data: allPlans = [] } = useStudyPlans();

  // Summary statistics for calendar overview
  const stats = useMemo(() => {
    const total = allPlans.length;
    const completed = allPlans.filter((p) => p.status === 'completed').length;
    const planned = allPlans.filter((p) => p.status === 'planned').length;
    const skipped = allPlans.filter((p) => p.status === 'skipped').length;
    return { total, completed, planned, skipped };
  }, [allPlans]);

  // Handler: Click date on calendar to add plan
  const handleDateClickAdd = (date: string) => {
    setSelectedDate(date);
    setDialogDate(date);
    setActivePlan(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  // Handler: Click an event on calendar to view details
  const handleEventClick = (plan: StudyPlan) => {
    setSelectedDate(plan.scheduledDate);
    setActivePlan(plan);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  // Handler: Open create dialog from header or day list
  const handleOpenCreate = (targetDate?: string) => {
    const dateToUse = targetDate || selectedDate;
    setDialogDate(dateToUse);
    setActivePlan(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  // Handler: Switch from view to edit
  const handleSwitchToEdit = (plan: StudyPlan) => {
    setActivePlan(plan);
    setDialogMode('edit');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarCheck2 className="w-6 h-6 text-brand-400" />
            DSA Study Calendar
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Organize problem scheduling, spaced repetition, and revision milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => handleOpenCreate(selectedDate)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Schedule Session
          </Button>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Scheduled</p>
            <p className="text-xl font-bold text-slate-100 mt-0.5">{stats.total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Planned</p>
            <p className="text-xl font-bold text-brand-300 mt-0.5">{stats.planned}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Completed</p>
            <p className="text-xl font-bold text-emerald-300 mt-0.5">{stats.completed}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Revision Ready</p>
            <p className="text-xl font-bold text-amber-300 mt-0.5">
              {stats.skipped > 0 ? `${stats.skipped} Skipped` : 'Up to Date'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Responsive Main Grid: Calendar on left, Selected Day Schedule on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* FullCalendar Interactive Grid */}
        <div className="lg:col-span-8 space-y-3">
          <StudyCalendar
            selectedDate={selectedDate}
            onDateSelect={(date) => setSelectedDate(date)}
            onDateClickAdd={handleDateClickAdd}
            onEventClick={handleEventClick}
          />

          <div className="flex flex-wrap items-center gap-4 px-3 py-2 text-xs text-slate-400 bg-slate-900/30 rounded-lg border border-slate-800/60">
            <span className="font-semibold text-slate-300">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
              <span>Planned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span>Skipped</span>
            </div>
            <span className="text-slate-500 ml-auto hidden sm:inline">
              Click any date to schedule a problem
            </span>
          </div>
        </div>

        {/* Selected Day Problem List */}
        <div className="lg:col-span-4 h-full">
          <DayStudyList
            selectedDate={selectedDate}
            plans={allPlans}
            onAddPlan={(date) => handleOpenCreate(date)}
            onSelectPlan={(plan) => handleEventClick(plan)}
            onEditPlan={(plan) => {
              setActivePlan(plan);
              setDialogMode('edit');
              setIsDialogOpen(true);
            }}
          />
        </div>
      </div>

      {/* Modal Dialog for Create / View / Edit */}
      <StudyPlanDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setActivePlan(null);
        }}
        mode={dialogMode}
        date={dialogDate}
        plan={activePlan}
        onPlanSaved={() => {
          // Handled via React Query cache invalidation
        }}
        onPlanDeleted={() => {
          setActivePlan(null);
        }}
        onSwitchToEdit={handleSwitchToEdit}
      />
    </div>
  );
};
