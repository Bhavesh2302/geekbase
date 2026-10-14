import { Router } from 'express';
import {
  getStudyPlans,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
} from '../controllers/studyPlan.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  getStudyPlansQuerySchema,
  createStudyPlanSchema,
  updateStudyPlanSchema,
  planIdParamsSchema,
} from '../validations/studyPlan.validation';

const router = Router();

// Protect all study calendar routes with authentication
router.use(requireAuth);

// GET /api/v1/study-plans?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/', validateRequest(getStudyPlansQuerySchema), getStudyPlans);

// POST /api/v1/study-plans
router.post('/', validateRequest(createStudyPlanSchema), createStudyPlan);

// PATCH /api/v1/study-plans/:planId
router.patch(
  '/:planId',
  validateRequest(updateStudyPlanSchema),
  updateStudyPlan
);

// DELETE /api/v1/study-plans/:planId
router.delete(
  '/:planId',
  validateRequest(planIdParamsSchema),
  deleteStudyPlan
);

export default router;
