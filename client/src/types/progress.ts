import type { ProblemDifficulty } from './catalog';

export interface UserProgressItem {
  _id: string;
  problemId: string;
  isCompleted: boolean;
  completedAt: string | null;
  updatedAt: string;
}

export interface ChapterProgressStat {
  chapterId: string;
  title: string;
  slug: string;
  order: number;
  totalProblems: number;
  completedProblems: number;
  completionPercentage: number;
}

export interface DifficultyProgressStat {
  total: number;
  completed: number;
  percentage: number;
}

export interface ProgressSummary {
  totalProblems: number;
  completedProblems: number;
  remainingProblems: number;
  completionPercentage: number;
  difficultyStats: Record<ProblemDifficulty, DifficultyProgressStat>;
  chapterStats: ChapterProgressStat[];
}

export interface UserProgressResponseData {
  progress: UserProgressItem[];
  completedProblemIds: string[];
  totalCompleted: number;
}
