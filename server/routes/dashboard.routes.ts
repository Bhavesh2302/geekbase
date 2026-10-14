import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import { getDashboardSummaryQuerySchema } from '../validations/dashboard.validation';

const router = Router();

// Protect all dashboard routes with authentication
router.use(requireAuth);

// GET /api/v1/dashboard/summary
router.get(
  '/summary',
  validateRequest(getDashboardSummaryQuerySchema),
  getDashboardSummary
);

export default router;
