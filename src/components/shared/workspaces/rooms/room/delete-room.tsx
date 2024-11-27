import { colors } from "@/const/varz"
import { TrashIcon } from "@/components/icons"
import CotopiaButton from "@/components/shared-ui/c-button"
import CDialog from "@/components/shared-ui/c-dialog"
import CotopiaPromptContent from "@/components/shared-ui/c-prompt/content"
import useLoading from "@/hooks/use-loading"
import axiosInstance from "@/services/axios"
import { WorkspaceRoomShortType } from "@/types/room"
import { toast } from "sonner"

type Props = {
  room: WorkspaceRoomShortType
  onDelete?: () => void
}

export default function DeleteRoom({ room, onDelete }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading()

  const handleDelete = (onClose?: () => void) => {
    startLoading()
    axiosInstance
      .delete(`/rooms/${room.id}`)
      .then((res) => {
        toast.success(`"${room.title}" room has been deleted successfully`)
        stopLoading()
        if (onClose) onClose()
        if (onDelete) onDelete()
      })
      .catch((err) => {
        stopLoading()
      })
  }

  return (
    <CDialog
      trigger={(open) => (
        <CotopiaButton
          variant={"ghost"}
          startIcon={<TrashIcon size={20} color={colors.destructive} />}
          onClick={open}
          className="text-sm"
          disabled={isLoading}
        >
          Delete room
        </CotopiaButton>
      )}
    >
      {(close) => (
        <CotopiaPromptContent
          title="Delete room"
          loading={isLoading}
          submitText="Delete"
          description="Are you sure to delete this room?!"
          onSubmit={() => handleDelete(close)}
          onClose={close}
        />
      )}
    </CDialog>
  )
}
