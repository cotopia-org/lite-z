import TimeTrackingButtonTool from '@/components/shared/room/tools/top-right/time-tracking';
import SidebarOpener from './sidebar-opener';

interface Props {}

const MobileToolbar = (props: Props) => {
  return (
    <div className="relative w-full md:hidden pt-2 px-5 text-white flex flex-row items-center justify-between">
      <SidebarOpener />
      <TimeTrackingButtonTool />
    </div>
  );
};

export default MobileToolbar;
