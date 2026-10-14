import type { ProblemDifficulty } from './catalog';
import type { ChapterProgressStat } from './progress';
import type { StudyPlanStatus } from './studyPlan';

export interface RecentlyCompletedItem {
  problemId: string;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
  completedAt: string;
}

export interface UpcomingStudyPlanItem {
  _id: string;
  problemId: {
    _id: string;
    title: string;
    slug: string;
    difficulty: ProblemDifficulty;
  };
  scheduledDate: string;
  status: StudyPlanStatus;
  notes: string;
}

export interface ContinueLearningRecommendation {
  problem: {
    _id: string;
    title: string;
    slug: string;
    difficulty: ProblemDifficulty;
    topicId: string;
    chapterTitle?: string;
    topicTitle?: string;
  } | null;
  reason: string;
}

export interface DashboardSummary {
  totalProblems: number;
  completedProblems: number;
  remainingProblems: number;
  completionPercentage: number;
  chapterStats: ChapterProgressStat[];
  recentlyCompleted: RecentlyCompletedItem[];
  upcomingStudyPlans: UpcomingStudyPlanItem[];
  continueLearning: ContinueLearningRecommendation;
}
