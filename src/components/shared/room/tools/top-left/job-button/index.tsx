import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import ToolButton from "../../tool-button";
import { BriefcaseIcon } from "@/components/icons";
import { useRoomContext } from "../../../room-context";
import { useApi } from "@/hooks/swr";
import { urlWithQueryParams } from "@/lib/utils";
import FullLoading from "@/components/shared/full-loading";
import AddJobHandler from "./shapes/add-job";
import { JobType, JobStatusType } from "@/types/job";
import { FetchDataType } from "@/services/axios";
import JobItems from "@/components/shared/job-items";
import CTabs from "@/components/shared-ui/c-tabs";

export default function JobButton() {
  const { workspace_id } = useRoomContext();

  const { data, isLoading, mutate } = useApi<FetchDataType<JobType[]>>(
    urlWithQueryParams(`/users/me/jobs`, { workspace_id }),
    undefined,
    { isPaused: () => workspace_id === undefined }
  );

  let jobItems = (data && data?.data) ?? [];
  console.log("Job items : " , jobItems)
  let job_label = "Create job";
  const active_job = jobItems.find((j) => j.status === "in_progress");
  if (active_job) job_label = active_job.title;
  if (!active_job && jobItems.length > 0) job_label = "Start job";
  console.log("Active Job : " , active_job)


  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <ToolButton
          isOpen={isOpen}
          startIcon={<BriefcaseIcon size={20} />}
          open={open}
        >
          {job_label}
        </ToolButton>
      )}
    >
      {(triggerPosition, open, close) => {
        let content = (
          <CTabs
            defaultValue='active'
            items={[
              {
                title: "Active",
                content: (
                  <JobItems
                    hasAction
                    items={jobItems.filter((x) =>
                      ["in_progress", "started"].includes(x.status)
                    )}
                    onMutate={mutate}
                  />
                ),
                value: `active`,
              },
              {
                title: "Paused",
                content: (
                  <JobItems
                    hasAction
                    items={jobItems.filter((x) =>
                      ["paused"].includes(x.status)
                    )}
                    onMutate={mutate}
                  />
                ),
                value: "paused",
              },
              {
                title: "Completed",
                content: (
                  <JobItems
                    hasAction
                    items={jobItems.filter((x) =>
                      ["completed"].includes(x.status)
                    )}
                    onMutate={mutate}
                  />
                ),
                value: "completed",
              },
            ]}
          />
        );

        if (isLoading || data === undefined) content = <FullLoading />;

        return (
          <PopupBoxChild
            onClose={close}
            title='Jobs'
            width={506}
            zIndex={triggerPosition.zIndex}
            top={triggerPosition.top}
            left={triggerPosition.left}
          >
            <div className='flex w-full flex-col gap-y-6 items-end'>
              {content}
              <AddJobHandler workspaceId={workspace_id} onCreated={mutate} />
            </div>
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
