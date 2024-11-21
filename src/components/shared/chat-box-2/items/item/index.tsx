import { Chat2ItemType } from "@/types/chat2";
import ChatUserOverView from "./user-overview";
import ChatItemContent from "./content";
import { UserMinimalType } from "@/types/user";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import CotopiaContextMenu from "@/components/shared-ui/c-context-menu";
import RightClickActions from "./right-click-actions";
import CotopiaPrompt from "@/components/shared-ui/c-prompt";
import DeletePrompt from "./content/delete-prompt";

type Props = {
  item: Chat2ItemType;
  isMine?: boolean;
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

export default function ChatItem({ item, isMine }: Props) {
  const [isShowDeletePrompt, showDeletePrompt] = useState(false);

  const { seen } = useChat2();

  const divRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
    };
  }, []);

  useEffect(() => {
    //Should remove item.nonce_id !== 0 in the feuture (just for legacy messages)
    if (isVisible && item?.seen === false && item.nonce_id !== 0 && !isMine) {
      seen(item);
    }
  }, [item, isVisible, isMine, seen]);

  useEffect(() => {
    if (item?.seen === false) seen(item);
  }, [item, seen]);

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
          className='bg-transparent border-0 shadow-none'
          trigger={
            <div
              ref={divRef}
              className={`message-item p-4 flex flex-row items-end gap-x-2`}
            >
              <ChatUserOverView chat={item} />
              <ChatItemContent chat={item} />
            </div>
          }
        >
          <RightClickActions item={item} />
        </CotopiaContextMenu>
        <DeletePrompt />
      </ChatItemContext.Provider>
    </>
  );
}
