import CBadge from "@/components/shared-ui/c-badge";

import { useChat } from "../..";

export default function UnSeenMessages() {
  //Getting locale chat item context
  const { chat } = useChat();

  return (
    <CBadge
      count={chat.unseens}
      className='absolute bottom-2 right-2'
      size='normal'
    />
  );
}
