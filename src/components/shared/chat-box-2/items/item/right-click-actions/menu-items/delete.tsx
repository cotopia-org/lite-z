import { ContextMenuItem } from "@/components/ui/context-menu";
import { Trash } from "lucide-react";
import { useChatItem } from "../..";

export default function Delete() {
  const { showDeletePrompt } = useChatItem();
  return (
    <ContextMenuItem
      className='py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2'
      onClick={() => showDeletePrompt(true)}
    >
      <Trash />
      Delete
    </ContextMenuItem>
  );
}
