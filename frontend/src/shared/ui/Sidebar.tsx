import { cn } from "@/shared/lib";
import { useState } from "react";

const tabs = [
    "Dashboard",
    "Activities",
    "Analytics"
] as const;

type Tab = typeof tabs[number];

const Sidebar = () => {

    const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

    const sidebarItemBase = `
        px-3
        py-2
        rounded-xl
        text-left
    `;

    const isValidTab = (value: string): value is Tab => {
        return tabs.includes(value as Tab);
    };

    const handleTabPress = (tab : Tab) => {
        if (isValidTab(tab)) {
            setActiveTab(tab);
        }
    }

    return (
        <aside
            className="
                w-64
                border-r
                border-border
                bg-surface
                p-4
                flex
                flex-col
            ">
                {/* LOGO */}
                <div className="mb-8">
                    <h1 className="
                        text-xl
                        font-semibold
                        tracking-tight
                    ">
                        Hour Tracker
                    </h1>
                </div>
                {/* NAVIGATION */}
                <nav className="
                    flex
                    flex-col
                    gap-2
                ">
                    {tabs.map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => handleTabPress(tab)}
                            className={cn(
                                sidebarItemBase,
                                activeTab === tab 
                                    ? "bg-surface-hover"
                                    : "hover:bg-surface-hover transition-colors",
                        )}>
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Spacer */}
                <div className="flex-1" />

                {/* FOOTER */}
                <div className="
                    border-t
                    border-borer
                    pt-4
                    text-sm
                    text-muted
                ">
                    Productivity Insights
                </div>
            </aside>
    )
}

export {
    Sidebar
};