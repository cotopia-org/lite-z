import { useRoomContext } from "@/components/shared/room/room-context";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { useMemo } from "react";
import Chat from "../../../chat";
import FullLoading from "@/components/shared/full-loading";
import useBus from "use-bus";
import { __BUS } from "@/const/bus";
import { useAppDispatch } from "@/store";
import { setCurrentChat } from "@/store/slices/chat-slice";
import { useSlides } from "@/components/shared/slide-pusher";
import ChatInnerHolder from "../../../chat/holder";
import { useSocket } from "@/routes/private-wrarpper";
import { MessageType } from "@/types/message";
import useAuth from "@/hooks/auth";

export default function ChatsWrapper() {
  const { user } = useAuth();

  const dispatch = useAppDispatch();

  const { workspace_id } = useRoomContext();

  const { push, back } = useSlides();

  //@ts-ignore
  const { chats, chatObjects, loading } = useChat2({ workspace_id });

  const chatSortedByLastMessage = useMemo(() => {
    return chats.sort(
      (a, b) => b?.last_message?.created_at - a?.last_message?.created_at,
    );
  }, [chats]);

  //Select chat by use bus event
  useBus(__BUS.selectChat, (data) => {
    const chat = data.chat;

    dispatch(setCurrentChat(chat));
    push(<ChatInnerHolder onBack={back} chat_id={chat?.id} />);
  });

  let content = (
    <div className="w-full chats-holder flex flex-col gap-y-0 overflow-y-auto h-[calc(100vh-80px)] pb-20">
      {chatSortedByLastMessage.map((chat) => (
        <Chat chat={chat} key={chat?.id} />
      ))}
    </div>
  );

  if (loading) content = <FullLoading />;

  return content;
}
