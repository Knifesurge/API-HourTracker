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
        </div>
    );
}

export {
    ActivitiesPage
}