import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { requireAuth } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimiter';
import { csrfProtection } from '../middlewares/csrfProtection';

const router = Router();

// Public routes with rate limiting and schema validation
router.post('/register', authRateLimiter, validateRequest(registerSchema), register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), login);

// Protected routes
router.post('/logout', csrfProtection, requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
