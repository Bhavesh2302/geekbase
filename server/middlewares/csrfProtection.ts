import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { AUTH_COOKIE_NAME } from '../utils/jwt';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const csrfProtection = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const hasAuthCookie = Boolean(req.cookies?.[AUTH_COOKIE_NAME]);
  if (!hasAuthCookie) {
    return next();
  }

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
