import UserList from "@/components/shared/user-selector/list";
import { __BUS } from "@/const/bus";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { UserMinimalType } from "@/types/user";
import { useState } from "react";
import useBus, { dispatch } from "use-bus";

type Props = {
  value: string;
  onAdd: (value: string) => void;
};
export default function Mentions({ value, onAdd }: Props) {
  const { currentChat } = useChat2();
  let currentChatParticipants = currentChat?.participants ?? [];

  const [isShowMention, setShowMention] = useState(false);
  useBus(__BUS.showChatMention, () => {
    setShowMention(true);
  });
  useBus(__BUS.hideChatMention, () => {
    setShowMention(false);
  });

  const handleAddMention = (user: UserMinimalType) => {
    setShowMention(false);
    const mentionIndex = value.lastIndexOf("@");
    if (mentionIndex !== -1) {
      const updatedValue =
        value.slice(0, mentionIndex) + `@${user.username} `;
        if (onAdd) onAdd(updatedValue);
    }

    dispatch(__BUS.chatInputFocus);

  };

  const searchText = value.slice(1)

  if ( searchText ) currentChatParticipants = currentChatParticipants.filter(a => a.username.toLocaleLowerCase().includes(searchText.toLowerCase()))

  if (!isShowMention || currentChatParticipants.length === 0) return null;

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
