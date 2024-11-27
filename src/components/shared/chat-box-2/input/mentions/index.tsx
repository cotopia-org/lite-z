import UserList from "@/components/shared/user-selector/list";
import { __BUS } from "@/const/bus";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { UserMinimalType } from "@/types/user";
import { useState } from "react";
import useBus, { dispatch } from "use-bus";

type Props = {
  value: string;
  onAdd: (user: UserMinimalType) => void;
};
export default function Mentions({ value, onAdd }: Props) {
  const { currentChat } = useChat2();
  const currentChatParticipants = currentChat?.participants ?? [];

  const [isShowMention, setShowMention] = useState(false);
  useBus(__BUS.showChatMention, () => {
    setShowMention(true);
  });
  useBus(__BUS.hideChatMention, () => {
    setShowMention(false);
  });

  const handleAddMention = (user: UserMinimalType) => {
    setShowMention(false);
    if (onAdd) onAdd(user);
    dispatch(__BUS.chatInputFocus);
  };

  if (!isShowMention) return null;

  return (
    <div className='absolute bottom-[58px] bg-white w-full h-auto min-h-[64px] border-b flex flex-col'>
      <UserList
        items={currentChatParticipants}
        env='simple'
        onPick={handleAddMention}
      />
    </div>
  );
}
