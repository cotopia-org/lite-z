import Rank from './rank';
import { LeaderboardType } from '@/types/leaderboard';
import UserAvatar from '@/components/shared/user-avatar';
import { UserType, WorkspaceUserType } from '@/types/user';

type Props = {
  rank: number;
  user: UserType;
};

const UserSummary = ({ rank, user }: Props) => {
  const avatar = user.avatar;

  const username = user.username;

  return (
    <div className="flex flex-row w-full items-center gap-x-2">
      <Rank rank={rank} />
      <UserAvatar date={user.created_at} title={username} src={avatar?.url} />
      <span className="text-xs text-grayscale-subtitle font-medium">
        {username ?? '-'}
      </span>
    </div>
  );
};

export default UserSummary;
