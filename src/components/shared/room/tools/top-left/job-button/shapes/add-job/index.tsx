import CotopiaButton from "@/components/shared-ui/c-button"
import { FullModalBox } from "@/components/shared/modal-box"
import { Plus } from "lucide-react"
import ManageJobContent from "./content"

interface Props {
  onDelete?: () => void
  onCreated?: () => void
  workspaceId?: string
}

const AddJobHandler = ({ onCreated, workspaceId }: Props) => {
  if (workspaceId === undefined) return null
  return (
    <FullModalBox
      title="Add job"
      trigger={(open) => (
        <CotopiaButton
          className="min-w-[100px] !bg-primary"
          startIcon={<Plus size={16} />}
          onClick={open}
        >
          Add Job
        </CotopiaButton>
      )}
      className="w-[464px] [&_.dialog-title]:text-lg [&_.dialog-header]:pb-4 [&_.dialog-header]:border-b"
    >
      {(open, close) => {
        return (
          <ManageJobContent
            workspaceId={workspaceId}
            onClose={close}
            onCreated={() => {
              if (onCreated) onCreated()
              close()
            }}
          />
        )
      }}
    </FullModalBox>
  )
}

export default AddJobHandler
