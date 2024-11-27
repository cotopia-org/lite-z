import FullLoading from "@/components/shared/full-loading";
import JobItems from "@/components/shared/job-items";
import { useApi } from "@/hooks/swr";
import { JobType } from "@/types/job";

type Props = {
  userId: number;
};
export default function UserJobList({ userId }: Props) {
  const { data, isLoading } = useApi(`/users/${userId}/jobs`);
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  let content = <JobItems items={jobs} />;

  if (isLoading || data === undefined) content = <FullLoading />;

  return <div>{content}</div>;
}
