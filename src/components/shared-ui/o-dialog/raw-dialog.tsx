"use client";

import ODialog, { ODialogProps } from ".";

export default function ORawDialog(props: ODialogProps) {
  let clss = "p-0 [&_.right-4]:hidden";
  if (props.dialogContentCss) clss += ` ${props.dialogContentCss}`;

  return <ODialog {...props} dialogContentCss={clss} />;
}
