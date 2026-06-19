import { apiClient } from "@/features/auth/api/client";

interface TimeDistribution {
    activityName: string;
    minutes: number;
    percentage: number;
};

interface LeaderboardEntry {
    activityName: string;
    hoursTracked: number;
    numSessions: number;
};

interface AnalyticsPayload {
    distribution: TimeDistribution[];
    leaderboard: LeaderboardEntry[];
};

const fetchAnalyticsLeaderboardAPI = async (): Promise<AnalyticsPayload> => {
    const { data } = await apiClient.get<AnalyticsPayload>('/analytics/leaderboard');
    return data;
}


export {
    type TimeDistribution,
    type LeaderboardEntry,
    type AnalyticsPayload,
    fetchAnalyticsLeaderboardAPI
}