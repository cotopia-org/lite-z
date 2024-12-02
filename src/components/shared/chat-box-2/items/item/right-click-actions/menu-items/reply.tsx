import { ContextMenuItem } from "@/components/ui/context-menu";
import { ReplyIcon } from "lucide-react";
import { useChatItem } from "../..";
import { useAppDispatch } from "@/store";
import { setReplyMessage } from "@/store/slices/chat-slice";
import { dispatch as busDispatch } from "use-bus";
import { __BUS } from "@/const/bus";

export default function Reply() {
  const { item } = useChatItem();
  const dispatch = useAppDispatch();

  const handleSelectReplyMessage = () => {
    dispatch(setReplyMessage(item));
    busDispatch(__BUS.chatInputFocus);
  };

  return (
    <ContextMenuItem
      className='py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2'
      onClick={handleSelectReplyMessage}
    >
      <ReplyIcon />
      Reply
    </ContextMenuItem>
  );
}
