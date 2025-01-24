import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { toast } from 'sonner';
import StreamButton from '../stream-button';
import { MicIcon, MicOffIcon } from '@/components/icons';
import { useCallback, useEffect, useState } from 'react';
import useAuth from '@/hooks/auth';
import { useSocket } from '@/routes/private-wrarpper';
import useSetting from '@/hooks/use-setting';

export default function VoiceButtonTool() {
  const { user } = useAuth();

  const [browserPermission, setBrowserPermission] = useState(true);

  const { reduxSettings } = useSetting();

  const isAfk = reduxSettings.afk;

  // const { disableAudioAccess, mediaPermissions, stream_loading } =
  //   useRoomHolder();

  const participant = useLocalParticipant();

  const localParticipant = participant.localParticipant;
  let voiceTrack = undefined;
  if (
    localParticipant &&
    typeof localParticipant?.getTrackPublication !== 'undefined'
  ) {
    //@ts-nocheck
    voiceTrack = localParticipant?.getTrackPublication(Track.Source.Microphone);
  }

  const track = voiceTrack?.track;
  const isMuted = voiceTrack?.isMuted ?? true;

  const toggleMute = useCallback(async () => {
    if (!browserPermission) {
      return toast.error(
        'Access to microphone is blocked,please check your browser settings',
      );
    } else if (isAfk) {
      return toast.error('You should first enable your AFK');
    } else {
      if (!track) {
        localParticipant.setMicrophoneEnabled(true);
        // enableAudioAccess();
      } else if (track.isMuted) {
        track.unmute();
        // enableAudioAccess();
      } else {
        track.mute();
        track.stop();
        // disableAudioAccess();
      }
    }
  }, [browserPermission, isAfk, track, localParticipant]);

  useSocket(
    'userUpdated',
    (updatedUser) => {
      if (track === undefined) return;
      if (updatedUser.id === user.id && updatedUser.status === 'afk') {
        track.mute();
        track.stop();
        // disableAudioAccess();
      }
    },
    [track, user?.id],
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
  // if (!browserPermission || !mediaPermissions.audio) {
  //   isActive = false;
  // }
  // if (mediaPermissions.audio && !isMuted) {
  //   isActive = true;
  // }
  if (track?.isMuted) title = 'Mic on';
  return (
    <StreamButton
      onClick={toggleMute}
      tooltipTitle={title}
      // loading={stream_loading}
      isActive={isActive}
    >
      {({ color }) => {
        let icon = <MicOffIcon color={color} size={20} />;
        if (!isMuted) {
          icon = <MicIcon color={color} size={20} />;
        }
        return icon;
      }}
    </StreamButton>
  );
}
