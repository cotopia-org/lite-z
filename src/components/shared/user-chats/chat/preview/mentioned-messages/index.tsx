import CBadge from "@/components/shared-ui/c-badge";

import { useChat } from "../..";

export default function MentionedMessages() {
  //Getting locale chat item context
  const { chat } = useChat();
  

  if (!chat.mentioned_messages) return null;

  return <CBadge hideCount prefix='@' size='normal' />;
}
