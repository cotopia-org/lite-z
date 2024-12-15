import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTable from "@/components/shared-ui/c-table";
import ContractDetailsById from "@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import { PaymentType } from "@/types/payment";
import { ChevronLeft, ChevronRight, Pencil, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  formatTime,
  getContractStatus,
  getDateTime,
  urlWithQueryParams,
} from "@/lib/utils";
import TitleEl from "@/components/shared/title-el";
import { JobType, UserJobType } from "@/types/job";
import CotopiaDropdown from "@/components/shared-ui/c-dropdown";
import CPagination from "@/components/shared-ui/c-pagination";
import ParticipantDetails from "@/components/shared/room/participant-detail";
import CotopiaAvatar from "@/components/shared-ui/c-avatar";
import { UserType, WorkspaceUserType } from "@/types/user";
import JobStatus from "@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/job-status";
import { colors, VARZ } from "@/const/varz";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import JobTag from "@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/tag";
import { TrashIcon } from "@/components/icons";
import PropmptBox from "@/components/shared/prompt-box";
import StatusBox from "@/components/shared/status-box";
import CotopiaMention from "@/components/shared-ui/c-mention";
import Page from "@/pages/dashboard/Page";
import UserJob from "@/pages/dashboard/components/user-job";

type Props = {
  job: JobType;
  onBack: () => void;
  setSelectedJob?: (job: JobType) => void;
  setSelectedEdit: (job: JobType) => void;
  setPreviousJob: (job: JobType) => void;
};

export default function Job({
  job,
  onBack,
  setSelectedJob,
  setSelectedEdit,
  setPreviousJob,
}: Props) {
  const { data, mutate } = useApi(`/jobs/${job.id}/jobs`);
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  return (
    <Page
      header={
        <>
          <div className={"flex gap-2 items-center"}>
            <h1 className={"font-bold text-lg"}>{job.title}</h1>

            <JobStatus status={job.status} />
          </div>
          <div className={"flex items-center"}>
            {!!onBack && (
              <CotopiaButton
                variant={"link"}
                startIcon={<ChevronLeft />}
                onClick={onBack}
              >
                Back
              </CotopiaButton>
            )}

            <CotopiaButton
              variant={"link"}
              startIcon={<Pencil />}
              onClick={() => {
                setSelectedEdit(job);
              }}
            >
              Edit
            </CotopiaButton>
          </div>
        </>
      }
      main={
        <>
          <div className={"border-r  flex flex-col items-start gap-y-2 w-1/2"}>
            <div>
              <small>Description</small> {job.description}
            </div>

            <div>
              <small>Estimate</small> {job.estimate} hrs
            </div>
            <div>
              <small>Created At</small> {getDateTime(job.created_at)}
            </div>

            <div>
              <small>Total Hours</small>{" "}
              {formatTime(
                job.members.reduce((sum, a) => sum + a.total_minutes, 0),
              )}
            </div>
            <div>
              <small>Parent</small>{" "}
              {job.parent !== undefined ? (
                <CotopiaButton
                  variant={"link"}
                  onClick={() => {
                    if (setSelectedJob && job.parent !== undefined) {
                      setSelectedJob(job.parent);
                      setPreviousJob(job);
                    }
                  }}
                >
                  {job.parent?.title}
                </CotopiaButton>
              ) : (
                <span className={"text-sm text-black/50"}>
                  This job has no parent
                </span>
              )}
            </div>
            <div>
              <small>Jobs</small>{" "}
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
            <div className={"flex items-center gap-1"}>
              <small>Open to</small>

              <div className={"flex gap-2 items-center flex-wrap"}>
                {job.mentions.map((mention) => {
                  return (
                    <StatusBox
                      label={<CotopiaMention item={mention} />}
                      variant="default"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className={"p-4 grid grid-cols-3 gap-4 w-1/2 "}>
            {job.members.length > 0 ? (
              job.members.map((user) => {
                return <UserJob user={user} />;
              })
            ) : (
              <div>This job has no members!</div>
            )}
          </div>
        </>
      }
    />
  );
}
