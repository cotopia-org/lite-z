import RoomSpatialWrapper from '@/components/shared/room-spatial-wrapper';
import { useAppSelector } from '@/store';
import { useParams } from 'react-router-dom';
import { useWorkspace } from '../..';

export default function WorkspaceRoomPage() {
  const { token } = useAppSelector((store) => store.livekit);
  const { workspace_id } = useParams();
  const { activeRoom } = useWorkspace();

  if (!workspace_id || !activeRoom) return null;
  return (
    <RoomSpatialWrapper
      token={token}
      workspace_id={+workspace_id}
      room_id={+activeRoom?.id}
    />
  );
}
