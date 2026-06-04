import { apiClient } from "./client";
import { type Activity } from "../../activities/api/activities";

interface TimeEntry {
    id: number;
    startTime: string;          // ISO DateTime string
    endTime: string | null;     // Null indicates actively running timer
    duration: number | null;    // Accumulated minutes
    userId: number;
    activityId: number;
    activity?: Activity;        // Optional populated metadata from Prisma include queries
}

interface UpdateTimeEntryPayload {
    startTime?: string;
    endTime?: string;
    duration?: number;
}

// Retrieves full historical timelog timeline for active User
const fetchMyTimeEntriesAPI = async (): Promise<TimeEntry[]> => {
    const { data } = await apiClient.get<TimeEntry[]>('/time-entries');
    return data;
};

// Start a timer block (sets startTime, leaves endTime null)
const startTimerAPI = async (activityId: number): Promise<TimeEntry> => {
    const { data } = await apiClient.post<TimeEntry>('/time-entries/start', { activityId });
    return data;
}

// Stops a running timer and calculates duration
const stopTimerAPI = async (): Promise<TimeEntry> => {
    const { data } = await apiClient.post<TimeEntry>('/time-entries/stop', {});
    return data;
}

// Partially modifies existing TimeEntry by ID
const updateTimeEntryAPI = async (id: number, payload: UpdateTimeEntryPayload): Promise<TimeEntry> => {
    const { data } = await apiClient.put<TimeEntry>(`/time-entries/${id}`, payload);
    return data;
}

export {
    type TimeEntry,
    fetchMyTimeEntriesAPI,
    startTimerAPI,
    stopTimerAPI,
    updateTimeEntryAPI
}