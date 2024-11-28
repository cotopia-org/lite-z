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
  let job_label = "Create job";
  const active_job = jobItems.find((j) => j.status === "in_progress");
  if (active_job) job_label = active_job.title.length > 20 ? active_job.title.slice(0, 20) + '... ' : active_job.title;
  if (!active_job && jobItems.length > 0) job_label = "Start job";

  const activeJobs = jobItems.filter((job) => job.status === "in_progress");
  const completedJobs = jobItems.filter((job) => job.status === "completed");
  const pausedJobs = jobItems.filter((job) => job.status === "paused");


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
            defaultValue='in_progress'
            items={[
              {
                title: "In Progress",
                content: (
                  <JobItems
                    hasAction
                    items={jobItems.filter((x) =>
                      ["in_progress"].includes(x.status)
                    )}
                    onMutate={mutate}
                  />
                ),
                length: activeJobs.length,
                value: "in_progress",
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
                length: pausedJobs.length,
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
                length: completedJobs.length,
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
