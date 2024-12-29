import UserCardItem from './item';
import { useEffect, useRef, useState } from 'react';
import useKeyPress from '@/hooks/use-key-press';
import { ScheduleType } from '@/types/calendar';
import ScheduleCardItem from './item';

type Props = {
  items: ScheduleType[];
  onPick?: (item: ScheduleType) => void;
  defaultSelectedId?: number;
  env?: 'simple' | 'detailed';
  excludes?: number[];
};

export default function ScheduleList({
  items,
  onPick,
  defaultSelectedId,
  env = 'detailed',
  excludes = [],
}: Props) {
  let finalItems = [...items];
  if (excludes.length > 0)
    finalItems = finalItems.filter((a) => !excludes.includes(a.id));

  const container = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [keyboardSelected, setKeyboardSelected] = useState(0);

  const scrollToSelected = () => {
    const containerElement = container.current;
    const selectedItem = itemRefs.current[keyboardSelected];

    if (containerElement && selectedItem) {
      const containerBounds = containerElement.getBoundingClientRect();
      const itemBounds = selectedItem.getBoundingClientRect();

      if (itemBounds.top < containerBounds.top) {
        // Scroll up to bring the item into view
        containerElement.scrollTop -= containerBounds.top - itemBounds.top;
      } else if (itemBounds.bottom > containerBounds.bottom) {
        // Scroll down to bring the item into view
        containerElement.scrollTop +=
          itemBounds.bottom - containerBounds.bottom;
      }
    }
  };

  useEffect(() => {
    scrollToSelected();
  }, [keyboardSelected]);

  useKeyPress('ArrowDown', () => {
    const next = keyboardSelected + 1;
    if (finalItems?.[next]) setKeyboardSelected(next);
    else setKeyboardSelected(0);
  });

  useKeyPress('ArrowUp', () => {
    const prev = keyboardSelected - 1;
    if (finalItems?.[prev]) setKeyboardSelected(prev);
    else setKeyboardSelected(finalItems.length - 1);
  });

  useKeyPress('Enter', (e) => {
    if (!onPick) return;
    onPick(finalItems?.[keyboardSelected]);
    e.stopPropagation();
    e.preventDefault();
  });

  if (finalItems.length === 0) return null;

  return (
    <div
      className="py-2 flex flex-col overflow-hidden max-h-[300px] overflow-y-auto"
      ref={container}
    >
      {finalItems.map((schedule, index) => (
        <div ref={(el) => (itemRefs.current[index] = el)} key={schedule.id}>
          <ScheduleCardItem
            item={schedule}
            onPick={(item) => {
              if (onPick) onPick(item);

              setKeyboardSelected(index);
            }}
            isSelected={defaultSelectedId === schedule?.id}
            isKeyboardSelected={keyboardSelected === index}
            env={env}
          />
        </div>
      ))}
    </div>
  );
}
