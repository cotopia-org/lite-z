import { ChatType } from "@/types/chat2";
import { createContext, useContext } from "react";
import ChatPreview from "./preview";
import { useSlides } from "../../slide-pusher";
import ChatInnerHolder from "./holder";
import { useAppDispatch } from "@/store";
import {
  clearCurrentChat,
  deleteChat,
  setCurrentChat,
  setMuteChat,
} from "@/store/slices/chat-slice";
import CotopiaContextMenu from "@/components/shared-ui/c-context-menu";

import { ContextMenuItem } from "@/components/ui/context-menu";
import { Bell, BellOff, ReplyIcon, Trash, VolumeOff } from "lucide-react";
import axiosInstance from "@/services/axios";
import { toast } from "sonner";
import { getRandomColor } from "@/lib/utils";
import moment from "moment";
import CDialog from "@/components/shared-ui/c-dialog";
import CotopiaButton from "@/components/shared-ui/c-button";
import { TrashIcon } from "@/components/icons";
import { colors } from "@/const/varz";
import CotopiaPromptContent from "@/components/shared-ui/c-prompt/content";
import useLoading from "@/hooks/use-loading";
import FullLoading from "@/components/shared/full-loading";

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

  const toggleMute = async () => {
    await axiosInstance.get(`/chats/${chat.id}/toggleMute`);
    appDispatch(
      setMuteChat({ chat_id: chat.id, muted: chat.muted === 1 ? 0 : 1 }),
    );
    toast.success(`${chat.title} has been ${chat.muted ? "Unmuted" : "Muted"}`);
  };

  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleDelete = () => {
    startLoading();
    axiosInstance
      .delete(`/chats/${chat.id}`)
      .then((res) => {
        toast.success(`"${chat.title}" chat has been deleted successfully`);
        appDispatch(deleteChat(chat));
        stopLoading();
      })
      .catch((err) => {
        toast.error(err.data.message);

        stopLoading();
      });
  };
  if (isLoading) {
    return <FullLoading />;
  }

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
              onClick={toggleMute}
            >
              {chat.muted ? <Bell /> : <BellOff />}
              {chat.muted ? "Unmute" : "Mute"}
            </ContextMenuItem>

            <ContextMenuItem
              onClick={handleDelete}
              className="py-2 px-4 cursor-pointer !text-white bg-red-500 rounded-none gap-x-2"
            >
              <Trash />
              Delete
            </ContextMenuItem>
          </div>
        </div>
      </CotopiaContextMenu>
    </ChatContext.Provider>
  );
}
