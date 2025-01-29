import useSetting from '@/hooks/use-setting';
import axiosInstance from '@/services/axios';
import { ReactNode, createContext, useContext, useReducer } from 'react';
import { toast } from 'sonner';

type MediaPermission = {
  audio: boolean;
  video: boolean;
};

const DEFAULT_MEDIA_PERMISSIONS = {
  audio: false,
  video: false,
};

type InitStreamType = {
  loading: boolean;
  permissions: MediaPermission;
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
};

const initialState: InitStreamType = {
  loading: false,
  permissions: DEFAULT_MEDIA_PERMISSIONS,
  videoStream: null,
  audioStream: null,
};

type StreamActionType =
  | { type: 'CHANGE_PERMISSION'; payload: { audio: boolean; video: boolean } }
  | { type: 'START_LOADING' }
  | { type: 'STOP_LOADING' }
  | { type: 'CHANGE_VALUES'; payload: { [key: string]: any } };

const reducer = (state: InitStreamType, action: StreamActionType) => {
  switch (action.type) {
    case 'CHANGE_PERMISSION':
      const permissions = action.payload;
      return { ...state, permissions };
    case 'CHANGE_VALUES':
      return { ...state, ...action.payload };
    case 'START_LOADING':
      return { ...state, loading: true };
    case 'STOP_LOADING':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PermissionContext = createContext<{
  permissions: MediaPermission;
  stream: InitStreamType;
  streamLoading: boolean;
  enableAudioStream: () => void;
  enableVideoStream: () => void;
  disableAudioStream: () => void;
  disableVideoStream: () => void;
  resetStreamHandler: () => void;
}>({
  stream: initialState,
  streamLoading: false,
  permissions: DEFAULT_MEDIA_PERMISSIONS,
  enableAudioStream: () => {},
  enableVideoStream: () => {},
  disableAudioStream: () => {},
  disableVideoStream: () => {},
  resetStreamHandler: () => {},
});

export const usePermissionContext = () => useContext(PermissionContext);

export default function MediaPermissionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    enableAudioSetting,
    enableVideoSetting,
    disableAudioSetting,
    disableVideoSetting,
  } = useSetting();

  const enableAudioStream = async () => {
    dispatch({ type: 'START_LOADING' });
    const videoAccess = state.permissions.video;
    const videoStream = state.videoStream;

    let perm_obj = { video: !!(videoAccess && videoStream), audio: true };
    try {
      await enableAudioSetting();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
        audioStream: stream,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {
      dispatch({ type: 'STOP_LOADING' });
    }
  };

  const disableAudioStream = async () => {
    dispatch({ type: 'START_LOADING' });
    const videoAccess = state.permissions.video;
    const videoStream = state.videoStream;
    const audioStream = state.audioStream;
    let perm_obj = { video: !!(videoAccess && videoStream), audio: false };
    try {
      await disableAudioSetting();
      const audioTracks = audioStream?.getAudioTracks() || [];
      audioTracks.forEach((track) => {
        track.stop();
      });
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
        audioStream: null,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {
      dispatch({ type: 'STOP_LOADING' });
    }
  };

  const enableVideoStream = async () => {
    const audioAccess = state.permissions.audio;
    const audioStream = state.audioStream;
    const videoStream = state.videoStream;
    dispatch({ type: 'START_LOADING' });
    if (videoStream) {
      dispatch({ type: 'STOP_LOADING' });
      return toast.error('Video stream already exists');
    }
    let perm_obj = { audio: !!(audioAccess && audioStream), video: true };
    try {
      await enableVideoSetting();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const obj_to_update = {
        loading: false,
        videoStream: stream,
        permissions: perm_obj,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {
      dispatch({ type: 'STOP_LOADING' });
    }
  };

  const disableVideoStream = async () => {
    dispatch({ type: 'START_LOADING' });
    const audioAccess = state.permissions.audio;
    const audioStream = state.audioStream;
    const videoStream = state.videoStream;
    if (!videoStream) {
      dispatch({ type: 'STOP_LOADING' });
      return toast.error('No vidoe stream found');
    }
    let perm_obj = { audio: !!(audioAccess && audioStream), video: false };
    try {
      disableVideoSetting();
      const videoTracks = videoStream.getTracks();
      videoTracks.forEach((track) => {
        track.stop();
      });
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
        videoStream: null,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {
      dispatch({ type: 'STOP_LOADING' });
    }
  };

  const resetStreamHandler = async () => {
    const videoAccess = state.permissions.video;
    const audioAccess = state.permissions.audio;
    const vStream = state.videoStream;
    const aStream = state.audioStream;
    const video_perm = !!(videoAccess && vStream);
    const audio_perm = !!(audioAccess && aStream);
    let perm_obj = {
      video: video_perm,
      audio: audio_perm,
    };
    try {
      await axiosInstance.post('/settings', {
        key: 'audio',
        value: audio_perm ? 'on' : 'off',
      });
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {}
  };

  return (
    <PermissionContext.Provider
      value={{
        stream: state,
        permissions: state.permissions,
        streamLoading: state.loading,
        enableAudioStream,
        disableAudioStream,
        enableVideoStream,
        disableVideoStream,
        resetStreamHandler,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}
