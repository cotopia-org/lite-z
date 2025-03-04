import { SoundIcon } from '@/components/icons';
import { WorkspaceRoomShortType } from '@/types/room';
import RoomOptions from './room-options';
import { colors } from '@/const/varz';
import { cn } from '@/lib/utils';
import { LayoutGrid, SendToBack } from 'lucide-react';
import { useState } from 'react';
import RenameInput from './rename-input';

interface Props {
  room: WorkspaceRoomShortType;
  isSelected: boolean;
  joinRoomHandler: () => void;
}

const RoomItem = ({ room, isSelected, joinRoomHandler }: Props) => {
  const [editMode, setEditMode] = useState(false);

  let clss =
    'flex items-center justify-between rounded-lg p-4 py-2 w-full cursor-pointer mx-auto max-w-[95%] hover:bg-black/5';

  if (isSelected) {
    clss +=
      ' !bg-primary [&_svg_path]:stroke-background !py-3 mb-1 [&_span]:text-background';
  }

  if (editMode)
    return (
      <RenameInput
        className={`${isSelected ? 'mb-1' : 'py-2'}`}
        onCancel={() => setEditMode(false)}
        onSubmit={() => setEditMode(false)}
        room={room}
      />
    );

  return (
    <div className={cn(clss, '[&_.room-options]:hover:opacity-100')}>
      <div
        onClick={joinRoomHandler}
        className="flex w-full items-center gap-x-2 justify-start"
      >
        {room.type === 'flow' ? (
          <SendToBack size={20} color={colors.grayscale.grayscaleCaption} />
        ) : (
          <LayoutGrid size={20} color={colors.grayscale.grayscaleCaption} />
        )}
        <span className="font-semibold text-grayscale-subtitle">
          {room.title}
        </span>
      </div>
      <div className="opacity-0 transition-all room-options">
        <RoomOptions changeStateHandler={() => setEditMode(true)} room={room} />
      </div>
    </div>
  );
};

export default RoomItem;
