import { Router } from 'express';
import { getUsers } from '../controllers/userController.js';
import { getActivities } from '../controllers/activityController.js';

const router = Router({ mergeParams: true });

router.get('/', getUsers);

router.get('/:userId/activities', getActivities);

export default router;