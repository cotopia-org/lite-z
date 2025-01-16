import CotopiaTooltip from '@/components/shared-ui/c-tooltip';
import ParticipantDetails from '../../room/participant-detail';
import { UserMinimalType, WorkspaceUserType } from '@/types/user';
import { useParticipantTileCtx } from '../participant-tile-provider';
import { useRoomContext } from '../../room/room-context';
import WithConnectionQuality from '@/routes/private-wrarpper/components/session/with-connection-quality';
import VoiceAreaHearing from '@/routes/private-wrarpper/components/session/wrapper/voice-area-hearing';
import RfUserTileContent from './content';
import AfkLayer from '../afk';
import GhostLayer from '../ghost';

interface Props {
  isDragging: boolean;
  meet: boolean;
}

const UserCircle = ({ isDragging, meet }: Props) => {
  const { userFullName, targetUser, quality, ref, htmlProps } =
    useParticipantTileCtx();

  const { room } = useRoomContext();

  return (
    <CotopiaTooltip title={userFullName}>
      <ParticipantDetails
        roomId={room?.id as number}
        user={targetUser as WorkspaceUserType | UserMinimalType}
      >
        <WithConnectionQuality quality={quality}>
          {targetUser?.status !== 'afk' && (
            <VoiceAreaHearing isDragging={isDragging} />
          )}
          <div
            ref={ref}
            style={{
              position: 'relative',
            }}
            {...htmlProps}
          >
            <RfUserTileContent meet={meet} />
          </div>
        </WithConnectionQuality>
      </ParticipantDetails>
    </CotopiaTooltip>
  );
};

export default UserCircle;
