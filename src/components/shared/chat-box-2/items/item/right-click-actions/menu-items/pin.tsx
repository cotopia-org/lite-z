import { ContextMenuItem } from "@/components/ui/context-menu";
import { PinIcon, PinOff } from "lucide-react";
import { useChatItem } from "../..";
import { useChat2 } from "@/hooks/chat/use-chat-2";

export default function Pin() {
  const { pin, unpin, currentChatPins } = useChat2();

  const { item } = useChatItem();

  const currentChatPinsIncludes = currentChatPins?.items.find(
    (a) => a.id === item.id
  );

  const handlePinMessage = () => {
    if (!currentChatPinsIncludes) {
      pin(item);
    } else {
      unpin(item);
    }
  };

  return (
    <ContextMenuItem
      className='py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2'
      onClick={handlePinMessage}
    >
      {currentChatPinsIncludes ? (
        <>
          <PinOff />
          Unpin
        </>
      ) : (
        <>
          <PinIcon />
          Pin
        </>
      )}
    </ContextMenuItem>
  );
}
