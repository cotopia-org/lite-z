import { useParams } from "react-router-dom";
import WorkspaceRoomsHolder from "../[slug]/rooms";

export default function WorkspaceSidebar() {
  const { workspace_id } = useParams();

  return (
    <div className='flex flex-col gap-y-4 bg-white min-h-screen overflow-y-auto'>
      <WorkspaceRoomsHolder workspace_id={workspace_id as string} />
    </div>
  );
}
