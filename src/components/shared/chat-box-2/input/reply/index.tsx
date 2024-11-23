import { Chat2ItemType } from "@/types/chat2";
import { ReplyIcon, X } from "lucide-react";
import { useChatItem } from "../../items/item";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { useAppDispatch } from "@/store";
import { clearReplyMessage } from "@/store/slices/chat-slice";
import { useChat2 } from "@/hooks/chat/use-chat-2";

type Props = {
  item: Chat2ItemType;
};
export default function ReplyBox({ item }: Props) {
  const dispatch = useAppDispatch();
  const handleClearReaplyBox = () => dispatch(clearReplyMessage(item.chat_id));
  const { getUser } = useChat2();

  const user = getUser(item.user);

  return (
    <div className='flex flex-row items-center justify-between px-4 py-2 border-b'>
      <div className='flex flex-row items-center gap-x-4'>
        <div>
          <ReplyIcon className='text-primary' />
        </div>
        <div className='flex flex-col gap-y-1'>
          <strong className='text-primary'>{`Reply to ${user?.name}`}</strong>
          <span className='whitespace-nowrap text-ellipsis overflow-hidden'>
            {item.text}
          </span>
        </div>
      </div>
      <div>
        <CotopiaIconButton
          className='opacity-50 hover:opacity-100 text-black'
          onClick={handleClearReaplyBox}
        >
          <X />
        </CotopiaIconButton>
      </div>
    </div>
  );
}
