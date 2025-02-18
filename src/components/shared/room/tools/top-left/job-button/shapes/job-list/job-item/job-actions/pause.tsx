import { PauseCircleIcon } from '@/components/icons';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { colors } from '@/const/varz';
import useLoading from '@/hooks/use-loading';
import { useWorkspace } from '@/pages/workspace';
import axiosInstance from '@/services/axios';
import { JobType } from '@/types/job';
import { toast } from 'sonner';

type Props = {
  job: JobType;
};
export default function PauseJob({ job }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { myJobs, suggestedJobs, parentJobs, changeItem } = useWorkspace();

  const handlePaused = () => {
    startLoading();
    axiosInstance
      .get(`/jobs/${job.id}/updateStatus?status=paused`)
      .then((res) => {
        toast.success('Job has been stopped');
        stopLoading();
        let resJob = res.data.data;
        let updatedJobs = myJobs.map((j) => {
          if (j.id === resJob.id) {
            return { ...j, status: 'paused' };
          }
          return j;
        });
        changeItem('jobs', { myJobs: updatedJobs, suggestedJobs, parentJobs });
      })
      .catch(() => {
        stopLoading();
      });
  };

  return (
    <CotopiaIconButton
      onClick={handlePaused}
      disabled={isLoading}
      className="hover:text-black w-5 h-5"
    >
      <PauseCircleIcon color={colors.warning.default} size={16} />
    </CotopiaIconButton>
  );
}
