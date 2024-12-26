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
import moment from "moment";
import ChatDate from "./date";

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

  const chatItemInit = useRef(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      chatItemInit.current = true;
    }, 1000);
    return () => clearInterval(timeout);
  }, []);

  const dispatch = useAppDispatch();

  const { chatObjects, editMessage } = useChat2({ chat_id });

  const items = chatObjects?.[chat_id]?.messages ?? [];
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

      if (itemIndex === -1) return;

      const rightIndex = items.length - (itemIndex + 1);

      rowVirtualizer.scrollToIndex(rightIndex);

      const messageEl: HTMLDivElement | null = document.querySelector(
        `.chat-item[data-index="${rightIndex}"]`,
      );

      if (!messageEl || !messageEl) return;

      messageEl?.classList?.add("[&]:!bg-blue-500/20");
      messageEl?.classList?.add("[&]:animate-pulse");

      setTimeout(() => {
        messageEl?.classList?.remove("[&]:!bg-blue-500/20");
        messageEl?.classList?.remove("[&]:animate-pulse");
      }, 1500);
    },
    [items],
  );

  useEffect(() => {
    if (!rowVirtualizer) return;

    if (onGetVirtualizer) onGetVirtualizer(rowVirtualizer);
  }, [onGetVirtualizer, rowVirtualizer]);

  const handleScroll = () => {
    if (chatItemInit.current === false) return;

    if (!vlistRef.current) return;

    if (chatPageLoading) return;

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
        () => {},
      );
    }
  };

  useEffect(() => {
    if (!!!latestMessage.current) return;

    const itemIndex = items.findIndex(
      (x) => x.id === latestMessage.current?.id,
    );

    if (itemIndex === -1) return;

    rowVirtualizer.scrollToIndex(items.length - (itemIndex + 1), {
      align: "start",
    });

    setIsFetching(false);
  }, [items.length, rowVirtualizer]);

  const initScrollEnd = useRef(false);

  useEffect(() => {
    if (items.length === 0) return;
    if (initScrollEnd.current === true) return;

    vlistRef.current?.scrollToIndex(items.length - 1);
    initScrollEnd.current = true;
  }, [items, initScrollEnd.current]);

  let content = (
    <>
      {!!isFetching && <FetchingProgress />}
      <VList className="h-full" ref={vlistRef} onScroll={handleScroll}>
        {messages.map((message, i) => {
          const messageDate = moment(
            message?.created_at
              ? message?.created_at * 1000
              : message?.nonce_id,
          ).format("dddd, MMMM D, YYYY");
          const messagePrevDate = moment(
            messages[i - 1]?.created_at
              ? messages[i - 1]?.created_at * 1000
              : messages[i - 1]?.nonce_id,
          ).format("dddd, MMMM D, YYYY");
          const showDateHeader = messageDate !== messagePrevDate;

          return (
            <div key={i}>
              {!!showDateHeader && <ChatDate date={messageDate} />}
              <ChatItem
                item={message}
                key={message.nonce_id}
                isMine={message?.user.id === profile?.id}
                index={i}
              />
            </div>
          );
        })}
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

  if (loading) content = <FullLoading className="py-8" />;

  return (
    <div className="flex-grow relative">
      <div
        ref={parentRef}
        className="relative flex-grow overflow-y-auto mb-4 space-y-2"
        style={{ contain: "strict", height: "100%" }}
      >
        {content}
      </div>
      <UnSeenHandlers items={items} />
    </div>
  );
}
