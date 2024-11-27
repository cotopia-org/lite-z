import Gallery from "./background/gallery";
import { useRoomContext } from "@/components/shared/room/room-context";

export default function RoomSettings() {
  const { room_id, workspace_id } = useRoomContext();

  if (!workspace_id) return null;

  return <Gallery room_id={room_id} workspace_id={workspace_id} />;
}
