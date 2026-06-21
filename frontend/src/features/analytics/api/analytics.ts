import { apiClient } from "@/features/auth/api/client";

interface UserActivityBreakdown {
    activityName: string;
    hours: number;
    numSessions: number;
    percentage: number;
};

interface UserAnalyticsMetrics {
    totalHours: number;
    completedSessions: number;
    numActivities: number;
}

interface AnalyticsPayload {
    userMetrics: UserAnalyticsMetrics;
    userActivityBreakdown: UserActivityBreakdown[];
    topActivities: UserActivityBreakdown[];
};

const fetchUserAnalyticsAPI = async (days: number): Promise<AnalyticsPayload> => {
    const { data } = await apiClient.get<AnalyticsPayload>(`/analytics/user-stats?days=${days}`);
    return data;
}


export {
    type AnalyticsPayload,
    fetchUserAnalyticsAPI
}