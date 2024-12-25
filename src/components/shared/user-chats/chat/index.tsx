import { ChatType } from "@/types/chat2";
import { createContext, useContext } from "react";
import ChatPreview from "./preview";
import { useSlides } from "../../slide-pusher";
import ChatInnerHolder from "./holder";
import { useAppDispatch } from "@/store";
import { clearCurrentChat, setCurrentChat } from "@/store/slices/chat-slice";
import CotopiaContextMenu from "@/components/shared-ui/c-context-menu";
import Reactions from "@/components/shared/chat-box-2/items/item/right-click-actions/reactions";
import MenuItems from "@/components/shared/chat-box-2/items/item/right-click-actions/menu-items";
import Reply from "@/components/shared/chat-box-2/items/item/right-click-actions/menu-items/reply";
import Edit from "@/components/shared/chat-box-2/items/item/right-click-actions/menu-items/edit";
import Pin from "@/components/shared/chat-box-2/items/item/right-click-actions/menu-items/pin";
import CopyText from "@/components/shared/chat-box-2/items/item/right-click-actions/menu-items/copy";
import Delete from "@/components/shared/chat-box-2/items/item/right-click-actions/menu-items/delete";
import Translate from "@/components/shared/chat-box-2/items/item/right-click-actions/menu-items/translate";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { BellOff, ReplyIcon, VolumeOff } from "lucide-react";

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
      <CotopiaContextMenu
        width={260}
        className="bg-transparent border-0 shadow-none"
        trigger={
          <div
            className="flex flex-row items-center gap-x-4 p-3 hover:bg-black/[.02] cursor-pointer relative"
            onClick={handleSelectChat}
          >
            <ChatPreview />
          </div>
        }
      >
        <div className="flex flex-col gap-y-4">
          <div className="bg-gray-700 rounded-md py-2">
            <ContextMenuItem
              className="py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2"
              onClick={() => {
                console.log("mute");
              }}
            >
              <BellOff />
              Mute Notifications
            </ContextMenuItem>
          </div>
        </div>
      </CotopiaContextMenu>
    </ChatContext.Provider>
  );
}
