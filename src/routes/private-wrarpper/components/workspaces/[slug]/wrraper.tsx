import FullLoading from '@/components/shared/full-loading';
import { useApi } from '@/hooks/swr';
import { WorkspaceRoomType } from '@/types/room';
import { isMobileBrowser } from '@livekit/components-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  workspace_id: string;
};

export default function Wrapper({ workspace_id }: Props) {
  const navigate = useNavigate();

  const { data, isLoading } = useApi(`/workspaces/${workspace_id}/rooms`);

  const isMobile = isMobileBrowser();

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
