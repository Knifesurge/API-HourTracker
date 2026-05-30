import { Router } from 'express';
import { createActivity, getMyActivities } from "../controllers/activityController.js";
import { requireAuth } from "@/backend/middleware/auth.js";

const router = Router({ mergeParams: true });

router.get('/', requireAuth, getMyActivities);
router.post('/create', requireAuth, createActivity);

export default router;