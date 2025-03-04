import { AvailabiltyType, ScheduleType } from '@/types/calendar';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { Mic, Pencil, Video } from 'lucide-react';
import TimeShower from './time-shower';
import ParticipantsWithPopover from '../../participants/with-popover';
import { isNowBetween } from '@/lib/utils';

type Props = {
  schedule: ScheduleType;
  onHide: () => void;
};
export default function Card({ schedule, onHide }: Props) {
  const today = moment();

  const timeToday = useMemo(() => {
    const dayTarget = schedule.days.find((x) => x.day === today.day());

    if (dayTarget) {
      return dayTarget;
    }

    return undefined;
  }, [schedule, today.day()]);

  if (timeToday === undefined) return null;

  const nowTimes = timeToday.times.filter((time) => {
    return isNowBetween(time.start, time.end, schedule.timezone);
  });

  let icons = {
    [AvailabiltyType.Text]: <Pencil size={12} />,
    [AvailabiltyType.Video]: <Video size={12} />,
    [AvailabiltyType.Voice]: <Mic size={12} />,
  };

  if (nowTimes.length < 1) {
    onHide();
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-x-2 select-none sepia">
      <ParticipantsWithPopover
        className="!pb-0"
        participants={[schedule.user]}
      />
      <div className="flex flex-col">
        <span className="text-sm capitalize font-medium">{`${schedule.user.username}`}</span>
        <span className="text-xs text-black/70">
          <div className="flex flex-row items-center gap-x-1">
            <span className="text-xs">{icons[schedule.availability_type]}</span>
            <TimeShower times={nowTimes} />
          </div>
        </span>
      </div>
    </div>
  );
}
