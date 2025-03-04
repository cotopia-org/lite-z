import CotopiaButton from "@/components/shared-ui/c-button"
import ModalBox from "@/components/shared/modal-box"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import AddRoomForm from "./form"
import { WorkspaceRoomShortType } from "@/types/room"
import { colors } from "@/const/varz"

type Props = {
  workspace_id: string
  onAdd: (room: WorkspaceRoomShortType) => void
}
export default function AddRoom({ workspace_id, onAdd }: Props) {
  return (
    <ModalBox
      trigger={(open) => (
        <CotopiaButton
          className="text-grayscale-subtitle hover:text-grayscale-subtitle"
          variant={"ghost"}
          startIcon={<Plus size={16} color={colors.grayscale.subtitle} />}
          onClick={open}
        >
          Add Room
        </CotopiaButton>
      )}
    >
      {(_, close) => {
        return (
          <>
            <DialogTitle>{`Adding room to workspace`}</DialogTitle>
            <DialogDescription>{`You are going to create room in your workspace`}</DialogDescription>
            <AddRoomForm
              workspace_id={workspace_id}
              onSubmit={close}
              onCreated={onAdd}
            />
          </>
        )
      }}
    </ModalBox>
  )
}
