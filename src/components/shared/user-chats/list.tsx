import { ChatType } from "@/types/chat2";
import Chat from "./chat";
import { UserMinimalType } from "@/types/user";
import useBus from "use-bus";
import { __BUS } from "@/const/bus";
import { useSlides } from "../slide-pusher";
import { useAppDispatch } from "@/store";
import { setCurrentChat } from "@/store/slices/chat-slice";
import ChatInnerHolder from "./chat/holder";

type Props = {
  chats: ChatType[];
  getUser: (user_id: number) => UserMinimalType | undefined;
};
export default function UserChatList({ chats, getUser }: Props) {
  const appDispatch = useAppDispatch();
  const { push, back } = useSlides();

  useBus(__BUS.selectChat, (data) => {
    const chat = data.chat;

    appDispatch(setCurrentChat(chat));
    push(<ChatInnerHolder onBack={back} chat={chat} getUser={getUser} />);
  });

  return (
    <div className='w-full chats-holder flex flex-col gap-y-0 overflow-y-auto'>
      {chats.map((chat) => (
        <Chat getUser={getUser} chat={chat} key={chat.id} />
      ))}
    </div>
  );
}
