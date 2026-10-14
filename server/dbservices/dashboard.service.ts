import { Types } from 'mongoose';
import { Chapter } from '../models/chapter.model';
import { Topic } from '../models/topic.model';
import { Problem, ProblemDifficulty } from '../models/problem.model';
import { UserProgress } from '../models/userProgress.model';
import { StudyPlan, StudyPlanStatus } from '../models/studyPlan.model';

export interface ChapterProgressStat {
  chapterId: string;
  title: string;
  slug: string;
  order: number;
  totalProblems: number;
  completedProblems: number;
  completionPercentage: number;
}

export interface RecentlyCompletedProblem {
  problemId: string;
  title: string;
  slug: string;
  difficulty: ProblemDifficulty;
  completedAt: Date;
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
    chapterTitle?: string | undefined;
    topicTitle?: string | undefined;
  } | null;
  reason: string;
}

export interface DashboardSummaryResponse {
  totalProblems: number;
  completedProblems: number;
  remainingProblems: number;
  completionPercentage: number;
  chapterStats: ChapterProgressStat[];
  recentlyCompleted: RecentlyCompletedProblem[];
  upcomingStudyPlans: UpcomingStudyPlanItem[];
  continueLearning: ContinueLearningRecommendation;
}

export class DashboardService {
  /**
   * Retrieves high-performance dashboard summary for authenticated student
   * Combines aggregation pipelines and indexed queries to avoid loading full histories into memory
   */
  static async getSummary(
    userId: string,
    currentDate?: string
  ): Promise<DashboardSummaryResponse> {
    const userObjId = new Types.ObjectId(userId);
    const todayStr =
      currentDate && /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(currentDate)
        ? currentDate
        : new Date().toISOString().slice(0, 10);

    // Parallel execution of:
    // 1. Chapter-wise progress aggregation (database-side counts)
    // 2. Recent completed problems (indexed query, top 5)
    // 3. Upcoming study plans (indexed query, top 5)
    const [chapterAggResults, recentlyCompletedDocs, upcomingStudyPlansDocs] =
      await Promise.all([
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

        // 2. Recently completed problems (index on userId, isCompleted)
        UserProgress.find({
          userId: userObjId,
          isCompleted: true,
        })
          .sort({ completedAt: -1, updatedAt: -1 })
          .limit(5)
          .populate('problemId', 'title slug difficulty topicId')
          .lean(),

        // 3. Upcoming study plans (index on userId, scheduledDate)
        StudyPlan.find({
          userId: userObjId,
          scheduledDate: { $gte: todayStr },
        })
          .sort({ scheduledDate: 1, createdAt: 1 })
          .limit(5)
          .populate('problemId', 'title slug difficulty')
          .lean(),
      ]);

    // Format chapter statistics
    let totalProblems = 0;
    let completedProblems = 0;

    const chapterStats: ChapterProgressStat[] = chapterAggResults.map((c) => {
      const chapterTotal = c.totalProblems || 0;
      const chapterCompleted = c.completedProblems || 0;
      const percentage =
        chapterTotal > 0
          ? Math.round((chapterCompleted / chapterTotal) * 1000) / 10
          : 0;

      totalProblems += chapterTotal;
      completedProblems += chapterCompleted;

      return {
        chapterId: c._id.toString(),
        title: c.title,
        slug: c.slug,
        order: c.order,
        totalProblems: chapterTotal,
        completedProblems: chapterCompleted,
        completionPercentage: percentage,
      };
    });

    const remainingProblems = Math.max(0, totalProblems - completedProblems);
    const overallPercentage =
      totalProblems > 0
        ? Math.round((completedProblems / totalProblems) * 1000) / 10
        : 0;

    // Format recently completed problems (filter out orphan/null problems)
    const recentlyCompleted: RecentlyCompletedProblem[] = recentlyCompletedDocs
      .filter((doc) => doc.problemId != null)
      .map((doc: any) => ({
        problemId: doc.problemId._id.toString(),
        title: doc.problemId.title,
        slug: doc.problemId.slug,
        difficulty: doc.problemId.difficulty,
        completedAt: doc.completedAt || doc.updatedAt,
      }));

    // Format upcoming study plans
    const upcomingStudyPlans: UpcomingStudyPlanItem[] = upcomingStudyPlansDocs
      .filter((plan) => plan.problemId != null)
      .map((plan: any) => ({
        _id: plan._id.toString(),
        problemId: {
          _id: plan.problemId._id.toString(),
          title: plan.problemId.title,
          slug: plan.problemId.slug,
          difficulty: plan.problemId.difficulty,
        },
        scheduledDate: plan.scheduledDate,
        status: plan.status,
        notes: plan.notes,
      }));

    // Determine continue-learning recommendation
    const continueLearning = await this.resolveRecommendation({
      userObjId,
      recentlyCompletedDocs,
      upcomingStudyPlansDocs,
      chapterStats,
      totalProblems,
      completedProblems,
    });

    return {
      totalProblems,
      completedProblems,
      remainingProblems,
      completionPercentage: overallPercentage,
      chapterStats,
      recentlyCompleted,
      upcomingStudyPlans,
      continueLearning,
    };
  }

