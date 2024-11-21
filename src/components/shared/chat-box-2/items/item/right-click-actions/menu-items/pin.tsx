import { ContextMenuItem } from "@/components/ui/context-menu";
import { PinIcon, PinOff } from "lucide-react";
import { useChatItem } from "../..";
import { useChat2 } from "@/hooks/chat/use-chat-2";

export default function Pin() {
  const { pin, currentChatPins } = useChat2();

  const { item } = useChatItem();

  const handlePinMessage = () => {
    pin(item);
  };

  const currentChatPinsIncludes = currentChatPins?.items.find(
    (a) => a.id === item.id
  );

  console.log("currentChatPinsIncludes", currentChatPinsIncludes);

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
