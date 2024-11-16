import StatusBox from "@/components/shared/status-box";
import { JobType } from "@/types/job";

type Props = {
  job: JobType;
};
export default function JobTotalHours({ job }: Props) {
  if (!job.total_hours) return null;
  return <StatusBox label={`${job.total_hours} worked`} variant='info' />;
}