  /**
   * Resolves intelligent continue-learning recommendation based on:
   * 1. Next problem in the topic student was recently working on
   * 2. Upcoming planned study calendar problem
   * 3. First problem in first incomplete chapter / topic
   * 4. 100% completion celebration state
   */
  private static async resolveRecommendation(params: {
    userObjId: Types.ObjectId;
    recentlyCompletedDocs: any[];
    upcomingStudyPlansDocs: any[];
    chapterStats: ChapterProgressStat[];
    totalProblems: number;
    completedProblems: number;
  }): Promise<ContinueLearningRecommendation> {
    const {
      userObjId,
      recentlyCompletedDocs,
      upcomingStudyPlansDocs,
      chapterStats,
      totalProblems,
      completedProblems,
    } = params;

    // Edge case: Empty problem catalog
    if (totalProblems === 0) {
      return {
        problem: null,
        reason: 'No problems currently available.',
      };
    }

    // Edge case: 100% completed
    if (completedProblems >= totalProblems && totalProblems > 0) {
      return {
        problem: null,
        reason: 'You have completed all available DSA problems! Congratulations!',
      };
    }

    // Strategy 1: Continue topic of most recent completed problem
    if (recentlyCompletedDocs.length > 0) {
      const mostRecent = recentlyCompletedDocs[0];
      const recentProblem = mostRecent.problemId;

      if (recentProblem && recentProblem.topicId) {
        const topic = await Topic.findById(recentProblem.topicId)
          .select('_id title chapterId order')
          .lean();

        if (topic) {
          // Find all problems in this topic sorted by order
          const topicProblems = await Problem.find({ topicId: topic._id })
            .sort({ order: 1 })
            .select('_id title slug difficulty order topicId')
            .lean();

          if (topicProblems.length > 0) {
            const topicProblemIds = topicProblems.map((p) => p._id);
            const completedInTopic = await UserProgress.find({
              userId: userObjId,
              problemId: { $in: topicProblemIds },
              isCompleted: true,
            })
              .select('problemId')
              .lean();

            const completedSet = new Set(
              completedInTopic.map((c) => c.problemId.toString())
            );

            const nextUnfinishedInTopic = topicProblems.find(
              (p) => !completedSet.has(p._id.toString())
            );

            if (nextUnfinishedInTopic) {
              const chapter = await Chapter.findById(topic.chapterId)
                .select('title')
                .lean();

              return {
                problem: {
                  _id: nextUnfinishedInTopic._id.toString(),
                  title: nextUnfinishedInTopic.title,
                  slug: nextUnfinishedInTopic.slug,
                  difficulty: nextUnfinishedInTopic.difficulty,
                  topicId: topic._id.toString(),
                  topicTitle: topic.title,
                  chapterTitle: chapter?.title,
                },
                reason: `Continue with the next problem in ${topic.title}`,
              };
            }
          }
        }
      }
    }

    // Strategy 2: Upcoming planned study calendar problem
    const plannedStudyItem = upcomingStudyPlansDocs.find(
      (p) => p.status === 'planned' && p.problemId != null
    );

    if (plannedStudyItem) {
      const isAlreadyCompleted = await UserProgress.exists({
        userId: userObjId,
        problemId: plannedStudyItem.problemId._id,
        isCompleted: true,
      });

      if (!isAlreadyCompleted) {
        const problemDoc = await Problem.findById(plannedStudyItem.problemId._id)
          .populate('topicId', 'title chapterId')
          .lean();

        const topic = problemDoc?.topicId as any;
        const chapter = topic
          ? await Chapter.findById(topic.chapterId).select('title').lean()
          : null;

        return {
          problem: {
            _id: plannedStudyItem.problemId._id.toString(),
            title: plannedStudyItem.problemId.title,
            slug: plannedStudyItem.problemId.slug,
            difficulty: plannedStudyItem.problemId.difficulty,
            topicId: topic ? topic._id.toString() : '',
            topicTitle: topic?.title,
            chapterTitle: chapter?.title,
          },
          reason: `Scheduled in your study plan for ${plannedStudyItem.scheduledDate}`,
        };
      }
    }

    // Strategy 3: Find the first incomplete chapter & topic in curriculum order
    const incompleteChapterStat = chapterStats.find(
      (c) => c.completedProblems < c.totalProblems
    );

    if (incompleteChapterStat) {
      const chapterObjId = new Types.ObjectId(incompleteChapterStat.chapterId);
      const chapterTopics = await Topic.find({ chapterId: chapterObjId })
        .sort({ order: 1 })
        .lean();

      for (const topic of chapterTopics) {
        const topicProblems = await Problem.find({ topicId: topic._id })
          .sort({ order: 1 })
          .select('_id title slug difficulty order topicId')
          .lean();

        if (topicProblems.length === 0) continue;

        const topicProblemIds = topicProblems.map((p) => p._id);
        const completedInTopic = await UserProgress.find({
          userId: userObjId,
          problemId: { $in: topicProblemIds },
          isCompleted: true,
        })
          .select('problemId')
          .lean();

        const completedSet = new Set(
          completedInTopic.map((c) => c.problemId.toString())
        );

        const firstUnfinished = topicProblems.find(
          (p) => !completedSet.has(p._id.toString())
        );

        if (firstUnfinished) {
          const isBeginner =
            recentlyCompletedDocs.length === 0 && completedProblems === 0;

          return {
            problem: {
              _id: firstUnfinished._id.toString(),
              title: firstUnfinished.title,
              slug: firstUnfinished.slug,
              difficulty: firstUnfinished.difficulty,
              topicId: topic._id.toString(),
              topicTitle: topic.title,
              chapterTitle: incompleteChapterStat.title,
            },
            reason: isBeginner
              ? `Recommended starting problem for beginners in ${incompleteChapterStat.title}`
              : `Advance to ${topic.title} in ${incompleteChapterStat.title}`,
          };
        }
      }
    }

    return {
      problem: null,
      reason: 'No further problems recommended at this time.',
    };
  }
}
