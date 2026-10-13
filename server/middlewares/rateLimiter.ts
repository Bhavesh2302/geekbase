import { rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';
import { sendError } from '../utils/apiResponse';

/**
 * Rate limiter for sensitive authentication endpoints (registration, login)
 * Limits each IP to 15 attempts per 15-minute window to mitigate brute-force and credential stuffing
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (_req: Request, res: Response) => {
    sendError(
      res,
      'Too many authentication attempts from this IP. Please try again after 15 minutes.',
      429
    );
  },
});
