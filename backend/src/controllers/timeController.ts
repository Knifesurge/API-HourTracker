import type { Request, Response } from 'express';
import { type AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { z } from "zod";

const StartTimerSchema = z.object({
    activityId: z.int('Activity identifier must be standard numeric format')
});

const startTimer = async (req: AuthRequest, res: Response) => {
    const validation = StartTimerSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: z.treeifyError(validation.error) });
    }

    const numericUserId = parseInt(req.userId || '');
    if (isNaN(numericUserId)) {
        return res.status(401).json({ error: 'Invalid user session context.'});
    }

    try {
        // Is there an existing open timer entry?
        const runningTimer = await prisma.timeEntry.findFirst({
            where: { userId: numericUserId, endTime: null }
        });

        if (runningTimer) {
            return res.status(400).json({ error: 'Timer already running for this Activity.' });
        }

        const entry = await prisma.timeEntry.create({
            data: {
                startTime: new Date(),
                userId: numericUserId,
                activityId: validation.data.activityId
            }
        });

        return res.status(201).json(entry);
    } catch (err) {
        return res.status(500).json({ error: 'Server error while creating new TimeEntry.' });
    }
};

const stopTimer = async (req: AuthRequest, res: Response) => {
    const numericUserId = parseInt(req.userId || '');
    if (isNaN(numericUserId)) {
        return res.status(401).json({ error: 'Invalid user session context.' });
    }

    try {
        const activeSession = await prisma.timeEntry.findFirst({
            where: { userId: numericUserId, endTime: null }
        });

        if (!activeSession) {
            return res.status(404).json({ error: 'No active running timers for this user.' });
        }

        const stopTime = new Date();
        // Calculate total duration in milliseconds delta blocks transformed to integer minutes
        const durationMinutes = Math.round((stopTime.getTime() - activeSession.startTime.getTime()) / 60_000);

        const updatedRecord = await prisma.timeEntry.update({
            where: { id: activeSession.id },
            data: {
                endTime: stopTime,
                duration: durationMinutes >= 0 ? durationMinutes : 0
            }
        });

        return res.json(updatedRecord);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to close the active timer.' });
    }
};

const getMyTimeEntries = async (req: AuthRequest, res: Response) => {
    const numericUserId = parseInt(req.userId || '');
    if (isNaN(numericUserId)) {
        return res.status(401).json({ error: 'Invalid user session context.' });
    }

    try {
        const metricsLog = await prisma.timeEntry.findMany({
            where: { userId: numericUserId },
            orderBy: { startTime: 'desc' },
            include: { activity: true }
        });

        return res.json(metricsLog);
    } catch (err) {
        return res.status(500).json({ error: 'Failed retrieving time entries for this user.' });
    }
}

export {
    startTimer,
    stopTimer,
    getMyTimeEntries
};