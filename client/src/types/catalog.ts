export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemResources {
  youtubeUrl: string | null;
  practiceUrl: string | null;
  articleUrl: string | null;
}

export interface Problem {
  _id: string;
  topicId: string;
  title: string;
  slug: string;
  description: string;
  difficulty: ProblemDifficulty;
  order: number;
  resources: ProblemResources;
  createdAt?: string;
  updatedAt?: string;
}

export interface Topic {
  _id: string;
  chapterId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  problems?: Problem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Chapter {
  _id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  topics?: Topic[];
  createdAt?: string;
  updatedAt?: string;
}
