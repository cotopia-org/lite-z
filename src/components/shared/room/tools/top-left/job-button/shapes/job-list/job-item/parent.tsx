import StatusBox from '@/components/shared/status-box';
import { JobType } from '@/types/job';

type Props = {
  job: JobType;
};
export default function JobParent({ job }: Props) {
  return (
    <StatusBox
      label={
        <div className="flex flex-row items-center gap-x-1">
          <span>Parent: {job.parent?.title}</span>
        </div>
      }
      variant="default"
    />
  );
}
