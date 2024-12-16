import { useChat2 } from "@/hooks/chat/use-chat-2";
import { useRoomContext } from "../room-context";
import { useSocket } from "@/routes/private-wrarpper";
import { Chat2ItemType } from "@/types/chat2";
import axiosInstance from "@/services/axios";
import { useAppDispatch } from "@/store";
import {
  addMentionedMessages,
  upcommingMessage,
} from "@/store/slices/chat-slice";
import useAuth from "@/hooks/auth";

export default function ChatEvents() {
  const dispatch = useAppDispatch();

  const { workspace_id } = useRoomContext();

  const { currentChat } = useChat2();

  const { user } = useAuth();

  const myUserId = user?.id;

  //@ts-ignore
  const { add, update } = useChat2({ workspace_id: +workspace_id });

  // useSocket(
  //   "messageReceived",
  //   async (data: Chat2ItemType) => {
  //     let seen = false;

  //     if (data?.mentions?.length > 0) {
  //       const myUserMentioned = !!data.mentions.find(
  //         (x) => x.model_type === "user" && x.model_id === myUserId
  //       );
  //       if (myUserMentioned) {
  //         dispatch(addMentionedMessages({ chat_id: data.chat_id }));
  //       }
  //     }

  //     if (currentChat !== undefined && data.chat_id === currentChat.id) {
  //       seen = true;
  //       add({ ...data, seen });
  //     } else {
  //       const chatMessagesRes = await axiosInstance.get(
  //         `/chats/${data.chat_id}/messages`
  //       );
  //       const chatMessages = chatMessagesRes.data?.data ?? [];
  //       dispatch(
  //         upcommingMessage({ messages: [...chatMessages], message: data })
  //       );
  //     }
  //   },
  //   [currentChat, myUserId]
  // );

  useSocket("messageUpdated", (data: Chat2ItemType) => {
    update(data);
  });

  return null;
}
