import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '@/hooks/swr';
import { WorkspaceRoomType } from '@/types/room';
import { useEffect } from 'react';
import FullLoading from '@/components/shared/full-loading';
import { isMobileBrowser } from '@livekit/components-core';

export default function WorkspacePage() {
  const { workspace_id } = useParams();

  const navigate = useNavigate();

  const isMobile = isMobileBrowser();

  const { data, isLoading } = useApi(`/workspaces/${workspace_id}/rooms`);

  const rooms: WorkspaceRoomType[] = data !== undefined ? data?.data : [];

  useEffect(() => {
    if (rooms.length === 0) return;

    let defaultRoom: WorkspaceRoomType | undefined = rooms[0];

    if (isMobile) {
      const gridRoom = rooms.find((a) => a.type === 'grid');

      if (gridRoom) defaultRoom = gridRoom;
    }

    navigate(`/workspaces/${workspace_id}/rooms/${defaultRoom.id}`);
  }, [rooms, workspace_id, isMobile]);

  if (isLoading || data === undefined) return <FullLoading />;

  return null;
}
