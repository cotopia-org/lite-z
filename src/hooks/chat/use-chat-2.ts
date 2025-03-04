import {
  addMessage,
  clearEditMessage,
  clearReplyMessage,
  deleteMessage,
  pinMessage,
  seenAllMessages,
  seenMessage,
  subtractMentionedMessages,
  unpinMessage,
  updateMessage,
} from '@/store/slices/chat-slice';
import { useAppDispatch, useAppSelector } from '@/store';
import { Chat2ItemType } from '@/types/chat2';
import { UserMinimalType, UserType } from '@/types/user';
import moment from 'moment';
import { RefObject, useMemo } from 'react';
import { dispatch as busDispatch } from 'use-bus';
import useAuth from '../auth';
//@ts-ignore
import { useSocket } from '@/routes/private-wrarpper';
import { __BUS } from '@/const/bus';
import { extractMentions, uniqueById } from '@/lib/utils';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { MessageType } from '@/types/message';
import { AttachmentFileType } from '@/types/file';

function generateTempChat({
  chat_id,
  user,
  user_id,
  text,
  reply,
}: {
  chat_id: number;
  user: UserType;
  user_id: number;
  text?: string;
  reply?: Chat2ItemType;
}) {
  const nonce_id = moment().unix() * 1000;

  //@ts-ignore
  const object: Chat2ItemType = {
    chat_id,
    created_at: moment().unix(),
    deleted_at: null,
    files: [],
    is_edited: null,
    is_pinned: 0,
    links: [],
    mentions: [],
    nonce_id,
    seens: [],
    text,
    updated_at: nonce_id,
    user: user as UserMinimalType,
    user_id: user_id,
    is_delivered: false,
    is_rejected: false,
    is_pending: false,
    translated_text: null,
  };

  if (reply) {
    object['reply_to'] = reply;
    object['reply_id'] = reply.id;
  }

  return object;
}

