import { Router } from 'express';
import { getAllActivities, createActivity } from "../controllers/activityController.js";
import { requireAuth } from "@/backend/middleware/auth.js";

const router = Router({ mergeParams: true });

router.get('/', getAllActivities);

router.post('/', requireAuth, createActivity);

export default router;