"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";

export type OCustomDialogProps = {
  dialogContentCss?: string;
} & DialogProps;
export default function OCustomRawDialog({
  dialogContentCss,
  ...rest
}: OCustomDialogProps) {
  let clss = "p-0 [&_.right-4]:hidden";
  if (dialogContentCss) clss += ` ${dialogContentCss}`;

  return (
    <Dialog modal {...rest}>
      <DialogContent className={clss}>{rest?.children}</DialogContent>
    </Dialog>
  );
}
