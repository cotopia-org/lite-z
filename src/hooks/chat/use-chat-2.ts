import {
  addMessage,
  getChats,
  seenAllMessages,
  seenMessage,
  updateMessage,
} from "@/store/slices/chat-slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { Chat2ItemType } from "@/types/chat2";
import { UserType } from "@/types/user";
import moment from "moment";
import { RefObject, useEffect, useMemo } from "react";
import { dispatch as busDispatch } from "use-bus";
import useAuth from "../auth";
//@ts-ignore
import { useSocket } from "@/routes/private-wrarpper";
import { __BUS } from "@/const/bus";

function generateTempChat({
  chat_id,
  user_id,
  text,
}: {
  chat_id: number;
  user_id: number;
  text: string;
}) {
  const nonce_id = moment().unix() * 1000;

  //@ts-ignore
  return {
    chat_id,
    created_at: null,
    deleted_at: null,
    files: [],
    is_edited: null,
    is_pinned: 0,
    links: [],
    mentions: [],
    nonce_id,
    reply_to: null,
    seen: false,
    text,
    updated_at: nonce_id,
    user: user_id,
    is_delivered: false,
    is_rejected: false,
    is_pending: false,
  } as Chat2ItemType;
}

export const useChat2 = (props?: {
  chat_id?: string | number;
  workspace_id?: number;
  hasInitFetch?: boolean;
  chatRef?: RefObject<HTMLDivElement> | undefined;
}) => {
  const { user } = useAuth();

  const hasInitFetch = props?.hasInitFetch ?? true;
  const workspace_id = props?.workspace_id;
  const chat_id = props?.chat_id;

  const socket = useSocket();

  const { chats, error, loading, participants } = useAppSelector(
    (store) => store.chat
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (hasInitFetch === true && workspace_id)
      dispatch(getChats({ workspace_id }));
  }, [workspace_id, hasInitFetch]);

  useSocket("updateMessage", (data: Chat2ItemType) =>
    console.log("data", data)
  );

  const seenFn = (message: Chat2ItemType, onSuccess?: () => void) => {
    const lastMessage = chats[message.chat_id].object.last_message;

    socket?.emit("seenMessage", {
      chat_id: message.chat_id,
      nonce_id: message.nonce_id,
    });

    //Seen message
    dispatch(
      seenMessage({ chat_id: message.chat_id, nonce_id: message.nonce_id })
    );

    //Because seening the last message means you've seen all messages before
    if (message.id === lastMessage?.id) {
      dispatch(seenAllMessages({ chat_id: message.chat_id }));
    }

    if (onSuccess) onSuccess();
  };

  const send = (
    {
      text,
      mentions,
      links,
      files,
    }: {
      text: string;
      mentions?: any[];
      links?: any[];
      files?: number[];
    },
    onSuccess?: () => void
  ) => {
    const message = generateTempChat({
      chat_id: chat_id as number,
      user_id: (user as UserType)?.id,
      text,
    });

    dispatch(addMessage(message));

    socket?.emit("sendMessage", message, (data: any) => {});

    if (onSuccess) onSuccess();
    setTimeout(() => {
      busDispatch(__BUS.scrollEndChatBox);
    }, 1);

    return message;
  };

  const add = (message: Chat2ItemType, onSuccess?: () => void) => {
    dispatch(addMessage(message));
    if (onSuccess) onSuccess();
  };

  const update = (message: Chat2ItemType, onSuccess?: () => void) => {
    socket?.emit("sendMessage", message, (data: any) => {});
    dispatch(updateMessage(message));
    if (onSuccess) onSuccess();
  };

  useSocket("messageSeen", (data: Chat2ItemType) => {
    dispatch(seenMessage({ chat_id: data.chat_id, nonce_id: data.nonce_id }));
  });

  const chatKeys = Object.keys(chats);

  return {
    add,
    send,
    update,
    seen: seenFn,
    chats: chatKeys.map((x) => chats[x].object),
    chatObjects: chats,
    loading,
    error,
    participants,
  };
};
