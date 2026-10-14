import { Types } from 'mongoose';
import { UserProgress } from '../models/userProgress.model';
import { Problem, ProblemDifficulty } from '../models/problem.model';
import { Chapter } from '../models/chapter.model';
import { AppError } from '../utils/AppError';

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

export interface ProgressSummaryResponse {
  totalProblems: number;
  completedProblems: number;
  remainingProblems: number;
  completionPercentage: number;
  difficultyStats: Record<ProblemDifficulty, DifficultyProgressStat>;
  chapterStats: ChapterProgressStat[];
}

export class ProgressService {
  /**
   * Atomic idempotent upsert for problem completion status
   */
  static async updateProgress(
    userId: string,
    problemId: string,
    isCompleted: boolean
  ) {
    const problemObjId = new Types.ObjectId(problemId);
    const userObjId = new Types.ObjectId(userId);

    // 1. Verify problem exists
    const problemExists = await Problem.exists({ _id: problemObjId });
    if (!problemExists) {
      throw AppError.notFound(`Problem with ID '${problemId}' not found`);
    }

    // 2. Atomic upsert using unique compound index (userId, problemId)
    const progress = await UserProgress.findOneAndUpdate(
      { userId: userObjId, problemId: problemObjId },
      {
        $set: {
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )
      .select('problemId isCompleted completedAt updatedAt')
      .lean();

    return progress;
  }

  /**
   * Retrieves all progress items and completed IDs for the authenticated student
   */
  static async getUserProgress(userId: string) {
    const userObjId = new Types.ObjectId(userId);

    const progress = await UserProgress.find({ userId: userObjId })
      .select('problemId isCompleted completedAt updatedAt')
      .lean();

    const completedProblemIds = progress
      .filter((p) => p.isCompleted)
      .map((p) => p.problemId.toString());

    return {
      progress,
      completedProblemIds,
      totalCompleted: completedProblemIds.length,
    };
  }

  /**
   * Aggregates complete progress summary with difficulty and chapter breakdown
   * Uses optimized aggregation pipelines to avoid document-by-document memory fetching
   */
  static async getProgressSummary(userId: string): Promise<ProgressSummaryResponse> {
    const userObjId = new Types.ObjectId(userId);

    // Parallel execution of Chapter-wise and Difficulty-wise aggregation pipelines
    const [chapterAggResults, difficultyAggResults] = await Promise.all([
      // 1. Chapter-wise breakdown pipeline
      Chapter.aggregate([
        { $match: { isActive: true } },
        { $sort: { order: 1 } },
        {
          $lookup: {
            from: 'topics',
            localField: '_id',
            foreignField: 'chapterId',
            as: 'topics',
          },
        },
        {
          $lookup: {
            from: 'problems',
            localField: 'topics._id',
            foreignField: 'topicId',
            as: 'problems',
          },
        },
        {
          $lookup: {
            from: 'user_progress',
            let: { problemIds: '$problems._id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', userObjId] },
                      { $eq: ['$isCompleted', true] },
                      { $in: ['$problemId', '$$problemIds'] },
                    ],
                  },
                },
              },
            ],
            as: 'userProgress',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            slug: 1,
            order: 1,
            totalProblems: { $size: '$problems' },
            completedProblems: { $size: '$userProgress' },
          },
        },
      ]),

      // 2. Difficulty breakdown pipeline
      Problem.aggregate([
        {
          $lookup: {
            from: 'user_progress',
            let: { pId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$userId', userObjId] },
                      { $eq: ['$problemId', '$$pId'] },
                      { $eq: ['$isCompleted', true] },
                    ],
                  },
                },
              },
            ],
            as: 'progress',
          },
        },
        {
          $group: {
            _id: '$difficulty',
            total: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $gt: [{ $size: '$progress' }, 0] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    // Format chapter statistics
    const chapterStats: ChapterProgressStat[] = chapterAggResults.map((c) => {
      const total = c.totalProblems || 0;
      const completed = c.completedProblems || 0;
      const percentage = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;

      return {
        chapterId: c._id.toString(),
        title: c.title,
        slug: c.slug,
        order: c.order,
        totalProblems: total,
        completedProblems: completed,
        completionPercentage: percentage,
      };
    });

    // Format difficulty statistics default map
    const difficultyMap: Record<ProblemDifficulty, DifficultyProgressStat> = {
      Easy: { total: 0, completed: 0, percentage: 0 },
      Medium: { total: 0, completed: 0, percentage: 0 },
      Hard: { total: 0, completed: 0, percentage: 0 },
    };

    let totalProblems = 0;
    let completedProblems = 0;

    for (const diffItem of difficultyAggResults) {
      const diffKey = diffItem._id as ProblemDifficulty;
      if (difficultyMap[diffKey]) {
        const total = diffItem.total || 0;
        const completed = diffItem.completed || 0;
        const percentage = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;

        difficultyMap[diffKey] = {
          total,
          completed,
          percentage,
        };

        totalProblems += total;
        completedProblems += completed;
      }
    }

    const remainingProblems = Math.max(0, totalProblems - completedProblems);
    const overallPercentage =
      totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 1000) / 10 : 0;

    return {
      totalProblems,
      completedProblems,
      remainingProblems,
      completionPercentage: overallPercentage,
      difficultyStats: difficultyMap,
      chapterStats,
    };
  }
}
