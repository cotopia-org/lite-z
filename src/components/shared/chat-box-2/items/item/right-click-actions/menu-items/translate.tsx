import { ContextMenuItem } from "@/components/ui/context-menu";
import { Languages, ReplyIcon } from "lucide-react";
import { useChatItem } from "../..";
import { useAppDispatch } from "@/store";
import { setReplyMessage, updateMessage } from "@/store/slices/chat-slice";
import { dispatch as busDispatch } from "use-bus";
import { __BUS } from "@/const/bus";
import axiosInstance from "@/services/axios";

export default function Translate() {
  const { item } = useChatItem();
  const dispatch = useAppDispatch();

  const handleTranslate = async () => {
    const translatedMessage = await axiosInstance.get(
      `/messages/${item.id}/translate`,
    );
    // console.log();
    dispatch(updateMessage(translatedMessage.data.data));
    // setTimeout(() => {busDispatch(__BUS.chatInputFocus);}, 100)
  };

  return (
    <ContextMenuItem
      className="py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2"
      onClick={handleTranslate}
    >
      <Languages />
      Translate
    </ContextMenuItem>
  );
}
