import { Router } from 'express';
import {
  updateProgress,
  getUserProgress,
  getProgressSummary,
} from '../controllers/progress.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { updateProgressSchema } from '../validations/progress.validation';

const router = Router();

// Protect all progress tracking routes with authentication
router.use(requireAuth);

// GET /api/v1/progress/summary (registered before :problemId to prevent param masking)
router.get('/summary', getProgressSummary);

// GET /api/v1/progress
router.get('/', getUserProgress);

// PUT /api/v1/progress/:problemId
router.put(
  '/:problemId',
  validateRequest(updateProgressSchema),
  updateProgress
);

export default router;
