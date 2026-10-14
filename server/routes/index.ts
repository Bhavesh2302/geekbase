import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import chapterRoutes from './chapter.routes';
import topicRoutes from './topic.routes';
import problemRoutes from './problem.routes';

const router = Router();

// Mount modular sub-routers
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/chapters', chapterRoutes);
router.use('/topics', topicRoutes);
router.use('/problems', problemRoutes);

export default router;
