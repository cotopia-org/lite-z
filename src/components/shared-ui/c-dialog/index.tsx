import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { ReactNode, useState } from 'react';

export type CDialogProps = {
  trigger: (open: () => void) => ReactNode;
  hasClose?: boolean;
  children: (close: () => void) => ReactNode;
  onClose?: () => void;
  dialogContentCss?: string;
};
export default function CDialog({
  trigger,
  hasClose = false,
  children,
  onClose,
  dialogContentCss,
  ...rest
}: CDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{trigger(handleOpen)}</DialogTrigger>
      <DialogContent className={cn(dialogContentCss)}>
        {hasClose && (
          <DialogClose className="opacity-70 absolute top-5 right-5 hover:opacity-100">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
        {children(handleClose)}
      </DialogContent>
    </Dialog>
  );
}
