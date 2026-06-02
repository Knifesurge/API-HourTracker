import { apiClient } from "./client";

interface GlobalStatsResponse {
    totalUsers: number;
    totalUniqueActivities: number;
    totalSessionsTracked: number;
    cumulativeMinutesTracked: number;
    averageSessionDurationMinutes: number;
};

interface LeaderboardItem {
    activityId: number;
    name: string;
    totalMinutes: number;
    totalSessions: number;
};

// Fetch public aggregates over all registered Users
const fetchGlobalStatsAPI = async (): Promise<GlobalStatsResponse> => {
    const { data } = await apiClient.get<GlobalStatsResponse>('/analytics/global-stats');
    return data;
}

// Fetch top 10 most tracked Activities ranked by cumulative minutes spent
const fetchLeaderboardAPI = async (): Promise<LeaderboardItem[]> => {
    const { data } = await apiClient.get<LeaderboardItem[]>('/analytics/leaderboard');
    return data;
}

export {
    type GlobalStatsResponse,
    type LeaderboardItem,
    fetchGlobalStatsAPI,
    fetchLeaderboardAPI
}