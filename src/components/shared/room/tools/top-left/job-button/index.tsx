import PopupBox from '@/components/shared/popup-box';
import PopupBoxChild from '@/components/shared/popup-box/child';
import ToolButton from '../../tool-button';
import { BriefcaseIcon } from '@/components/icons';
import { useRoomContext } from '../../../room-context';
import { isUserAdmin, limitChar } from '@/lib/utils';
import AddJobHandler from './shapes/add-job';
import JobItems from '@/components/shared/job-items';
import CTabs from '@/components/shared-ui/c-tabs';
import useAuth from '@/hooks/auth';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { useWorkspace } from '@/pages/workspace';

export default function JobButton() {
  const { workspace_id, room_id } = useRoomContext();

  const { user } = useAuth();

  const { myJobs, suggestedJobs } = useWorkspace();

  const activeJob = myJobs.find((j) => j.status === 'in_progress');
  let jobItems = myJobs ?? [];
  let suggestItems = suggestedJobs ?? [];
  let parentItems = isUserAdmin(user) ? jobItems : suggestItems;

  let job_label = 'Create job';

  if (activeJob) job_label = limitChar(activeJob.title, 20);

  if (!activeJob && jobItems.length > 0) job_label = 'Start job';

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
                    parentJobs={parentItems}
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
                    parentJobs={parentItems}
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
                    parentJobs={parentItems}
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
                    suggested={true}
                    parentJobs={isUserAdmin(user) ? jobItems : suggestItems}
                  />
                ),
                value: 'suggestions',
              },
            ]}
          />
        );
        const isAdmin = isUserAdmin(user, workspace_id);
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
                <AddJobHandler />
              </div>
            </div>
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
