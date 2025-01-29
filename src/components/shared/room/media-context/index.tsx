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

  console.log(audioTrack, 'AUDIOTRACKs');

  const {
    enableAudioStream,
    disableAudioStream,
    enableVideoStream,
    disableVideoStream,
  } = usePermissionContext();

  const voiceOnHandler = useCallback(() => {
    try {
      enableAudioStream();
      if (!audioTrack) {
        localParticipant.setMicrophoneEnabled(true);
      } else if (audioTrack && audioTrack?.isMuted) {
        audioTrack.unmute();
      }
      dispatch(__BUS.refreshNodeAudio);
    } catch (error) {
      toast.error('An error occurred while turning on the microphone.');
    }
  }, [enableAudioStream, audioTrack, localParticipant]);

  const voiceOffHandler = useCallback(() => {
    try {
      disableAudioStream();
      audioTrack?.mute();
      audioTrack?.stop();

      dispatch(__BUS.refreshNodeAudio);
    } catch (error) {
      toast.error('An error occurred while turning off the microphone.');
    }
  }, [audioTrack, disableAudioStream]);

  const videoOnHandler = useCallback(() => {
    try {
      enableVideoStream();
      if (!cameraTrack) {
        localParticipant.setCameraEnabled(true);
      } else if (cameraTrack && cameraTrack?.isMuted) {
        cameraTrack?.unmute();
      }
    } catch (error) {
      toast.error('An error occurred while turning on the camera.');
    }
  }, [cameraTrack, enableVideoStream, localParticipant]);

  const videoOffHandler = useCallback(() => {
    if (!cameraTrack) return toast.error('Not found camera track');
    try {
      disableVideoStream();
      cameraTrack.mute();
      cameraTrack.stop();
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
