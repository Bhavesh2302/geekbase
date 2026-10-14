import { z } from 'zod';

const DATE_REGEX = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

export const getDashboardSummaryQuerySchema = {
  query: z.object({
    date: z
      .string()
      .trim()
      .regex(DATE_REGEX, 'Date must follow canonical YYYY-MM-DD format')
      .optional(),
  }),
};

export type GetDashboardSummaryQuery = z.infer<
  typeof getDashboardSummaryQuerySchema.query
>;
