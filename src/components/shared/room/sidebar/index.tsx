import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
export default function RoomSidebar({ children }: Props) {
  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-screen">
      <div className="bg-white min-h-screen w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
