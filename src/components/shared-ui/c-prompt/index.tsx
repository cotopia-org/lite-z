import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode, useEffect, useState } from 'react';
import CotopiaPromptContent, { CotopiaPromptType } from './content';
import useBus from 'use-bus';
import { __BUS } from '@/const/bus';
import { cn } from '@/lib/utils';

type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type WithPortalProps = {
  isPortal?: true;
  trigger?: (open: () => void) => ReactNode;
};

type WithoutPortalProps = {
  isPortal: false;
  trigger?: (open: () => void) => ReactNode;
};

type RemaindPropTypes = {
  afterDesc?: ReactNode;
  open?: boolean;
  dialogContentClassName?: string;
};

type Props = RemaindPropTypes &
  (WithPortalProps | WithoutPortalProps) &
  PartiallyOptional<CotopiaPromptType, 'onClose'>;
export default function CotopiaPrompt({
  trigger,
  afterDesc,
  open = false,
  isPortal = true,
  dialogContentClassName,
  ...rest
}: Props) {
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  }, [open]);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    if (rest?.onClose) rest.onClose();
  };

  const handleSubmit = () => {
    if (rest?.onSubmit) rest.onSubmit();
  };

  useBus(__BUS.closePrompt, () => {
    handleClose();
  });

  let view = null;

  if (isPortal) {
    view = (
      <>
        {!!trigger && (
          <DialogTrigger asChild>{trigger(handleOpen)}</DialogTrigger>
        )}
        <DialogContent
          className={cn('sm:max-w-[425px] pt-12', dialogContentClassName)}
        >
          <CotopiaPromptContent
            {...rest}
            onSubmit={handleSubmit}
            onClose={handleClose}
            afterDesc={afterDesc}
          />
        </DialogContent>
      </>
    );
  }

  if (!isPortal) {
    view = (
      <>
        {trigger ? (
          <DialogTrigger asChild>{trigger(handleOpen)}</DialogTrigger>
        ) : null}
        <DialogOverlay className="z-10" onClick={handleClose} />
        <div className="fixed left-[50%] top-[50%] z-20 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
          <CotopiaPromptContent
            {...rest}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        </div>
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {view}
    </Dialog>
  );
}
