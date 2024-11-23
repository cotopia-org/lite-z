import StatusBox from "@/components/shared/status-box";
import { cn, getTimeFormat } from "@/lib/utils";
import { JobType } from "@/types/job";

type Props = {
  job: JobType;
};
export default function JobEstimate({ job }: Props) {
  if (!job.estimate) return null;

  const jobEstimateSeconds = (job.estimate ?? 0) * 60 * 60;
  const jobWorkedSeconds = (job.total_hours ?? 0) * 60;

  const workedMoreThanEstimate = jobWorkedSeconds > jobEstimateSeconds;

  return (
    <StatusBox
      label={
        <div className='flex flex-row items-center gap-x-1'>
          <span
            className={cn(workedMoreThanEstimate ? "text-yellow-600" : "")}
          >{` ${getTimeFormat(jobWorkedSeconds, true)} h worked`}</span>
          <span>/</span>
          <span>{`${getTimeFormat(jobEstimateSeconds, true)} h`}</span>
        </div>
      }
      variant='info'
    />
  );
}
