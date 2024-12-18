import { ReactNode } from "react";
import CBadge, { CBadgeProps } from ".";
import { cn } from "@/lib/utils";

type Props = CBadgeProps & { children: ReactNode; badgeClassName?: string };
export default function CBadgeSimple({
  children,
  badgeClassName,
  ...rest
}: Props) {
  return (
    <div className='relative'>
      <CBadge
        {...rest}
        className={cn(
          "absolute top-[-16px] right-[-16px] !w-6 !h-6",
          badgeClassName
        )}
      />
      {children}
    </div>
  );
}
