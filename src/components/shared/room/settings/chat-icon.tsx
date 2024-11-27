import { MessagesIcon } from "@/components/icons";
import CBadgeSimple from "@/components/shared-ui/c-badge/c-badge-simple";
import { colors } from "@/const/varz";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { useAppSelector } from "@/store";
import { useMemo } from "react";

export default function ChatIcon() {
  const { chats: arrayChats } = useChat2();
  const hasMentionedChat = !!arrayChats.find((x) => x.mentioned_messages > 0);

  const { chats } = useAppSelector((store) => store.chat);

  const totalUnSeenCount = useMemo(() => {
    let sum = 0;

    const chatKeys = Object.keys(chats);

    if (chatKeys.length === 0) return sum; //asume sum equals zero

    for (let chatId of chatKeys) {
      const chat = chats[chatId];

      sum += chat.object.unseens;
    }

    return sum;
  }, [chats]);

  return (
    <CBadgeSimple
      count={totalUnSeenCount}
      hideCount={hasMentionedChat}
      postfix={hasMentionedChat ? "@" : undefined}
    >
      <MessagesIcon color={colors.grayscale.grayscaleCaption} />
    </CBadgeSimple>
  );
}
