import { ContextMenuItem } from "@/components/ui/context-menu";
import { ReplyIcon } from "lucide-react";
import { useChatItem } from "../..";
import { useAppDispatch } from "@/store";
import { setReplyMessage } from "@/store/slices/chat-slice";

export default function Reply() {
  const { item } = useChatItem();
  const dispatch = useAppDispatch();

  const handleSelectReplyMessage = () => {
    dispatch(setReplyMessage(item));
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
