import type { RewardEventId, RewardWithId } from "@/store/rewardSlice"

export type CreateRewardGating = {
  needsCoreSelections: boolean
  needsEndDate: boolean
  needsSalesAmount: boolean
  needsPostInputs: boolean
  needsBonusAmount: boolean
  needsCommissionPct: boolean
  commissionDisabledForEvent: boolean
  canCreateCore: boolean
  canSubmit: boolean
}

type DraftLike = {
  eventType: RewardEventId | ""
  rewardType: RewardWithId | ""
  timeBound: boolean
  endDate: string | null
  eventSalesAmount: string
  eventPostX: string
  eventPostY: string
  rewardBonusAmount: string
  rewardCommissionPct: string
}

export function computeCreateRewardGating(draft: DraftLike): CreateRewardGating {
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

  return {
    needsCoreSelections,
    needsEndDate,
    needsSalesAmount,
    needsPostInputs,
    needsBonusAmount,
    needsCommissionPct,
    commissionDisabledForEvent,
    canCreateCore,
    canSubmit,
  }
}

