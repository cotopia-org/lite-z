import { useChat2 } from "@/hooks/chat/use-chat-2";
import { cn } from "@/lib/utils";

export default function PinSlider() {
  const { currentChatPins } = useChat2();

  return (
    <div className='flex flex-col gap-y-1 items-center'>
      {currentChatPins?.items.map((x, index) => {
        const isActive = index === currentChatPins?.currentIndex;

        return (
          <div
            key={x.id}
            className={cn(
              "w-1 h-[8px] bg-primary rounded-md transition-all",
              isActive ? "opacity-100" : "opacity-20"
            )}
          ></div>
        );
      })}
    </div>
  );
}
