import CotopiaAvatar from '@/components/shared-ui/c-avatar';
import UserSchedules from './schedules';
import { useUserDetail } from '.';
import UserMood from './mood';
import UserNavigate from './navigate';
import { useRoomContext } from '../../room-context';
import useAuth from '@/hooks/auth';
import UserJobs from './jobs';
import UserDirect from './direct';
import UserHardMute from './hard-mute';

export default function UserCover() {
  const { user, roomId } = useUserDetail();

  const { user: myAccount } = useAuth();

  const { room_id: currentRoomId } = useRoomContext();

  const inCurrentRoom = roomId === currentRoomId;

  const isMineAccount = myAccount?.id === user?.id;

  return (
    <div className="relative pb-[40px]">
      <div className="h-[80px] bg-black/70 w-full"></div>
      <CotopiaAvatar
        date={user?.created_at}
        src={user?.avatar?.url}
        className="absolute w-[80px] h-[80px] bottom-0 left-4 border-4 border-white"
      />
      <div className="absolute bottom-2 right-2 flex flex-row items-center gap-x-2">
        <UserHardMute />
        {inCurrentRoom && !isMineAccount && <UserNavigate />}
        <UserMood />
        <UserSchedules />
        <UserJobs />
        {!isMineAccount && <UserDirect />}
      </div>
    </div>
  );
}
