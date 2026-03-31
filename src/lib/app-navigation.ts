import {
  Brain,
  BriefcaseBusiness,
  ClipboardList,
  Home,
  Wallet,
  type LucideIcon,
} from "lucide-react"

export type AppPageId =
  | "home"
  | "insights"
  | "gamification"
  | "applications"
  | "payments"

/** Default landing area when the app opens */
export const DEFAULT_APP_PAGE: AppPageId = "gamification"

export const SIDEBAR_MAIN_ITEMS: ReadonlyArray<{
  id: AppPageId
  label: string
  Icon: LucideIcon
}> = [
  { id: "home", label: "Home", Icon: Home },
  { id: "insights", label: "Insights", Icon: Brain },
  { id: "gamification", label: "Gamification", Icon: BriefcaseBusiness },
  { id: "applications", label: "Applications", Icon: ClipboardList },
  { id: "payments", label: "Payments", Icon: Wallet },
] as const

export function getPageTitle(id: AppPageId): string {
  return SIDEBAR_MAIN_ITEMS.find((item) => item.id === id)?.label ?? "Gamification"
}
