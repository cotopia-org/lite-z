import { convertToTimezone, getDay } from '@/lib/utils';
import { ScheduleType } from '@/types/calendar';
import { useMemo } from 'react';

type Props = {
  selectedDay: number;
  item: ScheduleType;
};
export default function ScheduleOverview({ selectedDay, item }: Props) {
  const currentDay = item.days.filter((x) => x.day === selectedDay);

  const labelOutput = useMemo(() => {
    let output = `${getDay(selectedDay)}`;

    if (currentDay.length > 0) {
      output += ` : `;

      for (let day of currentDay) {
        let index = 0;
        for (let time of day.times) {
          output += ` ${convertToTimezone(time.start, item.timezone)} - ${convertToTimezone(time.end, item.timezone)}`;
          if (index < day.times.length - 1) output += `, `;
          index++;
        }
      }
    }

    return output;
  }, [selectedDay, currentDay, item]);

  if (currentDay.length === 0) return null;

  return (
    <div className="flex flex-row items-center text-xs">{labelOutput}</div>
  );
}
