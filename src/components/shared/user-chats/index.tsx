import { ChatType } from "@/types/chat2";
import { UserMinimalType } from "@/types/user";
import UserChatList from "./list";

type Props = {
  chats: ChatType[];
  getUser: (user_id: number) => UserMinimalType | undefined;
};

export default function Chats({ chats = [], getUser }: Props) {
  return <UserChatList />;
}
