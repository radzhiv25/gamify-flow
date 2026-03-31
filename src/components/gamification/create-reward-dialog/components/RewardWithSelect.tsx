import { useCallback, useRef, useState } from "react"
import { CheckIcon, PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { RewardWithId } from "@/store/rewardSlice"

import {
  INLINE_CANCEL_CLASSNAME,
  INLINE_SAVE_CLASSNAME,
  SELECT_CONTENT_CLASSNAME,
  SELECT_TRIGGER_CLASSNAME,
} from "../constants"
import { getRewardOptionLabel } from "../lib/labels"

const COMMISSION_TIER_OPTIONS = [
  "Tier Name Here",
  "Tier Name Here 2",
  "Tier Name Here 3",
  "Tier Name Here 4",
] as const

type Props = {
  value: RewardWithId | ""
  open: boolean
  onOpenChange: (open: boolean) => void
  onValueChange: (value: RewardWithId) => void

  rewardBonusAmount: string
  rewardCommissionPct: string
  commissionDisabledForEvent: boolean

  pendingBonusAmount: string
  setPendingBonusAmount: (v: string) => void
  pendingCommissionPct: string
  setPendingCommissionPct: (v: string) => void

  onInlineCancel: () => void
  onInlineSave: () => void
}

export function RewardWithSelect(props: Props) {
  const [commissionView, setCommissionView] = useState<"options" | "tiers">(
    "options",
  )
  const justSelectedCommissionRef = useRef(false)

  const { onOpenChange, value } = props

  const draftLikeForLabels = {
    eventType: "",
    eventSalesAmount: "",
    eventPostX: "",
    eventPostY: "",
    rewardType: props.value,
    rewardBonusAmount: props.rewardBonusAmount,
    rewardCommissionPct: props.rewardCommissionPct,
  } as const

  const showInlineFooter =
    props.value === "flat_bonus" ||
    (props.value === "commission" && commissionView === "options")

  const saveDisabled =
    props.value === "flat_bonus"
      ? !props.pendingBonusAmount.trim()
      : !props.pendingCommissionPct.trim()

  const saveDisabledMessage =
    props.value === "flat_bonus"
      ? "Enter the bonus amount to continue"
      : "Select a commission tier to continue"

  const handleOpenChange = useCallback(
    (next: boolean) => {
      onOpenChange(next)
      if (next && value === "commission") {
        setCommissionView("tiers")
      }
      if (!next) {
        // When selecting a select item, Radix closes then we re-open programmatically.
        // Avoid resetting view in that close transition.
        if (justSelectedCommissionRef.current) {
          justSelectedCommissionRef.current = false
          return
        }
        setCommissionView("options")
      }
    },
    [onOpenChange, value],
  )

  return (
    <div className="space-y-2">
      <Label
        htmlFor="reward-with-select"
        className="block text-sm font-normal text-text-grey"
      >
        Reward with <span className="text-[#F15858]">*</span>
      </Label>

      <Select
        value={props.value || undefined}
        open={props.open}
        onOpenChange={handleOpenChange}
        onValueChange={(v) => {
          const next = v as RewardWithId
          props.onValueChange(next)
          if (next === "commission") {
            justSelectedCommissionRef.current = true
            setCommissionView("tiers")
          } else {
            setCommissionView("options")
          }
        }}
      >
        <SelectTrigger id="reward-with-select" className={SELECT_TRIGGER_CLASSNAME}>
          <SelectValue placeholder="Select a reward" />
        </SelectTrigger>

        <SelectContent
          position="popper"
          align="start"
          sideOffset={6}
          className={cn(
            SELECT_CONTENT_CLASSNAME,
            "w-(--radix-select-trigger-width)",
          )}
        >
          {props.value === "commission" && commissionView === "tiers" ? (
            <div className="pb-2" onPointerDown={(e) => e.stopPropagation()}>
              <div className="px-1">
                <div className="px-2 pb-2 pt-1 text-xs font-medium text-text-grey">
                  Select a commission tier
                </div>

                <div className="flex flex-col gap-1">
                  {COMMISSION_TIER_OPTIONS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-10 px-3 py-2 text-left text-sm",
                        tier === props.pendingCommissionPct
                          ? "bg-primary-color-lightest text-primary-color"
                          : "text-text-grey-light hover:bg-primary-color-lightest",
                      )}
                      onClick={() => props.setPendingCommissionPct(tier)}
                    >
                      <span className="truncate">{tier}</span>
                      {tier === props.pendingCommissionPct ? (
                        <CheckIcon className="size-4 shrink-0 text-primary-color" />
                      ) : null}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className={INLINE_CANCEL_CLASSNAME}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => setCommissionView("options")}
                    >
                      Go Back
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
                              className={cn(
                                "pointer-events-none w-full",
                                INLINE_SAVE_CLASSNAME,
                              )}
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
                </div>
              </div>
            </div>
          ) : (
            <>
              <SelectItem value="flat_bonus">
                {getRewardOptionLabel(draftLikeForLabels, "flat_bonus")}
              </SelectItem>

              {/* Hidden item to let Radix render selected label in trigger */}
              <SelectItem value="commission" className="hidden">
                {getRewardOptionLabel(draftLikeForLabels, "commission")}
              </SelectItem>

              {props.value === "flat_bonus" && (
                <div className="pb-2" onPointerDown={(e) => e.stopPropagation()}>
                  <div className="mt-1 flex h-11 items-center gap-1 rounded-10 border border-primary-color bg-white px-3">
                    <span className="shrink-0 text-sm text-text-grey opacity-70">$</span>
                    <Input
                      inputMode="decimal"
                      className="h-9 flex-1 border-0 bg-transparent px-0 text-sm text-text-grey-light shadow-none placeholder:text-text-grey focus-visible:ring-0"
                      placeholder="e.g. 100"
                      value={props.pendingBonusAmount}
                      onChange={(e) => props.setPendingBonusAmount(e.target.value)}
                      aria-label="Bonus amount"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                role="option"
                aria-disabled={props.commissionDisabledForEvent}
                className={cn(
                  "group relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-14 pl-2 text-sm outline-hidden select-none",
                  props.commissionDisabledForEvent
                    ? "pointer-events-none opacity-50"
                    : "text-text-grey-light hover:bg-primary-color-lightest hover:text-primary-color focus:bg-primary-color-lightest",
                )}
                onPointerDown={(e) => {
                  // prevent Radix Select from closing the menu on "selection"
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (props.commissionDisabledForEvent) return

                  props.setPendingCommissionPct(props.rewardCommissionPct)
                  justSelectedCommissionRef.current = true
                  setCommissionView("tiers")
                  props.onValueChange("commission")
                  // Keep menu open and let parent sync pending values.
                  props.onOpenChange(true)
                }}
              >
                <span className="flex-1 text-left">
                  {getRewardOptionLabel(draftLikeForLabels, "commission")}
                </span>
                {props.value === "commission" && props.rewardCommissionPct.trim() ? (
                  <button
                    type="button"
                    className={cn(
                      "absolute right-2 inline-flex size-7 items-center justify-center rounded-10",
                      "text-text-grey opacity-0 transition-opacity group-hover:opacity-100",
                      "hover:bg-primary-color-lightest",
                    )}
                    aria-label="Edit commission tier"
                    onPointerDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      props.setPendingCommissionPct(props.rewardCommissionPct)
                      setCommissionView("tiers")
                      props.onValueChange("commission")
                      props.onOpenChange(true)
                    }}
                  >
                    <PencilIcon className="size-4 text-text-grey-light" />
                  </button>
                ) : null}
              </button>
            </>
          )}

          {showInlineFooter && (
            <div className="pt-2" onPointerDown={(e) => e.stopPropagation()}>
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
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

