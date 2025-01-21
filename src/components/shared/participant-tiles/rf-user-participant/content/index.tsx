import CotopiaAvatar from '@/components/shared-ui/c-avatar';
import { useParticipantTileCtx } from '../../participant-tile-provider';
import RfUserTileActions from '../actions';
import VideoTrackHandler from '../video-handler';
import AfkLayer from '../../afk';
import GhostLayer from '../../ghost';
import { useRoomContext } from '@/components/shared/room/room-context';

interface Props {
  meet: boolean;
}

const RfUserTileContent = ({ meet }: Props) => {
  const { trackType, targetUser, livekitIdentity, userFullName, isSpeaking } =
    useParticipantTileCtx();

  const { room } = useRoomContext();

  const is_megaphone = !!room?.is_megaphone;

  let clss =
    'relative z-[10] user-circle transition-all w-full h-full [&_.lk-participant-tile]:!absolute [&_.lk-participant-tile]:w-full [&_.lk-participant-tile]:h-full [&_.lk-participant-tile]:top-0 [&_.lk-participant-tile]:left-0 rounded-full p-1 [&_video]:h-full [&_video]:object-cover [&_video]:rounded-full [&_video]:h-full [&_video]:w-full w-[96px] h-[96px] flex flex-col items-center justify-center';
  let showAvatar = true;

  let trackContent: any = null;

  if (trackType === 'video' && meet) showAvatar = false;

  //Scale down the user profile if user isn't in user's area
  if (!meet) clss += ` scale-[0.6]`;

  //Highlight user circle in different states
  if (isSpeaking && meet) {
    clss += ` bg-green-700`;
  }

  if (!isSpeaking) {
    clss += ` bg-black/10`;
  }

  if (!meet) {
    clss += ` bg-gray-600`;
  }

  if (is_megaphone) {
    clss += ' scale-100';
  }
  // if (trackType === 'audio') {
  //   trackContent = <AudioTrackHandler />;
  // }
  if (trackType === 'video') {
    trackContent = <VideoTrackHandler />;
  }

  const hasUserTileActions =
    targetUser?.status !== 'afk' && targetUser?.status !== 'ghost';

  return (
    <div className={clss}>
      <div className="relative w-[86px]  h-[86px] rounded-full flex flex-col items-center justify-center overflow-hidden z-[1]">
        {targetUser?.status === 'afk' && <AfkLayer />}
        {targetUser?.status === 'ghost' && <GhostLayer />}
        {showAvatar && (
          <CotopiaAvatar
            date={targetUser?.created_at}
            className="absolute top-0 left-0 w-full h-full z-[1] text-3xl"
            src={targetUser?.avatar?.url ?? ''}
            title={
              targetUser?.status === 'afk'
                ? ''
                : (userFullName?.[0] ?? livekitIdentity?.[0])
            }
          />
        )}
        {trackContent}
      </div>
      <div className="absolute bottom-0 right-0 z-[2]">
        {hasUserTileActions && <RfUserTileActions />}
      </div>
    </div>
  );
};

export default RfUserTileContent;
