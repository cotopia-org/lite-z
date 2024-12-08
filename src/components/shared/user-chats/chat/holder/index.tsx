import React, { useCallback, useEffect, useRef } from "react";
import { ChatType } from "@/types/chat2";
import BackHolder from "./back";
import ChatDetails from "../details";
import Chat2 from "@/components/shared/chat-box-2";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { Virtualizer } from "@tanstack/react-virtual";
import FullLoading from "@/components/shared/full-loading";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getChatMessages,
  getNextMessages,
  getPinMessags,
  getPrevMessages,
} from "@/store/slices/chat-slice";
import { thunkResHandler } from "@/utils/utils";
import ChatHeading from "./heading";

type Props = {
  chat_id: number;
  onBack: () => void;
};

export default function ChatInnerHolder({ chat_id, onBack }: Props) {
  const chatRef = useRef<Virtualizer<HTMLDivElement, Element>>();

  const chatDetails = useAppSelector((store) => store.chat);

  const { chatObjects, send, currentChat } = useChat2({ chat_id });

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
      dispatch(getChatMessages({ chat_id: currentChat?.id, page: 1 }));
      dispatch(getPinMessags({ chat_id: currentChat?.id }));
    }
  }, [currentChat?.id]);

  const { loading } = useChat2();

  if (loading) return <FullLoading />;

  if (!currentChat?.id) return null;

  return (
    <div className='flex flex-col w-full h-[calc(100vh-72px)] overflow-hidden'>
      <ChatHeading
        title={chatObjects?.[currentChat?.id]?.object?.title ?? ""}
        onBack={onBack}
        loading={chatObjects?.[currentChat?.id]?.fetchPageLoading ?? false}
      />
      <Chat2
        chat_id={chat_id}
        addMessage={handleSendMessage}
        onGetVirtualizer={(vir) => (chatRef.current = vir)}
      />
    </div>
  );
}
