import { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Props = {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  contentClassName?: string;
  triggerClassName?: string;
  align?: 'center' | 'end' | 'start';
  onOpenChange?: (value: boolean) => void;
};
export default function CotopiaPopover({
  trigger,
  children,
  open,
  contentClassName,
  triggerClassName = '',
  align = 'end',
  onOpenChange,
}: Props) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        onClick={(e) => e.stopPropagation()}
        className={`popover-trigger ${triggerClassName}`}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent align={align} className={contentClassName ?? ''}>
        {children}
      </PopoverContent>
    </Popover>
  );
}
