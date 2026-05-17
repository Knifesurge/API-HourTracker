import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const getUserActivities = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    try {
        // Get unique user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                activities: {
                    include: {
                        activity: true,
                    },
                },
            }
        });
        // Get activity list for user
        const activities = user?.activities.map(
            (userActivity) => userActivity.activity
        );
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
    getUserActivities,
    getAllActivities
}
