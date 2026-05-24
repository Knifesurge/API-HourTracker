import { cn } from "@/shared/lib";
import { type Page } from "@/app/AppLayout";

type SidebarProps = {
    validPages: Page[];
    activePage: Page;
    onPageChange: (page: Page) => void;
}

const Sidebar = ({ validPages, activePage, onPageChange }: SidebarProps) => {

    const sidebarItemBase = `
        px-3
        py-2
        rounded-xl
        text-left
    `;

    const handleTabPress = (page: Page) => {
        onPageChange(page);
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
                    {validPages.map((page) => (
                        <button 
                            key={page}
                            onClick={() => handleTabPress(page)}
                            className={cn(
                                sidebarItemBase,
                                activePage === page 
                                    ? "bg-surface-hover"
                                    : "hover:bg-surface-hover transition-colors",
                        )}>
                            {page}
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