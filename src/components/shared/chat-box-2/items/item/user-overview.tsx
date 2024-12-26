import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import ParticipantDetails from "@/components/shared/room/participant-detail";
import { capitalizeWords } from "@/lib/utils";
import { Chat2ItemType } from "@/types/chat2";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import moment from "moment";

type Props = {
  chat: Chat2ItemType;
  prev?: Chat2ItemType;
  next?: Chat2ItemType;
};
export default function ChatUserOverView({ chat, prev, next }: Props) {
  const user = chat.user;

  const messageDate = moment(
    chat?.created_at ? chat?.created_at * 1000 : chat?.nonce_id,
  ).format("dddd, MMMM D, YYYY");
  const messageNextDate = moment(
    next?.created_at ? next?.created_at * 1000 : next?.nonce_id,
  ).format("dddd, MMMM D, YYYY");

  const showDateHeader = messageDate !== messageNextDate;

  if (next !== null && next?.user.id === chat?.user.id && !showDateHeader)
    return <div className="w-9"></div>;

  if (user === null || user === undefined) return null;

  return (
    <ParticipantDetails user={user}>
      <CotopiaAvatar
        date={user.created_at}
        className="w-9 h-9 text-xl"
        src={user?.avatar?.url}
        title={capitalizeWords(user.username)?.[0] ?? ""}
      />
    </ParticipantDetails>
  );
}
