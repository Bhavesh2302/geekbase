import { z } from 'zod';
import { Types } from 'mongoose';

// Helper validator for MongoDB ObjectId
export const objectIdSchema = z
  .string({ message: 'ID is required' })
  .trim()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId format',
  });

// GET /api/v1/chapters/:chapterId
export const getChapterByIdSchema = {
  params: z.object({
    chapterId: objectIdSchema,
  }),
};

// GET /api/v1/topics?chapterId=
export const getTopicsQuerySchema = {
  query: z.object({
    chapterId: z
      .string()
      .trim()
      .refine((val) => !val || Types.ObjectId.isValid(val), {
        message: 'Invalid chapterId format',
      })
      .optional(),
  }),
};

// GET /api/v1/problems?topicId=&difficulty=&search=&page=&limit=
export const getProblemsQuerySchema = {
  query: z.object({
    topicId: z
      .string()
      .trim()
      .refine((val) => !val || Types.ObjectId.isValid(val), {
        message: 'Invalid topicId format',
      })
      .optional(),
    difficulty: z
      .enum(['Easy', 'Medium', 'Hard'] as const)
      .optional(),
    search: z
      .string()
      .trim()
      .max(100, 'Search query cannot exceed 100 characters')
      .optional(),
    page: z.coerce
      .number()
      .int('Page must be an integer')
      .positive('Page must be greater than 0')
      .default(1),
    limit: z.coerce
      .number()
      .int('Limit must be an integer')
      .positive('Limit must be greater than 0')
      .max(1000, 'Limit cannot exceed 1000 items per page')
      .default(20),
  }),
};

// GET /api/v1/problems/:problemId
export const getProblemByIdSchema = {
  params: z.object({
    problemId: objectIdSchema,
  }),
};
