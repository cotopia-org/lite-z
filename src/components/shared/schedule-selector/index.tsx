import { ReactNode, useEffect, useState } from 'react';
import { ScheduleType } from '@/types/calendar';
import ScheduleList from './list';

type Props = {
  onPick?: (item: ScheduleType) => void;
  afterTitle?: ReactNode;
  defaultSelectedId?: number;
  defaultSchedule?: ScheduleType;
  label?: boolean;
  items: ScheduleType[];
};

export default function ScheduleSelector({
  onPick,
  afterTitle,
  defaultSelectedId,
  defaultSchedule,
  label,
  items,
}: Props) {
  const [selected, setSelected] = useState<ScheduleType | null>(null);
  useEffect(() => {
    if (defaultSchedule !== undefined) setSelected(defaultSchedule);
  }, [defaultSchedule]);
  const [search, setSearch] = useState('');

  const handlePick = (item: ScheduleType) => {
    setSearch('');
    setSelected(item);
    if (onPick) onPick(item);
  };

  let content = null;

  if (items.length > 0)
    content = (
      <ScheduleList
        items={items}
        onPick={handlePick}
        defaultSelectedId={selected?.id}
      />
    );

  return (
    <div className="flex flex-col gap-y-4">
      {label && (
        <p className="text-black/60">Search by username, full name, or email</p>
      )}
      {!!afterTitle && afterTitle}
      {content}
    </div>
  );
}
