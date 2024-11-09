import { TickIcon } from "@/components/icons"
import CotopiaTooltip from "@/components/shared-ui/c-tooltip"
import { colors } from "@/const/varz"
import { getDay } from "@/lib/utils"
import { ScheduleType } from "@/types/calendar"
import moment from "moment"

type Props = {
  schedule: ScheduleType
  handleSelect: (day: number) => void
  handleDeSelect: (day: number) => void
  selectedDay?: number
}

export default function Days({
  schedule,
  handleSelect,
  handleDeSelect,
  selectedDay,
}: Props) {
  const today = moment()

  const days = Array.from(Array(7).keys())

  return (
    <div className="flex flex-row items-center justify-between w-full gap-x-2">
      {days.map((day) => {
        const currentDay = schedule.days.find((x) => x.day === day)

        const isSelected = !!currentDay

        const isToday = today.day() === day

        let clss =
          "relative flex flex-col items-center justify-center w-[53px] h-[53px] cursor-default rounded-lg"

        if (isSelected)
          clss += ` border border-primary-border !text-primary-body [&_.day-label]:!text-primary-body cursor-pointer bg-white hover:bg-blue-50`

        let timeOfDayTooltip = ""

        if (!!isToday) {
          clss += " !border-2"
        }

        if (isSelected)
          timeOfDayTooltip = currentDay.times
            .map((x) => `${x.start} - ${x.end}`)
            .join(", ")

        let content = (
          <div
            className={clss}
            onMouseEnter={() => handleSelect(day)}
            onMouseLeave={() => handleDeSelect(day)}
          >
            <span className="day-label font-medium text-grayscale-caption">
              {getDay(day).slice(0, 3)}
            </span>
            {!!isToday && (
              <div className="absolute top-[2px] right-[2px]">
                <TickIcon size={12} color={colors.primary.body} />
              </div>
            )}
          </div>
        )

        return (
          <>
            {isSelected ? (
              <CotopiaTooltip key={day} title={timeOfDayTooltip}>
                {content}
              </CotopiaTooltip>
            ) : (
              content
            )}
          </>
        )
      })}
    </div>
  )
}
