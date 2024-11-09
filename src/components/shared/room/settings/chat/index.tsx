import WorkspaceChats from "@/components/shared/user-chats/shapes/workspace-chats";
import { useRoomContext } from "../../room-context";

export default function UserChat() {
  const { workspace_id } = useRoomContext();

  if (!workspace_id) return null;

  return <WorkspaceChats workspace_id={+workspace_id} />;
}
