"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";

export type ODialogProps = {
  trigger: (open: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
  onClose?: () => void;
  dialogContentCss?: string;
};
export default function ODialog({
  trigger,
  children,
  onClose,
  dialogContentCss,
  ...rest
}: ODialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>{trigger(handleOpen)}</DialogTrigger>
      <DialogContent className={dialogContentCss}>
        {children(handleClose)}
      </DialogContent>
    </Dialog>
  );
}
