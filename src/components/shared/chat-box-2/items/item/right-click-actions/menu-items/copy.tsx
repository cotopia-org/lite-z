import { ContextMenuItem } from "@/components/ui/context-menu";
import { Copy } from "lucide-react";
import { useChatItem } from "../..";
import copy from "copy-to-clipboard";

export default function CopyText() {
  const { item } = useChatItem();

  const handleCopyText = () => {
    copy(item.text);
  };

  return (
    <ContextMenuItem
      className='py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2'
      onClick={handleCopyText}
    >
      <Copy />
      Copy Text
    </ContextMenuItem>
  );
}
