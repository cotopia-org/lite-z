import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaTable from '@/components/shared-ui/c-table';
import ContractDetailsById from '@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id';
import ParticipantsWithPopover from '@/components/shared/participants/with-popover';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useApi } from '@/hooks/swr';
import { PaymentType } from '@/types/payment';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
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
import { UserMinimalType, UserType, WorkspaceUserType } from '@/types/user';
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
import { TagType } from '@/types/tag';
import UserAvatar from '@/components/shared/user-avatar';
import UserView from '@/components/shared/user-view';
import { useDashboard } from '@/pages/dashboard';
import axiosInstance from '@/services/axios';
import { toast } from 'sonner';
import UserSelector from '@/components/shared/user-selector';
import CotopiaInput from '@/components/shared-ui/c-input';
import FullLoading from '@/components/shared/full-loading';
import useLoading from '@/hooks/use-loading';

type Props = {
  tag: TagType;
  onBack: () => void;
  mutate: () => void;
};

export default function Tag({ tag, onBack, mutate }: Props) {
  const { selectItem } = useDashboard();

  const [title, setTitle] = useState(tag.title);
  const [editing, setEditing] = useState(false);
  const [members, setMembers] = useState(tag.members);

  const { data } = useApi(`/tags/${tag.id}/jobs`);
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  const handleRemove = async (user: UserMinimalType) => {
    const data = await axiosInstance({
      url: '/tags/' + tag.id + '/removeMember',
      method: 'POST',
      data: {
        user_id: user.id,
      },
    });
    setMembers(data.data.data.members);
    mutate();

    toast.success(user.username + ' has been removed from ' + tag.title);
  };

  const { isLoading, startLoading, stopLoading } = useLoading();
  const handeAddUser = async (user: UserMinimalType) => {
    axiosInstance({
      url: '/tags/' + tag.id + '/addMember',
      method: 'POST',
      data: {
        user_id: user.id,
      },
    })
      .then((res) => {
        setMembers(res.data.data.members);
        toast.success(user.username + ' has been added to ' + tag.title);
        mutate();
      })
      .catch((err) => {
        toast.error(err.response.data.meta.message);
      });
  };

  const handleUpdate = async () => {
    if (editing) {
      startLoading();
      axiosInstance({
        url: '/tags/' + tag.id,
        method: 'PUT',
        data: {
          title: title,
        },
      }).then((res) => {
        stopLoading();
        toast.success('Tag has been updated!');
        mutate();
      });
    }

    setEditing(!editing);
  };

  return (
    <Page
      header={
        <>
          <div className={'flex gap-2 items-center'}>
            {isLoading ? (
              <FullLoading />
            ) : (
              <>
                {editing ? (
                  <CotopiaInput
                    value={title}
                    className={'text-lg font-bold'}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                ) : (
                  <h1 className={'font-bold text-lg'}>{title}</h1>
                )}

                <CotopiaIconButton
                  className="w-8 h-8 text-yellow-900"
                  onClick={handleUpdate}
                >
                  {editing ? <Check size={14} /> : <Pencil size={14} />}
                </CotopiaIconButton>
              </>
            )}
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

            {/*<CotopiaButton*/}
            {/*  variant={'link'}*/}
            {/*  startIcon={<Pencil />}*/}
            {/*  onClick={() => {*/}
            {/*    editItem(tag, 'tag');*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Edit*/}
            {/*</CotopiaButton>*/}
          </div>
        </>
      }
      main={
        <>
          <div className={'border-r  flex flex-col items-start gap-y-2 w-1/2'}>
            <div>
              <small>Jobs</small>{' '}
              {jobs.length > 0 ? (
                jobs.map((job: JobType) => (
                  <CotopiaButton
                    variant={'link'}
                    onClick={() => {
                      selectItem(job, 'job');
                    }}
                  >
                    {job.title}
                  </CotopiaButton>
                ))
              ) : (
                <span className={'text-sm text-black/50'}>
                  This tag has no jobs
                </span>
              )}
            </div>
          </div>

          <div className={'p-4 flex flex-col gap-4 w-1/2 '}>
            <div className={'grid grid-cols-3 gap-4 w-full '}>
              {members.length > 0 ? (
                members.map((user) => {
                  return (
                    <div className={'flex items-center gap-2'}>
                      <UserView user={user} />
                      <span className="text-xs text-black/70">
                        <div className="flex flex-row items-center gap-x-1">
                          <CotopiaIconButton
                            onClick={() => {
                              handleRemove(user);
                            }}
                            disabled={false}
                            className="hover:text-black w-3 h-3"
                          >
                            <TrashIcon color={colors.error.default} size={12} />
                          </CotopiaIconButton>
                        </div>
                      </span>
                    </div>
                  );
                })
              ) : (
                <div>This tag has no members!</div>
              )}
            </div>
            <div>
              <UserSelector
                onPick={(user) => {
                  handeAddUser(user);
                }}
              />
            </div>
          </div>
        </>
      }
    />
  );
}
