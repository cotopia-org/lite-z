import FullLoading from "@/components/shared/full-loading";
import { useApi } from "@/hooks/swr";
import { JobType } from "@/types/job";
import JobTable from "@/components/shared/room/tools/top-left/job-button/shapes/job-table";

type Props = {
  userId: number;
  period?: string;
};
export default function UserJobList({ userId, period = "all_time" }: Props) {
  const { data, isLoading } = useApi(`/users/${userId}/jobs?period=${period}`);
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  let content = <JobTable items={jobs} loading={isLoading} userId={userId} />;

  if (isLoading || data === undefined) content = <FullLoading />;

  return <div className={"w-full min-w-full"}>{content}</div>;
}
