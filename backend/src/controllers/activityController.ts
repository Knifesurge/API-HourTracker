import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { type AuthRequest } from '@/backend/middleware/auth.js';
import { z } from "zod";

const CreateActivitySchema = z.object({
    name: z.string().min(1).max(50)
})

const createActivity = async (req: AuthRequest, res: Response) => {
    const validation = CreateActivitySchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.format() });
    }

    // Safely extract injected ID. Middleware ensures this is valid
    const numericUserId = parseInt(req.userId || '');
    if (isNaN(numericUserId)) {
        return res.status(401).json({ error: 'Invalid user session context.' });
    }

    const normalizedName = validation.data.name.toLowerCase().trim();
    const activityIdForName = await prisma.activity.findUnique({
        where: {
            name: normalizedName
        }
    });
    const activityId = activityIdForName?.id || 0;
    try {
        const existingLink = await prisma.userActivity.findUnique({
            where: {
                userId_activityId: {
                    userId: numericUserId,
                    activityId
                }
            }
        });

        if (existingLink) {
            return res.status(400).json({ error: 'You are already tracking this Activity.' });
        }

        // Execute transactional relational database creation
        const result = await prisma.$transaction(async (tx) => {
            const activityRecord = await tx.activity.upsert({
                where: { name: normalizedName },
                update: {},
                create: { name: normalizedName },
            });

            const userLink = await tx.userActivity.create({
                data: {
                    userId: numericUserId,
                    activityId = activityRecord.id,
                },
                include: { activity : true }
            });

            return userLink.activity;
        });
        
        return res.status(201).json(result);
    } catch (err) {
        return res.status(500).json({ error: 'Server error occurred while linking activity.' });
    }
}

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
    getAllActivities,
    createActivity
}
