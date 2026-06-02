import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, logoutUser, type UserProfile } from '@/features/auth/api/auth';

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // On browser start, check if valid session is cached
    useEffect(() => {
        const cachedUser = localStorage.getItem('user_profile');
        const cachedToken = localStorage.getItem('auth_token');

        if (cachedUser && cachedToken) {
            try {
                setUser(JSON.parse(cachedUser));
            } catch (err: any) {
                // If user corrupted, force a wipe
                logoutUser();
            }
        }
        setIsLoading(false);
    }, []);

    // Login implementation
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await loginAPI(email, password);
            setUser(response.user);
        } catch (err: any) {
            setError(err.message || 'Authentication login failed.');
            throw err;  // Pass to UI form so input fields can react
        } finally {
            setIsLoading(false);
        }
    };

    // Registration implementation
    const register = async (email: string, password: string, name?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await registerAPI(email, password, name);
            // Auto-login user
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout implementationm
    const logout = () => {
        logoutUser();   // Wipe local storage tokens
        setUser(null);
        setError(null);
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                error,
                login,
                register,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook export: Provides clean consumer bindings
const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be executed within an explicit <AuthProvider> wrapper tree.');
    }
    return context;
}

export {
    AuthProvider,
    useAuth
}