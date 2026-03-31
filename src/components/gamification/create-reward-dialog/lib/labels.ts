import type { RewardEventId, RewardWithId } from "@/store/rewardSlice"

type DraftLike = {
  eventType: RewardEventId | ""
  eventSalesAmount: string
  eventPostX: string
  eventPostY: string
  rewardType: RewardWithId | ""
  rewardBonusAmount: string
  rewardCommissionPct: string
}

export function getEventOptionLabel(draft: DraftLike, eventId: RewardEventId) {
  if (eventId === "crosses_sales") {
    return draft.eventSalesAmount.trim()
      ? `Cross $${draft.eventSalesAmount.trim()} in sales`
      : "Cross $X in sales"
  }

  if (eventId === "post_times") {
    return draft.eventPostX.trim() && draft.eventPostY.trim()
      ? `Posts ${draft.eventPostX.trim()} times every ${draft.eventPostY.trim()}`
      : "Posts X times every Y period"
  }

  return "Is Onboarded"
}

export function getRewardOptionLabel(draft: DraftLike, rewardId: RewardWithId) {
  if (rewardId === "flat_bonus") {
    return draft.rewardBonusAmount.trim()
      ? `Flat $${draft.rewardBonusAmount.trim()} bonus`
      : "Flat $X bonus"
  }

  return draft.rewardCommissionPct.trim()
    ? `Upgrade to (${draft.rewardCommissionPct.trim()})`
    : "Upgrade Commission Tier"
}

