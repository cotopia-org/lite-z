import { ChatType } from "@/types/chat2";
import { createContext, useContext } from "react";
import ChatPreview from "./preview";
import { useSlides } from "../../slide-pusher";
import ChatInnerHolder from "./holder";
import { useAppDispatch } from "@/store";
import { clearCurrentChat, setCurrentChat } from "@/store/slices/chat-slice";

type Props = {
  chat: ChatType;
};

//@ts-ignore
const ChatContext = createContext<{ chat: ChatType }>({ chat: undefined });

export const useChat = () => useContext(ChatContext);

export default function Chat({ chat }: Props) {
  const { push, back } = useSlides();

  const appDispatch = useAppDispatch();

  const handleBackChat = () => {
    appDispatch(clearCurrentChat());
    back();
  };

  const handleSelectChat = () => {
    appDispatch(setCurrentChat(chat));
    push(<ChatInnerHolder onBack={handleBackChat} chat_id={chat?.id} />);
  };

  return (
    <ChatContext.Provider value={{ chat }}>
      <div
        className='flex flex-row items-center gap-x-4 p-3 hover:bg-black/[.02] cursor-pointer relative'
        onClick={handleSelectChat}
      >
        <ChatPreview />
      </div>
    </ChatContext.Provider>
  );
}
