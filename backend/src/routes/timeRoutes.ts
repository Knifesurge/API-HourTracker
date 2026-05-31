import { Router } from 'express';
import { requireAuth } from '@/backend/middleware/auth.js';
import { startTimer, stopTimer, getMyTimeEntries, updateMyTimeEntry } from '../controllers/timeController.js'

const router = Router({ mergeParams: true });

router.get('/', requireAuth, getMyTimeEntries);
router.post('/start', requireAuth, startTimer);
router.post('/stop', requireAuth, stopTimer);
router.put('/:id', requireAuth, updateMyTimeEntry);

export default router;