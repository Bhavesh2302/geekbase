import { Request, Response, NextFunction } from 'express';
import { ProgressService } from '../dbservices/progress.service';
import { sendSuccess } from '../utils/apiResponse';
import { UpdateProgressInput } from '../validations/progress.validation';

/**
 * PUT /api/v1/progress/:problemId
 * Atomically marks problem complete or incomplete
 */
export const updateProgress = async (
  req: Request<{ problemId: string }, unknown, UpdateProgressInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id; // Authenticated user ID (never from client body)
    const { problemId } = req.params;
    const { isCompleted } = req.body;

    const progress = await ProgressService.updateProgress(
      userId,
      problemId,
      isCompleted
    );

    sendSuccess(
      res,
      { progress },
      isCompleted
        ? 'Problem marked as completed'
        : 'Problem marked as incomplete',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/progress
 * Retrieves authenticated student's saved problem completion records
 */
export const getUserProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data = await ProgressService.getUserProgress(userId);

    sendSuccess(res, data, 'Saved progress retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/progress/summary
 * Retrieves overall, difficulty-wise, and chapter-wise progress analytics
 */
export const getProgressSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const summary = await ProgressService.getProgressSummary(userId);

    sendSuccess(res, summary, 'Learning progress summary retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};
