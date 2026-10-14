import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { ErrorState } from '../components/ui/ErrorState';
import {
  DashboardGreeting,
  OverallProgressBanner,
  ContinueLearningCard,
  UpcomingSessionsCard,
  RecentlyCompletedCard,
  ChapterProgressGrid,
  DashboardSkeleton,
} from '../components/dashboard';

export const DashboardPage: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <ErrorState
          title="Unable to load dashboard"
          message={
            error?.message ||
            'Failed to connect to the learning analytics engine. Please check your network and try again.'
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Personalized Greeting & Time Badge */}
      <DashboardGreeting
        completedProblems={data.completedProblems}
        totalProblems={data.totalProblems}
      />

      {/* 2. Primary Hero Action: Continue Learning Recommendation */}
      <ContinueLearningCard recommendation={data.continueLearning} />

      {/* 3. Overall Progress & High-Level Statistics Banner */}
      <OverallProgressBanner
        totalProblems={data.totalProblems}
        completedProblems={data.completedProblems}
        remainingProblems={data.remainingProblems}
        completionPercentage={data.completionPercentage}
      />

      {/* 4. Two-Column Activity & Planner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <UpcomingSessionsCard sessions={data.upcomingStudyPlans} />
        <RecentlyCompletedCard completedItems={data.recentlyCompleted} />
      </div>

      {/* 5. Chapter-Wise Progress Grid */}
      <ChapterProgressGrid chapterStats={data.chapterStats} />
    </div>
  );
};

export default DashboardPage;
