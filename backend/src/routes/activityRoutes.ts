import { Router } from 'express';
import { createActivity, deleteMyActivityLink, getMyActivities } from "../controllers/activityController.js";
import { requireAuth } from "@/backend/middleware/auth.js";

const router = Router({ mergeParams: true });

router.get('/', requireAuth, getMyActivities);
router.post('/create', requireAuth, createActivity);
router.delete('/:id', requireAuth, deleteMyActivityLink);

export default router;