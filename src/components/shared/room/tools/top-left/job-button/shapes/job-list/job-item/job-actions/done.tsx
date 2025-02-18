import { colors } from '@/const/varz';
import { TickCircleIcon } from '@/components/icons';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import useLoading from '@/hooks/use-loading';
import axiosInstance from '@/services/axios';
import { JobType } from '@/types/job';
import { toast } from 'sonner';
import { useWorkspace } from '@/pages/workspace';

type Props = {
  job: JobType;
};
export default function DoneJob({ job }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { myJobs, suggestedJobs, parentJobs, changeItem } = useWorkspace();

  const handleDone = () => {
    startLoading();
    axiosInstance
      .get(`/jobs/${job.id}/updateStatus?status=completed`)
      .then((res) => {
        toast.success('Job has been completed');
        let resJob = res.data.data;
        let updatedJobs = myJobs.map((j) => {
          if (j.id === resJob.id) {
            return { ...j, status: 'completed' };
          }
          return j;
        });
        changeItem('jobs', { myJobs: updatedJobs, suggestedJobs, parentJobs });
        stopLoading();
      })
      .catch(() => {
        stopLoading();
      });
  };

  return (
    <CotopiaIconButton
      onClick={handleDone}
      disabled={isLoading}
      className="hover:text-black w-5 h-5"
    >
      <TickCircleIcon color={colors.success.default} size={16} />
    </CotopiaIconButton>
  );
}
