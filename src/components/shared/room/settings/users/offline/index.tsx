import TitleEl from '@/components/shared/title-el';
import { useState } from 'react';
import { useRoomContext } from '../../../room-context';
import moment from 'moment';
import * as emoji from 'node-emoji';
import User from './user';
import CotopiaButton from '@/components/shared-ui/c-button';
import { Plus } from 'lucide-react';
import { UserType, WorkspaceUserType } from '@/types/user';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { isUserAdmin } from '@/lib/utils';
import useAuth from '@/hooks/auth';

type Props = {
  allOfflineParticipants: WorkspaceUserType[];
};
export default function OfflineUsers({ allOfflineParticipants }: Props) {
  const [isExpand, setIsExpand] = useState(false);
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
      {isAdmin && (
        <CotopiaButton variant={'outline'} startIcon={<Plus size={16} />}>
          <Link
            target="_blank"
            to={`/workspaces/${workspace_id}/rooms/${room_id}/users`}
          >
            Show more
          </Link>
        </CotopiaButton>
      )}
    </TitleEl>
  );
}
