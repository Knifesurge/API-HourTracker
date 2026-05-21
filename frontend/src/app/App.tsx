import { Dashboard } from "../features/DashboardCard";
import { MetricCard } from "../features/MetricCard";
import { Clock3, Flame, Timer, TrendingUp } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <p className='text-3xl bg-red-400 font-bold underline'>My App</p>
      <Dashboard />
      <section
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >
        <MetricCard 
          label="Total Hours"
          value="34.5h"
          change="+5%"
          icon={<Clock3 />}
        />
        <MetricCard
          label="Average Session"
          value="2.1h"
          change="+8%"
          icon={<TrendingUp />}
        />
        <MetricCard
          label="Current Streak"
          value="12 Days"
          change="+2 Days"
          icon={<Flame />}
        />
        <MetricCard
          label="Longest Session"
          value="5.4h"
          change="-12%"
          icon={<Timer />}
        />
      </section>
    </div>
  )
}

export default App;
