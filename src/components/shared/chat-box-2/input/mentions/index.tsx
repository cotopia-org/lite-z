import UserList from "@/components/shared/user-selector/list";
import { __BUS } from "@/const/bus";
import useAuth from "@/hooks/auth";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { extractMentions } from "@/lib/utils";
import { UserMinimalType } from "@/types/user";
import { useState } from "react";
import useBus, { dispatch } from "use-bus";

type Props = {
  value: string;
  onAdd: (value: string) => void;
};

export default function Mentions({ value, onAdd }: Props) {
  const { user } = useAuth();
  const { currentChat } = useChat2();
  let currentChatParticipants = currentChat?.participants ?? [];

  const [isShowMention, setShowMention] = useState(false);

  useBus(__BUS.showChatMention, () => {
    setShowMention(true);
  });
  useBus(__BUS.hideChatMention, () => {
    setShowMention(false);
  });

  const handleAddMention = (selectedUser: UserMinimalType) => {
    setShowMention(false);
    const mentionIndex = value.lastIndexOf("@");
    if (mentionIndex !== -1) {
      const updatedValue =
        value.slice(0, mentionIndex) + `@${selectedUser.username} `;
      if (onAdd) onAdd(updatedValue);
    }

    dispatch(__BUS.hideChatMention);
    dispatch(__BUS.chatInputFocus);
  };

  // Extract the last word after the last "@" for mentions
  const mentions = extractMentions(value);
  const lastMention = mentions.length > 0 ? mentions[mentions.length - 1] : null;

  // Determine if the last mention is valid and filter participants
  const searchText = value.split(" ").pop()?.replace("@", "").trim();
  console.log('searchText', searchText);
  if (searchText) {
    currentChatParticipants = currentChatParticipants.filter((participant) =>
      participant.username.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  if (!isShowMention || !lastMention) return null;

  return (
    <div className="absolute bottom-[58px] bg-white w-full h-auto min-h-[64px] border-b flex flex-col">
      <UserList
        items={currentChatParticipants}
        env="simple"
        onPick={handleAddMention}
        excludes={[user.id]}
      />
    </div>
  );
}
