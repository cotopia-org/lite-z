import CotopiaButton from "@/components/shared-ui/c-button";
import { useApi } from "@/hooks/swr";
import { ChevronLeft, ChevronRight, Pencil, Plus, Save, X } from "lucide-react";

import TitleEl from "@/components/shared/title-el";
import { JobStatusType, JobType, UserJobType } from "@/types/job";
import CotopiaDropdown from "@/components/shared-ui/c-dropdown";
import JobStatus from "@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/job-status";
import CSelect from "@/components/shared-ui/c-select";
import axiosInstance, { FetchDataType } from "@/services/axios";
import Page from "@/pages/dashboard/Page";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaTextarea from "@/components/shared-ui/c-textarea";
import Search from "@/components/shared/search";
import useLoading from "@/hooks/use-loading";
import { useFormik } from "formik";
import { MentionType } from "@/types/mention";
import * as Yup from "yup";
import { toast } from "sonner";

type Props = {
  workspace_id: string | undefined;
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
export default function CreateJob({
  workspace_id,
  onBack,
  onUpdate,
  setSelectedJob,
}: Props) {
  const { data: workspaceJobs } = useApi<FetchDataType<JobType[]>>(
    "/workspaces/" + workspace_id + "/jobs",
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
    status: JobStatusType;
    estimate?: number;
    job_id?: number;
    mentions: MentionType[];
  }>({
    enableReinitialize: true,
    initialValues: {
      title: "",
      description: "",
      status: "in_progress",
      estimate: 1,
      job_id: undefined,
      mentions: [],
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("please enter job title"),
      description: Yup.string().required("please enter job description"),
    }),
    onSubmit: async (values) => {
      const { ...rest } = values;

      try {
        let payload: {
          [key: string]: string | number | undefined | number[] | MentionType[];
        } = {
          ...rest,
          workspace_id: workspace_id,
        };

        startLoading();
        const data = await axiosInstance({
          url: `/jobs/`,
          method: "POST",
          data: payload,
        });
        toast.success("Job has been created successfully");
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
            <small>Create Job</small>
            <h1 className={"font-bold text-lg"}>{values.title}</h1>

            <JobStatus status={values.status} />
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
                  hasError={!!touched.description && !!errors.description}
                  helperText={!!touched.description && errors.description}
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

              <div className="flex flex-row justify-between w-full gap-x-8">
                <div className="flex items-center w-full justify-end gap-x-2">
                  <CotopiaButton
                    type="submit"
                    className="min-w-[138px]"
                    startIcon={<Plus size={16} />}
                    loading={isLoading}
                    disabled={!isValid}
                  >
                    Create
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
