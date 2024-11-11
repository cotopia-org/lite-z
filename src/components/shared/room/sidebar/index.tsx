import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function RoomSidebar({ children }: Props) {
  return (
    <div className='min-h-screen'>
      <div className='bg-white min-h-screen w-full overflow-hidden'>
        {children}
      </div>
    </div>
  );
}
