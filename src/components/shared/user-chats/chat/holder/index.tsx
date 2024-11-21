import React, { useCallback, useEffect, useRef } from "react";
import { ChatType } from "@/types/chat2";
import BackHolder from "./back";
import ChatDetails from "../details";
import Chat2 from "@/components/shared/chat-box-2";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { UserMinimalType } from "@/types/user";
import { Virtualizer } from "@tanstack/react-virtual";
import FullLoading from "@/components/shared/full-loading";
import { useAppDispatch, useAppSelector } from "@/store";
import { getChatMessages, getPinMessags } from "@/store/slices/chat-slice";
import { useSlides } from "@/components/shared/slide-pusher";

type Props = {
  chat_id?: number;
  onBack: () => void;
};

export default function ChatInnerHolder({ chat_id, onBack }: Props) {
  const chatRef = useRef<Virtualizer<HTMLDivElement, Element>>();

  const chatDetails = useAppSelector((store) => store.chat);

  const { chatObjects, send, currentChat } = useChat2({ chat_id });

  const chatMessages = currentChat
    ? [...(chatObjects?.[currentChat?.id]?.messages ?? [])].sort(
        (a, b) => b.nonce_id - a.nonce_id
      )
    : [];

  const reply =
    chatDetails?.chats?.[(chatDetails?.currentChat as ChatType)?.id]
      ?.replyMessage;

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!chatDetails?.currentChat?.id) return;
      send({ text, seen: true, reply });
    },
    [reply, chatDetails, send]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentChat?.id) {
      dispatch(getChatMessages({ chat_id: currentChat?.id }));
      dispatch(getPinMessags({ chat_id: currentChat?.id }));
    }
  }, [currentChat?.id]);

  const { loading } = useChat2();

  if (loading) return <FullLoading />;

  if (!currentChat?.id) return null;

  return (
    <div className='flex flex-col w-full h-[calc(100vh-72px)] overflow-hidden'>
      <div className='flex flex-row items-center gap-x-2 py-2 px-4'>
        <BackHolder onClick={onBack} />
        <ChatDetails
          title={chatObjects?.[currentChat?.id]?.object?.title ?? ""}
        />
      </div>
      {reply?.text}
      <Chat2
        items={chatMessages}
        addMessage={handleSendMessage}
        onGetVirtualizer={(vir) => (chatRef.current = vir)}
      />
    </div>
  );
}
