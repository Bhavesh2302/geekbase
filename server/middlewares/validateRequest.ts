import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export interface RequestValidationSchema {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

export const validateRequest = (schema: RequestValidationSchema) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as typeof req.query;
      }

      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as typeof req.params;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
