import { Request, Response, NextFunction } from 'express';
import { CatalogService } from '../dbservices/catalog.service';
import { sendSuccess } from '../utils/apiResponse';
import { ProblemDifficulty } from '../models/problem.model';

export const getChapters = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chapters = await CatalogService.getAllChapters();
    sendSuccess(res, { chapters }, 'Chapters retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getChapterById = async (
  req: Request<{ chapterId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chapterId } = req.params;
    const chapter = await CatalogService.getChapterById(chapterId);
    sendSuccess(res, { chapter }, 'Chapter details retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getTopics = async (
  req: Request<unknown, unknown, unknown, { chapterId?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chapterId } = req.query;
    const topics = await CatalogService.getTopics(chapterId);
    sendSuccess(res, { topics }, 'Topics retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getProblems = async (
  req: Request<
    unknown,
    unknown,
    unknown,
    {
      topicId?: string;
      difficulty?: ProblemDifficulty;
      search?: string;
      page?: string | number;
      limit?: string | number;
    }
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topicId, difficulty, search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await CatalogService.getProblems({
      topicId,
      difficulty,
      search,
      page,
      limit,
    });

    sendSuccess(res, result, 'Problems retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (
  req: Request<{ problemId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { problemId } = req.params;
    const problem = await CatalogService.getProblemById(problemId);
    sendSuccess(res, { problem }, 'Problem details retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};
