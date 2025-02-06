import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { colors } from '@/const/varz';
import { cn } from '@/lib/utils';
import { UserMinimalType } from '@/types/user';
import {
  TrackMutedIndicatorProps,
  useTrackMutedIndicator,
} from '@livekit/components-react';
import { Mic, MicOff } from 'lucide-react';

type Props = {
  trackRef: TrackMutedIndicatorProps['trackRef'];
  forceMuted?: boolean;
  className?: string;
  targetUser: UserMinimalType;
  micSize?: number;
};

export default function MicButton({
  trackRef,
  forceMuted = false,
  className = '',
  targetUser,
  micSize = 22,
}: Props) {
  const { isMuted } = useTrackMutedIndicator(trackRef);

  const is_muted = targetUser?.hard_muted;

  return (
    <CotopiaIconButton className={cn('w-8 h-8 text-black/60', className)}>
      {isMuted || forceMuted ? (
        <MicOff
          color={is_muted ? colors.error.default : colors.foreground}
          size={micSize}
        />
      ) : (
        <Mic size={micSize} />
      )}
    </CotopiaIconButton>
  );
}
