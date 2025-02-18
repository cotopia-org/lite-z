import TitleEl from '@/components/shared/title-el';
import { useRoomContext } from '../../../room-context';
import User from './user';
import CotopiaButton from '@/components/shared-ui/c-button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isUserAdmin } from '@/lib/utils';
import useAuth from '@/hooks/auth';
import { useWorkspace } from '@/pages/workspace';
import moment from 'moment';

export default function OfflineUsers() {
  const { users, activeRoom } = useWorkspace();

  const allOfflineParticipants = users
    .filter((item) => item.status === 'offline')
    .sort((a, b) => moment(b.last_login).unix() - moment(a.last_login).unix());

  const { workspace_id, room_id } = useRoomContext();
  const { user } = useAuth();

  let finalShowParticipants = [...allOfflineParticipants];

  finalShowParticipants = finalShowParticipants.slice(0, 5);
  const isAdmin = isUserAdmin(user, workspace_id);

  return (
    <TitleEl title={`Recently`}>
      <div className="flex flex-col items-start gap-y-3 mb-6">
        {finalShowParticipants.map((item) => (
          <User user={item} key={item.id} />
        ))}
      </div>
      {isAdmin && activeRoom && (
        <CotopiaButton variant={'outline'} startIcon={<Plus size={16} />}>
          <Link
            target="_blank"
            to={`/workspaces/${workspace_id}/rooms/${activeRoom?.id}/users`}
          >
            Show more
          </Link>
        </CotopiaButton>
      )}
    </TitleEl>
  );
}
