import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10_000,    // 10-second request timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: automatically injects JWT Bearer tokens before request leaves client browser
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Unifies Express backend Zod/Relational errors into catchable exceptions
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.error || error.message || 'An unexpected network anomaly occurred.';

        return Promise.reject(new Error(errorMessage));
    }
);