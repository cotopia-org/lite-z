import ParticipantsWithPopover from '@/components/shared/participants/with-popover';
import { WorkspaceUserType } from '@/types/user';
import moment from 'moment';

type Props = {
  user: WorkspaceUserType;
};
export default function User({ user }: Props) {
  return (
    <div className="flex flex-row items-center gap-x-2 grayscale">
      <ParticipantsWithPopover className="!pb-0" participants={[user]} />
      <div className={'flex flex-col'}>
        <span>{user.name}</span>
        <span className="text-xs text-black/70">
          <div className="flex flex-row items-center gap-x-1">
            <span className="text-xs">{moment(user.last_login).fromNow()}</span>
          </div>
        </span>
      </div>
    </div>
  );
}
