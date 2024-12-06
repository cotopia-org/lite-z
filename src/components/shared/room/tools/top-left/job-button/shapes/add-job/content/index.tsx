import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaDropdown from "@/components/shared-ui/c-dropdown";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaTextarea from "@/components/shared-ui/c-textarea";
import TitleEl from "@/components/shared/title-el";
import useLoading from "@/hooks/use-loading";
import axiosInstance, { FetchDataType } from "@/services/axios";
import { JobType } from "@/types/job";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import * as Yup from "yup";
import DeleteJobHandler from "../delete-job";
import CSelect from "@/components/shared-ui/c-select";
import { useApi } from "@/hooks/swr";
import { TagType } from "@/types/tag";
import StatusBox from "@/components/shared/status-box";
import Search from "@/components/shared/search";
import useSearch from "@/hooks/search";

interface Props {
  onClose: () => void;
  defaultValue?: JobType;
  onDelete?: () => void;
  onCreated?: () => void;
  workspaceId?: string;
}

const dropdownItems = [
  { title: "In Progress", value: "in_progress" },
  { title: "Completed", value: "completed" },
  { title: "Paused", value: "paused" },
  { title: "Started", value: "started" },
];

const ManageJobContent = ({
  defaultValue,
  workspaceId,
  onCreated,
  onDelete,
  onClose,
}: Props) => {
  const worksapce_id =
    workspaceId === undefined ? defaultValue?.workspace_id : workspaceId;

  const { data: workspaceJobs } = useApi<FetchDataType<JobType[]>>(
    "/workspaces/" + worksapce_id + "/jobs",
  );
  let allJobs = (workspaceJobs && workspaceJobs?.data) ?? [];

  const { data: tags } = useApi<FetchDataType<TagType[]>>(
    "/workspaces/" + worksapce_id + "/tags",
  );
  let allTags = (tags && tags?.data) ?? [];

  const isEdit = defaultValue !== undefined;
  const { isLoading, stopLoading, startLoading } = useLoading();
  const {
    errors,
    getFieldProps,
    handleSubmit,
    values,
    setFieldValue,
    touched,
  } = useFormik<{
    title: string;
    description: string;
    status: string;
    estimate?: number;
    job_id?: number;
    tags: number[];
  }>({
    enableReinitialize: true,
    initialValues: {
      title: defaultValue ? defaultValue.title : "",
      description: defaultValue ? defaultValue.description : "",
      status: defaultValue ? defaultValue.status : "",
      estimate: defaultValue ? defaultValue.estimate : undefined,
      job_id: defaultValue ? defaultValue.parent?.id : undefined,
      tags: defaultValue ? defaultValue.tags.map((tag) => tag.id) : [],
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("please enter job title"),
    }),
    onSubmit: async (values) => {
      const { ...rest } = values;

      try {
        let payload: { [key: string]: string | number | undefined | number[] } =
          {
            ...rest,
            workspace_id: workspaceId,
          };

        if (!isEdit) payload["status"] = "in_progress";
        startLoading();
        await axiosInstance({
          url: isEdit ? `/jobs/${defaultValue.id}` : `/jobs`,
          method: isEdit ? "PUT" : "POST",
          data: payload,
        });
        toast.success(
          isEdit
            ? "Job has been updated successfully"
            : "Job has been created successfully",
        );
        if (onCreated) onCreated();
        stopLoading();
      } catch (error) {
        stopLoading();
      }
    },
  });

  const isSubmitDisabled = !values.title;

  const { q, setQ, result, selected, handleAddSelect, handleRemoveSelect } =
    useSearch();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 px-4">
      <TitleEl title="Parent">
        <CSelect
          items={allJobs.map((x) => ({
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
      {isEdit && (
        <TitleEl title="Status">
          <CotopiaDropdown
            onSelect={(item) => setFieldValue("status", item.value)}
            defaultValue={
              dropdownItems.find((x) => x.value === values?.status)?.title
            }
            items={dropdownItems}
          />
        </TitleEl>
      )}
      <TitleEl title="Description">
        <CotopiaTextarea
          {...getFieldProps("description")}
          placeholder="Enter job Description"
          rows={5}
          className="resize-none"
        />
      </TitleEl>

      <TitleEl title="Mentions">
        <Search
          q={q}
          setQ={setQ}
          selected={selected}
          handleRemoveSelect={handleRemoveSelect}
          handleAddSelect={handleAddSelect}
          result={result}
        />
      </TitleEl>

      <div className="flex flex-row justify-between w-full gap-x-8">
        {isEdit && (
          <DeleteJobHandler jobId={defaultValue.id} onDelete={onDelete} />
        )}
        <div className="flex items-center w-full justify-end gap-x-2">
          <CotopiaButton
            variant={"outline"}
            className="min-w-[80px]"
            onClick={onClose}
          >
            Close
          </CotopiaButton>
          <CotopiaButton
            type="submit"
            className="min-w-[138px]"
            startIcon={<Plus size={16} />}
            loading={isLoading}
            disabled={isSubmitDisabled}
          >
            {`${isEdit ? "Update" : "Create"} Job`}
          </CotopiaButton>
        </div>
      </div>
    </form>
  );
};

export default ManageJobContent;
