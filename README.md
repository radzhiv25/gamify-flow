## Gamify Flow (Frontend Assignment)

Production-quality React + Tailwind + shadcn/ui implementation of the “Gamify / Create Reward System” flow.

### Tech stack

- **Framework**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS (+ custom utility `rounded-10`)
- **UI primitives**: shadcn/ui (Radix UI under the hood)
- **State management**: Redux Toolkit (all app data stored in Redux)

### Local setup

```bash
npm install
npm run dev
```

### Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run preview    # preview production build
npm run lint       # eslint
```

### Project structure (high-signal)

Key files/folders you’ll likely look at during review:

- **`src/store/`**: Redux store setup + slices
  - `src/store/rewardSlice.ts`: reward draft + saved rewards (single source of truth)
  - `src/store/index.ts`: store configuration
  - `src/store/hooks.ts`: typed `useAppDispatch` / `useAppSelector`
- **`src/components/gamification/create-reward-dialog/`**: modular “Create Reward System” feature
  - `CreateRewardSystemDialog.tsx`: orchestration (Dialog + Redux wiring)
  - `components/`: UI components for event select / reward select / time-bound / footer
  - `lib/`: pure helpers (`gating.ts`, `labels.ts`) for readability/testability
- **`src/components/ui/`**: shadcn/ui components (generated/customized)

### Notes on state management (Redux)

This app intentionally keeps **all form data** in Redux:

- The dialog edits a **draft** in Redux.
- Inline “Save/Cancel” inside select menus commits/cancels draft fields.
- “Create Reward” commits the draft into saved rewards and resets the draft.

### Deploy (Vercel)

- Import the GitHub repo in Vercel
- Framework preset: **Vite**
- Build command: `npm run build`
- Output: `dist`

### Sharing (GitHub)

Add reviewers as collaborators:

- `saral-kalwani`
- `saral-omkar`
