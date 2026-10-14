import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../dbservices/dashboard.service';
import { sendSuccess } from '../utils/apiResponse';

/**
 * GET /api/v1/dashboard/summary
 * Retrieves overall student dashboard metrics, upcoming plans, and continue-learning recommendation
 */
export const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const dateQuery = typeof req.query.date === 'string' ? req.query.date : undefined;

    const summary = await DashboardService.getSummary(userId, dateQuery);

    sendSuccess(
      res,
      summary,
      'Dashboard summary retrieved successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};
