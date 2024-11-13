import CotopiaButton from "@/components/shared-ui/c-button";
import InviteButtonTool from "@/components/shared/Invite";
import { colors } from "@/const/varz";
import { WorkspaceRoomShortType } from "@/types/room";
import { Plus } from "lucide-react";

type Props = {
  room: WorkspaceRoomShortType;
};

export default function InviteUser({ room }: Props) {
  return (
    <InviteButtonTool
      room={room}
      render={(open) => (
        <CotopiaButton
          variant={"ghost"}
          startIcon={<Plus size={20} color={colors.foreground} />}
          onClick={open}
          className='text-sm'
        >
          Invite user
        </CotopiaButton>
      )}
    />
  );
}
