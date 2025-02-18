import { PlayCircleIcon } from '@/components/icons';
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
export default function PlayJob({ job }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const { myJobs, suggestedJobs, parentJobs, changeItem } = useWorkspace();

  const handlePlay = () => {
    startLoading();
    axiosInstance
      .get(`/jobs/${job.id}/updateStatus?status=in_progress`)
      .then((res) => {
        toast.success('Job has been started');
        stopLoading();
        let resJob = res.data.data;
        let updatedJobs = myJobs.map((j) => {
          if (j.id === resJob.id) {
            return { ...j, status: 'in_progress' };
          }
          if (j.status === 'in_progress') {
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
      onClick={handlePlay}
      disabled={isLoading}
      className="text-black/60 hover:text-black w-5 h-5"
    >
      <PlayCircleIcon color={colors.primary.body} size={16} />
    </CotopiaIconButton>
  );
}
