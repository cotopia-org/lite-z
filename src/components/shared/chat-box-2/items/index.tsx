import ChatItem from "./item";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import { Chat2ItemType } from "@/types/chat2";
import FetchingProgress from "./fetching-progress";
import useBus from "use-bus";
import UnSeenHandlers from "./un-seen-handlers";
import useAuth from "@/hooks/auth";
import { __BUS } from "@/const/bus";
import { VList, VListHandle } from "virtua";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import FullLoading from "../../full-loading";
import { useAppDispatch } from "@/store";
import { getNextMessages, getPrevMessages } from "@/store/slices/chat-slice";
import { thunkResHandler } from "@/utils/utils";

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
  const dispatch = useAppDispatch();

  const { chatObjects } = useChat2({ chat_id });

  const items = chatObjects?.[chat_id]?.messages ?? [];
  const loading = chatObjects?.[chat_id]?.loading ?? false;
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

  const scrollToEnd = () => {
    if (items.length === 0) return;

    // Scroll to the latest message when a new message is added
    rowVirtualizer.scrollToIndex(items.length, {
      align: "end",
    });
  };

  useBus(
    __BUS.scrollEndChatBox,
    () => {
      scrollToEnd();
    },
    [scrollToEnd]
  );

  useBus(
    __BUS.scrollToTargetMessage,
    (data: any) => {
      const messageId = data?.messageId;

      const itemIndex = items.findIndex((x) => +x.nonce_id === +messageId);

      if (itemIndex === -1) return;

      const rightIndex = items.length - (itemIndex + 1);

      rowVirtualizer.scrollToIndex(rightIndex);

      const messageEl: HTMLDivElement | null = document.querySelector(
        `.chat-item[data-index="${rightIndex}"]`
      );

      if (!messageEl || !messageEl) return;

      messageEl?.classList?.add("[&]:!bg-blue-500/20");
      messageEl?.classList?.add("[&]:animate-pulse");

      setTimeout(() => {
        messageEl?.classList?.remove("[&]:!bg-blue-500/20");
        messageEl?.classList?.remove("[&]:animate-pulse");
      }, 1500);
    },
    [items]
  );

  useEffect(() => {
    if (!rowVirtualizer) return;

    if (onGetVirtualizer) onGetVirtualizer(rowVirtualizer);
  }, [onGetVirtualizer, rowVirtualizer]);

  const handleScroll = () => {
    if (!vlistRef.current) return;

    if (chatPageLoading) return;

    const scrollHeight = vlistRef.current?.scrollSize;
    const scrollTop = vlistRef?.current?.scrollOffset;

    // Trigger fetching previous messages when scrolled to top
    if (scrollTop - marginFetching <= 0 && !lastPage) {
      const prevPage = chatPage + 1;
      thunkResHandler(
        dispatch(getPrevMessages({ chat_id, page: prevPage })),
        "chat/getPrevMessages",
        (res) => {
          const newItems = res?.payload?.items ?? [];

          vlistRef.current?.scrollToIndex(newItems.length);
        },
        () => {}
      );
    }

    // Trigger fetching next messages when scrolled to bottom
    // if (scrollTop + marginFetching >= scrollHeight - 10 && chatPage > 1) {
    //   dispatch(getNextMessages({ chat_id, page: chatPage - 1 }));
    // }
  };

  useEffect(() => {
    if (!!!latestMessage.current) return;

    const itemIndex = items.findIndex(
      (x) => x.id === latestMessage.current?.id
    );

    if (itemIndex === -1) return;

    rowVirtualizer.scrollToIndex(items.length - (itemIndex + 1), {
      align: "start",
    });

    setIsFetching(false);
  }, [items.length, rowVirtualizer]);

  const vlistRef = useRef<VListHandle | null>(null);

  // const initScrollEnd = useRef(false);
  useEffect(() => {
    // if (items.length === 0) return;
    // if (initScrollEnd.current === true) return;

    vlistRef.current?.scrollToIndex(items.length - 1);

    // initScrollEnd.current = true;
  }, [items]);

  let content = (
    <>
      {!!isFetching && <FetchingProgress />}
      <VList className='h-full' ref={vlistRef} onScroll={handleScroll}>
        {messages.map((message, i) => (
          <div key={i}>
            <ChatItem
              item={message}
              key={message.nonce_id}
              isMine={message?.user === profile?.id}
            />
          </div>
        ))}
      </VList>
    </>
  );

  if (messages.length === 0)
    content = (
      <div
        className={
          "flex text-center items-center justify-center m-auto h-full w-full"
        }
      >
        <span>There's no messages yet 😢</span>
      </div>
    );

  if (loading) content = <FullLoading className='py-8' />;

  return (
    <div className='flex-grow relative'>
      <div
        ref={parentRef}
        className='relative flex-grow overflow-y-auto mb-4 space-y-2'
        style={{ contain: "strict", height: "100%" }}
      >
        {content}
      </div>
      <UnSeenHandlers items={items} />
    </div>
  );
}
