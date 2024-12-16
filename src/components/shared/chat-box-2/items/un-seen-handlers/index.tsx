import CBadge from "@/components/shared-ui/c-badge";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { __BUS } from "@/const/bus";
import useAuth from "@/hooks/auth";
import { useAppDispatch } from "@/store";
import { seenAllMessages } from "@/store/slices/chat-slice";
import { Chat2ItemType } from "@/types/chat2";
import { ChevronDown, X } from "lucide-react";
import { dispatch as busDispatch } from "use-bus";

type Props = {
  items: Chat2ItemType[];
};
export default function UnSeenHandlers({ items }: Props) {
  const dispatch = useAppDispatch();

  const { user } = useAuth();

  const chat_id = items?.[0]?.chat_id;

  const unSeenCount = items.filter((x) => {
    const isSeen = !!!x.seens.find(a => a === user.id)
    return isSeen
  }).filter(a => a.is_pending === false).length;

  const mentionedMe =
    items.findIndex(
      (x) =>
        x.mentions.length > 0 &&
        !!x.mentions.find((a) => a.model_id === user?.id)
    ) > -1;

  const handleReachMessages = () => {
    if (chat_id) {
      dispatch(seenAllMessages({ chat_id ,  user_id: user.id}));
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
        hideCount={!!mentionedMe}
        postfix={!!mentionedMe ? "@" : ""}
        className='absolute top-[-28px] left-[50%] translate-x-[-50%]'
      />
      <ChevronDown className='text-black/60' />
    </CotopiaIconButton>
  );
}
