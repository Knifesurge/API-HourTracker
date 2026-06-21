import { cn } from "@/shared/lib";
import { type Page } from "@/types/types";
import { type UserProfile } from "@/features/auth/api/auth";

type SidebarProps = {
    validPages: readonly Page[];
    activePage: Page;
    onPageChange: (page: Page) => void;
    currentUser: UserProfile | null;
    onLogout: () => void;
}

const Sidebar = ({ validPages, activePage, onPageChange, currentUser, onLogout }: SidebarProps) => {

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
                sticky
                top-0
                h-screen
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
                {/* User context card */}
                {currentUser && (
                    <div className="px-1">
                        <p className="text-xs text-muted font-medium">Logged in as</p>
                        <p className="text-xs font-medium truncate text-primary" title={currentUser.email}>
                            {currentUser.name || currentUser.email}
                        </p>
                    </div>
                )}

                {/* Signout button */}
                <button
                    onClick={onLogout}
                    className={cn(
                        sidebarItemBase,
                        "w-full text-center text-xs font-semibold bg-surface border border-border text-primary hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-colors cursor-pointer"
                    )}
                >
                    Sign Out
                </button>

                <div className="text-xs text-muted px-1 mt-1">
                    Productivity Insights
                </div>
            </div>
        </aside>
    )
}

export {
    Sidebar
};