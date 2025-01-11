import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaDropdown from '@/components/shared-ui/c-dropdown';
import CotopiaInput from '@/components/shared-ui/c-input';
import CotopiaTextarea from '@/components/shared-ui/c-textarea';
import TitleEl from '@/components/shared/title-el';
import useLoading from '@/hooks/use-loading';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { JobType } from '@/types/job';
import { useFormik } from 'formik';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import DeleteJobHandler from '../delete-job';
import CSelect from '@/components/shared-ui/c-select';
import { useApi } from '@/hooks/swr';
import Search from '@/components/shared/search';
import { MentionType } from '@/types/mention';

interface Props {
  onClose: () => void;
  defaultValue?: JobType;
  onDelete?: () => void;
  onCreated?: () => void;
  workspaceId?: number;
  parentJobs: JobType[];
}

const dropdownItems = [
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Paused', value: 'paused' },
  { title: 'Started', value: 'started' },
];

const ManageJobContent = ({
  defaultValue,
  workspaceId,
  onCreated,
  onDelete,
  onClose,
  parentJobs,
}: Props) => {
  const isEdit = defaultValue !== undefined;
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
  }>({
    enableReinitialize: true,
    initialValues: {
      title: defaultValue ? defaultValue.title : '',
      description: defaultValue ? defaultValue.description : '',
      status: defaultValue ? defaultValue.status : '',
      estimate: defaultValue ? defaultValue.estimate : undefined,
      job_id: defaultValue ? defaultValue.parent?.id : undefined,
      mentions: defaultValue ? defaultValue.mentions : [],
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('please enter job title'),
    }),
    onSubmit: async (values) => {
      const { ...rest } = values;

      try {
        let payload: {
          [key: string]: string | number | undefined | number[] | MentionType[];
        } = {
          ...rest,
          workspace_id: workspaceId,
        };

        if (!isEdit) payload['status'] = 'in_progress';
        startLoading();
        await axiosInstance({
          url: isEdit ? `/jobs/${defaultValue.id}` : `/jobs`,
          method: isEdit ? 'PUT' : 'POST',
          data: payload,
        });
        toast.success(
          isEdit
            ? 'Job has been updated successfully'
            : 'Job has been created successfully',
        );
        if (onCreated) onCreated();
        stopLoading();
      } catch (error) {
        stopLoading();
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 px-4 w-full">
      <TitleEl title="Parent" className={'w-1/2'}>
        <CSelect
          items={parentJobs
            .filter((x) => !x.old)
            .map((x) => ({
              title: '- '.repeat(x.level) + x.title,
              value: x.id + '',
            }))}
          defaultValue={values.job_id + ''}
          onChange={(v) => {
            setFieldValue('job_id', +v);
          }}
        />
      </TitleEl>
      <TitleEl title="Title">
        <CotopiaInput
          {...getFieldProps('title')}
          hasError={!!touched.title && !!errors.title}
          helperText={!!touched.title && errors.title}
          placeholder="Enter Job Title"
        />
      </TitleEl>
      <TitleEl title="Description" className={'w-full'}>
        <CotopiaTextarea
          {...getFieldProps('description')}
          placeholder="Enter job Description"
          rows={5}
          className="resize-none"
        />
      </TitleEl>
      <TitleEl title="Estimate Time (Hours)">
        <div className="flex items-center gap-x-4 justify-between">
          <CotopiaInput
            {...getFieldProps('estimate')}
            hasError={!!touched.estimate && !!errors.estimate}
            helperText={!!touched.estimate && errors.estimate}
            placeholder="Estimate time"
          />
        </div>
      </TitleEl>
      {isEdit && (
        <TitleEl title="Status">
          <CotopiaDropdown
            onSelect={(item) => setFieldValue('status', item.value)}
            defaultValue={
              dropdownItems.find((x) => x.value === values?.status)?.title
            }
            items={dropdownItems}
          />
        </TitleEl>
      )}

      <TitleEl title="Open to" className={'w-full'}>
        <Search
          defaultSelected={values.mentions}
          onChange={(items) => {
            setFieldValue('mentions', items);
          }}
        />
      </TitleEl>

      <div className="flex flex-row justify-between w-full gap-x-8">
        {/*{isEdit && (*/}
        {/*  <DeleteJobHandler jobId={defaultValue.id} onDelete={onDelete} />*/}
        {/*)}*/}
        <div className="flex items-center w-full justify-end gap-x-2">
          <CotopiaButton
            variant={'outline'}
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
            disabled={!isValid}
          >
            {`${isEdit ? 'Update' : 'Create'} Job`}
          </CotopiaButton>
        </div>
      </div>
    </form>
  );
};

export default ManageJobContent;
