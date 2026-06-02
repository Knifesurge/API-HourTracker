import { apiClient } from "./client";

interface UserProfile {
    id: number;
    name: string;
    email: string;
};

interface AuthResponse {
    token: string;
    user: UserProfile;
};

const loginAPI = async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });

    // Persist verificed context directly upon clean login request 
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_profile', JSON.stringify(data.user));

    return data;
};

const registerAPI = async (email: string, password: string, name?: string) => {
    const { data } = await apiClient.post<{ message: string; userId: number }>('/auth/register', { email, password, name });

    return data;
};

const logoutUser = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
};

export {
    type UserProfile,
    type AuthResponse,
    loginAPI,
    registerAPI,
    logoutUser
}