import AddChat from "./add-chat";
import SlidePusher from "@/components/shared/slide-pusher";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import ChatsWrapper from "./chats-wrapper";
import { Chat2ItemType } from "@/types/chat2";
//@ts-ignore
import { useSocket } from "@/routes/private-wrarpper";

type Props = {
  workspace_id: number;
};
export default function WorkspaceChats({ workspace_id }: Props) {
  const { currentChat } = useChat2();

  const { add, update } = useChat2({ workspace_id });

  useSocket(
    "messageReceived",
    (data: Chat2ItemType) => {
      let seen = false;

      if (currentChat !== undefined && data.chat_id === currentChat.id) {
        seen = true;
      }

      add({ ...data, seen });
    },
    [currentChat]
  );

  useSocket("messageUpdated", (data: Chat2ItemType) => {
    update(data);
  });

  let content = (
    <>
      <AddChat workspace_id={workspace_id} />
      <SlidePusher>
        <ChatsWrapper />
      </SlidePusher>
    </>
  );

  return <div className='flex flex-col gap-y-2'>{content}</div>;
}
