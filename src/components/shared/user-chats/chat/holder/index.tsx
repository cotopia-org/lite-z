import { useCallback, useEffect, useRef } from 'react';
import { ChatType } from '@/types/chat2';
import Chat2 from '@/components/shared/chat-box-2';
import { useChat2 } from '@/hooks/chat/use-chat-2';
import { Virtualizer } from '@tanstack/react-virtual';
import FullLoading from '@/components/shared/full-loading';
import { useAppDispatch, useAppSelector } from '@/store';
import { getChatMessages, getPinMessags } from '@/store/slices/chat-slice';
import ChatHeading from './heading';
import { dispatch, dispatch as busDispatch } from 'use-bus';
import { __BUS } from '@/const/bus';

type Props = {
  chat_id: number;
  onBack: () => void;
};

export default function ChatInnerHolder({ chat_id, onBack }: Props) {
  const chatRef = useRef<Virtualizer<HTMLDivElement, Element>>();

  const chatDetails = useAppSelector((store) => store.chat);

  const { chatObjects, send, edit, currentChat, editMessage, loading } =
    useChat2({
      chat_id,
    });

  const reply =
    chatDetails?.chats?.[(chatDetails?.currentChat as ChatType)?.id]
      ?.replyMessage;

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!chatDetails?.currentChat?.id) return;
      if (editMessage) {
        await edit({ text });
      } else {
        busDispatch(__BUS.scrollEndChatBox);
        await send({ text, seen: true, reply });
      }
    },
    [reply, chatDetails, send, editMessage],
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentChat?.id) {
      dispatch(getChatMessages({ chat_id: currentChat?.id, page: 1 }));
      dispatch(getPinMessags({ chat_id: currentChat?.id }));
    }
  }, [currentChat?.id]);

  if (loading) return <FullLoading />;

  if (!currentChat?.id) return null;

  return (
    <div className="flex flex-col w-full h-[calc(100vh-72px)] overflow-hidden">
      <ChatHeading chat={currentChat} onBack={onBack} />
      <Chat2
        chat_id={chat_id}
        lastMessageUnseen={currentChat.last_seen_message?.id}
        addMessage={handleSendMessage}
        onGetVirtualizer={(vir) => (chatRef.current = vir)}
      />
    </div>
  );
}
