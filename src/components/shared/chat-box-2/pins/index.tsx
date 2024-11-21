import PinSlider from "./slider";
import { useChat2 } from "@/hooks/chat/use-chat-2";

export default function PinMessages() {
  const { currentChatPins } = useChat2();

  if (currentChatPins === undefined) return null;

  const currentPintMessage =
    currentChatPins.items[currentChatPins.currentIndex];

  return (
    <div className='absolute top-0 left-0 w-full z-10'>
      <div className='flex flex-row items-center gap-x-4 py-2 px-4 bg-background shadow-md border-t'>
        <PinSlider />
        {!!currentPintMessage && (
          <div className='flex flex-col'>
            <strong className='text-primary'>Pinned message</strong>
            <span>{currentPintMessage.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
