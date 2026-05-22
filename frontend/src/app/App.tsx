import { Sidebar } from "@/shared/ui";
import { MetricCard, MetricCardPage } from "@/features/MetricCard";
import { Clock3, Flame, Timer, TrendingUp } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background text-primary flex">
      
      <Sidebar />
      
      <main className="
        flex-1
        p-6
        space-y-6
      ">
        <header>
          <h1 className="
            text-3xl
            font-bold
            tracking-tight
          ">
            Hour Tracker
          </h1>
        </header>
      <MetricCardPage />
      </main>
    </div>
  )
}

export default App;
