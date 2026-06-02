import { Suspense, useState } from "react";
import { Sidebar } from "@/shared/ui";
import { DashboardPage } from "@/features/dashboard/components";
import { AnalyticsPage } from "@/features/analytics";
import { ActivitiesPage } from "@/features/activities";
import { DNA } from "react-loader-spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";

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
  const [activePage, setActivePage] = useState<Page>(pages[0]);
  // Create a component for the active page
  const ActivePageComponent = pageComponents[activePage];

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-primary flex">
      <Sidebar
        validPages={pages}
        activePage={activePage}
        onPageChange={setActivePage}
        currentUser={user}
        onLogout={logout}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <DNA height='80' width='80' />
          </div>
        }>
          <ActivePageComponent />
        </Suspense>
      </main>
    </div>
  )
}

export {
  AppLayout,
  type Page,
  pages
}