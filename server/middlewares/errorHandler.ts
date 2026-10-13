import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env';

interface MongooseErrorLike extends Error {
  name: string;
  code?: number;
  path?: string;
  value?: unknown;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { path?: string; message: string }>;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errorDetails: unknown = undefined;
  let isOperational = false;
  let stack: string | undefined = undefined;

  if (err instanceof Error) {
    stack = err.stack;
  }

  // 1. Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.details;
    isOperational = err.isOperational;
  }
  // 2. Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    isOperational = true;
    errorDetails = err.issues.map((issue) => ({
      field: issue.path.join('.') || 'body',
      message: issue.message,
    }));
  }
  // 3. Mongoose CastError (invalid ObjectId, etc.)
  else if ((err as MongooseErrorLike)?.name === 'CastError') {
    const castErr = err as MongooseErrorLike;
    statusCode = 400;
    message = `Invalid format for resource parameter '${castErr.path}'`;
    isOperational = true;
  }
  // 4. Mongoose ValidationError
  else if ((err as MongooseErrorLike)?.name === 'ValidationError') {
    const valErr = err as MongooseErrorLike;
    statusCode = 400;
    message = 'Validation failed';
    isOperational = true;
    if (valErr.errors) {
      errorDetails = Object.values(valErr.errors).map((e) => ({
        field: e.path || 'unknown',
        message: e.message,
      }));
    }
  }
  // 5. MongoDB Duplicate Key (Code 11000)
  else if ((err as MongooseErrorLike)?.code === 11000) {
    const dupErr = err as MongooseErrorLike;
    statusCode = 409;
    const duplicateFields = dupErr.keyValue ? Object.keys(dupErr.keyValue).join(', ') : 'field';
    message = `Duplicate value provided for: ${duplicateFields}`;
    isOperational = true;
    errorDetails = dupErr.keyValue;
  }
  // 6. JWT Errors
  else if ((err as Error)?.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
    isOperational = true;
  } else if ((err as Error)?.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
    isOperational = true;
  }
  // 7. Malformed JSON payload syntax error
  else if (
    err instanceof SyntaxError &&
    'status' in (err as unknown as Record<string, unknown>) &&
    (err as unknown as Record<string, unknown>)['status'] === 400
  ) {
    statusCode = 400;
    message = 'Malformed JSON payload provided in request body';
    isOperational = true;
  }
  // 8. General unexpected error
  else {
    logger.error('Unhandled Server Error:', err);
    if (env.NODE_ENV === 'production' && !isOperational) {
      message = 'An unexpected internal server error occurred';
    } else if (err instanceof Error) {
      message = err.message;
    }
  }

  // Only expose stack trace in non-production environments
  const exposedStack = env.NODE_ENV !== 'production' ? stack : undefined;

  sendError(res, message, statusCode, errorDetails, exposedStack);
};
