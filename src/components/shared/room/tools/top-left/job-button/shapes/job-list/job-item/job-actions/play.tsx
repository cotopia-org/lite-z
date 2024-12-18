import { PlayCircleIcon } from "@/components/icons";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { colors } from "@/const/varz";
import useLoading from "@/hooks/use-loading";
import axiosInstance from "@/services/axios";
import { JobType } from "@/types/job";
import { toast } from "sonner";

type Props = {
  job: JobType;
  onStart?: () => void;
};
export default function PlayJob({ job, onStart }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const handlePlay = () => {
    startLoading();
    axiosInstance
      .get(`/jobs/${job.id}/updateStatus?status=in_progress`)
      .then((res) => {
        toast.success("Job has been started");
        stopLoading();
        if (onStart) onStart();
      })
      .catch(() => {
        stopLoading();
      });
  };

  return (
    <CotopiaIconButton
      onClick={handlePlay}
      disabled={isLoading}
      className="text-black/60 hover:text-black w-5 h-5"
    >
      <PlayCircleIcon color={colors.primary.body} size={16} />
    </CotopiaIconButton>
  );
}
