import CotopiaButton from '@/components/shared-ui/c-button';
import { useApi } from '@/hooks/swr';
import { ChevronLeft, ChevronRight, Pencil, Plus, Save, X } from 'lucide-react';

import TitleEl from '@/components/shared/title-el';
import { JobStatusType, JobType, UserJobType } from '@/types/job';
import CotopiaDropdown from '@/components/shared-ui/c-dropdown';
import JobStatus from '@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/job-status';
import CSelect from '@/components/shared-ui/c-select';
import axiosInstance, { FetchDataType } from '@/services/axios';
import Page from '@/pages/dashboard/Page';
import CotopiaInput from '@/components/shared-ui/c-input';
import CotopiaTextarea from '@/components/shared-ui/c-textarea';
import Search from '@/components/shared/search';
import useLoading from '@/hooks/use-loading';
import { useFormik } from 'formik';
import { MentionType } from '@/types/mention';
import * as Yup from 'yup';
import { toast } from 'sonner';
import FullLoading from '@/components/shared/full-loading';
import CotopiaSwitch from '@/components/shared-ui/c-switch';
import { useState } from 'react';

type Props = {
  workspace_id: number | undefined;
  onBack: () => void;
};

export default function CreateTag({ workspace_id, onBack }: Props) {
  const [title, setTitle] = useState('');
  const handleCreate = async (title: string) => {
    await axiosInstance({
      url: '/tags/',
      method: 'POST',
      data: {
        title: title,
        workspace_id: workspace_id,
      },
    });
    toast.success(title + ' Tag has been created!');
  };
  return (
    <Page
      header={
        <>
          <div className={'flex gap-2 items-center'}>
            <small>Create Tag</small>
            <h1 className={'font-bold text-lg'}>{title}</h1>
          </div>
          <div className={'flex items-center'}>
            {!!onBack && (
              <CotopiaButton
                variant={'link'}
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
          <div className={'p-4 flex flex-col items-start gap-y-2 w-full'}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleCreate(title);
                onBack();
              }}
              className="flex flex-col gap-y-5 px-4 w-full"
            >
              <TitleEl title="Title">
                <CotopiaInput
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="Enter Tag Title"
                />
              </TitleEl>
              <div className="flex flex-row justify-between w-full gap-x-8">
                <div className="flex items-center w-full justify-end gap-x-2">
                  <CotopiaButton
                    type="submit"
                    className="min-w-[138px]"
                    startIcon={<Plus size={16} />}
                    loading={false}
                    disabled={false}
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
