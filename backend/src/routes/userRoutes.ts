import { Router } from 'express';
import { getUsers } from '../controllers/userController.js';
import { getUserActivities } from '../controllers/activityController.js';

const router = Router({ mergeParams: true });

router.get('/', getUsers);

router.get('/:userId/activities', getUserActivities);

export default router;