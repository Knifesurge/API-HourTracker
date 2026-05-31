import { Router } from 'express';
import { getAllUsers } from '../controllers/userController.js';

const router = Router({ mergeParams: true });

router.get('/', getAllUsers);

export default router;