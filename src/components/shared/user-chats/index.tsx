import { ChatType } from "@/types/chat2";
import Chat from "./chat";
import SlidePusher from "../slide-pusher";
import { UserMinimalType } from "@/types/user";
import { useMemo } from "react";
import UserChatList from "./list";

type Props = {
  chats: ChatType[];
  getUser: (user_id: number) => UserMinimalType | undefined;
};

export default function Chats({ chats = [], getUser }: Props) {
  return <UserChatList />;
}
