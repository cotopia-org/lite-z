import CBadge from "@/components/shared-ui/c-badge";

import { useChat } from "../..";

export default function UnSeenMessages() {
  //Getting locale chat item context
  const { chat } = useChat();

  return (
    <CBadge
      count={chat.unseens}
      type={chat.muted ? "normal" : "important"}
      size="normal"
    />
  );
}
