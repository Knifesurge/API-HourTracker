import express, { type Request, type Response} from 'express';
import { registerUser, loginUser } from "@/backend/controllers/authController.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;