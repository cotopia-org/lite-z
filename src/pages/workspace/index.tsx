import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '@/hooks/swr';
import { WorkspaceRoomType } from '@/types/room';
import { useEffect } from 'react';
import FullLoading from '@/components/shared/full-loading';

export default function WorkspacePage() {
  const { workspace_id } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useApi(`/workspaces/${workspace_id}/rooms`);

  const rooms: WorkspaceRoomType[] = data !== undefined ? data?.data : [];

  useEffect(() => {
    if (rooms.length === 0) return;

    navigate(`/workspaces/${workspace_id}/rooms/${rooms[0].id}`);
  }, [rooms, workspace_id]);

  if (isLoading || data === undefined) return <FullLoading />;

  return null;
}
