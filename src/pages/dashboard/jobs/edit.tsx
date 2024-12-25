import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTable from "@/components/shared-ui/c-table";
import ContractDetailsById from "@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id";
import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import { PaymentType } from "@/types/payment";
import { ChevronLeft, ChevronRight, Pencil, Plus, Save, X } from "lucide-react";
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
import CSelect from "@/components/shared-ui/c-select";
import axiosInstance, { FetchDataType } from "@/services/axios";
import Page from "@/pages/dashboard/Page";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaTextarea from "@/components/shared-ui/c-textarea";
import Search from "@/components/shared/search";
import DeleteJobHandler from "@/components/shared/room/tools/top-left/job-button/shapes/add-job/delete-job";
import useLoading from "@/hooks/use-loading";
import { useFormik } from "formik";
import { MentionType } from "@/types/mention";
import * as Yup from "yup";
import { toast } from "sonner";
import CotopiaSwitch from "@/components/shared-ui/c-switch";

type Props = {
  job: JobType;
  onBack: () => void;
  setSelectedJob?: (job: JobType) => void;
  onUpdate?: () => void;
};
const dropdownItems = [
  { title: "In Progress", value: "in_progress" },
  { title: "Completed", value: "completed" },
  { title: "Paused", value: "paused" },
  { title: "Started", value: "started" },
];
export default function EditJob({
  job,
  onBack,
  onUpdate,
  setSelectedJob,
}: Props) {
  const { data: workspaceJobs } = useApi<FetchDataType<JobType[]>>(
    "/workspaces/" + job.workspace_id + "/jobs",
  );
  let allJobs = (workspaceJobs && workspaceJobs?.data) ?? [];

  const { isLoading, stopLoading, startLoading } = useLoading();
  const {
    errors,
    getFieldProps,
    handleSubmit,
    values,
    setFieldValue,
    touched,
    isValid,
  } = useFormik<{
    title: string;
    description: string;
    status: string;
    estimate?: number;
    job_id?: number;
    mentions: MentionType[];
    joinable: number;
  }>({
    enableReinitialize: true,
    initialValues: {
      title: job ? job.title : "",
      description: job ? job.description : "",
      status: job ? job.status : "",
      estimate: job ? job.estimate : undefined,
      job_id: job ? job.parent?.id : undefined,
      mentions: job ? job.mentions : [],
      joinable: job ? job.joinable : 1,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("please enter job title"),
    }),
    onSubmit: async (values) => {
      const { ...rest } = values;

      try {
        let payload: {
          [key: string]: string | number | undefined | number[] | MentionType[];
        } = {
          ...rest,
          workspace_id: job.workspace_id,
        };

        startLoading();
        const data = await axiosInstance({
          url: `/jobs/${job.id}`,
          method: "PUT",
          data: payload,
        });
        toast.success("Job has been updated successfully");
        if (onUpdate) {
          onUpdate();
          onBack();
        }
        if (setSelectedJob) {
          console.log(data.data.data);
          setSelectedJob(data.data.data);
        }
        stopLoading();
      } catch (error) {
        stopLoading();
      }
    },
  });

  return (
    <Page
      header={
        <>
          <div className={"flex gap-2 items-center"}>
            <small>Editing</small>
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
          </div>
        </>
      }
      main={
        <>
          <div className={"p-4 flex flex-col items-start gap-y-2 w-full"}>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
              <TitleEl className={"w-1/2"} title="Parent">
                <CSelect
                  items={allJobs
                    .filter((x) => !x.old)
                    .map((x) => ({
                      title: "- ".repeat(x.level) + x.title,
                      value: x.id + "",
                    }))}
                  defaultValue={values.job_id + ""}
                  onChange={(v) => {
                    setFieldValue("job_id", +v);
                  }}
                />
              </TitleEl>
              <TitleEl title="Title">
                <CotopiaInput
                  {...getFieldProps("title")}
                  hasError={!!touched.title && !!errors.title}
                  helperText={!!touched.title && errors.title}
                  placeholder="Enter Job Title"
                />
              </TitleEl>

              <TitleEl className={"w-full"} title="Description">
                <CotopiaTextarea
                  {...getFieldProps("description")}
                  placeholder="Enter job Description"
                  rows={5}
                  className="resize-none"
                />
              </TitleEl>

              <TitleEl title="Estimate Time (Hours)">
                <div className="flex items-center gap-x-4 justify-between">
                  <CotopiaInput
                    {...getFieldProps("estimate")}
                    hasError={!!touched.estimate && !!errors.estimate}
                    helperText={!!touched.estimate && errors.estimate}
                    placeholder="Estimate time"
                  />
                </div>
              </TitleEl>
              <TitleEl title="Status">
                <CotopiaDropdown
                  onSelect={(item) => setFieldValue("status", item.value)}
                  defaultValue={
                    dropdownItems.find((x) => x.value === values?.status)?.title
                  }
                  items={dropdownItems}
                />
              </TitleEl>
              <TitleEl className={"w-full"} title="Open to">
                <Search
                  defaultSelected={values.mentions}
                  onChange={(items) => {
                    setFieldValue("mentions", items);
                  }}
                />
              </TitleEl>
              <CotopiaSwitch
                label="Parent Only? (No one can accept this job, it only can used as parent)"
                checked={values?.joinable === 0}
                onCheckedChange={(value) => {
                  setFieldValue("joinable", value === true ? 0 : 1);
                }}
                className="flex-col-reverse gap-y-4 [&_label]:font-bold [&_label]:text-base items-start"
              />
              <div className="flex flex-row justify-between w-full gap-x-8">
                <div className="flex items-center w-full justify-end gap-x-2">
                  <CotopiaButton
                    type="submit"
                    className="min-w-[138px]"
                    startIcon={<Save size={16} />}
                    loading={isLoading}
                    disabled={!isValid}
                  >
                    Save
                  </CotopiaButton>
                </div>
              </div>
            </form>
          </div>
        </>
      }
    />
  );
}
