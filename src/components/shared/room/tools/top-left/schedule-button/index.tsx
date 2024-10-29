import PopupBox from "@/components/shared/popup-box"
import PopupBoxChild from "@/components/shared/popup-box/child"
import { ScheduleType } from "@/types/calendar"
import {
  estimateTotalHoursBySchedules,
  getTwelveClockFormat,
} from "@/lib/utils"
import moment from "moment"
import ToolButton from "../../tool-button"
import { CalendarIcon } from "@/components/icons"
import { useApi } from "@/hooks/swr"
import Schedules from "@/components/shared/schedules"
import FullLoading from "@/components/shared/full-loading"
import AddScheduleButton from "./shapes/add-schedule"
import { FetchDataType } from "@/services/axios"

export default function ScheduleButton() {
  const { data, isLoading, mutate } =
    useApi<FetchDataType<ScheduleType[]>>(`/users/me/schedules`)

  const schedules = data !== undefined ? data?.data : []

  const totalHours = estimateTotalHoursBySchedules(schedules)

  const today = moment()

  const todayDay = today.day()

  let event_label = "Add Schedule"
  const allDays = schedules.flatMap((day) => day.days)
  const todayDate = allDays.find((day) => +day.day === todayDay)
  if (todayDate) {
    let start_time = getTwelveClockFormat(todayDate.times[0].start)
    let end_time = getTwelveClockFormat(todayDate.times[0].end)
    let format_day = today.format("ddd")
    event_label = `${format_day} : ${start_time} - ${end_time}`
  }

  if (schedules.length > 0 && !todayDate) event_label = "Schedules"

  let title_node = (
    <div className="flex items-center gap-x-1">
      <span className="text-lg text-grayscale-title font-medium">
        Scheduled this week :
      </span>
      <span className="text-sm text-grayscale-subtitle font-medium">
        {totalHours > 0 ? `${totalHours}h` : "No schedule"}
      </span>
    </div>
  )

  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <ToolButton
          open={open}
          onClick={open}
          startIcon={<CalendarIcon size={20} />}
          isOpen={isOpen}
        >
          {event_label}
        </ToolButton>
      )}
    >
      {(triggerPosition, open, close) => {
        let content = null
        if (schedules.length > 0)
          content = (
            <Schedules justView={false} items={schedules} onDelete={mutate} />
          )
        if (isLoading || data === undefined) return <FullLoading />
        return (
          <PopupBoxChild
            top={triggerPosition.top}
            left={triggerPosition.left}
            zIndex={triggerPosition.zIndex}
            onClose={close}
            title={title_node}
            width={500}
          >
            <div className="flex w-full flex-col gap-y-2 items-end max-h-[400px] overflow-y-auto">
              {content}
              <AddScheduleButton onDelete={mutate} onCreated={mutate} />
            </div>
          </PopupBoxChild>
        )
      }}
    </PopupBox>
  )
}
