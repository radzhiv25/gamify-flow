import { Brain, Home, BriefcaseBusiness, ClipboardList, Wallet, User } from "lucide-react";

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

function sidebar({ open, onClose }: SidebarProps) {
    const sidebarItems = [
        { label: "Home", Icon: Home },
        { label: "Insights", Icon: Brain },
        { label: "Gamification", Icon: BriefcaseBusiness },
        { label: "Applications", Icon: ClipboardList },
        { label: "Payments", Icon: Wallet },
    ] as const;

    return (
        <aside
            className={[
                "bg-primary-color-lightest p-4 flex flex-col overflow-y-auto w-64 md:w-44 h-full md:h-screen",
                "fixed inset-y-0 left-0 z-50 transition-transform duration-200",
                open ? "translate-x-0" : "-translate-x-full",
                "md:translate-x-0 md:static",
            ].join(" ")}
            aria-hidden={!open}
        >
            <div className="flex items-center gap-3 mb-4 sidebar-blurred-placeholder">
                <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: "var(--primary-color)" }}
                />
                <div className="flex flex-col gap-2">
                    <p className="text-text-grey text-sm font-medium select-none leading-none">
                        Gamify Flow
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-between flex-1">
                <ul className="flex flex-col gap-2 text-sm">
                    {sidebarItems.map(({ label, Icon }) => (
                        <li
                            key={label}
                            onClick={onClose}
                            className="sidebar-item p-2 text-text-grey flex items-center gap-2 transition-colors rounded-[10px] hover:cursor-pointer"
                        >
                            <Icon className="size-5" />
                            <span>{label}</span>
                        </li>
                    ))}
                </ul>

                <span className="text-text-grey flex items-center gap-2 text-sm p-2">
                    <User className="size-5" />
                    <p>Settings</p>
                </span>
            </div>
        </aside>
    )
}

export default sidebar;