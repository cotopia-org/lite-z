import StatusBox from "@/components/shared/status-box";
import { cn, getTimeFormat } from "@/lib/utils";
import { JobType, UserJobType } from "@/types/job";

type Props = {
  job: JobType;
  getUser: (value: JobType) => UserJobType | undefined;
};
export default function JobEstimate({ job, getUser }: Props) {
  if (!job.estimate) return null;

  const jobEstimateSeconds = (job.estimate ?? 0) * 60 * 60;
  const jobWorkedSeconds = (getUser(job)?.total_minutes ?? 0) * 60;

  const workedMoreThanEstimate = jobWorkedSeconds > jobEstimateSeconds;

  return (
    <StatusBox
      label={
        <div className="flex flex-row items-center gap-x-1">
          <span
            className={cn(workedMoreThanEstimate ? "text-yellow-600" : "")}
          >{` ${getTimeFormat(jobWorkedSeconds, true)}`}</span>
          <span>/</span>
          <span>{`${getTimeFormat(jobEstimateSeconds, true)}`}</span>
        </div>
      }
      variant="info"
    />
  );
}
