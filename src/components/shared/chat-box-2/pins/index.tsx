import { useAppDispatch } from "@/store";
import PinSlider from "./slider";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { getBeforeAndAfterMessages } from "@/store/slices/chat-slice";
import { thunkResHandler } from "@/utils/utils";

import { dispatch as busDispatch } from "use-bus";
import { __BUS } from "@/const/bus";

export default function PinMessages() {
  const { currentChatPins } = useChat2();
  const dispatch = useAppDispatch();

  if (currentChatPins === undefined) return null;

  const currentPintMessage =
    currentChatPins.items[currentChatPins.currentIndex];

  const handleChatPinSurfing = () => {
    if (!currentPintMessage.nonce_id) return;

    thunkResHandler(
      dispatch(
        getBeforeAndAfterMessages({ message_id: currentPintMessage.nonce_id })
      ),
      "chat/getBeforeAndAfterMessages",
      () => {
        busDispatch({
          type: __BUS.scrollToTargetMessage,
          messageId: currentPintMessage.nonce_id,
        });
      },
      () => {}
    );
  };

  if (currentChatPins.items?.length === 0) return null;

  return (
    <div className='absolute top-0 left-0 w-full z-10'>
      <div
        onClick={handleChatPinSurfing}
        className='flex flex-row items-center gap-x-4 py-2 px-4 bg-background shadow-md border-t cursor-pointer'
      >
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
