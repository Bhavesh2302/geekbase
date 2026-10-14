import type { ProblemDifficulty } from './catalog';

export type StudyPlanStatus = 'planned' | 'completed' | 'skipped';

export interface PopulatedStudyPlanProblem {
  _id: string;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
}

export interface StudyPlan {
  _id: string;
  userId: string;
  problemId: PopulatedStudyPlanProblem | string;
  scheduledDate: string; // YYYY-MM-DD canonical
  status: StudyPlanStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudyPlanDto {
  problemId: string;
  scheduledDate: string;
  status?: StudyPlanStatus;
  notes?: string;
}

export interface UpdateStudyPlanDto {
  scheduledDate?: string;
  status?: StudyPlanStatus;
  notes?: string;
}
