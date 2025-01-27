import { toast } from 'sonner';
import { useCallback, useEffect, useState } from 'react';
import StreamButton from '../stream-button';
import { VideoIcon, VideoOffIcon } from '@/components/icons';
import useSetting from '@/hooks/use-setting';
import { useMediaContext } from '../../../media-context';
import { useWorkspaceContext } from '@/pages/workspace/workspace-context';

export default function VideoButtonTool() {
  const [navPermission, setNavPermission] = useState(true);

  const { reduxSettings } = useSetting();

  const isAfk = reduxSettings.afk;

  const { permissions, streamLoading } = useWorkspaceContext();

  const { cameraTrack, videoOn, videoOff } = useMediaContext();

  const isUpstreamPaused = cameraTrack?.isMuted ?? true;
  const toggleUpstream = useCallback(async () => {
    if (!navPermission) {
      return toast.error(
        'Access to camera is blocked,please check your browser settings',
      );
    } else if (isAfk) {
      return toast.error('You should first enable Your AFK');
    } else {
      if (!cameraTrack || isUpstreamPaused) {
        videoOn();
      } else {
        videoOff();
      }
    }
  }, [navPermission, isAfk, cameraTrack, isUpstreamPaused, videoOn, videoOff]);

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

  if (!navPermission || !permissions.video) {
    isActive = false;
  }
  if (permissions.video) {
    isActive = true;
  }

  if (cameraTrack?.isMuted) {
    title = 'Video on';
    isActive = false;
  }

  return (
    <StreamButton
      tooltipTitle={title}
      loading={streamLoading}
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
