import { useRoomContext } from "@/components/shared/room/room-context";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { useCallback, useMemo } from "react";
import Chat from "../../../chat";
import FullLoading from "@/components/shared/full-loading";

export default function ChatsWrapper() {
  const { workspace_id } = useRoomContext();

  //@ts-ignore
  const { chats, loading } = useChat2({ workspace_id });

  // const loadUserByUserId = useCallback(
  //   (user_id: number) => {
  //     const user = participants.find((x) => x.id === user_id);
  //
  //     return user;
  //   },
  //   [participants]
  // );

  const chatSortedByLastMessage = useMemo(() => {
    return chats.sort(
      (a, b) => b?.last_message?.created_at - a?.last_message?.created_at
    );
  }, [chats]);

  let content = (
    <div className='w-full chats-holder flex flex-col gap-y-0 overflow-y-auto h-[calc(100vh-80px)] pb-20'>
      {chatSortedByLastMessage.map((chat) => (
        <Chat chat={chat} key={chat?.id} />
      ))}
    </div>
  );

  if (loading) content = <FullLoading />;

  return content;
}
