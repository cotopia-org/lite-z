import { getDay } from '@/lib/utils';
import { ScheduleType } from '@/types/calendar';

type Props = {
  item: ScheduleType;
  onPick?: (item: ScheduleType) => void;
  isSelected?: boolean;
  isKeyboardSelected?: boolean;
  env?: 'simple' | 'detailed';
};

export default function ScheduleCardItem({
  item,
  onPick,
  isSelected,
  isKeyboardSelected,
  env,
}: Props) {
  let clss = 'flex flex-row items-center gap-x-4 px-4 py-2 cursor-pointer';

  if (isSelected || isKeyboardSelected) {
    clss += ` bg-black/[.06] hover:bg-black/[.03]`;
  } else {
    clss += ` hover:bg-black/[.03]`;
  }

  //detailed by default
  let content = (
    <>
      <div className="flex items-start flex-col">{`From ${item.start_time} To ${item.end_time} (${item.days.map((x) => `${getDay(x.day)}`).join(', ')})`}</div>
    </>
  );

  return (
    <div
      onClick={() => onPick && onPick(item as ScheduleType)}
      className={clss}
    >
      {content}
    </div>
  );
}
