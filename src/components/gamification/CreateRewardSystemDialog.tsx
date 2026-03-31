import { type ReactNode, useCallback, useMemo, useRef, useState } from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  commitRewardFromDraft,
  resetRewardDraft,
  setRewardEvent,
  setRewardWith,
  updateRewardDraft,
  type RewardEventId,
  type RewardWithId,
} from "@/store/rewardSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

type CreateRewardSystemDialogProps = {
  children: ReactNode
}

const selectTriggerClassName =
  "h-11 w-full rounded-10 bg-white px-3 text-sm font-normal text-text-grey-light shadow-none focus-visible:ring-2 focus-visible:ring-primary-color/20 [&_[data-slot=select-value]]:text-text-grey-light"

function CreateRewardSystemDialog({ children }: CreateRewardSystemDialogProps) {
  const dispatch = useAppDispatch()
  const draft = useAppSelector((s) => s.rewards.draft)

  const [open, setOpen] = useState(false)
  const [eventMenuOpen, setEventMenuOpen] = useState(false)
  const [pendingSalesAmount, setPendingSalesAmount] = useState("")
  const [pendingPostX, setPendingPostX] = useState("")
  const [pendingPostPeriod, setPendingPostPeriod] = useState("")
  const [postPeriodMenuOpen, setPostPeriodMenuOpen] = useState(false)
  const [rewardMenuOpen, setRewardMenuOpen] = useState(false)
  const [pendingBonusAmount, setPendingBonusAmount] = useState("")
  const [pendingCommissionPct, setPendingCommissionPct] = useState("")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [successActive, setSuccessActive] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const needsCoreSelections = !draft.eventType || !draft.rewardType
  const needsEndDate = Boolean(draft.timeBound) && !draft.endDate
  const needsSalesAmount =
    draft.eventType === "crosses_sales" && !draft.eventSalesAmount.trim()
  const needsPostInputs =
    draft.eventType === "post_times" &&
    (!draft.eventPostX.trim() || !draft.eventPostY.trim())
  const needsBonusAmount =
    draft.rewardType === "flat_bonus" && !draft.rewardBonusAmount.trim()
  const needsCommissionPct =
    draft.rewardType === "commission" && !draft.rewardCommissionPct.trim()

  const commissionDisabledForEvent =
    draft.eventType === "post_times" || draft.eventType === "onboarded"

  const endDateObj = useMemo(() => {
    return draft.endDate ? new Date(`${draft.endDate}T12:00:00`) : undefined
  }, [draft.endDate])

  const canCreateCore =
    Boolean(draft.eventType) &&
    Boolean(draft.rewardType) &&
    (draft.eventType !== "crosses_sales" ||
      Boolean(draft.eventSalesAmount.trim())) &&
    (draft.eventType !== "post_times" ||
      (Boolean(draft.eventPostX.trim()) && Boolean(draft.eventPostY.trim()))) &&
    (draft.rewardType !== "flat_bonus" ||
      Boolean(draft.rewardBonusAmount.trim())) &&
    (draft.rewardType !== "commission" ||
      Boolean(draft.rewardCommissionPct.trim()))

  const canSubmit = canCreateCore && (!draft.timeBound || Boolean(draft.endDate))

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const handleEventMenuOpenChange = useCallback(
    (next: boolean) => {
      setEventMenuOpen(next)
      if (next && draft.eventType === "crosses_sales") {
        setPendingSalesAmount(draft.eventSalesAmount)
      }
      if (next && draft.eventType === "post_times") {
        setPendingPostX(draft.eventPostX)
        setPendingPostPeriod(draft.eventPostY)
      }
    },
    [draft.eventPostX, draft.eventPostY, draft.eventSalesAmount, draft.eventType],
  )

  const handleRewardMenuOpenChange = useCallback(
    (next: boolean) => {
      setRewardMenuOpen(next)
      if (next && draft.rewardType === "flat_bonus") {
        setPendingBonusAmount(draft.rewardBonusAmount)
      }
      if (next && draft.rewardType === "commission") {
        setPendingCommissionPct(draft.rewardCommissionPct)
      }
    },
    [draft.rewardBonusAmount, draft.rewardCommissionPct, draft.rewardType],
  )

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) clearCloseTimer()
      setOpen(next)
      if (!next) {
        setEventMenuOpen(false)
        setPendingSalesAmount("")
        setPendingPostX("")
        setPendingPostPeriod("")
        setPostPeriodMenuOpen(false)
        setRewardMenuOpen(false)
        setPendingBonusAmount("")
        setPendingCommissionPct("")
        setCalendarOpen(false)
        setSuccessActive(false)
        dispatch(resetRewardDraft())
      }
    },
    [clearCloseTimer, dispatch],
  )

  const handleCreate = useCallback(() => {
    if (!canSubmit || successActive) return
    dispatch(commitRewardFromDraft())
    dispatch(resetRewardDraft())
    setSuccessActive(true)
    setEventMenuOpen(false)
    setPendingSalesAmount("")
    setPendingPostX("")
    setPendingPostPeriod("")
    setPostPeriodMenuOpen(false)
    setRewardMenuOpen(false)
    setPendingBonusAmount("")
    setPendingCommissionPct("")
    setCalendarOpen(false)
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      setSuccessActive(false)
      closeTimerRef.current = null
    }, 950)
  }, [canSubmit, clearCloseTimer, dispatch, successActive])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        // desc
        className={cn(
          "max-w-[400px] rounded-[12px] bg-white p-6",
          "!flex !flex-col !gap-0 min-h-[372px]",
        )}
      >
        <DialogHeader className="relative space-y-0 pr-10 text-left">
          <DialogTitle className="text-[22px] font-medium leading-7 tracking-tight text-text-grey">
            Create your reward system
          </DialogTitle>

          <DialogClose
            className="absolute right-0 top-0 rounded-10 p-2 text-text-grey opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Close dialog"
          >
            <XIcon className="size-5" aria-hidden />
          </DialogClose>
        </DialogHeader>

        <div className="mt-6 flex flex-1 flex-col gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="reward-event-select"
              className="block text-sm font-normal text-text-grey"
            >
              Reward event <span className="text-[#F15858]">*</span>
            </Label>
            <Select
              value={draft.eventType || undefined}
              open={eventMenuOpen}
              onOpenChange={handleEventMenuOpenChange}
              onValueChange={(v) => {
                const id = v as RewardEventId
                dispatch(setRewardEvent(id))
                if ((id === "post_times" || id === "onboarded") && draft.rewardType === "commission") {
                  dispatch(updateRewardDraft({ rewardType: "", rewardCommissionPct: "" }))
                }
                if (id === "crosses_sales" || id === "post_times") {
                  window.setTimeout(() => setEventMenuOpen(true), 0)
                }
              }}
            >
              <SelectTrigger
                id="reward-event-select"
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent
                className={cn(
                  "rounded-10 shadow-lg",
                  // selected item: primary text + light magenta background
                  "[&_[data-slot=select-item][data-state=checked]]:bg-primary-color-lightest",
                  "[&_[data-slot=select-item][data-state=checked]]:text-primary-color",
                  "[&_[data-slot=select-item][data-state=checked]_[data-slot=select-item-indicator]_svg]:text-primary-color",
                )}
              >
                <SelectItem value="crosses_sales">
                  {draft.eventSalesAmount.trim()
                    ? `Cross $${draft.eventSalesAmount.trim()} in sales`
                    : "Cross $X in sales"}
                </SelectItem>
                {draft.eventType === "crosses_sales" && (
                  <div
                    className="pb-2"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div className="mt-1 flex h-11 items-center gap-1 rounded-10 border border-primary-color bg-white px-3">
                      <span className="shrink-0 text-sm text-text-grey opacity-70">
                        $
                      </span>
                      <Input
                        inputMode="decimal"
                        className="h-9 flex-1 border-0 bg-transparent px-0 text-sm text-text-grey-light shadow-none placeholder:text-text-grey focus-visible:ring-0"
                        placeholder="e.g. 100"
                        value={pendingSalesAmount}
                        onChange={(e) => setPendingSalesAmount(e.target.value)}
                        aria-label="Sales target amount"
                      />
                    </div>
                  </div>
                )}
                <SelectItem value="post_times">
                  {draft.eventPostX.trim() && draft.eventPostY.trim()
                    ? `Posts ${draft.eventPostX.trim()} times every ${draft.eventPostY.trim()}`
                    : "Posts X times every Y period"}
                </SelectItem>
                {draft.eventType === "post_times" && (
                  <div
                    className="pb-2"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <Input
                        inputMode="numeric"
                        className="h-11 w-full rounded-10 border border-primary-color bg-white px-3 py-0 text-sm font-normal text-text-grey-light shadow-none placeholder:text-text-grey focus-visible:ring-0"
                        placeholder="X e.g. 3"
                        value={pendingPostX}
                        onChange={(e) => setPendingPostX(e.target.value)}
                        aria-label="Post count"
                      />
                      <Popover
                        open={postPeriodMenuOpen}
                        onOpenChange={setPostPeriodMenuOpen}
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
                                pendingPostPeriod
                                  ? "text-text-grey-light"
                                  : "text-text-grey",
                              )}
                            >
                              {pendingPostPeriod || "Select duration"}
                            </span>
                            {postPeriodMenuOpen ? (
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
                          {[
                            "14 days",
                            "1 month",
                            "2 months",
                            "3 months",
                            "1 year",
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={cn(
                                "flex w-full items-center justify-between px-4 py-3 text-left text-sm rounded-10",
                                opt === pendingPostPeriod
                                  ? "text-primary-color"
                                  : "text-text-grey-light",
                                "hover:bg-primary-color-lightest",
                              )}
                              onClick={() => {
                                setPendingPostPeriod(opt)
                                setPostPeriodMenuOpen(false)
                              }}
                            >
                              <span>{opt}</span>
                            </button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
                <SelectItem value="onboarded">Is Onboarded</SelectItem>
                {(draft.eventType === "crosses_sales" ||
                  draft.eventType === "post_times") && (
                  <div
                    className="pt-2"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-10 bg-white text-sm font-medium text-text-grey-light shadow-none hover:bg-primary-color-lightest"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          setPendingSalesAmount(draft.eventSalesAmount)
                          setPendingPostX(draft.eventPostX)
                          setPendingPostPeriod(draft.eventPostY)
                          setEventMenuOpen(false)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={
                          draft.eventType === "crosses_sales"
                            ? !pendingSalesAmount.trim()
                            : !pendingPostX.trim() || !pendingPostPeriod.trim()
                        }
                        className="h-10 rounded-10 bg-primary-color-light text-sm font-medium text-white shadow-none hover:bg-primary-color active:bg-primary-color-dark disabled:opacity-60"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          dispatch(
                            updateRewardDraft(
                              draft.eventType === "crosses_sales"
                                ? {
                                    eventSalesAmount: pendingSalesAmount.trim(),
                                  }
                                : {
                                    eventPostX: pendingPostX.trim(),
                                    eventPostY: pendingPostPeriod.trim(),
                                  },
                            ),
                          )
                          setEventMenuOpen(false)
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="reward-with-select"
              className="block text-sm font-normal text-text-grey"
            >
              Reward with <span className="text-[#F15858]">*</span>
            </Label>
            <Select
              value={draft.rewardType || undefined}
              open={rewardMenuOpen}
              onOpenChange={handleRewardMenuOpenChange}
              onValueChange={(v) => {
                const id = v as RewardWithId
                dispatch(setRewardWith(id))
                if (id === "flat_bonus" || id === "commission") {
                  window.setTimeout(() => setRewardMenuOpen(true), 0)
                }
              }}
            >
              <SelectTrigger
                id="reward-with-select"
                className={selectTriggerClassName}
              >
                <SelectValue placeholder="Select a reward" />
              </SelectTrigger>
              <SelectContent
                className={cn(
                  "rounded-10 shadow-lg",
                  // selected item: primary text + light magenta background
                  "[&_[data-slot=select-item][data-state=checked]]:bg-primary-color-lightest",
                  "[&_[data-slot=select-item][data-state=checked]]:text-primary-color",
                  "[&_[data-slot=select-item][data-state=checked]_[data-slot=select-item-indicator]_svg]:text-primary-color",
                )}
              >
                <SelectItem value="flat_bonus">
                  {draft.rewardBonusAmount.trim()
                    ? `Flat $${draft.rewardBonusAmount.trim()} bonus`
                    : "Flat $X bonus"}
                </SelectItem>
                {draft.rewardType === "flat_bonus" && (
                  <div
                    className="pb-2"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div className="mt-1 flex h-11 items-center gap-1 rounded-10 border border-primary-color bg-white px-3">
                      <span className="shrink-0 text-sm text-text-grey opacity-70">
                        $
                      </span>
                      <Input
                        inputMode="decimal"
                        className="h-9 flex-1 border-0 bg-transparent px-0 text-sm text-text-grey-light shadow-none placeholder:text-text-grey focus-visible:ring-0"
                        placeholder="e.g. 100"
                        value={pendingBonusAmount}
                        onChange={(e) => setPendingBonusAmount(e.target.value)}
                        aria-label="Bonus amount"
                      />
                    </div>
                  </div>
                )}
                <SelectItem value="commission" disabled={commissionDisabledForEvent}>
                  {draft.rewardCommissionPct.trim()
                    ? `Upgrade to (${draft.rewardCommissionPct.trim()})`
                    : "Upgrade Commission Tier"}
                </SelectItem>
                {draft.rewardType === "commission" && (
                  <div
                    className="pb-2"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div className="mt-1 flex h-11 items-center gap-1 rounded-10 border border-primary-color bg-white px-3">
                      <Input
                        inputMode="text"
                        className="h-9 flex-1 border-0 bg-transparent px-0 text-sm text-text-grey-light shadow-none placeholder:text-text-grey focus-visible:ring-0"
                        placeholder="Tier Name Here"
                        value={pendingCommissionPct}
                        onChange={(e) =>
                          setPendingCommissionPct(e.target.value)
                        }
                        aria-label="Commission tier name"
                      />
                    </div>
                  </div>
                )}
                {/* Points option removed per latest spec */}
                {(draft.rewardType === "flat_bonus" ||
                  draft.rewardType === "commission") && (
                  <div
                    className="pt-2"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-10 bg-white text-sm font-medium text-text-grey-light shadow-none hover:bg-primary-color-lightest"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          setPendingBonusAmount(draft.rewardBonusAmount)
                          setPendingCommissionPct(draft.rewardCommissionPct)
                          setRewardMenuOpen(false)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={
                          draft.rewardType === "flat_bonus"
                            ? !pendingBonusAmount.trim()
                            : !pendingCommissionPct.trim()
                        }
                        className="h-10 rounded-10 bg-primary-color-light text-sm font-medium text-white shadow-none hover:bg-primary-color active:bg-primary-color-dark disabled:opacity-60"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          dispatch(
                            updateRewardDraft(
                              draft.rewardType === "flat_bonus"
                                ? {
                                    rewardBonusAmount:
                                      pendingBonusAmount.trim(),
                                  }
                                : {
                                    rewardCommissionPct:
                                      pendingCommissionPct.trim(),
                                  },
                            ),
                          )
                          setRewardMenuOpen(false)
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="time-bound-switch"
                className="cursor-pointer text-sm font-medium text-text-grey-light"
              >
                Make the reward time bound
              </Label>
              <Switch
                id="time-bound-switch"
                checked={draft.timeBound}
                onCheckedChange={(checked) =>
                  dispatch(
                    updateRewardDraft({
                      timeBound: checked,
                      ...(checked ? {} : { endDate: null }),
                    }),
                  )
                }
                className="h-6 w-11 shrink-0 data-[state=checked]:bg-primary-color data-[state=unchecked]:bg-[#E3E3E3]"
              />
            </div>
            <p className="text-xs leading-relaxed text-text-grey">
              Choose an end date to stop this reward automatically.
            </p>

            {draft.timeBound && (
              <div className="pt-2">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-10 w-full rounded-10 px-3 text-sm font-normal shadow-none",
                        "flex items-center justify-start gap-2 text-left",
                        "focus-visible:ring-2 focus-visible:ring-primary-color",
                      )}
                    >
                      <CalendarIcon className="size-4 shrink-0 text-text-grey opacity-70" />
                      <span
                        className={cn(
                          "truncate",
                          endDateObj ? "text-text-grey-light" : "text-text-grey",
                        )}
                      >
                        {endDateObj
                          ? endDateObj.toLocaleDateString(undefined, {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Select End Date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto rounded bg-white p-0 shadow-lg"
                    align="start"
                    sideOffset={8}
                  >
                    <Calendar
                      mode="single"
                      selected={endDateObj}
                      fromMonth={new Date()}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const d = new Date(date)
                        d.setHours(0, 0, 0, 0)
                        return d <= today
                      }}
                      onSelect={(date) => {
                        dispatch(
                          updateRewardDraft({
                            endDate: date
                              ? format(date, "yyyy-MM-dd")
                              : null,
                          }),
                        )
                        setCalendarOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-10 bg-white text-base font-medium text-text-grey-light shadow-none"
            >
              Cancel
            </Button>
          </DialogClose>

          {successActive ? (
            <Button
              type="button"
              disabled
              className="h-10 rounded-10 bg-text-grey text-base font-medium text-white shadow-none"
            >
              <CheckIcon className="size-4 shrink-0 text-white bg-green-400 rounded-full" />
              Reward Created!
            </Button>
          ) : canSubmit ? (
            <Button
              type="button"
              onClick={handleCreate}
              className="h-10 rounded-10 bg-primary-color-light text-base font-medium text-white shadow-none hover:bg-primary-color active:bg-primary-color-dark"
            >
              Create Reward
            </Button>
          ) : (
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <span
                  role="button"
                  tabIndex={0}
                  className="flex w-full rounded-10 outline-none focus-visible:ring-2 focus-visible:ring-primary-color/30"
                >
                  <Button
                    type="button"
                    disabled
                    tabIndex={-1}
                    className={cn(
                      "pointer-events-none h-10 w-full rounded-10 text-base font-medium text-white shadow-none",
                      // once core selections are satisfied, keep CTA primary-colored even if date is missing
                      canCreateCore ? "bg-[#F68DF6] opacity-90" : "bg-[#F68DF6] opacity-60",
                    )}
                  >
                    Create Reward
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={5}
                className="z-120 border-0 bg-text-grey p-2 text-center text-xs font-medium leading-snug text-white [&>svg]:hidden"
              >
                {needsCoreSelections
                  ? "Choose a reward trigger and a reward to continue"
                  : needsSalesAmount
                    ? "Enter the sales target amount to continue"
                  : needsPostInputs
                    ? "Enter post count and period to continue"
                  : needsBonusAmount
                    ? "Enter the bonus amount to continue"
                  : needsCommissionPct
                    ? "Select a commission tier to continue"
                  : needsEndDate
                    ? "Choose reward end date to continue"
                    : "Complete the required fields to continue"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CreateRewardSystemDialog }
