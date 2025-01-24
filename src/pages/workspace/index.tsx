import FullLoading from '@/components/shared/full-loading';
import RoomSettings from '@/components/shared/room/settings';
import RoomSidebar from '@/components/shared/room/sidebar';
import { useApi } from '@/hooks/swr';
import useSetting from '@/hooks/use-setting';
import { cn } from '@/lib/utils';
import { FetchDataType } from '@/services/axios';
import { WorkspaceType } from '@/types/workspace';
import { createContext, useContext, useReducer } from 'react';
import { useParams } from 'react-router-dom';
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

const WorkspaceContext = createContext<{
  permissions: MediaPermission;
  stream: InitStreamType;
  streamLoading: boolean;
  enableAudioStream: () => Promise<{ stream?: MediaStream }>;
  enableVideoStream: () => Promise<{ stream?: MediaStream }>;
  disableAudioStream: () => Promise<{
    audioTracks?: MediaStreamTrack[];
  }>;
  disableVideoStream: () => Promise<{
    videoTracks?: MediaStreamTrack[];
  }>;
}>({
  stream: initialState,
  streamLoading: false,
  permissions: DEFAULT_MEDIA_PERMISSIONS,
  enableAudioStream: async () => ({}),
  enableVideoStream: async () => ({}),
  disableAudioStream: async () => ({}),
  disableVideoStream: async () => ({}),
});

export const useWorkspaceContext = () => useContext(WorkspaceContext);

export default function WorkspacePage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    enableAudioSetting,
    enableVideoSetting,
    disableAudioSetting,
    disableVideoSetting,
  } = useSetting();

  const params = useParams();
  const { data, isLoading } = useApi<FetchDataType<WorkspaceType>>(
    `/workspaces/${params.workspace_id}`,
  );

  const enableAudioStream = async () => {
    dispatch({ type: 'START_LOADING' });
    const videoAccess = state.permissions.video;
    const videoStream = state.videoStream;
    const audioStream = state.audioStream;
    if (audioStream) {
      toast.error('Audio stream already exists');
      dispatch({ type: 'STOP_LOADING' });
      return { stream: audioStream };
    }
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
      return { stream };
    } catch (error) {
      dispatch({ type: 'STOP_LOADING' });
      return { stream: undefined };
    }
  };

  const disableAudioStream = async () => {
    dispatch({ type: 'START_LOADING' });
    const videoAccess = state.permissions.video;
    const videoStream = state.videoStream;
    const audioStream = state.audioStream;
    if (!audioStream) {
      toast.error('No audio stream found');
      dispatch({ type: 'STOP_LOADING' });
      return { audioTracks: [] };
    }
    let perm_obj = { video: !!(videoAccess && videoStream), audio: false };
    try {
      await disableAudioSetting();
      const audioTracks = audioStream.getAudioTracks();
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
        audioStream: null,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
      return { audioTracks };
    } catch (error) {
      dispatch({ type: 'STOP_LOADING' });
      return { audioTrakcs: [] };
    }
  };

  const enableVideoStream = async () => {
    const audioAccess = state.permissions.audio;
    const audioStream = state.audioStream;
    const videoStream = state.videoStream;
    dispatch({ type: 'START_LOADING' });
    if (videoStream) {
      toast.error('Video stream already exists');
      dispatch({ type: 'STOP_LOADING' });
      return { stream: videoStream };
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
      return { stream };
    } catch (error) {
      dispatch({ type: 'STOP_LOADING' });
      return { stream: undefined };
    }
  };

  const disableVideoStream = async () => {
    dispatch({ type: 'START_LOADING' });
    const audioAccess = state.permissions.audio;
    const audioStream = state.audioStream;
    const videoStream = state.videoStream;
    if (!videoStream) {
      dispatch({ type: 'STOP_LOADING' });
      toast.error('No vidoe stream found');
      return { videoTracks: [] };
    }
    let perm_obj = { audio: !!(audioAccess && audioStream), video: false };
    try {
      disableVideoSetting();
      const videoTracks = videoStream.getTracks();
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
        videoStream: null,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
      return { videoTracks };
    } catch (error) {
      dispatch({ type: 'STOP_LOADING' });
      return { videoTracks: [] };
    }
  };
  const workspace = data !== undefined ? data?.data : null;

  if (data === undefined || isLoading) return <FullLoading />;

  if (workspace === null) return null;

  let mainRoomHolderClss = 'main-room-holder w-full h-screen overflow-hidden';

  let parentSidebarClass = cn(
    'fixed right-0 top-0 bottom-0 w-full md:w-[376px] h-screen overflow-y-auto z-10',
  );

  return (
    <WorkspaceContext.Provider
      value={{
        stream: state,
        permissions: state.permissions,
        streamLoading: state.loading,
        enableAudioStream,
        disableAudioStream,
        enableVideoStream,
        disableVideoStream,
      }}
    >
      <div id="lobby-page" className={mainRoomHolderClss}>
        <div className="relative p-8">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">{workspace.title}</h1>
            <p>{workspace.description}</p>
          </div>
        </div>
        <div className={cn(parentSidebarClass, 'border-l')}>
          <RoomSidebar>
            <RoomSettings />
          </RoomSidebar>
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
}
