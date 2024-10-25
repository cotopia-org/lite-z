import CBadge from "@/components/shared-ui/c-badge";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { __BUS } from "@/const/bus";
import { useAppDispatch } from "@/store";
import { seenAllMessages } from "@/store/slices/chat-slice";
import { Chat2ItemType } from "@/types/chat2";
import { ChevronDown } from "lucide-react";
import { dispatch as busDispatch } from "use-bus";

type Props = {
  items: Chat2ItemType[];
};
export default function UnSeenHandlers({ items }: Props) {
  const dispatch = useAppDispatch();

  const chat_id = items?.[0]?.chat_id;

  const unSeenCount = items.filter((x) => x.seen === false).length;

  const handleReachMessages = () => {
    if (chat_id) {
      dispatch(seenAllMessages({ chat_id }));
      busDispatch(__BUS.scrollEndChatBox);
    }
  };

  if (unSeenCount === 0) return null;

  return (
    <CotopiaIconButton
      onClick={handleReachMessages}
      className='absolute bottom-4 right-4'
    >
      <CBadge
        size='large'
        count={unSeenCount}
        className='absolute top-[-28px] left-[50%] translate-x-[-50%]'
      />
      <ChevronDown className='text-black/60' />
    </CotopiaIconButton>
  );
}
