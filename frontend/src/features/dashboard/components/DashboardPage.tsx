import React, { useEffect, useState, useRef } from 'react';
import {
  fetchMyTimeEntriesAPI,
  startTimerAPI,
  stopTimerAPI,
  type TimeEntry
} from "@/features/auth/api/timeEntries";
import { fetchMyActivitiesAPI, type Activity } from '@/features/auth/api/activities';
import { DNA } from 'react-loader-spinner';

const loadingStyle = `
  h-full
  min-h-[400px]
  flex
  items-center
  justify-center
`;

const pageLayoutStyle = `
  space-y-6
  max-w-5xl
  mx-auto
  w-full
`;

const dashboardHeaderStyle = `
  text-2xl
  font-bold
  tracking-tight
  text-primary
`;

const dashboardErrorStyle = `
  p-3
  bg-danger/10
  border
  border-danger/20
  text-danger
  text-xs
  font-medium
  rounded-xl
`;

const timerPanelStyle = `
  p-6
  bg-card
  border
  border-border
  rounded-xl
  shadow-subtle
  flex
  flex-col
  md:flex-row
  md:items-center
  md:justify-between
  gap-6
`;

const DashboardPage: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);

  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const tickerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const [entriesData, activitiesData] = await Promise.all([
        fetchMyTimeEntriesAPI(),
        fetchMyActivitiesAPI()
      ]);

      setTimeEntries(entriesData);
      setActivities(activitiesData);

      const running = entriesData.find(entry => entry.endTime === null);
      if (running) {
        setActiveTimer(running);
        const startMs = new Date(running.startTime).getTime();
        const nowMs = new Date().getTime();
        setElapsedSeconds(Math.max(0, Math.floor((nowMs - startMs) / 1000)));
      } else {
        setActiveTimer(null);
        setElapsedSeconds(0);
      }
    } catch (err: any) {
      setError(err.message || "Failed loading dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, []);

  useEffect(() => {
    if (activeTimer) {
      tickerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
    }
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [activeTimer]);

  const handleStartTimer = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!selectedActivityId) return;

    setActionLoading(true);
    setError(null);
    try {
      const newTimer = await startTimerAPI(parseInt(selectedActivityId));
      setActiveTimer(newTimer);
      setElapsedSeconds(0);
      setTimeEntries(prev => [newTimer, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopTimer = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await stopTimerAPI();
      setActiveTimer(null);
      setElapsedSeconds(0);
      setSelectedActivityId("");
      await loadDashboardData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatSecondsToClock = (totalSecs: number): string => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0")
    ].join(":");
  };

  const completedEntries = timeEntries.filter(e => e.endTime !== null);
  const totalMinutesTracked = completedEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const totalHoursDisplay = (totalMinutesTracked / 60).toFixed(1);

  if (isLoading) {
    return (
      <div className={loadingStyle}>
        <DNA height="80" width="80" />
      </div>
    );
  }

  return (
    <div className={pageLayoutStyle}>

      {/* Header row */}
      <div>
        <h1 className={dashboardHeaderStyle}>Time Tracker Dashboard</h1>
        <p className={dashboardHeaderStyle}>
          Manage your active working clock counters and historical time entries.
        </p>
      </div>

      {error && (
        <div className={dashboardErrorStyle}>
          {error}
        </div>
      )}

      {/* Tier 1: Active Live Timer Controller Panel */}
      <div className={timerPanelStyle}>
        {activeTimer ? (
          <>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-danger">Tracking Live Session</span>
              </div>
              <h3 className="text-lg font-medium text-primary capitalize">
                {activeTimer.activity?.name || activities.find(a => a.id === activeTimer.activityId)?.name || "Active Task"}
              </h3>
            </div>

            <div className="flex items-center gap-6 justify-between md:justify-end">
              <span className="font-mono text-3xl font-bold tracking-tight text-primary">
                {formatSecondsToClock(elapsedSeconds)}
              </span>
              <button
                onClick={handleStopTimer}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-danger text-white hover:bg-danger transition-colors disabled:opacity-50 cursor-pointer"
              >
                Stop Timer
              </button>
            </div>
          </>
        ) : (
          <>

          </>
        )}
      </div>
    </div>
  )
}

export {
  DashboardPage
}