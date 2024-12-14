import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTable from "@/components/shared-ui/c-table";
import ContractDetailsById from "@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import { PaymentType } from "@/types/payment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { getContractStatus, urlWithQueryParams } from "@/lib/utils";
import TitleEl from "@/components/shared/title-el";
import { JobType, UserJobType } from "@/types/job";
import CotopiaDropdown from "@/components/shared-ui/c-dropdown";
import CPagination from "@/components/shared-ui/c-pagination";
import ParticipantDetails from "@/components/shared/room/participant-detail";
import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import { UserType, WorkspaceUserType } from "@/types/user";
import JobStatus from "@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/job-status";

type Props = {
  job: JobType;
  onBack: () => void;
  setSelectedJob?: (job: JobType) => void;
};

export default function Job({ job, onBack, setSelectedJob }: Props) {
  const { data, mutate } = useApi(`/jobs/${job.id}/jobs`);
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  return (
    <div className={" w-full flex flex-col p-4"}>
      <div
        className={
          "w-full flex flex-row  justify-between items-center border-b"
        }
      >
        <h1 className={"font-bold text-lg"}>{job.title}</h1>
        {!!onBack && (
          <CotopiaButton
            variant={"link"}
            startIcon={<ChevronLeft />}
            onClick={onBack}
          >
            Back
          </CotopiaButton>
        )}
      </div>
      <div className={"flex w-full flex-row  justify-between"}>
        <div className={"border-r p-4 flex flex-col items-start gap-y-2 w-1/2"}>
          <div>Description: {job.description}</div>
          <div>Status {job.status}</div>
          <div>Estimate {job.estimate}</div>
          <div>Date Created: {job.created_at}</div>
          <div>
            Total Minutes:
            {job.members.reduce((sum, a) => sum + a.total_minutes, 0)}
          </div>
          <div>
            Jobs:{" "}
            {jobs.length > 0 ? (
              jobs.map((job: JobType) => (
                <CotopiaButton
                  variant={"link"}
                  onClick={() => {
                    if (setSelectedJob) setSelectedJob(job);
                  }}
                >
                  {job.title}
                </CotopiaButton>
              ))
            ) : (
              <span className={"text-sm text-black/50"}>
                This job has no children
              </span>
            )}
          </div>
        </div>

        <div className={"p-4 flex flex-col items-start gap-y-2  w-1/2"}>
          {job.members.map((user) => {
            return <UserJob user={user} />;
          })}
        </div>
      </div>
    </div>
  );
}

function UserJob({ user }: { user: UserJobType }) {
  return (
    <div className={"flex flex-col gap-y-2 items-start"}>
      <div className={"flex flex-row gap-x-2 items-center"}>
        <CotopiaAvatar
          className={`min-w-8 min-h-8`}
          src={user.avatar.url}
          title={user.username ? user.username?.[0] : undefined}
        />
        <span>{user.username}</span>
      </div>

      <div className={"flex flex-col bg-red-500"}>
        <JobStatus status={user.status} />
        <span>{user.total_minutes / 60} hrs</span>
        <span>{user.created_at}</span>
      </div>
    </div>
  );
}
