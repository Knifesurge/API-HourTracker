import { Router } from 'express';
import { getAllActivities } from "../controllers/activityController.js";

const router = Router({ mergeParams: true });

router.get('/', getAllActivities);

export default router;