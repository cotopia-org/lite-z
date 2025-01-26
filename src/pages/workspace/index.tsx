import FullLoading from '@/components/shared/full-loading';
import RoomSettings from '@/components/shared/room/settings';
import RoomSidebar from '@/components/shared/room/sidebar';
import RoomWrapper from '@/components/shared/room/wrapper';
import { useApi } from '@/hooks/swr';
import { cn } from '@/lib/utils';
import { FetchDataType } from '@/services/axios';
import { WorkspaceType } from '@/types/workspace';
import { useParams } from 'react-router-dom';

export default function WorkspacePage() {
  const params = useParams();
  const { data, isLoading } = useApi<FetchDataType<WorkspaceType>>(
    `/workspaces/${params.workspace_id}`,
  );
  const workspace = data !== undefined ? data?.data : null;

  if (data === undefined || isLoading) return <FullLoading />;

  if (workspace === null) return null;

  let mainRoomHolderClss = 'main-room-holder w-full h-screen overflow-hidden';

  let parentSidebarClass = cn(
    'fixed right-0 top-0 bottom-0 w-full md:w-[376px] h-screen overflow-y-auto z-10',
  );

  return (
    <>
      <div id="lobby-page" className={mainRoomHolderClss}>
        <div className="relative p-8">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">{workspace.title}</h1>
            <p>{workspace.description}</p>
          </div>
        </div>
        <div className={cn(parentSidebarClass, 'border-l')}>
          <RoomSidebar>
            <RoomSettings />
          </RoomSidebar>
        </div>
      </div>
    </>
  );
}
