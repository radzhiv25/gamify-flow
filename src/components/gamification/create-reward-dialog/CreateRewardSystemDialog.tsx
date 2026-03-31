import { type ReactNode, useCallback, useMemo, useRef, useState } from "react"
import { format } from "date-fns"
import { XIcon } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { cn } from "@/lib/utils"

import { computeCreateRewardGating } from "./lib/gating"
import { EventSelect } from "./components/EventSelect"
import { RewardWithSelect } from "./components/RewardWithSelect"
import { TimeBoundSection } from "./components/TimeBoundSection"
import { DialogFooter } from "./components/DialogFooter"

type CreateRewardSystemDialogProps = {
  children: ReactNode
}

function CreateRewardSystemDialog({ children }: CreateRewardSystemDialogProps) {
  const dispatch = useAppDispatch()
  const draft = useAppSelector((s) => s.rewards.draft)

  const gating = useMemo(() => computeCreateRewardGating(draft), [draft])

  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const [eventMenuOpen, setEventMenuOpen] = useState(false)
  const [pendingSalesAmount, setPendingSalesAmount] = useState("")
  const [pendingPostX, setPendingPostX] = useState("")
  const [pendingPostPeriod, setPendingPostPeriod] = useState("")
  const [postPeriodMenuOpen, setPostPeriodMenuOpen] = useState(false)

  const [rewardMenuOpen, setRewardMenuOpen] = useState(false)
  const [pendingBonusAmount, setPendingBonusAmount] = useState("")
  const [pendingCommissionTier, setPendingCommissionTier] = useState("")

  const [successActive, setSuccessActive] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const endDateObj = useMemo(() => {
    return draft.endDate ? new Date(`${draft.endDate}T12:00:00`) : undefined
  }, [draft.endDate])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) clearCloseTimer()
      setOpen(next)
      if (!next) {
        setCalendarOpen(false)

        setEventMenuOpen(false)
        setPendingSalesAmount("")
        setPendingPostX("")
        setPendingPostPeriod("")
        setPostPeriodMenuOpen(false)

        setRewardMenuOpen(false)
        setPendingBonusAmount("")
        setPendingCommissionTier("")

        setSuccessActive(false)
        dispatch(resetRewardDraft())
      }
    },
    [clearCloseTimer, dispatch],
  )

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
        setPendingCommissionTier(draft.rewardCommissionPct)
      }
    },
    [draft.rewardBonusAmount, draft.rewardCommissionPct, draft.rewardType],
  )

  const onEventValueChange = useCallback(
    (value: RewardEventId) => {
      dispatch(setRewardEvent(value))
      if (value === "post_times" || value === "onboarded") {
        if (draft.rewardType === "commission") {
          dispatch(updateRewardDraft({ rewardType: "", rewardCommissionPct: "" }))
        }
      }
      if (value === "crosses_sales" || value === "post_times") {
        window.setTimeout(() => setEventMenuOpen(true), 0)
      }
    },
    [dispatch, draft.rewardType],
  )

  const onRewardValueChange = useCallback(
    (value: RewardWithId) => {
      dispatch(setRewardWith(value))
      if (value === "flat_bonus" || value === "commission") {
        window.setTimeout(() => setRewardMenuOpen(true), 0)
      }
    },
    [dispatch],
  )

  const onCreate = useCallback(() => {
    if (!gating.canSubmit || successActive) return
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
    setPendingCommissionTier("")

    setCalendarOpen(false)
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      setSuccessActive(false)
      closeTimerRef.current = null
    }, 950)
  }, [clearCloseTimer, dispatch, gating.canSubmit, successActive])

  const onInlineEventCancel = useCallback(() => {
    setPendingSalesAmount(draft.eventSalesAmount)
    setPendingPostX(draft.eventPostX)
    setPendingPostPeriod(draft.eventPostY)
    setPostPeriodMenuOpen(false)
    setEventMenuOpen(false)
  }, [draft.eventPostX, draft.eventPostY, draft.eventSalesAmount])

  const onInlineEventSave = useCallback(() => {
    if (draft.eventType === "crosses_sales") {
      dispatch(updateRewardDraft({ eventSalesAmount: pendingSalesAmount.trim() }))
    } else if (draft.eventType === "post_times") {
      dispatch(
        updateRewardDraft({
          eventPostX: pendingPostX.trim(),
          eventPostY: pendingPostPeriod.trim(),
        }),
      )
    }
    setPostPeriodMenuOpen(false)
    setEventMenuOpen(false)
  }, [
    dispatch,
    draft.eventType,
    pendingPostPeriod,
    pendingPostX,
    pendingSalesAmount,
  ])

  const onInlineRewardCancel = useCallback(() => {
    setPendingBonusAmount(draft.rewardBonusAmount)
    setPendingCommissionTier(draft.rewardCommissionPct)
    setRewardMenuOpen(false)
  }, [draft.rewardBonusAmount, draft.rewardCommissionPct])

  const onInlineRewardSave = useCallback(() => {
    if (draft.rewardType === "flat_bonus") {
      dispatch(
        updateRewardDraft({ rewardBonusAmount: pendingBonusAmount.trim() }),
      )
    } else if (draft.rewardType === "commission") {
      dispatch(
        updateRewardDraft({ rewardCommissionPct: pendingCommissionTier.trim() }),
      )
    }
    setRewardMenuOpen(false)
  }, [dispatch, draft.rewardType, pendingBonusAmount, pendingCommissionTier])

  const onTimeBoundChange = useCallback(
    (checked: boolean) => {
      dispatch(
        updateRewardDraft({
          timeBound: checked,
          ...(checked ? {} : { endDate: null }),
        }),
      )
      if (!checked) setCalendarOpen(false)
    },
    [dispatch],
  )

  const onSelectEndDate = useCallback(
    (date: Date | undefined) => {
      dispatch(updateRewardDraft({ endDate: date ? format(date, "yyyy-MM-dd") : null }))
      setCalendarOpen(false)
    },
    [dispatch],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className={cn(
          // Mobile-first sizing: fit viewport width/height, then lock to desktop spec.
          "w-[calc(100vw-32px)] max-w-[92vw] rounded-[12px] bg-white p-6",
          "max-h-[85vh] overflow-y-auto",
          "sm:max-w-[400px] sm:min-h-[372px]",
          "flex! flex-col! gap-0!",
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
          <EventSelect
            value={draft.eventType}
            open={eventMenuOpen}
            onOpenChange={handleEventMenuOpenChange}
            onValueChange={onEventValueChange}
            eventSalesAmount={draft.eventSalesAmount}
            eventPostX={draft.eventPostX}
            eventPostY={draft.eventPostY}
            pendingSalesAmount={pendingSalesAmount}
            setPendingSalesAmount={setPendingSalesAmount}
            pendingPostX={pendingPostX}
            setPendingPostX={setPendingPostX}
            pendingPostPeriod={pendingPostPeriod}
            setPendingPostPeriod={setPendingPostPeriod}
            postPeriodMenuOpen={postPeriodMenuOpen}
            setPostPeriodMenuOpen={setPostPeriodMenuOpen}
            onInlineCancel={onInlineEventCancel}
            onInlineSave={onInlineEventSave}
          />

          <RewardWithSelect
            value={draft.rewardType}
            open={rewardMenuOpen}
            onOpenChange={handleRewardMenuOpenChange}
            onValueChange={onRewardValueChange}
            rewardBonusAmount={draft.rewardBonusAmount}
            rewardCommissionPct={draft.rewardCommissionPct}
            commissionDisabledForEvent={gating.commissionDisabledForEvent}
            pendingBonusAmount={pendingBonusAmount}
            setPendingBonusAmount={setPendingBonusAmount}
            pendingCommissionPct={pendingCommissionTier}
            setPendingCommissionPct={setPendingCommissionTier}
            onInlineCancel={onInlineRewardCancel}
            onInlineSave={onInlineRewardSave}
          />

          <TimeBoundSection
            timeBound={draft.timeBound}
            onTimeBoundChange={onTimeBoundChange}
            endDateObj={endDateObj}
            calendarOpen={calendarOpen}
            onCalendarOpenChange={setCalendarOpen}
            onSelectDate={onSelectEndDate}
          />
        </div>

        <DialogFooter
          successActive={successActive}
          canSubmit={gating.canSubmit}
          canCreateCore={gating.canCreateCore}
          needsCoreSelections={gating.needsCoreSelections}
          needsSalesAmount={gating.needsSalesAmount}
          needsPostInputs={gating.needsPostInputs}
          needsBonusAmount={gating.needsBonusAmount}
          needsCommissionPct={gating.needsCommissionPct}
          needsEndDate={gating.needsEndDate}
          onCreate={onCreate}
        />
      </DialogContent>
    </Dialog>
  )
}

export { CreateRewardSystemDialog }

