import React, { useState, useRef, useMemo, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type {
  DatesSetArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import { CalendarEvent } from './CalendarEvent';
import { useStudyPlans } from '../../hooks/useStudyPlans';
import { extractCanonicalDate, getTodayCanonical } from '../../utils/date';
import type { StudyPlan } from '../../types/studyPlan';

export interface StudyCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onEventClick: (plan: StudyPlan) => void;
  onDateClickAdd: (date: string) => void;
  plans?: StudyPlan[];
}

export const StudyCalendar: React.FC<StudyCalendarProps> = ({
  selectedDate,
  onDateSelect,
  onEventClick,
  onDateClickAdd,
  plans: externalPlans,
}) => {
  const calendarRef = useRef<FullCalendar | null>(null);

  // Range state for visible calendar dates
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  // Query study plans for visible calendar range
  const {
    data: fetchedPlans,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudyPlans(dateRange);

  // Transform study plans into FullCalendar event objects
  const calendarEvents = useMemo(() => {
    const activePlans = externalPlans ?? fetchedPlans ?? [];
    return activePlans.map((plan) => {
      const problemTitle =
        typeof plan.problemId === 'object' && plan.problemId !== null
          ? plan.problemId.title
          : 'DSA Problem';

      return {
        id: plan._id,
        title: problemTitle,
        start: plan.scheduledDate,
        allDay: true,
        extendedProps: {
          plan,
        },
      };
    });
  }, [externalPlans, fetchedPlans]);

  // Handle visible date range changes (Month navigation: prev, next, today)
  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    const startCanonical = extractCanonicalDate(arg.startStr);
    // FullCalendar endStr is exclusive (day after visible range).
    // Subtract 1 day or extract canonical to prevent out-of-range queries
    const endCanonical = extractCanonicalDate(arg.endStr);

    setDateRange({
      startDate: startCanonical,
      endDate: endCanonical,
    });
  }, []);

  // Handle date click (selects date and opens add dialog)
  const handleDateClick = useCallback(
    (arg: DateClickArg) => {
      const canonical = extractCanonicalDate(arg.dateStr);
      onDateSelect(canonical);
      onDateClickAdd(canonical);
    },
    [onDateSelect, onDateClickAdd]
  );

  // Handle existing event click
  const handleEventClick = useCallback(
    (arg: EventClickArg) => {
      arg.jsEvent.preventDefault();
      arg.jsEvent.stopPropagation();
      const plan = arg.event.extendedProps?.plan as StudyPlan;
      if (plan) {
        onDateSelect(plan.scheduledDate);
        onEventClick(plan);
      }
    },
    [onDateSelect, onEventClick]
  );

  // Custom event renderer using CalendarEvent component
  const renderEventContent = useCallback((arg: EventContentArg) => {
    const plan = arg.event.extendedProps?.plan as StudyPlan;
    if (!plan) return <span>{arg.event.title}</span>;

    return <CalendarEvent plan={plan} />;
  }, []);

  return (
    <div className="relative bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm study-calendar-wrapper">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs text-slate-200">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading scheduled sessions...</span>
          </div>
        </div>
      )}

      {/* Error notification banner */}
      {isError && (
        <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-300">
          <span>Failed to load study calendar: {error?.message}</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={selectedDate || getTodayCanonical()}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        buttonText={{
          today: 'Today',
        }}
        events={calendarEvents}
        eventContent={renderEventContent}
        datesSet={handleDatesSet}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={false}
        selectable={true}
        dayMaxEvents={3}
        moreLinkContent={(args) => `+${args.num} more`}
        height="auto"
        dayCellClassNames={(arg) => {
          const canonical = extractCanonicalDate(arg.date.toISOString());
          const isSelected = canonical === selectedDate;
          return isSelected ? 'study-calendar-selected-day' : '';
        }}
      />
    </div>
  );
};
