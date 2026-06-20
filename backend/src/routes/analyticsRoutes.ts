import { Router } from 'express';
import { getUserAnalytics } from '@/backend/controllers/analyticsController.js';
import { requireAuth } from '../middleware/index.js';

const router = Router();

router.get('/user-stats', requireAuth, getUserAnalytics);

export default router;