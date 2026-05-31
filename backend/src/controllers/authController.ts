import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AuthSchema = z.object({
    email: z.email('Invalid email address format.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    name: z.string().min(1, 'Name field required.')
});

const LoginSchema = AuthSchema.omit({ name: true });

const registerUser = async (req: Request, res: Response) => {
    const validation = AuthSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: z.treeifyError(validation.error) });
    }
    const { name, email, password } = validation.data;

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
}

const loginUser = async (req: Request, res: Response) => {
    const validation = LoginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: z.treeifyError(validation.error) });
    }

    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET as string;

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
        const token = jwt.sign({ userId: String(user.id) }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ 
            token, 
            message: 'Login successful.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login.' });
    }
}

export {
    registerUser,
    loginUser
}