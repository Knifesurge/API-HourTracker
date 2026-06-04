import React, { useEffect, useState, useRef } from 'react';
import {
  fetchMyTimeEntriesAPI,
  startTimerAPI,
  stopTimerAPI,
  type TimeEntry
} from "@/features/auth/api/timeEntries";
import { fetchMyActivitiesAPI, type Activity } from '@/features/activities/api/activities';
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
  // Dynamic calculation fallback: Recompute real minutes from raw timestamps
  const totalMinutesTracked = completedEntries.reduce((sum, e) => {
    const start = new Date(e.startTime).getTime();
    const end = new Date(e.endTime!).getTime(); // Asserting non-null since filtered above
    const realDiffMinutes = Math.round((end - start) / 60000);
    return sum + realDiffMinutes;
  }, 0);

  // Safely translate the clean, corrected minutes total into standard decimal hours
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
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-danger text-white hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Stop Timer
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-primary">What are you working on right now?</h3>
              <p className="text-xs text-muted">Select an item to start tracking</p>
            </div>

            <form
              onSubmit={handleStartTimer}
              className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto"
            >
              <select
                value={selectedActivityId}
                onChange={(e) => setSelectedActivityId(e.target.value)}
                disabled={actionLoading || activities.length === 0}
                className="px-3 py-2 rounded-lg bg-input border border-input text-sm text-primary focus:outline-none focus:border-accent transition-all min-w-[200px]"
              >
                <option value="">-- Choose an Activity --</option>
                {activities.map(activity => (
                  <option key={activity.id} value={activity.id} className="capitalize">{activity.name}</option>
                ))}
              </select>

              <button
                type="submit"
                disabled={actionLoading || !selectedActivityId}
                className="px-5 py-2 rounded-xl font-semibold text-sm bg-accent text-accent-foreground hover:bg-accent-hover transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                Start Tracking
              </button>
            </form>
          </>
        )}
      </div>

      {/* Tier 2: Analytical Metrics Grid Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Total Time Tracked</p>
          <p className="text-2xl font-semibold text-primary mt-1">{totalHoursDisplay} <span className="text-sm font-normal text-muted">hrs</span></p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Completed Sessions</p>
          <p className="text-2xl font-semibold text-primary mt-1">{completedEntries.length} <span className="text-sm font-normal text-muted">activities</span></p>
        </div>
      </div>

      {/* Tier 3: History Ledger Table Container */}
      <div className="p-5 bg-card border border-border rounded-xl space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">Recent Tracking History</h3>

        {timeEntries.length === 0 ? (
          <p className="text-xs text-muted text-center py-6">No tracking history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-muted bg-surface-hover/20">
                  <th className="py-2 px-3">Activity</th>
                  <th className="py-2 px-3">Started</th>  
                  <th className="py-2 px-3">Ended</th>
                  <th className="py-2 px-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {timeEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-primary capitalize">
                      {entry.activity?.name || activities.find(a => a.id === entry.activityId)?.name || "Task Logging"}
                    </td>
                    <td className="py-3 px-3 text-secondary text-xs">
                      {new Date(entry.startTime).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="py-3 px-3 text-secondary text-xs">
                      {entry.endTime ? (
                        new Date(entry.endTime).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-danger/10 text-danger animate-pulse uppercase">Active</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      {entry.endTime ? (
                        (() => {
                          const start = new Date(entry.startTime).getTime();
                          const end = new Date(entry.endTime!).getTime();
                          const diffMinutes = Math.round((end - start) / 60_000);
                          return `${diffMinutes} min`;
                        })()
                      ) : (
                        "--"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};

export {
  DashboardPage
}