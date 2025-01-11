import { WorkspaceType } from '@/types/workspace';

import WorkspaceAvatar from './avatar';
import WorkspaceTitle from './title';
import WorkspaceDate from './date';
import { useState } from 'react';
//@ts-ignore
import { useSocket } from '@/routes/private-wrarpper';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import WorkspaceActions from './actions';

type Props = {
  item: WorkspaceType;
};
export default function WorkspaceItem({ item }: Props) {
  const [localWorkspace, setLocalWorkspace] = useState<WorkspaceType>(item);

  let avatarTitle = '';
  if (item.title) avatarTitle = localWorkspace.title[0].toUpperCase();

  const navigate = useNavigate();

  useSocket('workspaceUpdated', (data: any) => {
    if (data.id === item.id) {
      setLocalWorkspace(data);
    }
  });

  const joinWorkspaceHandler = () => {
    navigate(`/workspaces/${localWorkspace.id}`);
  };

  return (
    <div
      onClick={joinWorkspaceHandler}
      className="p-4 rounded-3xl cursor-pointer bg-gray-50 hover:bg-black/5 w-full flex flex-row items-center justify-between"
    >
      <div className="flex flex-row items-center gap-x-4">
        <WorkspaceAvatar
          title={avatarTitle}
          date={moment(item.created_at).unix()}
        />
        <div className="flex flex-col">
          <WorkspaceTitle title={localWorkspace.title} />
          <WorkspaceDate date={localWorkspace.created_at ?? null} />
        </div>
      </div>
      {/* <WorkspaceActions item={localWorkspace} /> */}
    </div>
  );
}
