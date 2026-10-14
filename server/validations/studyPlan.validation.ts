import { z } from 'zod';
import { objectIdSchema } from './catalog.validation';

const DATE_REGEX = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

export const canonicalDateSchema = z
  .string({ message: 'Date is required' })
  .trim()
  .regex(DATE_REGEX, 'Date must follow canonical YYYY-MM-DD format');

export const studyPlanStatusEnum = z.enum([
  'planned',
  'completed',
  'skipped',
] as const);

// GET /api/v1/study-plans?startDate=&endDate=
export const getStudyPlansQuerySchema = {
  query: z
    .object({
      startDate: z
        .string()
        .trim()
        .regex(DATE_REGEX, 'startDate must follow YYYY-MM-DD format')
        .optional(),
      endDate: z
        .string()
        .trim()
        .regex(DATE_REGEX, 'endDate must follow YYYY-MM-DD format')
        .optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return data.startDate <= data.endDate;
        }
        return true;
      },
      {
        message: 'startDate cannot be after endDate',
        path: ['startDate'],
      }
    ),
};

// POST /api/v1/study-plans
export const createStudyPlanSchema = {
  body: z.object({
    problemId: objectIdSchema,
    scheduledDate: canonicalDateSchema,
    status: studyPlanStatusEnum.default('planned'),
    notes: z
      .string()
      .trim()
      .max(1000, 'Notes cannot exceed 1000 characters')
      .default(''),
  }),
};

// PATCH /api/v1/study-plans/:planId
export const updateStudyPlanSchema = {
  params: z.object({
    planId: objectIdSchema,
  }),
  body: z
    .object({
      scheduledDate: z
        .string()
        .trim()
        .regex(DATE_REGEX, 'scheduledDate must follow YYYY-MM-DD format')
        .optional(),
      status: studyPlanStatusEnum.optional(),
      notes: z
        .string()
        .trim()
        .max(1000, 'Notes cannot exceed 1000 characters')
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      { message: 'At least one field (scheduledDate, status, or notes) must be provided to update' }
    ),
};

// DELETE /api/v1/study-plans/:planId
export const planIdParamsSchema = {
  params: z.object({
    planId: objectIdSchema,
  }),
};

export type CreateStudyPlanInput = z.infer<typeof createStudyPlanSchema.body>;
export type UpdateStudyPlanInput = z.infer<typeof updateStudyPlanSchema.body>;
