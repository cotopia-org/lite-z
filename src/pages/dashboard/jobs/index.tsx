import CotopiaButton from '@/components/shared-ui/c-button';
import CotopiaTable from '@/components/shared-ui/c-table';
import ContractDetailsById from '@/components/shared/cotopia-payroll/user-information/user-contract/contract-details/view-by-id';
import ParticipantsWithPopover from '@/components/shared/participants/with-popover';
import { useRoomContext } from '@/components/shared/room/room-context';
import { useApi } from '@/hooks/swr';
import { useEffect, useMemo, useState } from 'react';
import { JobType } from '@/types/job';
import CotopiaDropdown from '@/components/shared-ui/c-dropdown';
import CPagination from '@/components/shared-ui/c-pagination';
import Job from '@/pages/dashboard/jobs/single';
import EditJob from '@/pages/dashboard/jobs/edit';
import JobStatus from '@/components/shared/room/tools/top-left/job-button/shapes/job-list/job-item/job-status';
import { Pencil, Plus } from 'lucide-react';
import CreateJob from '@/pages/dashboard/jobs/create';
import { useDashboard } from '@/pages/dashboard';

type Props = {
  isAll?: boolean;
};

export default function Jobs({ isAll = true }: Props) {
  const [selectStatus, setSelectStatus] = useState<string>('all');

  const { item, selectItem } = useDashboard();

  const [creating, setCreating] = useState<boolean>(false);

  const { workspaceUsers, workspace_id } = useRoomContext();

  const [page, setPage] = useState(1);

  const { data, isLoading, mutate } = useApi(
    `/workspaces/${workspace_id}/jobs?page=${page}&status=${selectStatus}`,
  );
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  const jobsMeta = data !== undefined ? data?.meta : [];

  let finalJobs = jobs;

  const tableHeadItems = useMemo(() => {
    const items = [
      {
        title: '#',
        render: (item: JobType) => {
          return item.id;
        },
      },
      {
        title: 'User',
        render: (item: JobType) => {
          return (
            <ParticipantsWithPopover
              className="!pb-0"
              participants={workspaceUsers.filter((a) =>
                item.members.map((b) => b.id).includes(a.id),
              )}
            />
          );
        },
      },

      {
        title: 'Title',
        render: (item: JobType) => {
          return (
            <CotopiaButton
              variant={'link'}
              onClick={() => selectItem(item, 'job')}
            >
              {item.title}
            </CotopiaButton>
          );
        },
      },

      {
        title: 'Parent',
        render: (item: JobType) => {
          if (item.parent !== undefined && item.parent !== null) {
            return (
              <CotopiaButton
                variant={'link'}
                onClick={() => selectItem(item.parent, 'job')}
              >
                {item.parent.title}
              </CotopiaButton>
            );
          } else {
            return 'No Parent';
          }
        },
      },
      {
        title: 'Total Hours',
        render: (item: JobType) =>
          (
            item.members.reduce((sum, a) => sum + a.total_minutes, 0) / 60
          ).toFixed(2) + ' hrs',
      },

      {
        title: 'Status',
        render: (item: JobType) => {
          return <JobStatus status={item.status} />;
        },
      },
    ];

    return items;
  }, [isAll]);

  if (item && item.type === 'job' && !item.edit)
    return (
      <Job
        onBack={() => {
          selectItem(undefined);
        }}
        job={item.data}
      />
    );

  if (creating) {
    return (
      <CreateJob
        onBack={() => {
          setCreating(false);
        }}
        workspace_id={workspace_id}
        setSelectedJob={(item) => {
          selectItem(item, 'job');
        }}
        onUpdate={mutate}
      />
    );
  }

  if (item && item.type === 'job' && item.edit)
    return (
      <EditJob
        onBack={() => {
          selectItem(item.data, 'job');
        }}
        onUpdate={mutate}
      />
    );

  return (
    <div className={'p-4'}>
      <div className="flex flex-row items-center gap-x-4 justify-between">
        <CotopiaDropdown
          label="Job Status"
          items={[
            { title: 'All', value: 'all' },
            { title: 'In Progress', value: 'in_progress' },
            {
              title: 'Paused',
              value: 'paused',
            },
            { title: 'Completed', value: 'completed' },
          ]}
          defaultValue={selectStatus}
          onSelect={(item) => setSelectStatus(item.value)}
        />

        <CotopiaButton
          variant={'default'}
          startIcon={<Plus />}
          onClick={() => {
            setCreating(true);
          }}
        >
          New Job
        </CotopiaButton>
      </div>

      <CotopiaTable
        loading={isLoading}
        items={finalJobs}
        tableHeadItems={tableHeadItems}
      />
      <CPagination
        totalItems={jobsMeta.total}
        currentPage={page}
        onPageChange={setPage}
        perPage={10}
      />
    </div>
  );
}
