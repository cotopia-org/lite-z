import { useParams } from "react-router-dom";
import WorkspaceRoomsHolder from "../[slug]/rooms";
import OfflineUsers from "@/components/shared/room/settings/users/offline";
import ScheduledUsers from "@/components/shared/room/settings/users/scheduled";
import WorkspaceActionFab from "./componets/action-fab";

export default function WorkspaceSidebar() {
  const { workspace_id } = useParams();

  return (
    <div className='flex flex-col gap-y-4 bg-white h-[calc(100vh-80px)] pb-20 overflow-y-auto relative'>
      <WorkspaceRoomsHolder workspace_id={workspace_id as string} />
      <div className='p-4 flex flex-col gap-y-6'>
        <ScheduledUsers />
        <OfflineUsers />
      </div>
      <WorkspaceActionFab />
    </div>
  );
}
