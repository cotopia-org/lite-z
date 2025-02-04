import { useParams } from 'react-router-dom';
import WorkspaceRoomsHolder from '../[slug]/rooms';
import OfflineUsers from '@/components/shared/room/settings/users/offline';
import ScheduledUsers from '@/components/shared/room/settings/users/scheduled';
import WorkspaceActionFab from './componets/action-fab';
import { useRoomContext } from '@/components/shared/room/room-context';
import moment from 'moment';
import { isNowBetween } from '@/lib/utils';
import { useWorkspace } from '@/pages/workspace';
import FullLoading from '@/components/shared/full-loading';
import BlurFade from '@/components/magicui/blur-fade';

export default function WorkspaceSidebar() {
  const { workspace_id } = useParams();

  const { scheduled, onlineUsers } = useRoomContext();

  const { users, workspaceFetchingLoading } = useWorkspace();

  const today = moment();

  const onlineUserIds = onlineUsers.map((x) => x.id);

  const finalSchedules = scheduled
    .filter((x) =>
      x.days.find((a) => {
        if (a.day === today.day()) {
          return (
            a.times.filter((time) =>
              isNowBetween(time.start, time.end, x.timezone),
            ).length > 0
          );
        }
      }),
    )
    .filter((x) => !onlineUserIds.includes(x.user.id));

  const finalSchedulesIds = finalSchedules.map((x) => x.user.id);

  const allOfflineParticipants = users
    .filter((x) => !onlineUserIds.includes(x.id))
    .filter((x) => !finalSchedulesIds.includes(x.id))
    .filter((x) => x.last_login !== null)
    .sort((a, b) => moment(b.last_login).unix() - moment(a.last_login).unix());

  if (workspaceFetchingLoading) return <FullLoading className="py-6" />;

  return (
    <div className="flex flex-col gap-y-4 bg-white h-[calc(100vh-80px)] pb-20 overflow-y-auto relative">
      <BlurFade delay={0.3} inView>
        <WorkspaceRoomsHolder
          workspaceUsers={users}
          workspace_id={workspace_id as string}
        />
      </BlurFade>
      <BlurFade delay={0.6} inView className="p-4 flex flex-col gap-y-6">
        <ScheduledUsers finalSchedules={finalSchedules} />
        <OfflineUsers allOfflineParticipants={allOfflineParticipants} />
      </BlurFade>
      <WorkspaceActionFab />
    </div>
  );
}
