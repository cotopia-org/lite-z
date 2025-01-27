import { toast } from 'sonner';
import StreamButton from '../stream-button';
import { MicIcon, MicOffIcon } from '@/components/icons';
import { useEffect, useState } from 'react';
import useAuth from '@/hooks/auth';
import { useSocket } from '@/routes/private-wrarpper';
import useSetting from '@/hooks/use-setting';
import { useMediaContext } from '../../../media-context';
import { useWorkspaceContext } from '@/pages/workspace/workspace-context';
import { useRoomContext } from '../../../room-context';
import { LockIcon } from 'lucide-react';

export default function VoiceButtonTool() {
  const { user } = useAuth();

  const [browserPermission, setBrowserPermission] = useState(true);

  const { room } = useRoomContext();

  const userNode = room?.participants.find((p) => p?.id === user?.id);

  const hard_muted = userNode?.hard_muted;

  const { reduxSettings } = useSetting();

  const { voiceOn, voiceOff, audioTrack } = useMediaContext();

  const { permissions, streamLoading } = useWorkspaceContext();

  const isMuted = audioTrack?.isMuted ?? true;

  const isAfk = reduxSettings.afk;

  const toggleMute = () => {
    if (!browserPermission) {
      return toast.error(
        'Access to microphone is blocked,please check your browser settings',
      );
    }

    if (hard_muted) {
      return toast.error(
        'You have been muted by the admin. Please wait until they unmute you.',
      );
    }
    if (isAfk) {
      return toast.error('You should first enable your AFK');
    }
    if (!audioTrack || isMuted) {
      voiceOn();
    } else {
      voiceOff();
    }
  };

  useSocket(
    'userUpdated',
    (updatedUser) => {
      if (audioTrack === undefined) return;
      if (updatedUser?.id === user?.id && updatedUser?.status === 'afk') {
        voiceOff();
      }
    },
    [audioTrack, user?.id],
  );

  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' } as any).then((res) => {
      const permState = res.state;
      if (permState === 'denied') {
        setBrowserPermission(false);
      } else {
        setBrowserPermission(true);
      }
    });
  }, []);

  let title = 'Mic Off';
  let isActive = false;
  if (!browserPermission) {
    title = 'Permission denied';
  }
  if (!browserPermission || !permissions.audio) {
    isActive = false;
  }
  if (permissions.audio && !isMuted) {
    isActive = true;
  }
  if (isMuted) title = 'Mic on';

  return (
    <StreamButton
      onClick={toggleMute}
      tooltipTitle={title}
      loading={streamLoading}
      isActive={isActive}
      {...(hard_muted && { className: 'opacity-50 relative' })}
    >
      {({ color }) => {
        const lock_node = (
          <div className="absolute top-[3px] right-[3px]">
            <LockIcon size={8} color={color} />
          </div>
        );

        let icon = <MicOffIcon color={color} size={20} />;
        if (!isMuted) {
          icon = <MicIcon color={color} size={20} />;
        }
        return (
          <>
            {(hard_muted && lock_node) || null}
            {icon}
          </>
        );
      }}
    </StreamButton>
  );
}
