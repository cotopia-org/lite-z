import RoomSpatialWrapper from "@/components/shared/room-spatial-wrapper";
import { useAppSelector } from "@/store";
import { useParams } from "react-router-dom";

export default function WorkspaceRoomPage() {
  const { token } = useAppSelector((store) => store.livekit);
  const { workspace_id, room_id } = useParams();

  if (!workspace_id || !room_id) return null;

  return (
    <RoomSpatialWrapper
      token={token}
      workspace_id={workspace_id}
      room_id={+room_id}
    />
  );
}
