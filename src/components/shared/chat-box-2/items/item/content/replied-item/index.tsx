import { useChat2 } from "@/hooks/chat/use-chat-2";
import { Chat2ItemType } from "@/types/chat2";

type Props = {
  item: Chat2ItemType;
};
export default function ChatRepliedItem({ item }: Props) {
  const { getUser } = useChat2();

  const user = getUser(item.user);

  return (
    <div className='border-l-4 p-2 cursor-pointer border-primary-border bg-muted rounded-md'>
      <strong className='text-primary'>{user?.name ?? "-"}</strong>
      <p>{item.text}</p>
    </div>
  );
}
