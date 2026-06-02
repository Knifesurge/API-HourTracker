import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DNA } from 'react-loader-spinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback: React.ReactNode;  // Show this if user is unauthenticated
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Splash Screen
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <DNA
                    visible={true}
                    height='80'
                    width='80'
                    ariaLabel='dna-loading'
                    wrapperStyle={{}}
                    wrapperClass='dna-wrapper'
                />
                <p className="text-sm text-primary font-semibold tracking-wide mt-2">
                    Restoring secure session...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <>{fallback}</>;
    }

    return <>{children}</>
};

export {
    ProtectedRoute
}