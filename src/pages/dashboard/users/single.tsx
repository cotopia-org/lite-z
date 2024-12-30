import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaTable from '@/components/shared-ui/c-table';
import ContractDetailsById from '@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id';
import ParticipantsWithPopover from '@/components/shared/participants/with-popover';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useApi } from '@/hooks/swr';
import { PaymentType } from '@/types/payment';
import { ChevronLeft, ChevronRight, Pencil, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  formatTime,
  getContractStatus,
  getDateTime,
  urlWithQueryParams,
} from '@/lib/utils';
import TitleEl from '@/components/shared/title-el';
import { JobType, UserJobType } from '@/types/job';
import CotopiaDropdown from '@/components/shared-ui/c-dropdown';
import CPagination from '@/components/shared-ui/c-pagination';
import ParticipantDetails from '@/components/shared/room/participant-detail';
import CotopiaAvatar from '@/components/shared-ui/c-avatar';
import { UserType, WorkspaceUserType } from '@/types/user';
import JobStatus from '@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/job-status';
import { colors, VARZ } from '@/const/varz';
import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import JobTag from '@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/tag';
import { TrashIcon } from '@/components/icons';
import PropmptBox from '@/components/shared/prompt-box';
import StatusBox from '@/components/shared/status-box';
import CotopiaMention from '@/components/shared-ui/c-mention';
import Page from '@/pages/dashboard/Page';
import UserJob from '@/pages/dashboard/components/user-job';

type Props = {
  user: UserType;
  onBack: () => void;
};

export default function User({ user, onBack }: Props) {
  // const { data, mutate } = useApi(`/jobs/${job.id}/jobs`);
  // const jobs: JobType[] = data !== undefined ? data?.data : [];

  return (
    <Page
      header={
        <>
          <div className={'flex gap-2 items-center'}>
            <h1 className={'font-bold text-lg'}>{user.username}</h1>
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
          <div className={'border-r  flex flex-col items-start gap-y-2 w-1/2'}>
            <div>
              <small>Bio</small> {user.bio ?? 'None'}
            </div>
          </div>

          <div className={'p-4 grid grid-cols-3 gap-4 w-1/2 '}>Right</div>
        </>
      }
    />
  );
}
