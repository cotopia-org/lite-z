import SidebarOpener from './sidebar-opener';
import SidebarOverview from './sidebar-overview';

interface Props {}

const MobileToolbar = (props: Props) => {
  return (
    <div className="relative w-full md:hidden pt-2 px-5 text-white flex flex-row gap-x-4 items-center justify-between">
      <div className="w-full flex flex-row items-center gap-x-4">
        <SidebarOpener />
        <SidebarOverview />
      </div>
    </div>
  );
};

export default MobileToolbar;
