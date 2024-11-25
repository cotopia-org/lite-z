import { colors } from "@/const/varz";
import { TrashIcon } from "@/components/icons";
import CotopiaButton from "@/components/shared-ui/c-button";
import CDialog from "@/components/shared-ui/c-dialog";
import { WorkspaceRoomShortType } from "@/types/room";
import RoomSettings from "./room-settings";
import { Settings } from "lucide-react";

type Props = {
  room: WorkspaceRoomShortType;
};

export default function SettingsRoom({ room }: Props) {
  return (
    <CDialog
      trigger={(open) => (
        <CotopiaButton
          variant={"ghost"}
          startIcon={<Settings size={20} />}
          onClick={open}
          className='text-sm'
        >
          Settings room
        </CotopiaButton>
      )}
    >
      {(close) => <RoomSettings />}
    </CDialog>
  );
}
