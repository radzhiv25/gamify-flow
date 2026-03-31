import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit"

export type RewardEventId = "crosses_sales" | "post_times" | "onboarded"
export type RewardWithId = "flat_bonus" | "commission" | "points"

export interface RewardDraftState {
  eventType: RewardEventId | ""
  eventSalesAmount: string
  eventPostX: string
  eventPostY: string
  rewardType: RewardWithId | ""
  rewardBonusAmount: string
  rewardCommissionPct: string
  timeBound: boolean
  /** ISO date `yyyy-MM-dd` */
  endDate: string | null
}

export interface SavedReward extends RewardDraftState {
  id: string
  createdAt: string
}

const initialDraft: RewardDraftState = {
  eventType: "",
  eventSalesAmount: "",
  eventPostX: "",
  eventPostY: "",
  rewardType: "",
  rewardBonusAmount: "",
  rewardCommissionPct: "",
  timeBound: false,
  endDate: null,
}

const rewardSlice = createSlice({
  name: "rewards",
  initialState: {
    draft: initialDraft,
    savedRewards: [] as SavedReward[],
  },
  reducers: {
    resetRewardDraft: (state) => {
      state.draft = { ...initialDraft }
    },
    updateRewardDraft: (
      state,
      action: PayloadAction<Partial<RewardDraftState>>
    ) => {
      Object.assign(state.draft, action.payload)
    },
    setRewardEvent: (state, action: PayloadAction<RewardEventId>) => {
      const t = action.payload
      state.draft.eventType = t
      if (t !== "crosses_sales") state.draft.eventSalesAmount = ""
      if (t !== "post_times") {
        state.draft.eventPostX = ""
        state.draft.eventPostY = ""
      }
    },
    setRewardWith: (state, action: PayloadAction<RewardWithId>) => {
      const t = action.payload
      state.draft.rewardType = t
      if (t !== "flat_bonus") state.draft.rewardBonusAmount = ""
      if (t !== "commission") state.draft.rewardCommissionPct = ""
    },
    commitRewardFromDraft: (state) => {
      state.savedRewards.push({
        id: nanoid(),
        createdAt: new Date().toISOString(),
        ...state.draft,
      })
    },
  },
})

export const {
  resetRewardDraft,
  updateRewardDraft,
  setRewardEvent,
  setRewardWith,
  commitRewardFromDraft,
} = rewardSlice.actions

export default rewardSlice.reducer
