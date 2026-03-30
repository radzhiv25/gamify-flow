import Navbar from "./components/common/navbar";
import Sidebar from "./components/common/sidebar";
import { GamificationHero } from "./components/gamification/GamificationHero";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
    <div className="flex font-jakarta-sans flex-col md:flex-row min-h-screen md:h-screen md:overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative z-0 flex w-full flex-1 flex-col bg-white md:h-screen md:overflow-y-auto">
        <div className="mx-auto w-full max-w-[1152px] px-4 md:px-8">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
          <GamificationHero />
        </div>
      </div>
    </div>
    </>
  )
}

export default App;