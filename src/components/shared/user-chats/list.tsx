import Chat from "./chat";
import useBus from "use-bus";
import { __BUS } from "@/const/bus";
import { useSlides } from "../slide-pusher";
import { useAppDispatch } from "@/store";
import { setCurrentChat } from "@/store/slices/chat-slice";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import ChatInnerHolder from "./chat/holder";

type Props = {};
export default function UserChatList() {
  const appDispatch = useAppDispatch();
  const { push, back } = useSlides();

  useBus(__BUS.selectChat, (data) => {
    const chat = data.chat;

    appDispatch(setCurrentChat(chat));
    push(<ChatInnerHolder onBack={back} chat_id={chat?.id} />);
  });

  const { chats } = useChat2();

  return (
    <div className='w-full chats-holder flex flex-col gap-y-0 overflow-y-auto'>
      {chats.map((chat) => (
        <Chat chat={chat} key={chat.id} />
      ))}
    </div>
  );
}
