import AddChat from "./add-chat";
import SlidePusher from "@/components/shared/slide-pusher";
import ChatsWrapper from "./chats-wrapper";
import { __BUS } from "@/const/bus";

type Props = {
  workspace_id: number;
};
export default function WorkspaceChats({ workspace_id }: Props) {

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
