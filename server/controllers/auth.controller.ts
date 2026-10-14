import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import { hashPassword, comparePassword } from '../utils/password';
import { signAuthToken, setAuthCookie, clearAuthCookie } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validations/auth.validation';

export const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(
        AppError.conflict('An account with this email address already exists.')
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'student',
    });

    const token = signAuthToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    sendSuccess(
      res,
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      'Student account registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    const invalidCredentialsMessage = 'Invalid email or password.';

    if (!user) {
      return next(AppError.unauthorized(invalidCredentialsMessage));
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return next(AppError.unauthorized(invalidCredentialsMessage));
    }

    const token = signAuthToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    sendSuccess(
      res,
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'Authentication successful',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Terminate user session and clear cookie
 * POST /api/v1/auth/logout
 */
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    clearAuthCookie(res);
    sendSuccess(res, null, 'Logged out successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve currently authenticated user profile
 * GET /api/v1/auth/me
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      return next(
        AppError.notFound('User account belonging to this session was not found.')
      );
    }

    sendSuccess(
      res,
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      'Current authenticated user profile',
      200
    );
  } catch (error) {
    next(error);
  }
};
