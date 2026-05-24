import { useState } from "react";
import { Sidebar } from "@/shared/ui";
import { DashboardPage } from "@/features/Dashboard";

const pages = [
  "Dashboard",
  "Activities",
  "Analytics"
] as const;

type Page = typeof pages[number];

const AppLayout = () => {
    const [ activePage, setActivePage ] = useState<Page>(pages[0]);
  
  return (
    <div className="min-h-screen bg-background text-primary flex">
      
      <Sidebar validPages={pages} activePage={activePage} onPageChange={setActivePage} />
      
      <DashboardPage />
    </div>
  )
}

export {
    AppLayout,
    type Page,
    pages
}