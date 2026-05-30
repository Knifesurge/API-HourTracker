import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { type AuthRequest } from '@/backend/middleware/auth.js';
import { z } from "zod";

const ActivitySchema = z.object({
    name: z.string().min(1, 'Activity name is required.').max(50)
});

const ParamIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a numeric string.')
});

const createActivity = async (req: AuthRequest, res: Response) => {
    const validation = ActivitySchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.format() });
    }

    // Safely extract injected ID. Middleware ensures this is valid
    const numericUserId = parseInt(req.userId || '');
    if (isNaN(numericUserId)) {
        return res.status(401).json({ error: 'Invalid user session context.' });
    }

    const normalizedName = validation.data.name.toLowerCase().trim();

    try {
        const existingActivityRecord = await prisma.activity.findUnique({
            where: {
                name: normalizedName
            }
        });

        if (existingActivityRecord) {
            const linkCheck = await prisma.userActivity.findUnique({
                where: {
                    userId_activityId: {
                        userId: numericUserId,
                        activityId: existingActivityRecord.id
                    }
                }
            });

            if (linkCheck) {
                return res.status(400).json({ error: 'This Activity already exists.'});
            }
        }
        
        const savedActivity = await prisma.$transaction(async (tx) => {
            const act = await tx.activity.upsert({
                where: { name: normalizedName },
                update: {},
                create: { name: normalizedName },
            });

            await tx.userActivity.create({
                data: { userId: numericUserId, activityId: act.id }
            });
            
            return act;
        });

        return res.status(201).json(savedActivity);
    } catch (err) {
        return res.status(500).json({ error: 'Server error parsing transactional context parameters.' });
    }
}

const getMyActivities = async (req: AuthRequest, res: Response) => {
    const numericUserId = parseInt(req.userId || '');
    if (isNaN(numericUserId)) {
        return res.status(401).json({ error: 'Invalid session profile.' });
    }

    try {
        // Get unique user
        const userActivities = await prisma.userActivity.findMany({
            where: { userId: numericUserId },
            include: { activity: true }
        });
        // Get activity list for user
        const output = userActivities.map((ua) => ua.activity);
        return res.json(output);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch activities" });
    }
}

const deleteMyActivityLink = async (req: AuthRequest, res: Response) => {
    const validation = ParamIdSchema.safeParse(req.params);
    if (!validation.success) {
        return res.status(400).json({ error: 'Invalid URL parameter format.' });
    }

    const activityIdToDelete = parseInt(validation.data.id);
    const numericUserId = parseInt(req.userId || '');
    if (isNaN(numericUserId)) {
        return res.status(401).json({ error: 'Invalid session profile.' });
    }

    try {
        // Remove the junction record mapping.
        await prisma.userActivity.delete({
            where: {
                userId_activityId: {
                    userId: numericUserId,
                    activityId: activityIdToDelete
                }
            }
        });

        return res.json({ message: 'Activity unlinked from your profile.' });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to unlink activity from your profile.' });
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
    getMyActivities,
    getAllActivities,
    createActivity,
    deleteMyActivityLink
}
