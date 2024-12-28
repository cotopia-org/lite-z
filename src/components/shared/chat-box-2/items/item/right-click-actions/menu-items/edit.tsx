import { ContextMenuItem } from "@/components/ui/context-menu";
import { useChatItem } from "../..";
import { useAppDispatch } from "@/store";
import { setEditMessage } from "@/store/slices/chat-slice";
import { dispatch as busDispatch } from "use-bus";
import { __BUS } from "@/const/bus";
import { EditIcon } from "lucide-react";
import useAuth from "@/hooks/auth";

export default function Edit() {
  const { user } = useAuth();

  const { item } = useChatItem();
  const dispatch = useAppDispatch();

  const handleEditMessage = () => {
    dispatch(setEditMessage(item));
    busDispatch(__BUS.chatInputFocus);
  };

  if (user.id !== item.user.id) return null;

  return (
    <ContextMenuItem
      className="py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2"
      onClick={handleEditMessage}
    >
      <EditIcon />
      Edit
    </ContextMenuItem>
  );
}
