import React, { useState, useEffect } from "react";
import { type AnalyticsPayload, fetchUserAnalyticsAPI } from "../api/analytics";
import { DNA } from "react-loader-spinner";
import { cn } from "@/shared/lib";

const loadingStyle = `
h-full
min-h-[400px]
flex
items-center
justify-center
`;

const metricsCardStyle = `
p-4 
bg-surface
border
border-border
rounded-xl
`;

const metricsCardTitleStyle = `
text-xs
font-medium
text-muted
uppercase
tracking-wider
`;

const metricsCardTextStyle = `
text-2xl
font-semibold
text-primary
mt-1
`;

const metricsCardSubtextStyle = `
text-sm
font-normal
text-muted
`;

const filterDays = [1, 3, 7, 14, 30, 90, 180, 365] as const;


const AnalyticsPage: React.FC = () => {
    const [selectedDays, setSelectedDays] = useState<number>(7);
    const [data, setData] = useState<AnalyticsPayload | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadAnalyticsData = async() => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetchUserAnalyticsAPI(selectedDays);
            setData(res);
        } catch (err: any) {
            setError(err.message || "Failed fetching User Analytics");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAnalyticsData();
    }, [selectedDays]);

    // Colors for rendering percentage pieces
    const tailwindChartColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#64748b"];

    // Calculate dynamic gradient for pie chart
    let compiledPercentage = 0;
    const gradientSlices = data?.userActivityBreakdown.map((item, index) => {
        const color = tailwindChartColors[index % tailwindChartColors.length];
        const start = compiledPercentage;
        compiledPercentage += item.percentage;
        return `${color} ${start}% ${compiledPercentage}%`;
    }).join(", ") || "";

    const pieChartStyle = {
        background: gradientSlices ? `conic-gradient(${gradientSlices})` : "#3f3f46"
    };

    const maxHoursLogged = data?.userActivityBreakdown.reduce((max, item) => item.hours > max ? item.hours : max, 0.1) || 1;


    if (isLoading && !data) {
        return (
            <div className={loadingStyle}>
                <DNA height="80" width="80" />
            </div>
        );
    }

    const handleSelectDays = (days: number) => {
        setSelectedDays(days);
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto w-full">
            {/* Header and Filter Control */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Personal Analytics</h1>
                    <p className="text-sm text-muted mt-1">Identify patterns and trends in your data</p>
                </div>

                <div className="flex flex-wrap items-center bg-surface-elevated border border-border p-1 rounded-xl shrink-0">
                    {filterDays.map((days) => (
                        <button
                            key={days}
                            onClick={() => handleSelectDays(days)}
                            className={cn(
                                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                                selectedDays === days
                                ? "bg-accent text-accent-foreground shadow-sm"
                                : "text-muted hover:text-primary hover:bg-surface-hover"
                            )}
                        >
                            {days}d
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-xs font-medium rounded-xl">
                    {error}
                </div>
            )}

            {data && (
                <>
                    {/* Header Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className={metricsCardStyle}>
                            <p className={metricsCardTitleStyle}>Total Hours Tracked</p>
                            <p className={metricsCardTextStyle}>
                                {data.userMetrics.totalHours} <span className={metricsCardSubtextStyle}>hrs</span>
                            </p>
                        </div>
                        <div className={metricsCardStyle}>
                            <p className={metricsCardTitleStyle}>Completed Sessions</p>
                            <p className={metricsCardTextStyle}>
                                {data.userMetrics.completedSessions} <span className={metricsCardSubtextStyle}>sessions</span>
                            </p>
                        </div>
                        <div className={metricsCardStyle}>
                            <p className={metricsCardTitleStyle}>Activities Tracked</p>
                            <p className={metricsCardTextStyle}>
                                {data.userMetrics.activitiesCount} <span className={metricsCardSubtextStyle}>activities</span>
                            </p>
                        </div>
                    </div>

                    {/* Visual graph and Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Top 3 Activities tracked 
                            TODO: Add some space between title and first item.
                        */}
                        <div className={metricsCardStyle}>
                            <p className={metricsCardTitleStyle}>Top Activities</p>
                            <div className="space-y-3 flex-1 flex flex-col justify-center">
                                {data.topActivities.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs border-b border-border/40pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2 truncate pr-2">
                                            <span className="text-muted font-mono">#{index + 1}</span>
                                            <span className="text-primary font-medium truncate">{activity.activityName}</span>
                                        </div>
                                        <span className="text-secondary font-semibold font-mono shrink-0">{activity.hours} hrs</span>
                                    </div>
                                ))}
                                {data.topActivities.length === 0 && (
                                    <p className="text-xs text-muted text-center py-4">No activities tracked</p>
                                )}
                            </div>
                        </div>
                        {/* Pie chart breakdown */}
                        <div className="p-4 bg-surface border border-border rounded-xl flex flex-col items-center">
                            <p className="text-xs font-medium text-muted uppercase tracking-wider w-full text-left mb-4">Activity Breakdown</p>
                            <div className="flex items-center gap-5 w-full justify-center">
                                <div className="w-24 h-24 rounded-full border border-strong relative shrink-0" style={pieChartStyle} />
                                <div className="space-y-1.5 overflow-hidden flex-1 max-w-[130px]">
                                    {data.userActivityBreakdown.sort((a, b) => b.percentage - a.percentage).map((item, index) => (
                                        <div key={index} className="flex items-center gap-1.5 text-[11px] truncate">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tailwindChartColors[index % tailwindChartColors.length] }} />
                                            <span className="text-muted truncate">{item.activityName}</span>
                                            <span className="text-primary font-mono ml-auto pl-1">{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Inline Bar Chart */}

                    </div>
                </>
            )}
        </div>
    )
}

export {
    AnalyticsPage
}