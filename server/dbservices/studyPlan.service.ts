import { Types } from 'mongoose';
import { StudyPlan, StudyPlanStatus } from '../models/studyPlan.model';
import { Problem } from '../models/problem.model';
import { AppError } from '../utils/AppError';

export interface CreatePlanDTO {
  problemId: string;
  scheduledDate: string;
  status?: StudyPlanStatus | undefined;
  notes?: string | undefined;
}

export interface UpdatePlanDTO {
  scheduledDate?: string | undefined;
  status?: StudyPlanStatus | undefined;
  notes?: string | undefined;
}

export interface GetPlansFilter {
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export class StudyPlanService {
  static async createPlan(userId: string, input: CreatePlanDTO) {
    const { problemId, scheduledDate, status = 'planned', notes = '' } = input;
    const userObjId = new Types.ObjectId(userId);
    const problemObjId = new Types.ObjectId(problemId);

    const problemExists = await Problem.exists({ _id: problemObjId });
    if (!problemExists) {
      throw AppError.notFound(`Problem with ID '${problemId}' not found`);
    }

    const newPlan = await StudyPlan.create({
      userId: userObjId,
      problemId: problemObjId,
      scheduledDate,
      status,
      notes,
    });

    return StudyPlan.findById(newPlan._id)
      .populate('problemId', 'title slug difficulty')
      .select('-__v')
      .lean();
  }

  static async getPlans(userId: string, filter: GetPlansFilter) {
    const { startDate, endDate } = filter;
    const userObjId = new Types.ObjectId(userId);

    const query: Record<string, unknown> = {
      userId: userObjId,
    };

    if (startDate && endDate) {
      query.scheduledDate = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.scheduledDate = { $gte: startDate };
    } else if (endDate) {
      query.scheduledDate = { $lte: endDate };
    }

    return StudyPlan.find(query)
      .sort({ scheduledDate: 1, createdAt: 1 })
      .populate('problemId', 'title slug difficulty')
      .select('-__v')
      .lean();
  }

  static async updatePlan(userId: string, planId: string, updates: UpdatePlanDTO) {
    const planObjId = new Types.ObjectId(planId);
    const userObjId = new Types.ObjectId(userId);

    const plan = await StudyPlan.findOne({
      _id: planObjId,
      userId: userObjId,
    });

    if (!plan) {
      throw AppError.notFound(`Study plan with ID '${planId}' not found`);
    }

    if (updates.scheduledDate !== undefined) {
      plan.scheduledDate = updates.scheduledDate;
    }
    if (updates.status !== undefined) {
      plan.status = updates.status;
    }
    if (updates.notes !== undefined) {
      plan.notes = updates.notes;
    }

    await plan.save();

    return StudyPlan.findById(plan._id)
      .populate('problemId', 'title slug difficulty')
      .select('-__v')
      .lean();
  }

  static async deletePlan(userId: string, planId: string) {
    const planObjId = new Types.ObjectId(planId);
    const userObjId = new Types.ObjectId(userId);

    const plan = await StudyPlan.findOneAndDelete({
      _id: planObjId,
      userId: userObjId,
    });

    if (!plan) {
      throw AppError.notFound(`Study plan with ID '${planId}' not found`);
    }

    return {
      deletedId: planId,
      message: 'Study plan deleted successfully',
    };
  }
}
