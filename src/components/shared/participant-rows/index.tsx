import {
  MicrophoneIcon,
  MirrorScreenIcon,
  VideoIcon,
} from '@/components/icons';
import { WorkspaceUserType } from '@/types/user';
import { ReactNode } from 'react';
import ParticipantsWithPopover from '../participants/with-popover';
import { useRoomContext } from '../room/room-context';
import useAuth from '@/hooks/auth';
import { cn, isUserAdmin } from '@/lib/utils';
import ParticipantBadge from './participant-badges';
import { Crown, Shield } from 'lucide-react';
import ParticipantDetails from '../room/participant-detail';
import { useWorkspace } from '@/pages/workspace';

interface Props {
  participants: WorkspaceUserType[];
}

const ParticipantRows = ({ participants }: Props) => {
  const { users } = useWorkspace();

  const { room_id, workspace_id } = useRoomContext();

  const { user } = useAuth();

  if (participants.length === 0) return null;

  return (
    <div className="w-full flex gap-y-4 flex-col pl-6 pb-5">
      {participants.map((participant) => {
        let has_video = participant.has_video;
        let has_mic = participant.has_mic;
        let has_screen_share = participant.has_screen_share;

        let accessibilities: ReactNode[] = [];

        if (has_video) {
          accessibilities.push(<VideoIcon size={20} />);
        }

        if (has_mic) {
          accessibilities.push(<MicrophoneIcon size={20} />);
        }
        if (has_screen_share) {
          accessibilities.push(<MirrorScreenIcon size={20} />);
        }

        const is_mine = participant.username === user?.username;

        const userActiveJob = participant.active_job?.title ?? 'Idle';

        const findWorkspace = participant?.workspaces?.find(
          (a) => a.id == workspace_id,
        );

        return (
          <div
            key={participant.id}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-x-2">
              <ParticipantsWithPopover
                avatarClss="border border-primary"
                className="!pb-0"
                roomId={room_id}
                participants={[participant]}
                render={(item, content) => {
                  const user = users.find((a) => a.id === item.id);
                  const admin = user ? isUserAdmin(user, workspace_id) : false;
                  const isOwner = findWorkspace
                    ? findWorkspace?.role === 'owner'
                    : false;
                  return (
                    <ParticipantDetails
                      user={user as WorkspaceUserType}
                      roomId={room_id}
                    >
                      <div className="relative">
                        {!!isOwner && (
                          <div className="absolute top-[-4px] right-[-4px] z-10 bg-muted rounded-full text-primary">
                            <Crown size={16} />
                          </div>
                        )}
                        {!!admin && !isOwner && (
                          <div className="absolute top-[-4px] right-[-4px] z-10  bg-muted rounded-full text-primary">
                            <Shield size={16} />
                          </div>
                        )}
                        {content}
                      </div>
                    </ParticipantDetails>
                  );
                }}
              />
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-x-2">
                  <span className="font-semibold text-grayscale-paragraph">
                    {participant.username}
                  </span>
                  {is_mine && <ParticipantBadge title="You" />}
                </div>
                <span
                  className={cn(
                    userActiveJob === 'Idle' ? 'text-yellow-600' : '',
                    'capitalize text-xs',
                  )}
                >
                  {userActiveJob.length > 25
                    ? userActiveJob.slice(0, 25) + '... '
                    : userActiveJob}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-1">{accessibilities}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantRows;
