import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const getActivities = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    try {
        const activities = await prisma.activity.findMany({
            where: { userId },
        });
        return res.json(activities);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch activities" });
    }
}

const getAllActivities = async (req: Request, res: Response) => {
    try {
        const activities = await prisma.activity.findMany();
        return res.json(activities);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch activities" });
    }
}

export {
    getActivities,
    getAllActivities
}