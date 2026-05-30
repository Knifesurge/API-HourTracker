import express, { type Request, type Response} from 'express';
import { registerUser, loginUser } from "@/backend/controllers/authController.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;