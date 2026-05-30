import { Router } from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { getUserActivities } from '../controllers/activityController.js';
import { getUserHours } from '../controllers/timeController.js';

const router = Router({ mergeParams: true });

router.get('/', getAllUsers);

router.get('/:userId/activities', getUserActivities);

router.get('/:userId/hours', getUserHours);

export default router;