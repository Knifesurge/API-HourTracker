import type { Response } from 'express';
import { type AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { z } from "zod";
import type { Prisma } from '../generated/prisma/browser.js';

const StartTimerSchema = z.object({
    activityId: z.int('Activity identifier must be standard numeric format')
});

const ParamIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a numeric string')
});

const UpdateTimeEntrySchema = z.object({
    startTime: z.iso.datetime('Invalid starting ISO date format.').optional(),
    endTime: z.iso.datetime('Invalid ending ISO date format.').optional(),
    duration: z.int().min(0, 'Duration must be a non-negative integer.').optional(),
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

const updateMyTimeEntry = async (req: AuthRequest, res: Response) => {
    const paramValidation = ParamIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
        return res.status(400).json({ error: z.treeifyError(paramValidation.error) });
    }

    const bodyValidation = UpdateTimeEntrySchema.safeParse(req.body);
    if (!bodyValidation.success) {
        return res.status(400).json({ error: z.treeifyError(bodyValidation.error) });
    }

    const timeEntryIdToUpdate = parseInt(paramValidation.data.id);
    const numericUserId = parseInt(req.userId || '');
    if (isNaN(numericUserId)) {
        return res.status(401).json({ error: 'Invalid user session context.' });
    }

    try {
        // This specific entry must belong to this user
        const actualRecord = await prisma.timeEntry.findUnique({
            where: { id: timeEntryIdToUpdate }
        });

        if (!actualRecord) {
            return res.status(404).json({ error: `Time entry with ID ${timeEntryIdToUpdate} not found.` });
        } 

        if (actualRecord.userId !== numericUserId) {
            return res.status(404).json({ error: 'Time entry not found for this user.' });
        }

        // Compute valid duration
        // If user didn't pass new dates in request body, fallback to existing row data
        let finalStart =  bodyValidation.data.startTime ? new Date(bodyValidation.data.startTime) : actualRecord.startTime;
        let finalEnd = bodyValidation.data.endTime ? new Date(bodyValidation.data.endTime) : actualRecord.endTime;
        const inputDuration = bodyValidation.data.duration;

        // If starttime and duration are provided, calculate the endtime
        // Start time is provided above, so no need to check for it again here
        if (inputDuration !== undefined && !bodyValidation.data.endTime) {
            // Convert duration minutes to milliseconds and add to starting timestamp
            const calculatedEndMs = finalStart.getTime() + (inputDuration * 60 * 1000);
            finalEnd = new Date(calculatedEndMs);
        }

        if (finalEnd) {
            // End time must be after start time
            if (finalEnd.getTime() < finalStart.getTime()) {
                return res.status(400).json({ error: 'Chronological Error: End time must be after start time.' });
            }

            // Verify duration if endtime is provided with duration
            if (inputDuration !== undefined && bodyValidation.data.endTime) {
                // If duration is provided, it must match the difference between start and end times
                const calculatedMinutesDelta = Math.round((finalEnd.getTime() - finalStart.getTime()) / 60_000);

                // Allow 1 minute margin of error for rounding tolerances across clients
                if (Math.abs(calculatedMinutesDelta - inputDuration) > 1) {
                    return res.status(400).json({
                        error: `Data integrity error: Provided duration (${inputDuration}m) does not match the timestamp calculation (${calculatedMinutesDelta}m).`
                    });
                }
            }   
        }

        // Create update object with only fields to be updated
        const updateData: Prisma.TimeEntryUpdateInput = {};
        if (bodyValidation.data.startTime) {
            updateData.startTime = finalStart;
        }
        if (bodyValidation.data.endTime || (inputDuration !== undefined && !bodyValidation.data.endTime)) {
            updateData.endTime = finalEnd;
        }
        if (inputDuration !== undefined) {
            updateData.duration = inputDuration;
        }

        // Update values
        const updatedRecord = await prisma.timeEntry.update({
            where: { id: timeEntryIdToUpdate },
            data: updateData
        });

        return res.json(updatedRecord);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update the time entry.' });
    }
}

export {
    startTimer,
    stopTimer,
    getMyTimeEntries,
    updateMyTimeEntry
};