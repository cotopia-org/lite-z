import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import ModalBox from "@/components/shared/modal-box"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import AddRoomForm from "@/pages/workspace/rooms/add-room/form"
import { useRoomContext } from "@/components/shared/room/room-context"

export default function WorkspaceActionFab() {
  const { workspace_id } = useRoomContext()

  return (
    <div
      className={cn(
        "fixed right-4 flex flex-col gap-y-4 justify-end z-10 transition-all opacity-100 visible bottom-4"
      )}
    >
      <ModalBox
        trigger={(open) => (
          <CotopiaIconButton
            onClick={open}
            className={cn(
              "!bg-primary !text-white z-10 shadow-lg w-12 h-12 transition-all"
            )}
          >
            <Plus />
          </CotopiaIconButton>
        )}
      >
        {(_, close) => {
          return (
            <>
              <DialogTitle>{`Adding room to workspace`}</DialogTitle>
              <DialogDescription>{`You are going to create room in your workspace`}</DialogDescription>
              <AddRoomForm
                workspace_id={"" + workspace_id}
                onSubmit={close}
                onCreated={() => {}}
              />
            </>
          )
        }}
      </ModalBox>
    </div>
  )
}
