import { Router } from 'express';
import { getGlobalStats, getActivityLeaderboard } from '@/backend/controllers/analyticsController.js';

const router = Router();

router.get('/global-stats', getGlobalStats);
router.get('/leaderboard', getActivityLeaderboard);

export default router;