import PopupBox from '@/components/shared/popup-box';
import PopupBoxChild from '@/components/shared/popup-box/child';
import ToolButton from '../../tool-button';
import { BriefcaseIcon } from '@/components/icons';
import { useRoomContext } from '../../../room-context';
import { useApi } from '@/hooks/swr';
import { isUserAdmin, urlWithQueryParams } from '@/lib/utils';
import FullLoading from '@/components/shared/full-loading';
import AddJobHandler from './shapes/add-job';
import { JobType } from '@/types/job';
import { FetchDataType } from '@/services/axios';
import JobItems from '@/components/shared/job-items';
import CTabs from '@/components/shared-ui/c-tabs';
import useAuth from '@/hooks/auth';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';

export default function JobButton() {
  const { workspace_id, room_id } = useRoomContext();

  const { user } = useAuth();

  const { data, isLoading, mutate } = useApi<FetchDataType<JobType[]>>(
    urlWithQueryParams(`/users/me/jobs`, { workspace_id }),
    undefined,
    { isPaused: () => workspace_id === undefined },
  );

  const { data: suggestionsJobs, mutate: mutateSuggest } = useApi<
    FetchDataType<JobType[]>
  >('/users/mentionedJobs?suggests=true', undefined, {
    isPaused: () => workspace_id === undefined,
  });

  const { data: parentJobs } = useApi<FetchDataType<JobType[]>>(
    '/users/mentionedJobs',
    undefined,
    {
      isPaused: () => workspace_id === undefined,
    },
  );

  let jobItems = (data && data?.data) ?? [];
  let suggestItems = (suggestionsJobs && suggestionsJobs?.data) ?? [];
  let parentItems = (parentJobs && parentJobs?.data) ?? [];

  let job_label = 'Create job';
  const active_job = user?.active_job;

  if (active_job)
    job_label =
      active_job.title.length > 20
        ? active_job.title.slice(0, 20) + '... '
        : active_job.title;
  if (!active_job && jobItems.length > 0) job_label = 'Start job';

  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <ToolButton
          isOpen={isOpen}
          startIcon={<BriefcaseIcon size={20} />}
          open={open}
        >
          {suggestItems.length > 0 && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></div>
          )}
          {job_label}
        </ToolButton>
      )}
    >
      {(triggerPosition, open, close) => {
        let content = (
          <CTabs
            defaultValue="in_progress"
            items={[
              {
                title: 'In Progress',
                content: (
                  <JobItems
                    user={user}
                    hasAction
                    items={jobItems.filter((x) =>
                      ['in_progress'].includes(x.status + ''),
                    )}
                    onMutate={mutate}
                    parentJobs={isUserAdmin(user) ? jobItems : suggestItems}
                  />
                ),
                value: 'in_progress',
              },
              {
                title: 'Paused',
                content: (
                  <JobItems
                    user={user}
                    hasAction
                    items={jobItems.filter((x) =>
                      ['paused'].includes(x.status + ''),
                    )}
                    onMutate={mutate}
                    parentJobs={isUserAdmin(user) ? jobItems : suggestItems}
                  />
                ),
                value: 'paused',
              },
              {
                title: 'Completed',
                content: (
                  <JobItems
                    user={user}
                    hasAction
                    items={jobItems.filter((x) =>
                      ['completed'].includes(x.status + ''),
                    )}
                    parentJobs={isUserAdmin(user) ? jobItems : suggestItems}
                    onMutate={mutate}
                  />
                ),
                value: 'completed',
              },
              {
                title: 'Suggested',
                content: (
                  <JobItems
                    user={user}
                    hasAction
                    items={suggestItems}
                    onMutate={() => {
                      mutateSuggest();
                      mutate();
                    }}
                    suggested={true}
                    parentJobs={isUserAdmin(user) ? jobItems : suggestItems}
                  />
                ),
                value: 'suggestions',
                // badge: suggestItems.length > 0,
              },
            ]}
          />
        );
        const isAdmin = isUserAdmin(user, workspace_id);

        if (isLoading || data === undefined) content = <FullLoading />;

        return (
          <PopupBoxChild
            onClose={close}
            title="Jobs"
            width={506}
            zIndex={triggerPosition.zIndex}
            top={triggerPosition.top}
            left={triggerPosition.left}
          >
            <div className="flex w-full flex-col gap-y-6 items-end">
              {content}

              <div
                className={'w-full flex flex-row items-center justify-between'}
              >
                {isAdmin && (
                  <Link
                    className={buttonVariants({
                      variant: 'default',
                      class: 'min-w-[100px] !bg-primary',
                    })}
                    target="_blank"
                    to={`/workspaces/${workspace_id}/rooms/${room_id}/jobs`}
                  >
                    Dashboard
                  </Link>
                )}

                <AddJobHandler
                  parentJobs={parentItems}
                  workspaceId={workspace_id}
                  onCreated={mutate}
                />
              </div>
            </div>
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
