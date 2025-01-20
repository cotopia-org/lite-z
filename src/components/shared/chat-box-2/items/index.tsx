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

  const { chatObjects, currentChat } = useChat2({ chat_id });

  const items = chatObjects?.[chat_id]?.messages ?? [];

  const [unreadIndex, setUnreadIndex] = useState(items.length - 1);

  const dispatch = useAppDispatch();

  const loading = chatObjects?.[chat_id]?.loading ?? true;
  const chatPageLoading = chatObjects?.[chat_id]?.fetchPageLoading ?? false;
  const chatPage = chatObjects?.[chat_id]?.page ?? 1;
  const firstPage = chatObjects?.[chat_id]?.firstPage ?? true;
  const lastPage = chatObjects?.[chat_id]?.lastPage ?? false;

  const isInitialized = useRef(false);

  const { user: profile } = useAuth();

  const parentRef = useRef<HTMLDivElement>(null);

  const latestMessage = useRef<Chat2ItemType>();

  const [isFetching, setIsFetching] = useState(false);

  const messages = [...items].reverse();

  // Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated height of each message
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer?.getVirtualItems();
    const totalsize = rowVirtualizer?.getTotalSize();

    if (virtualItems.length > 0 && totalsize > 0) {
      isInitialized.current = true;
    }
  }, [rowVirtualizer]);

  useBus(
    __BUS.scrollEndChatBox,
    () => {
      if (items.length === 0) return;
      vlistRef.current?.scrollToIndex(items.length - 1);
    },
    [items, vlistRef.current],
  );

  useBus(
    __BUS.scrollToTargetMessage,
    (data: any) => {
      const messageId = data?.messageId;

      const itemIndex = items.findIndex((x) => +x.nonce_id === +messageId);
      console.log('Target', messageId, itemIndex);

      if (itemIndex === -1) return;

      // const rightIndex = items.length - (itemIndex + 1);

      // vlistRef.current?.scrollToIndex(rightIndex);
      // // rowVirtualizer.scrollToIndex(rightIndex);
      //
      // const messageEl: HTMLDivElement | null = document.querySelector(
      //   `.chat-item[data-index="${messageId}"]`,
      // );
      //
      // console.log(messageEl);
      //
      // if (!messageEl || !messageEl) return;
      //
      // messageEl?.classList?.add('[&]:!bg-blue-500/20');
      // messageEl?.classList?.add('[&]:animate-pulse');
      //
      // setTimeout(() => {
      //   messageEl?.classList?.remove('[&]:!bg-blue-500/20');
      //   messageEl?.classList?.remove('[&]:animate-pulse');
      // }, 1500);
    },
    [items],
  );

  useEffect(() => {
    if (!rowVirtualizer) return;

    if (onGetVirtualizer) onGetVirtualizer(rowVirtualizer);
  }, [onGetVirtualizer, rowVirtualizer]);

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

  const scrollToUnread = (index: number) => {
    // console.log(index);
    vlistRef.current?.scrollToIndex(index);
  };

  useEffect(() => {
    if (!!!latestMessage.current) return;

    const itemIndex = items.findIndex(
      (x) => x.id === latestMessage.current?.id,
    );

    if (itemIndex === -1) return;

    rowVirtualizer.scrollToIndex(items.length - (itemIndex + 1), {
      align: 'start',
    });

    setIsFetching(false);
  }, [items.length, rowVirtualizer]);

  const initScrollEnd = useRef(false);

  useEffect(() => {
    if (items.length === 0) return;
    console.log('HERE');
    // if (initScrollEnd.current === true) return;

    // vlistRef.current?.scrollToIndex(items.length - 1);
    // initScrollEnd.current = true;

    const lastMessageSeen = chatObjects?.[chat_id].object.last_seen_message?.id;

    console.log(items);
    console.log(
      [...items].reverse().findIndex((x) => x.id === lastMessageSeen),
    );
    scrollToUnread(5);
  }, [items]);

  function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const now = new Date();

    const options = {
      month: 'long',
      day: '2-digit',
    };
    if (date.getFullYear() !== now.getFullYear()) {
      // @ts-ignore
      options.year = 'numeric';
    }

    // @ts-ignore
    return date.toLocaleDateString('en-US', options);
  }

  const groupedMessages = messages.reduce((acc: any, message) => {
    const formattedDate = formatDate(message.created_at);
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(message);
    return acc;
  }, {});

  let content = (
    <>
      {!!isFetching && <FetchingProgress />}
      <VList className="h-full" ref={vlistRef} onScroll={handleScroll}>
        {Object.keys(groupedMessages).map((date, j) => {
          return (
            <div key={j}>
              <ChatDate date={date} />

              {groupedMessages[date].map((message: any, i: number) => {
                return (
                  <div key={i + j}>
                    <ChatItem
                      item={message}
                      key={message.nonce_id}
                      isMine={message?.user.id === profile?.id}
                      index={messages.indexOf(message)}
                    />
                    {messages.indexOf(message) === unreadIndex &&
                      messages.indexOf(message) !== messages.length - 1 && (
                        <div className="flex flex-col w-full text-blue-500 h-6 bg-white text-sm items-center justify-center my-4 pointer-events-none">
                          Unread messages
                        </div>
                      )}
                    {messages.indexOf(message)}
                  </div>
                );
              })}
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
