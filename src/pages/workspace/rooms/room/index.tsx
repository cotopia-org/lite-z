import RoomSpatialWrapper from '@/components/shared/room-spatial-wrapper';
import { useAppSelector } from '@/store';
import { useParams } from 'react-router-dom';
import { useActiveRoom } from '@/pages/workspace';

export default function WorkspaceRoomPage() {
  const { token } = useAppSelector((store) => store.livekit);
  const { workspace_id } = useParams();

  const { activeRoom: room_id } = useActiveRoom();

  if (!workspace_id || !room_id) return null;

  return (
    <RoomSpatialWrapper
      token={token}
      workspace_id={+workspace_id}
      room_id={+room_id}
    />
  );
}
