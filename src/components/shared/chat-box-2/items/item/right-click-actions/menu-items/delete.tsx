import { ContextMenuItem } from "@/components/ui/context-menu";
import { Trash } from "lucide-react";
import { useChatItem } from "../..";
import useAuth from "@/hooks/auth";

export default function Delete() {
  const { user } = useAuth();

  const { showDeletePrompt, item } = useChatItem();

  if (user?.id !== item.user.id) return null;

  return (
    <ContextMenuItem
      className="py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2"
      onClick={() => showDeletePrompt(true)}
    >
      <Trash />
      Delete
    </ContextMenuItem>
  );
}
