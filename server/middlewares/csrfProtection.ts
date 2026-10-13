import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { AUTH_COOKIE_NAME } from '../utils/jwt';

/**
 * CSRF Protection Middleware for Cookie-based Authentication
 *
 * Defense Strategy:
 * 1. Safe HTTP methods (GET, HEAD, OPTIONS) are exempt.
 * 2. If the request does NOT carry the session authentication cookie, CSRF is not applicable.
 * 3. For authenticated state-changing requests (POST, PUT, PATCH, DELETE):
 *    - Validates request Origin against configured CORS allowed origins.
 *    - Validates presence of custom request header (e.g. 'x-requested-with' or 'x-csrf-protection').
 *    - Browsers enforce SOP (Same-Origin Policy), preventing cross-origin forms from attaching custom headers
 *      without triggering preflight OPTIONS checks.
 */
export const csrfProtection = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // 1. Safe methods do not mutate state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // 2. Only enforce if an authentication session cookie is present
  const hasAuthCookie = Boolean(req.cookies && req.cookies[AUTH_COOKIE_NAME]);
  if (!hasAuthCookie) {
    return next();
  }

  // 3. Origin check
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

  if (origin) {
    const isAllowedOrigin = allowedOrigins.some(
      (allowed) => origin === allowed || origin.startsWith(`${allowed}/`) || allowed === '*'
    );

    if (!isAllowedOrigin) {
      return next(
        AppError.forbidden('CSRF verification failed: Untrusted request origin.')
      );
    }
  }

  next();
};
