import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import { hashPassword, comparePassword } from '../utils/password';
import { signAuthToken, setAuthCookie, clearAuthCookie } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validations/auth.validation';

/**
 * Register a new student account
 * POST /api/v1/auth/register
 */
export const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verify email uniqueness
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(
        AppError.conflict('An account with this email address already exists.')
      );
    }

    // 2. Hash password with bcrypt
    const passwordHash = await hashPassword(password);

    // 3. Create student record
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'student',
    });

    // 4. Issue JWT and set secure HttpOnly cookie
    const token = signAuthToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    // 5. Send sanitized response (passwordHash never exposed)
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

/**
 * Authenticate student credentials and start session
 * POST /api/v1/auth/login
 */
export const login = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Query user with explicit passwordHash projection
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    // Generic error message to prevent account enumeration
    const invalidCredentialsMessage = 'Invalid email or password.';

    if (!user) {
      return next(AppError.unauthorized(invalidCredentialsMessage));
    }

    // 2. Constant-time password comparison
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return next(AppError.unauthorized(invalidCredentialsMessage));
    }

    // 3. Generate JWT and set HttpOnly cookie
    const token = signAuthToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    // 4. Return authenticated user payload
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
