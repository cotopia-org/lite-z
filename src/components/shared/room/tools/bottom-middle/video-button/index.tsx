import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useRoomHolder } from '../../..';
import { toast } from 'sonner';
import { useCallback, useEffect, useState } from 'react';
import StreamButton from '../stream-button';
import { VideoIcon, VideoOffIcon } from '@/components/icons';
import useSetting from '@/hooks/use-setting';

export default function VideoButtonTool() {
  const [navPermission, setNavPermission] = useState(true);

  const { reduxSettings } = useSetting();

  const isAfk = reduxSettings.afk;

  // const {
  //   enableVideoAccess,
  //   disableVideoAccess,
  //   mediaPermissions,
  //   stream_loading,
  // } = useRoomHolder();

  const participant = useLocalParticipant();

  const localParticipant = participant.localParticipant;

  let videoTrack = undefined;

  if (
    localParticipant &&
    typeof localParticipant?.getTrackPublication !== 'undefined'
  ) {
    //@ts-nocheck
    videoTrack = localParticipant?.getTrackPublication(Track.Source.Camera);
  }

  const track = videoTrack?.track;

  const isUpstreamPaused = videoTrack?.isMuted ?? true;

  const toggleUpstream = useCallback(async () => {
    if (!navPermission) {
      return toast.error(
        'Access to camera is blocked,please check your browser settings',
      );
    } else if (isAfk) {
      return toast.error('You should first enable Your AFK');
    } else {
      if (!track) {
        localParticipant.setCameraEnabled(true);
        // enableVideoAccess();
      } else if (isUpstreamPaused) {
        // enableVideoAccess();
        track.unmute();
      } else {
        // disableVideoAccess();
        track.mute();
        track.stop();
      }
    }
  }, [
    isAfk,
    // disableVideoAccess,
    // enableVideoAccess,
    isUpstreamPaused,
    localParticipant,
    navPermission,
    track,
  ]);

  useEffect(() => {
    navigator.permissions.query({ name: 'camera' } as any).then((res) => {
      const permState = res.state;
      if (permState === 'denied') {
        setNavPermission(false);
      } else {
        setNavPermission(true);
      }
    });
  }, []);

  let title = 'Video Off';

  let isActive = false;

  if (!navPermission) {
    title = 'Permission denied';
  }

  // if (!navPermission || !mediaPermissions.video) {
  //   isActive = false;
  // }
  // if (mediaPermissions.video) {
  //   isActive = true;
  // }

  if (track?.isMuted) {
    title = 'Video on';
    isActive = false;
  }

  return (
    <StreamButton
      tooltipTitle={title}
      // loading={stream_loading}
      onClick={toggleUpstream}
      isActive={isActive}
    >
      {({ color }) => {
        let icon = <VideoOffIcon color={color} size={20} />;
        if (!isUpstreamPaused) {
          icon = <VideoIcon color={color} size={20} />;
        }
        return icon;
      }}
    </StreamButton>
  );
}
