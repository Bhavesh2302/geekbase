import { Request, Response, NextFunction } from 'express';
import { StudyPlanService } from '../dbservices/studyPlan.service';
import { sendSuccess } from '../utils/apiResponse';
import {
  CreateStudyPlanInput,
  UpdateStudyPlanInput,
} from '../validations/studyPlan.validation';

/**
 * GET /api/v1/study-plans?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Retrieves student's scheduled calendar items
 */
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

/**
 * POST /api/v1/study-plans
 * Schedules a new DSA study session on the calendar
 */
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

/**
 * PATCH /api/v1/study-plans/:planId
 * Updates date, status, or notes on a scheduled plan with ownership enforcement
 */
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

/**
 * DELETE /api/v1/study-plans/:planId
 * Removes a scheduled plan from the user's study calendar
 */
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
