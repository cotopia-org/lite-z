import { useEffect, useState } from 'react';
import CTabs from '@/components/shared-ui/c-tabs';
import UserChat from './chat';
import WorkspaceSidebar from '@/routes/private-wrarpper/components/workspaces/sidebar';
import { SoundIcon } from '@/components/icons';
import { colors } from '@/const/varz';
import { useRoomContext } from '../room-context';
import { useAppDispatch } from '@/store';
import {
  addMentionedMessages,
  addMessage,
  addNewChat,
  getChats,
  setChatMessages,
  upcommingMessage,
  updateMessage,
} from '@/store/slices/chat-slice';
import ChatIcon from './chat-icon';
import UserActionsAvatarButton from '../../user-actions-avatar-button';
import ChatEvents from './chat-events';
import useAuth from '@/hooks/auth';
import { useChat2 } from '@/hooks/chat/use-chat-2';
import { useSocket } from '@/routes/private-wrarpper';
import { MessageType } from '@/types/message';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { ChatType } from '@/types/chat2';
import { dispatch as busDispatch } from 'use-bus';
import { __BUS } from '@/const/bus';
import { toast } from 'sonner';
import CotopiaAvatar from '@/components/shared-ui/c-avatar';

export default function RoomSettings() {
  const { workspace_id } = useRoomContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (workspace_id === null || workspace_id === undefined) return;

    dispatch(getChats({ workspace_id: +workspace_id }));
  }, [workspace_id]);

  const { user } = useAuth();

  //@ts-ignore
  // @ts-ignore
  const { chatObjects, currentChat } = useChat2({
    workspace_id: workspace_id === undefined ? undefined : +workspace_id,
  });

  useSocket(
    'messageSeen',
    (data: { chat_id: number; message_id: number; user_id: number }) => {
      const targetChat = chatObjects?.[data.chat_id];

      if (!targetChat) return;

      const message = targetChat?.messages?.find(
        (a) => a?.id === data?.message_id,
      );

      if (!message) return;

      dispatch(
        updateMessage({
          ...message,
          seens: [...new Set([...message.seens, data.user_id])],
        }),
      );
    },
    [chatObjects],
  );

  useSocket(
    'newMessage',
    async (newMessage: MessageType) => {
      const targetChat = chatObjects?.[newMessage.chat_id];

      const chatType = targetChat.object.type;

      if (newMessage.user.id !== user.id && targetChat) {
        if (currentChat?.id !== newMessage.chat_id) {
          new Notification(
            `- New chat message from \n ${newMessage.user.username}`,
            { body: newMessage.text, icon: newMessage.user.avatar?.url },
          );
          toast(
            <div className={'flex gap-2 items-center'}>
              <CotopiaAvatar
                date={newMessage.user.created_at}
                className={`w-16 h-16 text-3xl`}
                src={newMessage.user.avatar?.url}
                title={
                  newMessage.user.username
                    ? newMessage.user.username?.[0]
                    : undefined
                }
              />
              <div className={'flex flex-col'}>
                <span className={'font-bold'}>
                  {newMessage.user.username}{' '}
                  {chatType !== 'direct' && (
                    <span>at {targetChat.object.title}</span>
                  )}
                </span>

                {newMessage?.text ? (
                  <div>
                    {newMessage?.text?.length > 70
                      ? newMessage?.text.slice(0, 70) + '... '
                      : newMessage.text}
                  </div>
                ) : null}
              </div>
            </div>,
          );
        }

        dispatch(
          upcommingMessage({
            message: {
              ...newMessage,
              is_delivered: true,
              is_pending: false,
              is_rejected: false,
            },
          }),
        );

        if (newMessage?.mentions?.length > 0) {
          const myUserMentioned = !!newMessage.mentions.find(
            (x) => x?.type === 'user' && x?.model_id === user.id,
          );
          if (myUserMentioned) {
            dispatch(addMentionedMessages({ chat_id: newMessage.chat_id }));
          }
        }
      }

      if (targetChat === undefined) {
        //We should add chat object to our slice
        const chatObjectRes = await axiosInstance.get<FetchDataType<ChatType>>(
          `/chats/${newMessage.chat_id}`,
        );
        const chatMessagesRes = await axiosInstance.get<
          FetchDataType<MessageType[]>
        >(`/chats/${newMessage.chat_id}/messages`);
        const chatObject = chatObjectRes?.data?.data;
        const chatObjectMessags = chatMessagesRes?.data?.data ?? [];
        dispatch(addNewChat({ ...chatObject, unseens: 1 }));
        dispatch(
          setChatMessages(
            chatObjectMessags.map((item) => ({
              ...item,
              is_delivered: true,
              is_pending: false,
              is_rejected: false,
            })),
          ),
        );
      } else {
        const chatMesssages = targetChat?.messages ?? [];

        const foundMessage = chatMesssages.findIndex(
          (a) => a.nonce_id === newMessage.nonce_id,
        );

        if (foundMessage > -1) {
          //We should update state of message
          console.log('update state of message, for instance to sent');
          dispatch(
            updateMessage({
              ...newMessage,
              is_delivered: true,
              is_pending: false,
              is_rejected: false,
            }),
          );
        } else {
          //We should add our message to slice
          console.log(
            'add our message to chat messages as a new incoming message',
          );
          dispatch(
            addMessage({
              ...newMessage,
              is_delivered: true,
              is_pending: false,
              is_rejected: false,
            }),
          );
          if (user.id !== newMessage.user.id)
            setTimeout(() => {
              busDispatch(__BUS.scrollEndChatBox);
            }, 10);
        }
      }
    },
    [chatObjects, user?.id],
  );

  const [value, setValue] = useState('rooms');

  return (
    <div className="flex flex-col gap-y-4">
      <ChatEvents />
      <CTabs
        title={
          <div>
            <UserActionsAvatarButton size="large" />
          </div>
        }
        defaultValue={value}
        onChangeTab={setValue}
        className=" [&>.tab-holder]:p-6 [&>.tab-holder]:py-4 [&>.tab-holder]:shadow-app-bar"
        items={[
          {
            icon: <SoundIcon color={colors.grayscale.grayscaleCaption} />,
            content: <WorkspaceSidebar />,
            value: 'rooms',
          },
          {
            icon: <ChatIcon />,
            content: <UserChat />,
            value: 'chat',
          },
          // {
          //   icon: (
          //     <Profile2UserIcon color={colors.grayscale.grayscaleCaption} />
          //   ),
          //   content: <WorkspaceUsers />,
          //   value: "users",
          // },
        ]}
      />
    </div>
  );
}
