import { useRoomContext } from '@/components/shared/room/room-context';
import { useApi } from '@/hooks/swr';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/pages/workspace';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { WorkspaceType } from '@/types/workspace';
import { Text } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function WorkspaceOverviewItem() {
  const location = useLocation();

  const { activeRoom, setActiveRoom } = useWorkspace();
  const { workspace_id } = useRoomContext();

  const handleClick = () => {
    if (activeRoom) {
      setActiveRoom(undefined);
      axiosInstance.get(`/rooms/${activeRoom.id}/leave`);
    }
  };

  const data = useApi<FetchDataType<WorkspaceType>>(
    `/workspaces/${workspace_id}`,
  );
  const workspace = data !== undefined ? data?.data?.data : null;

  const isActive =
    location.pathname === `/workspaces/${workspace_id}` && !activeRoom;

  return (
    <div
      onClick={handleClick}
      className={cn(
        'cursor-pointer m-2 py-2 flex flex-row items-center px-4 gap-x-2 hover:bg-black/5 rounded-lg',
        isActive ? '!bg-primary text-white [&_*]:text-white' : '',
      )}
    >
      <Text size={20} className="text-grayscale-caption" />
      <strong className="font-semibold text-grayscale-subtitle">
        {workspace?.title ?? '...'}
      </strong>
    </div>
  );
}
