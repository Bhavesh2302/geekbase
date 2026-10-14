import { Router } from 'express';
import { getChapters, getChapterById } from '../controllers/catalog.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { getChapterByIdSchema } from '../validations/catalog.validation';

const router = Router();

// GET /api/v1/chapters
router.get('/', getChapters);

// GET /api/v1/chapters/:chapterId
router.get('/:chapterId', validateRequest(getChapterByIdSchema), getChapterById);

export default router;
