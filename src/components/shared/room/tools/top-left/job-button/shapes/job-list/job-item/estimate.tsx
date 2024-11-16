import StatusBox from "@/components/shared/status-box";
import { JobType } from "@/types/job";

type Props = {
  job: JobType;
};
export default function JobEstimate({ job }: Props) {
  if (!job.estimate) return null;
  return (
    <StatusBox
      label={`${job.estimate} hour${job.estimate > 1 ? "s" : ""} estimated`}
      variant='info'
    />
  );
}
