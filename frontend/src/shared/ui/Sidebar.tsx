import { cn } from "@/shared/lib";

const Sidebar = () => {

    const sidebarItemBase = `
        px-3
        py-2
        rounded-xl
        text-left
    `;

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
                    <button className={cn(
                        sidebarItemBase,
                        "bg-surface-hover"
                    )}>
                        Dashboard
                    </button>

                    <button className={cn(
                        sidebarItemBase,
                        "hover:bg-surface-hover transition-colors"
                    )}>
                        Activities
                    </button>

                    <button className={cn(
                        sidebarItemBase,
                        "hover:bg-surface-hover transition-colors"
                    )}>
                        Analytics
                    </button>
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