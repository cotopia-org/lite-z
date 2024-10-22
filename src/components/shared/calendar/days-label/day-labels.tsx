import { useContext, useMemo } from "react";
import moment from "moment";
import jalaliMoment from "jalali-moment";
import { CalendarContext, CalendarViewType } from "../calendar";
import { CalendarHolderContext } from "../calendar-holder";
import Day from "./day";

const getJalaliWeekdays = (): string[] => {
  moment.locale("fa"); // Set the locale to Persian

  const weekdays: string[] = [];
  for (let i = 0; i < 7; i++) {
    weekdays.push(moment().weekday(i).format("dd"));
  }

  return weekdays;
};

export default function DaysLabels() {
  //Get calendar context
  const { viewDate, config, viewType } = useContext(CalendarContext);

  //Get days label format
  const daysLabelFormat = config?.options?.daysLabelFormat ?? "dd";

  //Get calender holder context
  const { index } = useContext(CalendarHolderContext);

  let finalDate = viewDate ? viewDate?.clone() : moment();

  const isJalali = config.system === "jalali";

  const timeFormat = isJalali ? "jmonth" : "month";

  if (isJalali) {
    //@ts-ignore
    finalDate = jalaliMoment(finalDate);
  }

  //@ts-ignore
  if (index > 0) finalDate = finalDate?.add(index, timeFormat);

  //@ts-ignore
  const firstDayOfMonth = finalDate?.startOf(timeFormat);

  const getNextWeekLabels = useMemo(() => {
    if (isJalali) return getJalaliWeekdays();

    let days = [];
    for (let i = 0; i < 7; i++) {
      let date = firstDayOfMonth.clone().startOf("day");

      days.push(date.clone().add(i, "day"));
    }

    return days.map((item) => item.format(daysLabelFormat));
  }, [firstDayOfMonth, isJalali]);

  if (!config?.options?.hasDaysLabel) return null;

  if (viewType !== CalendarViewType.Days) return null;

  return (
    <div className='grid grid-cols-7 pointer-events-none gap-x-0 w-full'>
      {getNextWeekLabels.map((item, key) => (
        <Day key={key} dayLabel={item} />
      ))}
    </div>
  );
}
