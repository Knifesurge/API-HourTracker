import React from 'react';
import { type TimeDistribution } from '../api/analytics';

interface TimeDistributionChartProps {
    data: TimeDistribution[];
};

const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ data }) => {
    return (
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-primary tracking-tight">Your Activity Distribution</h3>
            <p className="text-xs text-muted mt-0.5 mb-6">Percentage distribution of total tracked hours.</p>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 bg-surface-elevated rounded-xl border border-strong border-dashed p-4">
                    <p className="text-xs text-muted text-center">No activity data available.</p>
                </div>
            ): (
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-secondary truncate pr-4">{item.activityName}</span>
                                <span className="text-muted font-mono shrink-0">
                                    {Number((item.minutes / 60).toFixed(1))}h ({item.percentage}&)
                                </span>
                            </div>
                            <div className="w-full bg-surface-elevated rounded-full h-2.5 overflow-hidden border border-strong">
                                <div 
                                    className="bg-accent h-full transition-all duration-500 ease-out rounded-full"
                                    style={{ width: `${item.percentage}%`}}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export {
    TimeDistributionChart
}