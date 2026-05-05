import { Router } from 'express';
import { getActivities, getUsers } from '../controllers/userController'

const router = Router({ mergeParams: true });

router.get('/', getUsers);

router.get('/:userId/activities', getActivities);

export default router;