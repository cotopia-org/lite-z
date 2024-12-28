import { Chat2ItemType } from "@/types/chat2";
import ChatUserOverView from "./user-overview";
import ChatItemContent from "./content";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import CotopiaContextMenu from "@/components/shared-ui/c-context-menu";
import RightClickActions from "./right-click-actions";
import DeletePrompt from "./content/delete-prompt";
import useAuth from "@/hooks/auth";
import { cn } from "@/lib/utils";

type Props = {
  item: Chat2ItemType;
  isMine?: boolean;
  index: number;
};

const ChatItemContext = createContext<{
  item: Chat2ItemType;
  isShowDeletePrompt: boolean;
  showDeletePrompt: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  //@ts-ignore
  item: undefined,
  showDeletePrompt: () => {},
  isShowDeletePrompt: false,
});

export const useChatItem = () => useContext(ChatItemContext);

export default function ChatItem({ item, isMine, index }: Props) {
  const { user } = useAuth();

  const [isShowDeletePrompt, showDeletePrompt] = useState(false);

  const { seen, chatObjects } = useChat2();

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (user?.id === null) return;

          const isMeSeen = item.seens.includes(user.id);

          //Should remove item.nonce_id !== 0 in the feuture (just for legacy messages)
          if (isMeSeen === false && item.nonce_id !== 0 && !isMine) {
            seen(item);
          }
        }
      },
      { threshold: 0.1 }, // Customize visibility threshold
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
    };
  }, [user?.id, seen]);

  const prevMessage = useMemo(() => {
    const messageIndex = chatObjects?.[item?.chat_id]?.messages?.findIndex(
      (a) => a.id === item.id,
    );

    if (messageIndex < 0) return undefined;

    let message = chatObjects?.[item?.chat_id]?.messages[messageIndex + 1];

    return message;
  }, [item, chatObjects]);

  const nextMessage = useMemo(() => {
    const messageIndex = chatObjects?.[item?.chat_id]?.messages?.findIndex(
      (a) => a.id === item.id,
    );

    if (messageIndex < 0) return undefined;

    let prevMessage = chatObjects?.[item?.chat_id]?.messages[messageIndex - 1];

    return prevMessage;
  }, [item, chatObjects]);

  const isLastMessage = useMemo(() => {
    const messageIndex = chatObjects?.[item?.chat_id]?.messages?.findIndex(
      (a) => a.id === item.id,
    );
    return messageIndex === 0;
  }, [item, chatObjects]);

  const isFirstMessage = useMemo(() => {
    const messageIndex = chatObjects?.[item?.chat_id]?.messages?.findIndex(
      (a) => a.id === item.id,
    );
    return messageIndex === chatObjects?.[item?.chat_id]?.messages.length - 1;
  }, [item, chatObjects]);

  return (
    <>
      <ChatItemContext.Provider
        value={{
          item,
          isShowDeletePrompt,
          showDeletePrompt,
        }}
      >
        <CotopiaContextMenu
          width={260}
          className="bg-transparent border-0 shadow-none"
          trigger={
            <div
              ref={divRef}
              className={cn(
                "message-item py-[2px] px-4 flex flex-row items-end gap-x-2",
                nextMessage?.user.id !== item?.user.id ? "mb-4" : "",
                isLastMessage ? "pb-4" : "",
                isFirstMessage ? "mt-4" : "",
              )}
            >
              <div className="w-9">
                <ChatUserOverView
                  chat={item}
                  prev={prevMessage}
                  next={nextMessage}
                />
              </div>
              <ChatItemContent
                chat={item}
                next={nextMessage}
                prev={prevMessage}
              />
            </div>
          }
        >
          <RightClickActions item={item} />
        </CotopiaContextMenu>
        <DeletePrompt item={item} />
      </ChatItemContext.Provider>
    </>
  );
}
