import { ScrollArea } from '@/components/ui/scroll-area';
import BlurFade from '@/components/magicui/blur-fade';
import {
  CommitmentLeaderboardType,
  LeaderboardType,
} from '@/types/leaderboard';
import useAuth from '@/hooks/auth';
import { WorkspaceUserType } from '@/types/user';
import WorkingTimes from './working-times';
import UserSummary from './user-summary';
import { formatTime } from '@/lib/utils';

type TimeTrackingDetailProps = {
  leaderboard: CommitmentLeaderboardType[];
  workspaceUsers: WorkspaceUserType[];
  setSelectedUser: Function;
};

export default function TimeTrackingDetails({
  leaderboard,
  workspaceUsers,
  setSelectedUser,
}: TimeTrackingDetailProps) {
  const { user } = useAuth();

  let content = (
    <div className="flex flex-col gap-y-1 w-full h-full">
      {leaderboard.map((item, key) => {
        const isMe = item.user.id === user?.id;

        let clss =
          'flex items-center justify-between  w-full p-2 px-3 !transform-none hover:bg-grayscale-light hover:cursor-pointer';

        if (isMe) clss += ` bg-blue-400/[0.4] hover:bg-blue-400/[0.4]`;
        if (item.percentage < 50)
          clss += ` bg-red-300/[0.4] hover:bg-red-300/[0.4]`;

        return (
          <div
            className={'w-full'}
            key={key}
            onClick={() => {
              setSelectedUser(item.user);
            }}
          >
            <BlurFade inView className={clss} delay={0.05 + key * 0.05}>
              <UserSummary user={item.user} rank={key + 1} />
              <div className={'text-sm text-center  w-1/2'}>
                {item.percentage.toFixed(0)}% ({formatTime(item.done, true)})
              </div>
            </BlurFade>
          </div>
        );
      })}
    </div>
  );

  return <ScrollArea className="h-72 w-full">{content}</ScrollArea>;
}
