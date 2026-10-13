import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: unknown;
  timestamp: string;
}

/**
 * Standardized success response helper
 */
export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message = 'Operation successful',
  statusCode = 200
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    ...(data !== undefined && { data }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(payload);
};

/**
 * Standardized error response helper
 */
export const sendError = (
  res: Response,
  message = 'An unexpected error occurred',
  statusCode = 500,
  errors?: unknown,
  stack?: string
): Response => {
  const payload: ApiResponse & { stack?: string } = {
    success: false,
    statusCode,
    message,
    ...(errors !== undefined && { errors }),
    ...(stack !== undefined && { stack }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(payload);
};
