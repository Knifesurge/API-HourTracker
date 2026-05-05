import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const getActivities = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    const activities = await prisma.activity.findMany({
        where: { userId },
    });

    return res.json(activities);
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
}

export {
    getActivities,
    getUsers
};