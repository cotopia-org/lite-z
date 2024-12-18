import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import PopupBox from "@/components/shared/popup-box";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import AddDirect from "./direct";
import { useState } from "react";
import useBus from "use-bus";
import { __BUS } from "@/const/bus";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import AddGroup from "./group";

export default function AddChatNew() {
  const { currentChat } = useChat2();

  const [isShowFab, setShowFab] = useState(true);
  const hideFab = () => setShowFab(false);
  const showFab = () => setShowFab(true);

  useBus(__BUS.showAddChat, () => {    
    showFab();
  });

  useBus(__BUS.hideAddChat, () => {
    hideFab();
  });

  return (
    <div
      className={cn(
        "absolute right-4 flex flex-col gap-y-4 justify-end z-[100] transition-all",
        isShowFab && currentChat === undefined
          ? "opacity-100 visible bottom-4"
          : "bottom-0 opacity-0 invisible"
      )}
    >
      <PopupBox
        trigger={(open, isOpen, close) => (
          <CotopiaIconButton
            onClick={isOpen ? close : open}
            className={cn(
              "!bg-primary !text-white z-10 shadow-lg w-12 h-12 transition-all",
              isOpen ? "rotate-45" : "rotate-0"
            )}
          >
            <Plus />
          </CotopiaIconButton>
        )}
      >
        {(style) => (
          <div className='flex flex-col gap-y-4 mb-[64px]' style={style}>
            <AddDirect />
            <AddGroup />
          </div>
        )}
      </PopupBox>
    </div>
  );
}
