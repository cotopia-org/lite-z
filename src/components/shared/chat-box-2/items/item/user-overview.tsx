import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import ParticipantDetails from "@/components/shared/room/participant-detail";
import { capitalizeWords } from "@/lib/utils";
import { Chat2ItemType } from "@/types/chat2";
import { useChatItem } from ".";
import { useChat2 } from "@/hooks/chat/use-chat-2";

type Props = {
  chat: Chat2ItemType;
};
export default function ChatUserOverView({ chat }: Props) {
  const { getUser } = useChat2();

  const user = getUser(chat.user);

  if (!user) return null;

  return (
    <ParticipantDetails user={user}>
      <CotopiaAvatar
        className='w-9 h-9'
        src={user?.avatar?.url}
        title={capitalizeWords(user.username)?.[0] ?? ""}
      />
    </ParticipantDetails>
  );
}
