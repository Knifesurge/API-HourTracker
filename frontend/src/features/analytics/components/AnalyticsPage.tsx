import { useAuth } from "@/features/auth/hooks/useAuth"
import { TimeDistributionChart } from "./TimeDistributionChart"
import { useState, useEffect } from "react";
import { type AnalyticsPayload, fetchAnalyticsLeaderboardAPI } from "../api/analytics";
import { DNA } from "react-loader-spinner";

const loadingStyle = `
h-full
min-h-[400px]
flex
items-center
justify-center
`;

const AnalyticsPage = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState<AnalyticsPayload | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadAnalyticsData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchAnalyticsLeaderboardAPI();
            setMetrics(data);
        } catch (error: any) {
            setError(error.message || "Failed to load analytics data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("load analytics data")
        loadAnalyticsData();
    }, []);

    if (isLoading) {
        return (
            <div className={loadingStyle} >
                <DNA height="80" width="80" />
            </div>
        );
    }

    return (
        <div>
            <p>Analytics Page</p>
            {metrics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    { /* Overwrite warning for undefined metrics with ! */}
                    <TimeDistributionChart data={metrics!.distribution}/>
                </div>
            )}
        </div>
    )
}

export {
    AnalyticsPage
}