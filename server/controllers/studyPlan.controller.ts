import { Request, Response, NextFunction } from 'express';
import { StudyPlanService } from '../dbservices/studyPlan.service';
import { sendSuccess } from '../utils/apiResponse';
import {
  CreateStudyPlanInput,
  UpdateStudyPlanInput,
} from '../validations/studyPlan.validation';

export const getStudyPlans = async (
  req: Request<
    unknown,
    unknown,
    unknown,
    { startDate?: string; endDate?: string }
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    const plans = await StudyPlanService.getPlans(userId, {
      startDate,
      endDate,
    });

    sendSuccess(res, { plans }, 'Study plans retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const createStudyPlan = async (
  req: Request<unknown, unknown, CreateStudyPlanInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const plan = await StudyPlanService.createPlan(userId, req.body);

    sendSuccess(res, { plan }, 'Study plan scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateStudyPlan = async (
  req: Request<{ planId: string }, unknown, UpdateStudyPlanInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { planId } = req.params;

    const plan = await StudyPlanService.updatePlan(userId, planId, req.body);

    sendSuccess(res, { plan }, 'Study plan updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const deleteStudyPlan = async (
  req: Request<{ planId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { planId } = req.params;

    const result = await StudyPlanService.deletePlan(userId, planId);

    sendSuccess(res, result, 'Study plan deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};
