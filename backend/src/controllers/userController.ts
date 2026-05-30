import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
}

export {
    getAllUsers
};