import { WorkspaceRoomShortType } from '@/types/room';
import { WorkspaceUserType } from '@/types/user';
import WorkspaceRoom from './room';
import WorkspaceOverviewItem from './overview-item';
import { useWorkspace } from '@/pages/workspace';
import useAuth from '@/hooks/auth';

type Props = {
  rooms: WorkspaceRoomShortType[];
  workspace_id: number;
  selected_room_id?: number;
  workspaceUsers: WorkspaceUserType[];
};

export default function WorkspaceRooms({
  workspace_id,
  rooms,
  selected_room_id,
  workspaceUsers,
}: Props) {
  const { myJobs } = useWorkspace();

  const { user: profile } = useAuth();

  const activeJob = myJobs.find((j) => j.status === 'in_progress');

  if (rooms.length === 0) return null;

  let rooms_view = (
    <>
      <WorkspaceOverviewItem />
      {rooms.map((room) => {
        const usersList = workspaceUsers
          .filter((x) => x.room_id === room.id && x.status === 'online')
          .map((user) => {
            if (user.id === profile.id) {
              return {
                ...user,
                active_job: activeJob || null,
              };
            } else {
              return user;
            }
          });

        return (
          <WorkspaceRoom
            selected_room_id={selected_room_id}
            key={room.id}
            workspace_id={workspace_id}
            room={room}
            participants={usersList}
          />
        );
      })}
    </>
  );

  return (
    <div className="flex flex-col justify-start gap-y-1 w-full">
      {rooms_view}
    </div>
  );
}
