import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DropdownItemType = { title: string; value: string };
interface Props {
  items: DropdownItemType[];
  onSelect?: (item: DropdownItemType) => void;
  defaultValue?: string;
  triggerClassName?: string;
  className?: string;
  label?: string;
}

const CotopiaDropdown = ({
  items,
  onSelect,
  defaultValue,
  className = ' ',
  triggerClassName,
  label,
}: Props) => {
  const [value, setValue] = useState('Choose');

  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultValue !== undefined) setValue(defaultValue);
  }, [defaultValue]);

  const selectItemHandler = useCallback(
    (item: DropdownItemType) => {
      setValue(item.title);
      if (onSelect) onSelect(item);
    },
    [onSelect],
  );

  return (
    <div className="flex flex-col gap-y-2">
      {!!label && <strong>{label}</strong>}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn('border  rounded-md w-full', triggerClassName)}
        >
          <div
            ref={triggerRef}
            className="flex w-full p-2 px-4 items-center justify-between"
          >
            <span>{value}</span>
            <ChevronDown size={16} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          style={{
            width: triggerRef?.current
              ? triggerRef.current?.clientWidth
              : '100%',
          }}
          className={`z-[10000] ${className}`}
        >
          <div className="flex flex-col gap-y-2">
            {items.map((item, key) => {
              return (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => selectItemHandler(item)}
                  key={key + 1}
                >
                  {item.title}
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CotopiaDropdown;
