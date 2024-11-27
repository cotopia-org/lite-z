import { colors } from "@/const/varz"
import { TickCircleIcon } from "@/components/icons"
import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import useLoading from "@/hooks/use-loading"
import axiosInstance from "@/services/axios"
import { JobType } from "@/types/job"
import { toast } from "sonner"

type Props = {
  job: JobType
  onDone?: () => void
}
export default function DoneJob({ job, onDone }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading()

  const handleDone = () => {
    startLoading()
    axiosInstance
      .put(`/jobs/${job.id}`, { status: "completed" })
      .then((res) => {
        toast.success("Job has been completed")
        if (onDone) onDone()
        stopLoading()
      })
      .catch(() => {
        stopLoading()
      })
  }

  return (
    <CotopiaIconButton
      onClick={handleDone}
      disabled={isLoading}
      className="hover:text-black w-5 h-5"
    >
      <TickCircleIcon color={colors.success.default} size={16} />
    </CotopiaIconButton>
  )
}
