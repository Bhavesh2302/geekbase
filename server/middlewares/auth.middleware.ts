import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { verifyAuthToken, AUTH_COOKIE_NAME } from '../utils/jwt';
import { User, UserRole } from '../models/user.model';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Authentication Middleware:
 * Extracts and verifies JWT from HttpOnly cookie or Authorization Bearer header.
 * Attaches the authenticated user to `req.user`.
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined = undefined;

    // 1. Try reading token from HttpOnly cookie
    if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
      token = req.cookies[AUTH_COOKIE_NAME];
    }
    // 2. Fallback to Authorization: Bearer <token> header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        AppError.unauthorized('Authentication required. Please log in to proceed.')
      );
    }

    // 3. Verify token signature and expiration
    let decoded: ReturnType<typeof verifyAuthToken>;
    try {
      decoded = verifyAuthToken(token);
    } catch (err: unknown) {
      const errorName = (err as Error)?.name;
      if (errorName === 'TokenExpiredError') {
        return next(
          AppError.unauthorized('Your session has expired. Please log in again.')
        );
      }
      return next(
        AppError.unauthorized('Invalid authentication token. Please log in again.')
      );
    }

    // 4. Verify user exists in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        AppError.unauthorized(
          'The account associated with this session no longer exists.'
        )
      );
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-Based Authorization Middleware:
 * Restricts access to users holding specified roles (e.g. 'admin')
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        AppError.unauthorized('Authentication required before checking permissions.')
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden('You do not have permission to access this resource.')
      );
    }

    next();
  };
};
