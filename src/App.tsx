import Navbar from "./components/common/navbar"
import Sidebar from "./components/common/sidebar"
import { WorkInProgress } from "./components/common/WorkInProgress"
import { GamificationHero } from "./components/gamification/GamificationHero"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  DEFAULT_APP_PAGE,
  getPageTitle,
  type AppPageId,
} from "@/lib/app-navigation"
import { useState } from "react"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState<AppPageId>(DEFAULT_APP_PAGE)

  const navTitle = getPageTitle(activePage)

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen flex-col font-jakarta-sans md:h-screen md:flex-row md:overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activePage={activePage}
          onNavigate={setActivePage}
        />

        <div className="relative z-0 flex w-full flex-1 flex-col bg-white md:h-screen md:overflow-y-auto">
          <div className="mx-auto w-full max-w-[1152px] px-4 md:px-8">
            <Navbar
              onOpenSidebar={() => setSidebarOpen(true)}
              title={navTitle}
            />
            {activePage === "gamification" ? (
              <GamificationHero />
            ) : (
              <WorkInProgress />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default App;