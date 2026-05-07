import { Router } from 'express';
import { getAllHours } from '../controllers/hourController.js'

const router = Router({ mergeParams: true });

router.get('/', getAllHours);

export default router;