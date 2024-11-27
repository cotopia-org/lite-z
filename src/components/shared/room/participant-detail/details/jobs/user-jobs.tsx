import FullLoading from "@/components/shared/full-loading";
import { useApi } from "@/hooks/swr";
import { JobType } from "@/types/job";
import JobTable from "@/components/shared/room/tools/top-left/job-button/shapes/job-table";

type Props = {
  userId: number | null;
};
export default function UserJobList({ userId }: Props) {
  const { data, isLoading } = useApi(`/users/${userId}/jobs`);
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  let content = <JobTable items={jobs} loading={isLoading} />;

  if (isLoading || data === undefined) content = <FullLoading />;

  return <div className={'w-[400px] min-w-full'}>{content}</div>;
}
