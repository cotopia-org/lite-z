import React, { useCallback, useEffect, useRef } from "react";
import { ChatType } from "@/types/chat2";
import BackHolder from "./back";
import ChatDetails from "../details";
import Chat2 from "@/components/shared/chat-box-2";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { UserMinimalType } from "@/types/user";
import { Virtualizer } from "@tanstack/react-virtual";
import FullLoading from "@/components/shared/full-loading";
import { useAppDispatch } from "@/store";
import { getChatMessages } from "@/store/slices/chat-slice";

type Props = {
  chat: ChatType;
  onBack: () => void;
  getUser: (user_id: number) => UserMinimalType | undefined;
};

export default function ChatInnerHolder({ chat, onBack, getUser }: Props) {
  const chatRef = useRef<Virtualizer<HTMLDivElement, Element>>();

  const { chatObjects, send, seen } = useChat2({ chat_id: chat.id });

  const chatMessages = [...(chatObjects?.[chat.id]?.messages ?? [])].sort(
    (a, b) => b.nonce_id - a.nonce_id
  );

  const handleSendMessage = useCallback(
    (text: string) => {
      const message = send({ text, seen: true });
      seen(message);
    },
    [seen, send]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getChatMessages({ chat_id: chat.id }));
  }, [chat?.id]);

  const { loading } = useChat2();

  if (loading) return <FullLoading />;

  return (
    <div className='flex flex-col gap-y-2 w-full h-[calc(100vh-72px)] overflow-hidden'>
      <div className='flex flex-row items-center gap-x-2 px-4'>
        <BackHolder onClick={onBack} />
        <ChatDetails title={chat.title} />
      </div>
      <Chat2
        items={chatMessages}
        addMessage={handleSendMessage}
        getUser={getUser}
        onGetVirtualizer={(vir) => (chatRef.current = vir)}
      />
    </div>
  );
}
