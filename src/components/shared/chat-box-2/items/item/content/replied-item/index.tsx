import { __BUS } from "@/const/bus";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { useAppDispatch } from "@/store";
import { getBeforeAndAfterMessages } from "@/store/slices/chat-slice";
import { Chat2ItemType } from "@/types/chat2";
import { thunkResHandler } from "@/utils/utils";
import { dispatch as busDispatch } from "use-bus";

type Props = {
  item: Chat2ItemType;
};
export default function ChatRepliedItem({ item }: Props) {
  const dispatch = useAppDispatch();
  const { getUser } = useChat2();

  const user = getUser(item?.user_id ?? item?.user);

  const handleGoToReplyMessage = () => {
    thunkResHandler(
      dispatch(getBeforeAndAfterMessages({ message_id: item.nonce_id })),
      "chat/getBeforeAndAfterMessages",
      () => {
        busDispatch({
          type: __BUS.scrollToTargetMessage,
          messageId: item.nonce_id,
        });
      },
      () => {}
    );
  };

  return (
    <div
      className='border-l-4 p-2 cursor-pointer border-primary-border bg-muted rounded-md'
      onClick={handleGoToReplyMessage}
    >
      <strong className='text-primary'>{user?.name ?? "-"}</strong>
      <p>{item.text}</p>
    </div>
  );
}
