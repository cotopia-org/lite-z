import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { useRoomContext } from '@/components/shared/room/room-context';
import { Menu } from 'lucide-react';

export default function SidebarOpener() {
  const { showSidebarInMobile } = useRoomContext();

  return (
    <CotopiaIconButton
      className="!bg-transparent text-white w-[48px] h-[48px] rounded-lg"
      size={'lg'}
      onClick={showSidebarInMobile}
    >
      <Menu size={20} />
    </CotopiaIconButton>
  );
}
