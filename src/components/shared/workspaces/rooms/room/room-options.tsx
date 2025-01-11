import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import CotopiaPopover from '@/components/shared-ui/c-popover';
import DeleteRoom from './delete-room';
import { WorkspaceRoomShortType } from '@/types/room';
import InviteUser from './invite-user';
import MoreHorizontal from '@/components/icons/more-horiz';

import SettingsRoom from './settings-room';

interface Props {
  room: WorkspaceRoomShortType;
}

const RoomOptions = ({ room }: Props) => {
  return (
    <CotopiaPopover
      trigger={
        <CotopiaIconButton
          type="button"
          className="!bg-transparent hover:!bg-black/[0.10] w-6 h-6"
        >
          <MoreHorizontal size={16} />
        </CotopiaIconButton>
      }
      contentClassName="w-auto p-1 flex flex-col [&_button]:justify-between"
    >
      <DeleteRoom room={room} />
      <InviteUser room={room} />
      <SettingsRoom room={room} />
    </CotopiaPopover>
  );
};

export default RoomOptions;
