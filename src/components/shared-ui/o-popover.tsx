import { PopoverProps } from "@radix-ui/react-popover";
import { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "center" | "end" | "start";
  side?: "top" | "bottom" | "left" | "right";
  contentClassName?: string;
  contentWidth?: number;
} & PopoverProps;

export default function OPopover({
  trigger,
  children,
  align,
  side,
  contentClassName,
  contentWidth,
  ...rest
}: Props) {
  let popoverContentStyle: React.CSSProperties = { pointerEvents: "all" };

  if (contentWidth) popoverContentStyle["width"] = contentWidth;

  return (
    <Popover {...rest}>
      <PopoverTrigger className='w-full'>{trigger}</PopoverTrigger>
      <PopoverContent
        className={contentClassName ?? ""}
        align={align}
        side={side}
        style={popoverContentStyle}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
