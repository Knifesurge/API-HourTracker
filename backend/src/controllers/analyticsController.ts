import type { Request, Response } from 'express';
import { prisma } from "@/backend/lib/prisma.js";

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

export { 
    getGlobalStats,
    getActivityLeaderboard
}