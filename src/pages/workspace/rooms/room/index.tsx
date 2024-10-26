import RoomSpatialWrapper from "@/components/shared/room-spatial-wrapper";
import useQueryParams from "@/hooks/use-query-params";
import { useParams } from "react-router-dom";

export default function WorkspaceRoomPage() {
  const { query } = useQueryParams();
  const { workspace_id, room_id } = useParams();

  console.log("query", query);

  if (!workspace_id || !room_id) return null;

  return (
    <RoomSpatialWrapper
      token={query?.token}
      workspace_id={workspace_id}
      room_id={+room_id}
    />
  );
}
