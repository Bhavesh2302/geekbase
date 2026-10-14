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

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.[AUTH_COOKIE_NAME] ??
      (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined);

    if (!token) {
      return next(AppError.unauthorized('Authentication required. Please log in to proceed.'));
    }

    let decoded: ReturnType<typeof verifyAuthToken>;
    try {
      decoded = verifyAuthToken(token);
    } catch (err: unknown) {
      const isExpired = (err as Error)?.name === 'TokenExpiredError';
      return next(
        AppError.unauthorized(
          isExpired
            ? 'Your session has expired. Please log in again.'
            : 'Invalid authentication token. Please log in again.'
        )
      );
    }

    const user = await User.findById(decoded.id).select('name email role');
    if (!user) {
      return next(
        AppError.unauthorized('The account associated with this session no longer exists.')
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
