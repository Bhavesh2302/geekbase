import { z } from 'zod';
import { objectIdSchema } from './catalog.validation';

// PUT /api/v1/progress/:problemId
export const updateProgressSchema = {
  params: z.object({
    problemId: objectIdSchema,
  }),
  body: z.object({
    isCompleted: z.boolean({
      message: 'isCompleted must be a valid boolean',
    }),
  }),
};

export type UpdateProgressInput = z.infer<typeof updateProgressSchema.body>;
