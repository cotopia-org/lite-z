import BackHolder from '../back';
import ChatDetails from '../../details';
import { Skeleton } from '@radix-ui/themes';
import Loading from './loading';
import CotopiaAvatar from '@/components/shared-ui/c-avatar';
import { ChatType } from '@/types/chat2';
import { useRoomContext } from '@/components/shared/room/room-context';
import useAuth from '@/hooks/auth';
import moment from 'moment/moment';

type Props = {
  onBack: () => void;
  chat: ChatType;
};

export default function ChatHeading({ onBack, chat }: Props) {
  const { workspaceUsers } = useRoomContext();
  const { user } = useAuth();

  const isDirectChat = chat.type === 'direct';
  const chatUser = workspaceUsers?.find(
    (x) => x.id === chat?.participants?.find((x) => x.id !== user?.id)?.id,
  );

  return (
    <div className="flex flex-row items-center gap-x-2 py-2 px-4 relative shadow border-b border-black/5">
      <CotopiaAvatar
        src={isDirectChat ? chatUser?.avatar?.url : ''}
        date={isDirectChat ? chatUser?.created_at : chat.created_at}
        title={chat?.title?.slice(0, 1)}
        className={`w-10 h-10 text-xl`}
        status={
          isDirectChat && (
            <div
              className={
                'w-full h-full rounded-full ' +
                (chatUser?.status === 'online' ? 'bg-green-500' : 'bg-gray-500')
              }
            ></div>
          )
        }
      />
      <ChatDetails
        muted={chat.muted}
        title={chat.title}
        sub_title={
          isDirectChat
            ? chatUser?.status === 'online'
              ? 'Online'
              : `last seen ${moment(chatUser?.last_login).fromNow()}`
            : `${chat.participants.length} members`
        }
        type={chat.type}
      />

      <BackHolder onClick={onBack} />
    </div>
  );
}
