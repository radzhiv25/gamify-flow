// import React from 'react'

import { Bell, CircleUserRound, Menu } from "lucide-react"

type NavbarProps = {
  onOpenSidebar: () => void
  title: string
}

const navbar = ({ onOpenSidebar, title }: NavbarProps) => {
  return (
    <div className="flex items-center justify-between py-4 text-text-grey">
        <button
            type="button"
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded hover:bg-white/60"
            aria-label="Open sidebar"
        >
            <Menu className="size-5" />
        </button>

        <h1 className="font-semibold text-xl text-text-grey">{title}</h1>

        <span className="flex items-center gap-4">
            <Bell/>
            <CircleUserRound/>
        </span>
    </div>
  )
}

export default navbar