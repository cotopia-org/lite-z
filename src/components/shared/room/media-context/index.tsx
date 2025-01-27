import { useWorkspaceContext } from '@/pages/workspace/workspace-context';
import { useLocalParticipant } from '@livekit/components-react';
import { LocalTrackPublication, LocalTrack,Track} from 'livekit-client';
import { ReactNode, createContext, useContext } from 'react';
import { toast } from 'sonner';

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

  const audioTrack = publishedAudioTrack?.track;
  const cameraTrack = publishedCameraTrack?.track;

  const {
    enableAudioStream,
    disableAudioStream,
    enableVideoStream,
    disableVideoStream,
  } = useWorkspaceContext();

  const voiceOnHandler = () => {
    try {
      enableAudioStream();
      if (!audioTrack) {
        return localParticipant.setMicrophoneEnabled(true);
      }
      if (audioTrack && audioTrack?.isMuted) {
        return audioTrack.unmute();
      }
    } catch (error) {
      toast.error('An error occurred while turning on the microphone.');
    }
  };
  const voiceOffHandler = () => {
    try {
      disableAudioStream();
      audioTrack?.mute();
      audioTrack?.stop();
    } catch (error) {
      toast.error('An error occurred while turning off the microphone.');
    }
  };
  const videoOnHandler = async () => {
    try {
      enableVideoStream();
      if (!cameraTrack) {
        return localParticipant.setCameraEnabled(true);
      }
      if (cameraTrack && cameraTrack?.isMuted) {
        return cameraTrack.unmute();
      }
    } catch (error) {
      toast.error('An error occurred while turning on the camera.');
    }
  };
  const videoOffHandler = async () => {
    if (!cameraTrack) return toast.error('Not found camera track');
    try {
      disableVideoStream();
      cameraTrack.mute();
      cameraTrack.stop();
    } catch (error) {
      toast.error('An error occurred while turning off the camera.');
    }
  };

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
