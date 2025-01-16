import { useTalk } from '..';
import UserAvatar from '@/components/shared/user-avatar';

export default function TalkItemRejectView() {
  const { talk } = useTalk();

  return (
    <div className="flex flex-row items-center gap-x-2 whitespace-nowrap bg-white rounded-lg shadow-md p-4">
      <UserAvatar
        date={talk.user.created_at}
        src={talk.user?.avatar?.url}
        title={talk.user?.username!}
        className="w-10 h-10"
      />
      <span className="py-1 px-2 bg-black/10 hover:bg-black/15 text-black rounded-md cursor-default">{`@${talk.user.username}`}</span>
      rejected your invitation
    </div>
  );
}
