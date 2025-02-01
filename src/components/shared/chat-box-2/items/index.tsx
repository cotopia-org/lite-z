import ChatItem from './item';
import { useEffect, useRef, useState } from 'react';
import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual';
import { Chat2ItemType } from '@/types/chat2';
import FetchingProgress from './fetching-progress';
import useBus, { dispatch as busDispatch } from 'use-bus';
import UnSeenHandlers from './un-seen-handlers';
import useAuth from '@/hooks/auth';
import { __BUS } from '@/const/bus';
import { VList, VListHandle } from 'virtua';
import { useChat2 } from '@/hooks/chat/use-chat-2';
import FullLoading from '../../full-loading';
import { useAppDispatch } from '@/store';
import {
  getChatMessages,
  getNextMessages,
  getPinMessags,
  getPrevMessages,
} from '@/store/slices/chat-slice';
import { thunkResHandler } from '@/utils/utils';
import moment from 'moment';
import { MessageType } from '@/types/message';
import ChatDate from '@/components/shared/chat-box-2/items/date';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { useApi } from '@/hooks/swr';
import { WorkspaceType } from '@/types/workspace';

type Props = {
  chat_id: number;
  marginFetching?: number;
  onGetVirtualizer?: (vir: Virtualizer<HTMLDivElement, Element>) => void;
};

export default function Items({
  chat_id,
  marginFetching = 1000,
  onGetVirtualizer,
}: Props) {
  const vlistRef = useRef<VListHandle | null>(null);

  const { chatObjects } = useChat2({ chat_id });

  const items = chatObjects?.[chat_id]?.messages ?? [];

  const dispatch = useAppDispatch();

  const loading = chatObjects?.[chat_id]?.loading ?? true;
  const chatPageLoading = chatObjects?.[chat_id]?.fetchPageLoading ?? false;
  const chatPage = chatObjects?.[chat_id]?.page ?? 1;
  const firstPage = chatObjects?.[chat_id]?.firstPage ?? true;
  const lastPage = chatObjects?.[chat_id]?.lastPage ?? false;

  const { user: profile } = useAuth();

  const parentRef = useRef<HTMLDivElement>(null);

  const [isFetching, setIsFetching] = useState(false);

  const messages = [...items].reverse();

  useBus(
    __BUS.scrollEndChatBox,
    () => {
      console.log('Hewre');
      if (items.length === 0) return;
      vlistRef.current?.scrollToIndex(messages.length - 1);
    },
    [items, vlistRef.current],
  );

  useBus(
    __BUS.scrollToTargetMessage,
    (data: any) => {
      const messageId = data?.messageId;

      const itemIndex = messages.findIndex((x) => +x.nonce_id === +messageId);
      console.log('Target', messageId, itemIndex);

      if (itemIndex === -1) return;
      scrollToMessage(itemIndex);
    },
    [messages],
  );

  const handleScroll = () => {
    // if (chatItemInit.current === false) return;

    if (!vlistRef.current) return;

    if (chatPageLoading) return;

    const scrollTop = vlistRef?.current?.scrollOffset;

    // Trigger fetching previous messages when scrolled to top
    if (scrollTop - marginFetching <= 0 && !lastPage) {
      const prevPage = chatPage + 1;
      thunkResHandler(
        dispatch(getPrevMessages({ chat_id, page: prevPage })),
        'chat/getPrevMessages',
        (res) => {
          const newItems = res?.payload?.items ?? [];

          // vlistRef.current?.scrollToIndex(newItems.length);
        },
        () => {},
      );
    }
  };

  const scrollToMessage = (index: number) => {
    // console.log(index);
    vlistRef.current?.scrollToIndex(index);
  };
  const lastMessageSeen = chatObjects?.[chat_id].object.last_seen_message?.id;
  const lastMessage = chatObjects[chat_id].object.last_message;
  useEffect(() => {
    if (items.length === 0) return;

    console.log(lastMessage.id, lastMessageSeen);

    let scrollMessage = messages.length - 1;
    if (lastMessage.id !== lastMessageSeen) {
      scrollMessage = messages.findIndex((x) => x.id === lastMessageSeen);
    }

    scrollToMessage(scrollMessage);
  }, [items]);

  let content = (
    <>
      {!!isFetching && <FetchingProgress />}
      <VList className="h-full" ref={vlistRef} onScroll={handleScroll}>
        {messages.map((message, key) => {
          return (
            <div key={key}>
              <ChatItem
                item={message}
                key={message.nonce_id}
                isMine={message?.user.id === profile?.id}
                index={messages.indexOf(message)}
              />
              {message.id === lastMessageSeen &&
                messages.indexOf(message) !== messages.length - 1 && (
                  <div className="flex flex-col w-full text-blue-500 h-6 bg-white text-sm items-center justify-center my-4 pointer-events-none">
                    Unread messages
                  </div>
                )}
            </div>
          );
        })}
      </VList>
    </>
  );

  if (loading) content = <FullLoading className="py-8" />;

  if (!loading && items.length === 0)
    content = (
      <div
        className={
          'flex text-center items-center justify-center m-auto h-full w-full'
        }
      >
        <span>There's no messages yet 😢</span>
      </div>
    );

  return (
    <div className="flex-grow relative">
      <div
        ref={parentRef}
        className="relative flex-grow overflow-y-auto mb-4 space-y-2 "
        style={{
          contain: 'strict',
          height: '100%',
          backgroundImage: 'url(/assets/backgrounds/chat-bg-1.png',
          backgroundSize: 'cover',
        }}
      >
        {content}
      </div>
      <UnSeenHandlers items={items} />
    </div>
  );
}
