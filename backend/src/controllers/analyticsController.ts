import type { Request, Response } from 'express';
import { prisma } from "@/backend/lib/prisma.js";
import { AuthRequest } from '../middleware/index.js';
import { z } from 'zod';
//#region deprecated global analytics functions
/* This project has moved away from global stats and leaderboards, but these functions are 
 * left here to give examples on how they would have been used.
 */
/*
const getGlobalStats = async (req: Request, res: Response) => {
    try {
        // Higher performance to fire parallel database queries
        const [ userCount, activityCount, entryStats ] = await Promise.all([
            prisma.user.count(),
            prisma.activity.count(),
            prisma.timeEntry.aggregate({
                _sum: { duration: true },   // Cumulative time tracked
                _avg: { duration: true },   // Average length of tracked sessions
                _count: { id: true },       // Total number of sessions completed
            })
        ]);

        return res.json({
            totalUsers: userCount,
            totalUniqueActivities: activityCount,
            totalSessionsTracked: entryStats._count.id,
            cumulativeMinutesTracked: entryStats._sum.duration || 0,
            averageSessionDurationMinutes: entryStats._avg.duration ? Math.round(entryStats._avg.duration) : 0
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to retrieve global statistics.' });
    }
}
*/
/*
const getActivityLeaderboard = async (req: Request, res: Response) => {
    try {
        // Use Prisma groupBy to rank activities by total duration spent
        const rankedData = await prisma.timeEntry.groupBy({
            by: ['activityId'],
            _sum: { duration: true },
            _count: { id: true },
            orderBy: { 
                _sum: { duration: 'desc' } 
            },
            take: 10    // Return only top 10 activities
        });

        // Hydrate global activity names for the leaderboard
        const leaderboard = await Promise.all(
            rankedData.map(async (item) => {
                const activityMeta = await prisma.activity.findUnique({
                    where: { id: item.activityId },
                    select: { name: true }
                });
                return {
                    activityId: item.activityId,
                    name: activityMeta?.name || 'Unknown Activity',
                    totalMinutes: item._sum.duration || 0,
                    totalSessions: item._count.id
                };
            })
        );

        return res.json(leaderboard);
    } catch (err) {
        return res.status(500).json({ error: 'Failed compiling leaderboard data.' });
    }
}
*/
//#endregion

const AnalyticsSchema = z.object({
    days: z.coerce.number('Days must be standard numeric format').optional()
});

/*
 *  TODO: Currently does not provide data when query param provided
 * {"metrics":{"totalHours":0,"completedSessions":0,"activitiesCount":0},"topActivities":[],"breakdown":[]}
 */
const getUserAnalytics = async (req: AuthRequest, res: Response) => {
    const validation = AnalyticsSchema.safeParse(req.query);
    if (!validation.success) {
        return res.status(400).json({ error: z.treeifyError(validation.error) });
    }
    
    const userId = req.userId;
    // Default to 365 if no days param given
    const daysParam = validation.data.days ? validation.data.days : 365;
    
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysParam);

        const numericUserId = parseInt(userId || '');
        if (isNaN(numericUserId)) {
            return res.status(401).json({ error: 'Invalid user session context.' });
        }
        // Fetch user time-entries within the specified date range
        const timeEntries = await prisma.timeEntry.findMany({
            where: {
                userId: numericUserId,
                startTime: { gte: cutoffDate }
            },
            include: {
                activity: true
            }
        });

        // Perform aggregation loops
        let totalSeconds = 0;
        const completedSessions = timeEntries.filter(e => e.endTime !== null).length;

        // Map to group total tracked seconds and run counter per unique activity type
        const activityMap: Record<string, { name: string; seconds: number; sessions: number }> = {};

        timeEntries.forEach((entry) => {
            if (!entry.activity) return;

            const seconds = entry.duration || 0;
            totalSeconds += seconds;

            const activityName = entry.activity.name;
            if (!activityMap[activityName]) {
                activityMap[activityName] = { name: activityName, seconds: 0, sessions: 0 };
            }

            activityMap[activityName].seconds += seconds;
            activityMap[activityName].sessions += 1;
        });

        const totalHoursDisplay = Number((totalSeconds / 3600).toFixed(1));
        const uniqueActivitiesCount = Object.keys(activityMap).length;

        // Compute precise percentages
        const breakdown = Object.values(activityMap).map((item) => ({
            activityName: item.name,
            hours: Number((item.seconds / 3600).toFixed(1)),
            numSessions: item.sessions,
            percentage: totalSeconds > 0 ? Math.round((item.seconds / totalSeconds) * 100) : 0,
        }));

        // Sort to capture top performing Activities
        const topActivities = [...breakdown]
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 3);
        
        return res.json({
            metrics: {
                totalHours: totalHoursDisplay,
                completedSessions,
                activitiesCount: uniqueActivitiesCount
            },
            topActivities,
            breakdown
        });
    } catch (error: any) {
        return res.status(500).json({ error: 'Failed compiling user analytics data.' });
    }
};

export { 
    getUserAnalytics
}