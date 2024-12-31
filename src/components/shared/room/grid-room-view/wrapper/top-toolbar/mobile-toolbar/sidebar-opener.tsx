import { GridIcon } from '@/components/icons';
import CotopiaButton from '@/components/shared-ui/c-button';
import { useRoomContext } from '@/components/shared/room/room-context';

export default function SidebarOpener() {
  const { showSidebarInMobile } = useRoomContext();

  return (
    <CotopiaButton
      className="bg-white text-black h-[48px] rounded-lg"
      startIcon={<GridIcon size={20} />}
      size={'lg'}
      onClick={showSidebarInMobile}
    >
      Chats & Stuff
    </CotopiaButton>
  );
}
