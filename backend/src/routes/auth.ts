import express, { type Request, type Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from "@/backend/lib/prisma.js"

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

// REGISTER USER
router.post('/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, Email and Password are required.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with that email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user to db
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: 'User registered successfully.',
            userId: newUser.id
        });
    } catch (err) {
        return res.status(500).json({ error: 'Server error during registration.' });
    }
});

// LOGIN USER
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Compare password with db hash
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Sign a JWT valid for 24 hours
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, message: 'Login successful.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login.' });
    }
});

export default router;