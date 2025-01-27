import { ReactNode, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Props = {
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  isOpen?: boolean;
  contentClassName?: string;
  triggerClassName?: string;
  onOpenChange?: (open: boolean) => void;
  align?: 'center' | 'end' | 'start';
};
export default function CotopiaPopover({
  trigger,
  children,
  contentClassName,
  isOpen = false,
  onOpenChange,
  triggerClassName = '',
  align = 'end',
}: Props) {
  const [open, setOpen] = useState(isOpen);

  const changeOpenHandler = (val: boolean) => {
    setOpen(val);
    if (onOpenChange) onOpenChange(val);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={changeOpenHandler}>
      <PopoverTrigger
        onClick={(e) => e.stopPropagation()}
        className={`popover-trigger ${triggerClassName}`}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent align={align} className={contentClassName ?? ''}>
        {children(handleClose)}
      </PopoverContent>
    </Popover>
  );
}
