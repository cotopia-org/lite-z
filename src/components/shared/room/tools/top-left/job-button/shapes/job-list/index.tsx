import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import JobItem from "./job-item";
import FullLoading from "@/components/shared/full-loading";
import AddJobHandler from "../add-job";
import { urlWithQueryParams } from "@/lib/utils";
import { FetchDataType } from "@/services/axios";
import JobItems from "@/components/shared/job-items";

interface Props {}

const JobList = (props: Props) => {
  const { workspace_id } = useRoomContext();

  const { data, isLoading, mutate } = useApi<FetchDataType<any>>(
    urlWithQueryParams(`/users/me/jobs`, { workspace_id }),
    undefined,
    { isPaused: () => workspace_id === undefined }
  );

  let jobItems: any[] = (data && data?.data) ?? [];

  let content = <JobItems items={jobItems} onMutate={mutate} hasAction />;

  const loading = data === undefined || isLoading;

  if (!loading && jobItems.length === 0)
    content = (
      <span className='w-full text-lg text-grayscale-paragraph font-medium text-center py-4'>
        There is no job to show!
      </span>
    );

  if (loading) return <FullLoading />;

  return (
    <div className='flex w-full flex-col gap-y-6 items-end'>
      {content}
      <AddJobHandler workspaceId={workspace_id} onCreated={mutate} />
    </div>
  );
};

export default JobList;
