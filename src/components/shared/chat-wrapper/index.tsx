import useSetting from '@/hooks/use-setting';
import { playSoundEffect } from '@/lib/sound-effects';
import {
  removeMessageAction,
  unreadMessagesAction,
  updateMessagesAction,
} from '@/store/slices/room-slice';
import { useAppDispatch } from '@/store';
import { ChatItemType } from '@/types/chat';
import { Chat2ItemType } from '@/types/chat2';
import { ReactNode } from 'react';
import { useSocket } from '@/routes/private-wrarpper';

type Props = {
  children: ReactNode;
};
export default function ChatWrapper({ children }: Props) {
  const settings = useSetting();

  const appDispatch = useAppDispatch();

  useSocket(
    'messageReceived',
    (data: ChatItemType) => {
      const isDirect = data?.is_direct;

      if (settings.sounds.messageIncoming) playSoundEffect('newMessage2');

      appDispatch(
        updateMessagesAction({
          message: data,
        }),
      );
      appDispatch(
        unreadMessagesAction({
          message: data,
          messageType: isDirect ? 'direct' : 'room',
        }),
      );
    },
    [settings.sounds.messageIncoming],
  );

  useSocket('messageSeen', (data) => {
    const message = data.message;
    let convertedMessage = { ...message, seen: true };
    appDispatch(
      updateMessagesAction({
        message: convertedMessage,
      }),
    );
  });

  useSocket('messageUpdated', (data: Chat2ItemType) => {
    appDispatch(updateMessagesAction({ message: data }));
  });
  useSocket('messageDeleted', (data: Chat2ItemType) => {
    appDispatch(removeMessageAction({ message: data }));
  });

  return <>{children}</>;
}
