import { Router } from 'express';
import { getProblems, getProblemById } from '../controllers/catalog.controller';
import { validateRequest } from '../middlewares/validateRequest';
import {
  getProblemsQuerySchema,
  getProblemByIdSchema,
} from '../validations/catalog.validation';

const router = Router();

// GET /api/v1/problems?topicId=&difficulty=&search=&page=&limit=
router.get('/', validateRequest(getProblemsQuerySchema), getProblems);

// GET /api/v1/problems/:problemId
router.get('/:problemId', validateRequest(getProblemByIdSchema), getProblemById);

export default router;
