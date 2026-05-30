import { MetricCardPage } from "@/features/MetricCard";

const DashboardPage = () => {
    return (
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
    )
}

export {
    DashboardPage
}