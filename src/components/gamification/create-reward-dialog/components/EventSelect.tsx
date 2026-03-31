import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { RewardEventId } from "@/store/rewardSlice"

import {
  INLINE_CANCEL_CLASSNAME,
  INLINE_SAVE_CLASSNAME,
  SELECT_CONTENT_CLASSNAME,
  SELECT_TRIGGER_CLASSNAME,
} from "../constants"
import { getEventOptionLabel } from "../lib/labels"

const PERIOD_OPTIONS = ["14 days", "1 month", "2 months", "3 months", "1 year"] as const

type Props = {
  value: RewardEventId | ""
  open: boolean
  onOpenChange: (open: boolean) => void
  onValueChange: (value: RewardEventId) => void

  eventSalesAmount: string
  eventPostX: string
  eventPostY: string

  pendingSalesAmount: string
  setPendingSalesAmount: (v: string) => void
  pendingPostX: string
  setPendingPostX: (v: string) => void
  pendingPostPeriod: string
  setPendingPostPeriod: (v: string) => void

  postPeriodMenuOpen: boolean
  setPostPeriodMenuOpen: (v: boolean) => void

  onInlineCancel: () => void
  onInlineSave: () => void
}

export function EventSelect(props: Props) {
  const draftLikeForLabels = {
    eventType: props.value,
    eventSalesAmount: props.eventSalesAmount,
    eventPostX: props.eventPostX,
    eventPostY: props.eventPostY,
    rewardType: "",
    rewardBonusAmount: "",
    rewardCommissionPct: "",
  } as const

  const showInlineFooter =
    props.value === "crosses_sales" || props.value === "post_times"

  const saveDisabled =
    props.value === "crosses_sales"
      ? !props.pendingSalesAmount.trim()
      : !props.pendingPostX.trim() || !props.pendingPostPeriod.trim()

  const saveDisabledMessage =
    props.value === "crosses_sales"
      ? "Enter the sales target amount to continue"
      : "Enter post count and period to continue"

  return (
    <div className="space-y-2">
      <Label
        htmlFor="reward-event-select"
        className="block text-sm font-normal text-text-grey"
      >
        Reward event <span className="text-[#F15858]">*</span>
      </Label>

      <Select
        value={props.value || undefined}
        open={props.open}
        onOpenChange={props.onOpenChange}
        onValueChange={(v) => props.onValueChange(v as RewardEventId)}
      >
        <SelectTrigger id="reward-event-select" className={SELECT_TRIGGER_CLASSNAME}>
          <SelectValue placeholder="Select an event" />
        </SelectTrigger>

        <SelectContent
          position="popper"
          align="start"
          sideOffset={3}
          className={cn(
            SELECT_CONTENT_CLASSNAME,
            "w-(--radix-select-trigger-width)",
          )}
        >
          <SelectItem value="crosses_sales">
            {getEventOptionLabel(draftLikeForLabels, "crosses_sales")}
          </SelectItem>

          <AnimatePresence initial={false}>
            {props.value === "crosses_sales" && (
              <motion.div
                key="sales-inline"
                className="pb-2"
                onPointerDown={(e) => e.stopPropagation()}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ overflow: "hidden" }}
              >
                <motion.div
                  className="mt-1 flex h-11 items-center gap-1 rounded-10 border border-primary-color bg-white px-3"
                  initial={{ y: -4 }}
                  animate={{ y: 0 }}
                  exit={{ y: -4 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <span className="shrink-0 text-sm text-text-grey opacity-70">$</span>
                  <Input
                    inputMode="decimal"
                    className="h-9 flex-1 border-0 bg-transparent px-0 text-sm text-text-grey-light shadow-none placeholder:text-text-grey focus-visible:ring-0"
                    placeholder="e.g. 100"
                    value={props.pendingSalesAmount}
                    onChange={(e) => props.setPendingSalesAmount(e.target.value)}
                    aria-label="Sales target amount"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <SelectItem value="post_times">
            {getEventOptionLabel(draftLikeForLabels, "post_times")}
          </SelectItem>

          <AnimatePresence initial={false}>
            {props.value === "post_times" && (
              <motion.div
                key="posts-inline"
                className="pb-2"
                onPointerDown={(e) => e.stopPropagation()}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ overflow: "hidden" }}
              >
                <motion.div
                  className="mt-1 grid grid-cols-2 gap-2"
                  initial={{ y: -4 }}
                  animate={{ y: 0 }}
                  exit={{ y: -4 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                <Input
                  inputMode="numeric"
                  className="h-11 w-full rounded-10 border border-primary-color bg-white px-3 py-0 text-sm font-normal text-text-grey-light shadow-none placeholder:text-text-grey focus-visible:ring-0"
                  placeholder="X e.g. 3"
                  value={props.pendingPostX}
                  onChange={(e) => props.setPendingPostX(e.target.value)}
                  aria-label="Post count"
                />

                <Popover
                  open={props.postPeriodMenuOpen}
                  onOpenChange={props.setPostPeriodMenuOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-11 w-full rounded-10 border border-primary-color bg-white px-3 py-0 text-sm font-normal text-text-grey-light shadow-none",
                        "justify-between",
                      )}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className={cn(
                          "truncate",
                          props.pendingPostPeriod
                            ? "text-text-grey-light"
                            : "text-text-grey",
                        )}
                      >
                        {props.pendingPostPeriod || "Select duration"}
                      </span>
                      {props.postPeriodMenuOpen ? (
                        <ChevronUpIcon className="size-4 shrink-0 opacity-60 text-text-grey" />
                      ) : (
                        <ChevronDownIcon className="size-4 shrink-0 opacity-60 text-text-grey" />
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[220px] rounded-10 border border-light-border bg-white p-0 shadow-lg"
                    align="start"
                    sideOffset={6}
                    onPointerDown={(e) => e.stopPropagation()}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    {PERIOD_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-3 text-left text-sm rounded-10",
                          opt === props.pendingPostPeriod
                            ? "text-primary-color"
                            : "text-text-grey-light",
                          "hover:bg-primary-color-lightest",
                        )}
                        onClick={() => {
                          props.setPendingPostPeriod(opt)
                          props.setPostPeriodMenuOpen(false)
                        }}
                      >
                        <span>{opt}</span>
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <SelectItem value="onboarded">
            {getEventOptionLabel(draftLikeForLabels, "onboarded")}
          </SelectItem>

          <AnimatePresence initial={false}>
            {showInlineFooter && (
              <motion.div
                key="inline-footer"
                className="pt-2"
                onPointerDown={(e) => e.stopPropagation()}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                style={{ overflow: "hidden" }}
              >
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={INLINE_CANCEL_CLASSNAME}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={props.onInlineCancel}
                >
                  Cancel
                </Button>

                {saveDisabled ? (
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <span
                        role="button"
                        tabIndex={0}
                        className="flex w-full rounded-10 outline-none focus-visible:ring-2 focus-visible:ring-primary-color/30"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          disabled
                          tabIndex={-1}
                          className={cn("pointer-events-none w-full", INLINE_SAVE_CLASSNAME)}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          Save
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      sideOffset={5}
                      className="z-120 border-0 bg-text-grey p-2 text-center text-xs font-medium leading-snug text-white [&>svg]:hidden"
                    >
                      {saveDisabledMessage}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    type="button"
                    className={INLINE_SAVE_CLASSNAME}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={props.onInlineSave}
                  >
                    Save
                  </Button>
                )}
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SelectContent>
      </Select>
    </div>
  )
}

