import { useApi } from "@/hooks/swr";
import { useUserDetail } from "..";
import { JobType } from "@/types/job";
import FullLoading from "@/components/shared/full-loading";
import Jobs from "@/components/shared/jobs";
import { capitalizeWords } from "@/lib/utils";
import BoxHolder from "@/components/shared/box-holder";

export default function JobList() {
  const { user } = useUserDetail();

  const { data, isLoading } = useApi(`/users/${user?.id}/jobs`);
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  if (data === undefined || isLoading) return <FullLoading />;

  return (
    <>
      <BoxHolder
        title={`${capitalizeWords(user?.username ?? "")} Jobs List`}
        className="border-t p-4 "
      >
        <Jobs items={jobs} />
      </BoxHolder>
    </>
  );
}
