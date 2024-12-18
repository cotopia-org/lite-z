import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import ParticipantDetails from "@/components/shared/room/participant-detail";
import { capitalizeWords } from "@/lib/utils";
import { Chat2ItemType } from "@/types/chat2";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import moment from "moment";

type Props = {
  chat: Chat2ItemType;
  prev?: Chat2ItemType
  next?: Chat2ItemType
};
export default function ChatUserOverView({ chat, prev, next }: Props) {
  const { getUser, chatObjects } = useChat2();

  const user = getUser(chat.user);

  const messageDate = moment(
    chat?.created_at ? chat?.created_at * 1000 : chat?.nonce_id
  ).format("dddd, MMMM D, YYYY");
  const messageNextDate = moment(
    next?.created_at
      ? next?.created_at * 1000
      : next?.nonce_id
  ).format("dddd, MMMM D, YYYY");

  const showDateHeader = messageDate !== messageNextDate;

  if (next !== null && next?.user === chat?.user && !showDateHeader) return <div className="w-9"></div>

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
