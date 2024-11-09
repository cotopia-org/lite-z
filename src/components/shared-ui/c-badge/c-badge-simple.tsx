import { ReactNode } from "react";
import CBadge, { CBadgeProps } from ".";

type Props = CBadgeProps & { children: ReactNode };
export default function CBadgeSimple({ children, ...rest }: Props) {
  return (
    <div className='relative'>
      <CBadge
        {...rest}
        className='absolute top-[-16px] right-[-16px] !w-6 !h-6'
      />
      {children}
    </div>
  );
}
