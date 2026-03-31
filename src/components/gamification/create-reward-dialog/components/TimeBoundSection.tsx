import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Props = {
  timeBound: boolean
  onTimeBoundChange: (checked: boolean) => void

  endDateObj: Date | undefined
  calendarOpen: boolean
  onCalendarOpenChange: (open: boolean) => void
  onSelectDate: (date: Date | undefined) => void
}

export function TimeBoundSection(props: Props) {
  return (
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
          checked={props.timeBound}
          onCheckedChange={props.onTimeBoundChange}
          className="h-6 w-11 shrink-0 data-[state=checked]:bg-primary-color data-[state=unchecked]:bg-[#E3E3E3]"
        />
      </div>

      <p className="text-xs leading-relaxed text-text-grey">
        Choose an end date to stop this reward automatically.
      </p>

      {props.timeBound && (
        <div className="pt-2">
          <Popover open={props.calendarOpen} onOpenChange={props.onCalendarOpenChange}>
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
                    props.endDateObj ? "text-text-grey-light" : "text-text-grey",
                  )}
                >
                  {props.endDateObj
                    ? props.endDateObj.toLocaleDateString(undefined, {
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
                selected={props.endDateObj}
                fromMonth={new Date()}
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const d = new Date(date)
                  d.setHours(0, 0, 0, 0)
                  return d <= today
                }}
                onSelect={props.onSelectDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}