export const useChat2 = (props?: {
  chat_id?: string | number;
  workspace_id?: number;
  hasInitFetch?: boolean;
  chatRef?: RefObject<HTMLDivElement> | undefined;
}) => {
  const { user } = useAuth();

  const socket = useSocket();

  const { chats, error, loading, currentChat } = useAppSelector(
    (store) => store.chat,
  );

  const chat_id = props?.chat_id ? props.chat_id : currentChat?.id;

  //current reply message
  const replyMessage = currentChat
    ? chats?.[currentChat?.id]?.replyMessage
    : undefined;

  //current edit message
  const editMessage = currentChat
    ? chats?.[currentChat?.id]?.editMessage
    : undefined;

  //current pins
  const currentChatPins = currentChat
    ? chats?.[currentChat?.id]?.pin
    : undefined;

  const dispatch = useAppDispatch();

  useSocket('updateMessage', (data: Chat2ItemType) =>
    console.log('data', data),
  );

  const seenFn = async (message: Chat2ItemType, onSuccess?: () => void) => {
    const lastMessage = chats[message.chat_id].object.last_message;

    await axiosInstance.get(`/messages/${message.id}/seen`);

    dispatch(
      seenMessage({
        chat_id: message.chat_id,
        nonce_id: message.nonce_id,
        user_id: (user as UserType)?.id,
      }),
    );

    if (
      message?.mentions?.length > 0 &&
      message?.mentions?.findIndex((x) => x.model_id === user?.id) > -1
    ) {
      dispatch(subtractMentionedMessages({ chat_id: message.chat_id }));
    }

    //Because seening the last message means you've seen all messages before
    if (message.id === lastMessage?.id) {
      dispatch(seenAllMessages({ chat_id: message.chat_id, user_id: user.id }));
    }

    if (onSuccess) onSuccess();
  };

  const send = async (
    {
      text,
      links,
      files,
      voice_id,
      seen = false,
      reply,
    }: {
      text?: string;
      links?: any[];
      files?: AttachmentFileType[];
      seen?: boolean;
      reply?: Chat2ItemType;
      voice_id?: number;
    },
    onSuccess?: () => void,
  ) => {
    const mentions = extractMentions(text ? text : '');
    const currentChatMembers = currentChat?.participants ?? [];

    const properMentions = mentions.map((x) => ({
      start_position: x.start_position,
      model_type: 'user',
      model_id: currentChatMembers.find((a) => a.username === x.user)?.id,
    }));

    const message = generateTempChat({
      chat_id: chat_id as number,
      user: user,
      user_id: user.id,
      text,
      reply,
    });

    const sendObject = { ...message, mentions: properMentions, seen };

    if (reply) {
      //@ts-ignore
      sendObject['reply_id'] = reply.id;
      sendObject['reply_to'] = reply;
    }

    dispatch(
      addMessage({
        ...sendObject,
        is_delivered: false,
        is_pending: true,
        is_rejected: false,
        files: files ?? [],
        voice_id,
      }),
    );

    //Clear reply message
    if (currentChat && reply) dispatch(clearReplyMessage(currentChat?.id));

    const recievedMessageFromServerRes = await axiosInstance.post<
      FetchDataType<MessageType>
    >(`/messages`, {
      text: sendObject.text,
      chat_id: sendObject.chat_id,
      nonce_id: sendObject.nonce_id,
      mentions: sendObject.mentions,
      links: sendObject.links,
      reply_to: sendObject?.reply_to,
      reply_id: sendObject?.reply_to?.id,
      files: files?.map((a) => a.id),
      voice_id,
    });

    const recievedMessageFromServer = recievedMessageFromServerRes?.data?.data;

    dispatch(
      updateMessage({
        ...recievedMessageFromServer,
        is_delivered: true,
        is_pending: false,
        is_rejected: false,
      }),
    );

    // socket?.emit(
    //   "sendMessage",
    //   { ...message, mentions: properMentions },
    //   (data: any) => {
    //     if (seen === true) seenMessage(data);
    //   }
    // );

    if (onSuccess) onSuccess();
    setTimeout(() => {
      busDispatch(__BUS.scrollEndChatBox);
    }, 1);

    return message;
  };

  const edit = async (
    {
      text,
      links,
    }: {
      text: string;
      links?: any[];
    },
    onSuccess?: () => void,
  ) => {
    if (!editMessage) return;

    if (!text) return;

    const mentions = extractMentions(text);
    const currentChatMembers = currentChat?.participants ?? [];

    const properMentions = mentions.map((x) => ({
      start_position: x.start_position,
      model_type: 'user',
      model_id: currentChatMembers.find((a) => a.username === x.user)?.id,
    }));

    const sendObject = { text, mentions: properMentions, links };

    const recievedMessageFromServerRes = await axiosInstance.put<
      FetchDataType<MessageType>
    >(`/messages/${editMessage?.id}`, {
      text: sendObject.text,
      mentions: sendObject.mentions,
      links: sendObject.links,
    });

    const recievedMessageFromServer = recievedMessageFromServerRes?.data?.data;

    dispatch(
      updateMessage({
        ...recievedMessageFromServer,
        is_delivered: true,
        is_pending: false,
        is_rejected: false,
      }),
    );

    dispatch(clearEditMessage(editMessage?.chat_id));

    if (onSuccess) onSuccess();

    return recievedMessageFromServer;
  };

  const deleteFn = (message: Chat2ItemType) => {
    socket?.emit(
      'deleteMessage',
      { chat_id: message.chat_id, nonce_id: message.nonce_id },
      () => {
        dispatch(deleteMessage(message));
      },
    );
  };

  const pin = (message: Chat2ItemType) => {
    dispatch(pinMessage(message));

    socket?.emit(
      'pinMessage',
      { chat_id: message.chat_id, nonce_id: message.nonce_id },
      () => {},
    );
  };

  const remove = (message: Chat2ItemType) => {
    dispatch(pinMessage(message));

    socket?.emit(
      'pinMessage',
      { chat_id: message.chat_id, nonce_id: message.nonce_id },
      () => {},
    );
  };

  const unpin = (message: Chat2ItemType) => {
    dispatch(unpinMessage(message));

    socket?.emit(
      'unPinMessage',
      { chat_id: message.chat_id, nonce_id: message.nonce_id },
      () => {},
    );
  };

  const add = (message: Chat2ItemType, onSuccess?: () => void) => {
    dispatch(addMessage(message));
    if (onSuccess) onSuccess();
  };

  const addSimple = (
    {
      text,
      links,
      files = [],
      seen = false,
      reply,
    }: {
      text: string;
      links?: any[];
      files?: File[];
      seen?: boolean;
      reply?: Chat2ItemType;
    },
    onSuccess?: () => void,
  ) => {
    //@ts-ignore
    const tempMessage = generateTempChat({ text, chat_id, user, reply });

    dispatch(
      addMessage({
        ...tempMessage,
        files: files?.map((a) => ({
          id: Math.random() * 10000000000,
          path: URL.createObjectURL(a),
          url: URL.createObjectURL(a),
          mime_type: a.type,
          owner: user,
        })),
      }),
    );
    if (onSuccess) onSuccess();
  };

  const update = (message: Chat2ItemType, onSuccess?: () => void) => {
    socket?.emit('sendMessage', message, (data: any) => {});
    dispatch(updateMessage(message));
    if (onSuccess) onSuccess();
  };

  useSocket(
    'messageSeen',
    (data: Chat2ItemType) => {
      dispatch(
        seenMessage({
          chat_id: data.chat_id,
          nonce_id: data.nonce_id,
          user_id: (user as UserType).id,
        }),
      );
    },
    [user?.id],
  );

  const chatKeys = Object.keys(chats);

  const participants: UserMinimalType[] = useMemo(() => {
    const chatIds = Object.keys(chats);

    let users = [];

    for (let chatId of chatIds) {
      for (let participant of chats[chatId].object.participants) {
        users.push(participant);
      }
    }

    return uniqueById(users) as UserMinimalType[];
  }, [chats]);

  const getUser = (userId: number) => {
    return currentChat?.participants?.find((x) => x.id === userId);
  };

  return {
    add,
    addSimple,
    send,
    edit,
    update,
    deleteFn,
    seen: seenFn,
    chats: chatKeys.map((x) => chats[x].object),
    chatObjects: chats,
    loading,
    error,
    participants,
    currentChat,
    replyMessage,
    editMessage,
    getUser,
    currentChatPins,
    pin,
    unpin,
  };
};
