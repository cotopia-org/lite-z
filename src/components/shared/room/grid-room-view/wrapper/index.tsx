import { ReactNode } from 'react';
import TopToolbar from './top-toolbar';
import BottomToolbar from './bottom-toolbar';

interface Props {
  children: ReactNode;
}

const MeetingWrapper = ({ children }: Props) => {
  return (
    <div className=" w-full h-screen flex flex-col justify-between py-0 md:py-2">
      <TopToolbar />
      <div className="children w-full h-full">{children}</div>
      <BottomToolbar />
    </div>
  );
};

export default MeetingWrapper;
