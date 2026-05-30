import { Suspense, useState } from "react";
import { Sidebar } from "@/shared/ui";
import { DashboardPage } from "@/features/Dashboard";
import { AnalyticsPage } from "@/features/Analytics";
import { ActivitiesPage } from "@/features/Activities";
import { DNA } from "react-loader-spinner";

const pages = [
  "Dashboard",
  "Activities",
  "Analytics"
] as const;

type Page = typeof pages[number];

// Used to dynamically render the active page
const pageComponents: Record<Page, React.ComponentType> = {
    Dashboard: DashboardPage,
    Analytics: AnalyticsPage,
    Activities: ActivitiesPage
};

const AppLayout = () => {
    const [ activePage, setActivePage ] = useState<Page>(pages[0]);
    // Create a component for the active page
    const ActivePageComponent = pageComponents[activePage];

  return (
    <div className="min-h-screen bg-background text-primary flex">
        <Sidebar validPages={pages} activePage={activePage} onPageChange={setActivePage} />
        <Suspense fallback={<DNA />}>
            <ActivePageComponent />
        </Suspense>
    </div>
  )
}

export {
    AppLayout,
    type Page,
    pages
}