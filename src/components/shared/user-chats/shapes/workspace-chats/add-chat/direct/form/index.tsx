import UserSelector from "@/components/shared/user-selector";
import { __BUS } from "@/const/bus";
import axiosInstance, { FetchDataType } from "@/services/axios";
import { useAppDispatch } from "@/store";
import { addNewChat } from "@/store/slices/chat-slice";
import { ChatType } from "@/types/chat2";
import { UserMinimalType } from "@/types/user";
import { dispatch } from "use-bus";

type Props = {
  onCreateChat: (chat: ChatType) => void;
};

export default function AddDirectForm({ onCreateChat }: Props) {
  const appDispatch = useAppDispatch();

  const handleCreateChat = (user: UserMinimalType) => {
    axiosInstance
      .post<FetchDataType<ChatType>>(`/chats/createDirect`, {
        user_id: user.id,
      })
      .then((res) => {
        const chat = res.data.data;

        appDispatch(addNewChat(chat));

        dispatch({
          type: __BUS.selectChat,
          chat,
        });

        if (onCreateChat) onCreateChat(chat);
      })
      .catch((err) => {});
  };

  return (
    <div>
      <UserSelector onPick={handleCreateChat} />
    </div>
  );
}
