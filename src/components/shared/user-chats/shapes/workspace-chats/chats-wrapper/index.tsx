import { useRoomContext } from '@/components/shared/room/room-context';
import { useChat2 } from '@/hooks/chat/use-chat-2';
import { useMemo } from 'react';
import Chat from '../../../chat';
import FullLoading from '@/components/shared/full-loading';
import useBus from 'use-bus';
import { __BUS } from '@/const/bus';
import { useAppDispatch } from '@/store';
import { setCurrentChat } from '@/store/slices/chat-slice';
import { useSlides } from '@/components/shared/slide-pusher';
import ChatInnerHolder from '../../../chat/holder';
import { useSocket } from '@/routes/private-wrarpper';
import { MessageType } from '@/types/message';
import useAuth from '@/hooks/auth';
import { ChatType } from '@/types/chat2';

export default function ChatsWrapper({ chats }: { chats: ChatType[] }) {
  return (
    <div className="w-full chats-holder  flex flex-col gap-y-0 overflow-y-auto h-[calc(100vh-80px)] pb-20">
      {chats.map((chat) => (
        <Chat chat={chat} key={chat?.id} />
      ))}
    </div>
  );
}
