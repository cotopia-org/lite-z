import { useChat2 } from "@/hooks/chat/use-chat-2";
import React from "react";
import { useRoomContext } from "../room-context";
import { useSocket } from "@/routes/private-wrarpper";
import { Chat2ItemType } from "@/types/chat2";
import axiosInstance from "@/services/axios";
import { useAppDispatch } from "@/store";
import {
  addMessage,
  setChatMessages,
  upcommingMessage,
} from "@/store/slices/chat-slice";

export default function ChatEvents() {
  const dispatch = useAppDispatch();

  const { workspace_id } = useRoomContext();

  const { currentChat } = useChat2();

  //@ts-ignore
  const { add, update } = useChat2({ workspace_id: +workspace_id });

  useSocket(
    "messageReceived",
    async (data: Chat2ItemType) => {
      let seen = false;

      if (currentChat !== undefined && data.chat_id === currentChat.id) {
        seen = true;
        add({ ...data, seen });
      } else {
        const chatMessagesRes = await axiosInstance.get(
          `/chats/${data.chat_id}/messages`
        );
        const chatMessages = chatMessagesRes.data?.data ?? [];
        dispatch(
          upcommingMessage({ messages: [...chatMessages], message: data })
        );
      }
    },
    [currentChat]
  );

  useSocket("messageUpdated", (data: Chat2ItemType) => {
    update(data);
  });

  return null;
}
