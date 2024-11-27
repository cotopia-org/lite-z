import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import CotopiaTooltip from "@/components/shared-ui/c-tooltip"
import ModalBox from "@/components/shared/modal-box"
import { useRoomContext } from "@/components/shared/room/room-context"
import AddRoom from "@/pages/workspace/rooms/add-room"
import { DoorOpen } from "lucide-react"

export default function AddRoomButton() {
  const { workspace_id } = useRoomContext()

  return (
    <ModalBox
      trigger={(open) => (
        <CotopiaTooltip title="Add room">
          <CotopiaIconButton onClick={open} className="text-black w-12 h-12">
            <DoorOpen />
          </CotopiaIconButton>
        </CotopiaTooltip>
      )}
    >
      {(_, close) => (
        <AddRoom
          onAdd={() => {}}
          workspace_id={"" + workspace_id}
          onClose={close}
        />
      )}
    </ModalBox>
  )
}
