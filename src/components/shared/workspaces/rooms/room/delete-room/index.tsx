import { colors } from '@/const/varz';
import { TrashIcon } from '@/components/icons';
import CotopiaButton from '@/components/shared-ui/c-button';
import { WorkspaceRoomShortType } from '@/types/room';
import EmptyPrompt from './empty-prompt';
import { ButtonProps } from '@radix-ui/themes';
import ActiveRoomPrompt from './active-room-prompt';

type Props = {
  room: WorkspaceRoomShortType;
  onDelete?: () => void;
};

const DeleteRoomButton = ({ onClick }: ButtonProps) => {
  return (
    <CotopiaButton
      variant={'ghost'}
      startIcon={<TrashIcon size={20} color={colors.destructive} />}
      onClick={onClick}
      className="text-sm"
    >
      Delete room
    </CotopiaButton>
  );
};

export default function DeleteRoom({ room, onDelete }: Props) {
  const has_member = room.participants.length > 0;

  if (has_member) {
    return (
      <ActiveRoomPrompt
        room={room}
        trigger={(open) => {
          return <DeleteRoomButton onClick={open} />;
        }}
        onDelete={onDelete}
      />
    );
  }
  return (
    <EmptyPrompt
      room={room}
      trigger={(open) => {
        return <DeleteRoomButton onClick={open} />;
      }}
      onDelete={onDelete}
    />
  );
}
