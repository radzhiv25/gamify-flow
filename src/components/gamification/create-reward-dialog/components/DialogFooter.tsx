import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Props = {
  successActive: boolean
  canSubmit: boolean
  canCreateCore: boolean

  needsCoreSelections: boolean
  needsSalesAmount: boolean
  needsPostInputs: boolean
  needsBonusAmount: boolean
  needsCommissionPct: boolean
  needsEndDate: boolean

  onCreate: () => void
}

export function DialogFooter(props: Props) {
  return (
    <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
      <DialogClose asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-10 bg-white text-base font-medium text-text-grey-light shadow-none"
        >
          Cancel
        </Button>
      </DialogClose>

      {props.successActive ? (
        <Button
          type="button"
          disabled
          className="h-10 rounded-10 bg-text-grey text-base font-medium text-white shadow-none"
        >
          <CheckIcon className="size-4 shrink-0 text-white bg-green-400 rounded-full" />
          Reward Created!
        </Button>
      ) : props.canSubmit ? (
        <Button
          type="button"
          onClick={props.onCreate}
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
                  props.canCreateCore
                    ? "bg-[#F68DF6] opacity-90"
                    : "bg-[#F68DF6] opacity-60",
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
            {props.needsCoreSelections
              ? "Choose a reward trigger and a reward to continue"
              : props.needsSalesAmount
                ? "Enter the sales target amount to continue"
                : props.needsPostInputs
                  ? "Enter post count and period to continue"
                  : props.needsBonusAmount
                    ? "Enter the bonus amount to continue"
                    : props.needsCommissionPct
                      ? "Select a commission tier to continue"
                      : props.needsEndDate
                        ? "Choose reward end date to continue"
                        : "Complete the required fields to continue"}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

