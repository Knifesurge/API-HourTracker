/*
 *  TODO
 *  - Delete doesn't remove associated TimeEntries from the dashboard
 *      - Need verification that it deletes them from database
 *  - Users are able to add duplicate Activities already present from seed data
 *      - Naming needs to be looked at for this 
 */

import React, { useEffect, useState } from 'react';
import {
    fetchMyActivitiesAPI,
    createActivityAPI,
    deleteActivityAPI,
    type Activity
} from '../api/activities';
import { DNA } from 'react-loader-spinner';

const ActivitiesPage: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivityName, setNewActivityName] = useState<string>('');

    // Operational View States
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const loadActivities = async () => {
        try {
            setError(null);
            const data = await fetchMyActivitiesAPI();
            setActivities(data);
        } catch (err: any) {
            setError(err.message || "Failed to load activities.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadActivities();
    }, []);

    const handleCreateActivity = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!newActivityName.trim()) {
            return;
        }

        setActionLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const created = await createActivityAPI(newActivityName.trim());
            setActivities((prev) => [...prev, created]);
            setNewActivityName('');
            setSuccessMessage(`Activity "${created.name}" created successfully!`);
        } catch (err: any) {
            setError(err.message || "Failed to create activity.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteActivity = async (id: number, name: string) => {
        if (!window.confirm(`Are you sure you want to remove ${name}? This will delete all time entries associated with this activity!`)) {
            return;
        }

        setActionLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await deleteActivityAPI(id);
            setActivities((prev) => prev.filter((act) => act.id !== id));
            setSuccessMessage(`Activity "${name}" deleted successfully!`);
        } catch (err: any) {
            setError(err.message || "Failed to delete activity.");
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full min-h-[400px] flex items-center justify-center">
                <DNA
                    height={80}
                    width={80}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto w-full">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-primary">Manage Activities</h1>
                <p className="text-sm text-muted">Create new activities or manage existing ones</p>
            </div>

            {/* Feedback Status Bars */}
            {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-xs font-medium rounded-xl">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="p-3 bg-success/10 border border-success/20 text-success text-xs font-medium rounded-xl">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols3 gap-6 items-start">
                {/* Left Column: Create new Activity Form Card */}
                <div className="p-6 bg-card border border-border rounded-xl shadow-subtle space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Add New Activity</h3>
                        <p className="text-xs text-muted">Create a unique named Activity to start tracking.</p>
                    </div>

                    <form
                        onSubmit={handleCreateActivity}
                        className="space-y-4"
                    >
                        <div className="flex flex-col gap-1.5">
                            <input
                                type="text"
                                value={newActivityName}
                                onChange={(e) => setNewActivityName(e.target.value)}
                                placeholder="e.g., Cycling, Programming, Meetings..."
                                disabled={actionLoading}
                                maxLength={50}
                                className="w-full px-3 py-2 rounded-lg bg-input border border-input-border text-sm text-primary focus:outline-none focus:border-accent transition-all disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={actionLoading || !newActivityName.trim()}
                            className="w-full font-semibold text-sm py-2 px-4 rounded-lg bg-accent text-accent-foreground hover:bg-accent-hover transition-all disabled:opacity-50 cursor-pointer text-center"
                        >
                            {actionLoading ? "Creating..." : "Create new Activity"}
                        </button>
                    </form>
                </div>

                {/* Right column: List and Management Ledger */}
                <div className="p-6 bg-card border border-border rounded-xl shadow-subtle md:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Your Activities</h3>

                    {activities.length === 0 ? (
                        <p className="text-xs text-muted text-center py-8">You have no Activities. Create one to start tracking!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-border text-xs font-semibold text-muted bg-surface-hover/20">
                                        <th className="py-2 px-3">Activity ID</th>
                                        <th className="py-2 px-3">Activity Name</th>
                                        <th className="py-2 px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {activities.map(activity => (
                                        <tr
                                            key={activity.id}
                                            className="hover:bg-surface-hover/30 transition-colors"
                                        >
                                            <td className="py-3 px-3 text-secondary font-mono text-xs w-24">
                                                #{activity.id}
                                            </td>
                                            <td className="py-3 px-3 font-medium capitalize">
                                                {activity.name}
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <button
                                                    onClick={() => handleDeleteActivity(activity.id, activity.name)}
                                                    disabled={actionLoading}
                                                    className="px-3 py-1 text-xs font-semibold rounded-md bg-surface border border-border text-primary hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export {
    ActivitiesPage
}