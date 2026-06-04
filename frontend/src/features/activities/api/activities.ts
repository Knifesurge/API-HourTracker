import { apiClient } from "../../auth/api/client";

interface Activity {
    id: number;
    name: string;
};

// Fetch all Activities attached to the current User
const fetchMyActivitiesAPI = async (): Promise<Activity[]> => {
    const { data } = await apiClient.get<Activity[]>('/activities');
    return data;
};

// Create a new Activity and link it to the current User
const createActivityAPI = async (name: string): Promise<Activity> => {
    const { data } = await apiClient.post<Activity>('/activities/create', { name });
    return data;
}

// Delete the junction link between the current User and the Activity, cascading
const deleteActivityAPI = async (activityId: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string}>(`/activities/${activityId}`);
    return data;
}

export {
    type Activity,
    fetchMyActivitiesAPI,
    createActivityAPI,
    deleteActivityAPI
};