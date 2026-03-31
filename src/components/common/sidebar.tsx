import { User } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SIDEBAR_MAIN_ITEMS,
  type AppPageId,
} from "@/lib/app-navigation"

type SidebarProps = {
  open: boolean
  onClose: () => void
  activePage: AppPageId
  onNavigate: (page: AppPageId) => void
}

function sidebar({ open, onClose, activePage, onNavigate }: SidebarProps) {

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
                    <p className="text-text-grey text-lg font-bold select-none leading-none">
                        Sathi
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-between flex-1">
                <ul className="flex flex-col gap-2 text-sm">
                    {SIDEBAR_MAIN_ITEMS.map(({ id, label, Icon }) => {
                        const isActive = activePage === id
                        return (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onNavigate(id)
                                        onClose()
                                    }}
                                    className={cn(
                                        "sidebar-item flex w-full items-center gap-2 rounded-10 p-2 text-left transition-colors hover:cursor-pointer",
                                        isActive
                                            ? "bg-white/95 font-medium text-primary-color shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                                            : "text-text-grey-light",
                                    )}
                                >
                                    <Icon className="size-5 shrink-0" />
                                    <span>{label}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>

                <span className="text-text-grey-light flex items-center gap-2 text-sm p-2">
                    <User className="size-5" />
                    <p>Settings</p>
                </span>
            </div>
        </aside>
    )
}

export default sidebar;