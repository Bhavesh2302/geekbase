import { Response, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const AUTH_COOKIE_NAME = 'token';

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate a signed JWT token
 */
export const signAuthToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

/**
 * Verify and decode an authentication token
 */
export const verifyAuthToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
};

/**
 * Cookie options adhering to secure cross-site and transport rules
 */
export const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    // Use 'none' in production with HTTPS for cross-origin SPA, or 'lax' in development
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };
};

/**
 * Attaches the JWT in an HttpOnly cookie
 */
export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};

/**
 * Clears the authentication HttpOnly cookie upon logout
 */
export const clearAuthCookie = (res: Response): void => {
  const isProduction = env.NODE_ENV === 'production';
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
};
