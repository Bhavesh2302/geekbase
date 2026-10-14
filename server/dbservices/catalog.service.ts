import { Types } from 'mongoose';
import { Chapter } from '../models/chapter.model';
import { Topic } from '../models/topic.model';
import { Problem, ProblemDifficulty } from '../models/problem.model';
import { AppError } from '../utils/AppError';

export interface GetProblemsFilter {
  topicId?: string | undefined;
  difficulty?: ProblemDifficulty | undefined;
  search?: string | undefined;
  page: number;
  limit: number;
}

const escapeRegex = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export class CatalogService {
  /**
   * Retrieves all active chapters ordered by sequence with topic & problem counts
   * Uses single aggregation pipeline to eliminate N+1 queries.
   */
  static async getAllChapters() {
    return Chapter.aggregate([
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
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          description: 1,
          order: 1,
          isActive: 1,
          topicCount: { $size: '$topics' },
          problemCount: { $size: '$problems' },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }

  /**
   * Retrieves single chapter by ID with its ordered topics
   */
  static async getChapterById(
    chapterId: string
  ): Promise<Record<string, unknown>> {
    const chapter = await Chapter.findById(chapterId).lean();
    if (!chapter) {
      throw AppError.notFound(`Chapter with ID '${chapterId}' not found`);
    }

    const topics = await Topic.find({ chapterId })
      .sort({ order: 1 })
      .select('-__v')
      .lean();

    return {
      ...chapter,
      topics,
    };
  }

  /**
   * Retrieves topics optionally filtered by chapterId with problem counts
   */
  static async getTopics(chapterId?: string) {
    if (chapterId) {
      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        throw AppError.notFound(`Chapter with ID '${chapterId}' not found`);
      }
    }

    const matchStage: Record<string, unknown> = {};
    if (chapterId) {
      matchStage.chapterId = new Types.ObjectId(chapterId);
    }

    return Topic.aggregate([
      { $match: matchStage },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: 'problems',
          localField: '_id',
          foreignField: 'topicId',
          as: 'problems',
        },
      },
      {
        $project: {
          _id: 1,
          chapterId: 1,
          title: 1,
          slug: 1,
          description: 1,
          order: 1,
          problemCount: { $size: '$problems' },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }

  /**
   * Retrieves paginated problems with optional topic, difficulty, and search filters
   */
  static async getProblems(filter: GetProblemsFilter) {
    const { topicId, difficulty, search, page, limit } = filter;

    const query: Record<string, unknown> = {};

    if (topicId) {
      const topic = await Topic.findById(topicId);
      if (!topic) {
        throw AppError.notFound(`Topic with ID '${topicId}' not found`);
      }
      query.topicId = new Types.ObjectId(topicId);
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search && search.trim().length > 0) {
      const escaped = escapeRegex(search.trim());
      query.title = { $regex: escaped, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .sort({ order: 1, createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Problem.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      problems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Retrieves single problem by ID with populated topic and chapter context
   */
  static async getProblemById(problemId: string) {
    const problem = await Problem.findById(problemId)
      .populate({
        path: 'topicId',
        select: 'title slug chapterId',
        populate: {
          path: 'chapterId',
          select: 'title slug',
        },
      })
      .select('-__v')
      .lean();

    if (!problem) {
      throw AppError.notFound(`Problem with ID '${problemId}' not found`);
    }

    return problem;
  }
}
