import { Router } from 'express';
import { getTopics } from '../controllers/catalog.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { getTopicsQuerySchema } from '../validations/catalog.validation';

const router = Router();

// GET /api/v1/topics?chapterId=
router.get('/', validateRequest(getTopicsQuerySchema), getTopics);

export default router;
