import { Dashboard } from "../features/DashboardCard";
import { MetricCard } from "../features/MetricCard";

function App() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <p className='text-3xl bg-red-400 font-bold underline'>My App</p>
      <Dashboard />
      <MetricCard 
        title="Total Hours"
        size="md"
        description="Hours logged this week"
      />
    </div>
  )
}

export default App;
