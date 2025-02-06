import { __BUS } from '@/const/bus';
import { usePermissionContext } from '@/pages/workspace/permission-context';
import { useLocalParticipant } from '@livekit/components-react';
import { LocalTrackPublication, LocalTrack, Track } from 'livekit-client';
import {
  ReactNode,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import { dispatch } from 'use-bus';

type Props = { children: ReactNode };

const MediaContext = createContext<{
  voiceOn: () => void;
  voiceOff: () => void;
  videoOn: () => void;
  videoOff: () => void;
  publishedAudioTrack?: LocalTrackPublication;
  publishedVideoTrack?: LocalTrackPublication;
  audioTrack?: LocalTrack;
  cameraTrack?: LocalTrack;
}>({
  voiceOn: () => {},
  voiceOff: () => {},
  videoOff: () => {},
  videoOn: () => {},
  audioTrack: undefined,
  cameraTrack: undefined,
  publishedAudioTrack: undefined,
  publishedVideoTrack: undefined,
});

export const useMediaContext = () => useContext(MediaContext);

const MediaContextProvider = ({ children }: Props) => {
  const [_, setRefresher] = useState(0);
  const participant = useLocalParticipant();

  const localParticipant = participant.localParticipant;

  const voiceTrack = localParticipant?.getTrackPublication(
    Track.Source.Microphone,
  );
  const videoTrack = localParticipant?.getTrackPublication(Track.Source.Camera);

  const publishedAudioTrack = voiceTrack;
  const publishedCameraTrack = videoTrack;

  const audioTrack = useMemo(() => {
    return publishedAudioTrack?.track;
  }, [publishedAudioTrack]);

  const cameraTrack = useMemo(() => {
    return publishedCameraTrack?.track;
  }, [publishedCameraTrack]);

  const refreshTracksHandler = () => {
    setTimeout(() => {
      dispatch(__BUS.refreshNodeAudio);
      dispatch(__BUS.refreshRoomHolder);
      setRefresher(Math.round(Math.random() * 200000000));
    }, 200);
  };

  const {
    enableAudioStream,
    disableAudioStream,
    enableVideoStream,
    disableVideoStream,
  } = usePermissionContext();

  const voiceOnHandler = useCallback(async () => {
    try {
      await enableAudioStream();
      if (!audioTrack) {
        localParticipant.setMicrophoneEnabled(true);
      } else if (audioTrack && audioTrack?.isMuted) {
        audioTrack.unmute();
      }
      refreshTracksHandler();
    } catch (error) {
      toast.error('An error occurred while turning on the microphone.');
    }
  }, [enableAudioStream, audioTrack, localParticipant]);

  const voiceOffHandler = useCallback(async () => {
    try {
      await disableAudioStream();
      audioTrack?.mute();
      audioTrack?.stop();
      refreshTracksHandler();
    } catch (error) {
      toast.error('An error occurred while turning off the microphone.');
    }
  }, [audioTrack, disableAudioStream]);

  const videoOnHandler = useCallback(async () => {
    try {
      await enableVideoStream();
      if (!cameraTrack) {
        localParticipant.setCameraEnabled(true);
      } else if (cameraTrack && cameraTrack?.isMuted) {
        cameraTrack?.unmute();
      }
      refreshTracksHandler();
    } catch (error) {
      toast.error('An error occurred while turning on the camera.');
    }
  }, [cameraTrack, enableVideoStream, localParticipant]);

  const videoOffHandler = useCallback(async () => {
    if (!cameraTrack) return toast.error('Not found camera track');
    try {
      await disableVideoStream();
      cameraTrack.mute();
      cameraTrack.stop();
      refreshTracksHandler();
    } catch (error) {
      toast.error('An error occurred while turning off the camera.');
    }
  }, [cameraTrack, disableVideoStream]);

  return (
    <MediaContext.Provider
      value={{
        voiceOn: voiceOnHandler,
        voiceOff: voiceOffHandler,
        videoOn: videoOnHandler,
        videoOff: videoOffHandler,
        audioTrack: audioTrack,
        cameraTrack: cameraTrack,
        publishedAudioTrack: publishedAudioTrack,
        publishedVideoTrack: publishedCameraTrack,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaContextProvider;
