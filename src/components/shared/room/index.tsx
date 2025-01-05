'use client';

import RoomContext from './room-context';
import RoomInner from './room-inner';
import { WorkspaceRoomJoinType } from '@/types/room';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import LiveKitConnectionStatus from './connection-status';
// import CheckPermissions2 from './check-permissions-2';
import ChatWrapper from '../chat-wrapper';
import { ReactFlowProvider } from '@xyflow/react';
import { toast } from 'sonner';
import useBus from 'use-bus';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { useSocket } from '@/routes/private-wrarpper';
import { __BUS } from '@/const/bus';
import Disconnected from './connection-status/disconnected';
import { useAppDispatch } from '@/store';
import { setToken } from '@/store/slices/livekit-slice';
import LivekitRefactored from '../livekit-refactored';

type MediaPermission = {
  audio: boolean;
  video: boolean;
};

const DEFAULT_MEDIA_PERMISSIONS = {
  audio: false,
  video: false,
};

const initialState: InitStreamType = {
  loading: false,
  permissions: DEFAULT_MEDIA_PERMISSIONS,
  videoStream: null,
  audioStream: null,
};
const RoomHolderContext = createContext<{
  mediaPermissions: MediaPermission;
  enableVideoAccess: () => void;
  enableAudioAccess: () => void;
  disableVideoAccess: () => void;
  disableAudioAccess: () => void;
  changeStreamState: (stream: MediaStream, type: 'video' | 'audio') => void;
  stream: InitStreamType;
  stream_loading: boolean;
}>({
  mediaPermissions: DEFAULT_MEDIA_PERMISSIONS,
  enableVideoAccess: () => {},
  enableAudioAccess: () => {},
  disableVideoAccess: () => {},
  disableAudioAccess: () => {},
  changeStreamState: () => {},
  stream: initialState,
  stream_loading: false,
});

export const useRoomHolder = () => useContext(RoomHolderContext);

type Props = {
  token?: string;
  workspace_id: number;
  room_id: number;
  isReConnecting?: boolean;
  isSwitching?: boolean;
};

type InitStreamType = {
  loading: boolean;
  permissions: MediaPermission;
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
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

export default function RoomHolder({
  token,
  workspace_id,
  room_id,
  isReConnecting,
  isSwitching,
}: Props) {
  const reduxDispatch = useAppDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);

  const [permissionChecked, setPermissionChecked] = useState(false);
  const [mustJoin, setMustJoin] = useState(false);

  const enableVideoAccess = async () => {
    const audioAccess = state.permissions.audio;
    const audioStream = state.audioStream;
    let perm_obj = { audio: !!(audioAccess && audioStream), video: true };
    try {
      // dispatch({ type: 'START_LOADING' });
      await axiosInstance.post('/settings', { key: 'video', value: 'on' });
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const obj_to_update = {
        loading: false,
        videoStream: stream,
        permissions: perm_obj,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {
      // dispatch({ type: 'STOP_LOADING' });
    }
  };
  const disableVideoAccess = async () => {
    const audioAccess = state.permissions.audio;
    const audioStream = state.audioStream;
    const videoStream = state.videoStream;
    if (!videoStream) return;
    let perm_obj = { audio: !!(audioAccess && audioStream), video: false };
    try {
      // dispatch({ type: 'START_LOADING' });
      await axiosInstance.post('/settings', { key: 'video', value: 'off' });
      const videoTracks = videoStream.getTracks();
      videoTracks.forEach((track) => {
        track.stop();
      });
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
        //@ts-ignore
        videoStream: null,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {
      // dispatch({ type: 'STOP_LOADING' });
    }
  };
  const enableAudioAccess = async () => {
    const videoAccess = state.permissions.video;
    const videoStream = state.videoStream;
    let perm_obj = { video: !!(videoAccess && videoStream), audio: true };
    try {
      // dispatch({ type: 'START_LOADING' });
      await axiosInstance.post('/settings', { key: 'audio', value: 'on' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
        audioStream: stream,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {
      // dispatch({ type: 'STOP_LOADING' });
    }
  };
  const disableAudioAccess = async () => {
    const videoAccess = state.permissions.video;
    const videoStream = state.videoStream;
    const audioStream = state.audioStream;
    if (!audioStream) return;
    let perm_obj = { video: !!(videoAccess && videoStream), audio: false };
    try {
      // dispatch({ type: 'START_LOADING' });
      await axiosInstance.post('/settings', { key: 'audio', value: 'off' });
      const audioTracks = audioStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.stop();
      });
      const obj_to_update = {
        loading: false,
        permissions: perm_obj,
        //@ts-ignore
        audioStream: null,
      };
      dispatch({ type: 'CHANGE_VALUES', payload: obj_to_update });
    } catch (error) {
      // dispatch({ type: 'STOP_LOADING' });
    }
  };
  const changeStreamState = (stream: MediaStream, type: 'video' | 'audio') => {
    let key = '';
    if (type === 'video') key = 'videoStream';
    if (type === 'audio') key = 'audioStream';
    if (!key) return;
    dispatch({ type: 'CHANGE_VALUES', payload: { [key]: stream } });
  };

  const socket = useSocket();

  useEffect(() => {
    // const getSettings = async () => {
    //   try {
    //     dispatch({ type: "START_LOADING" });
    //     const res = await axiosInstance.get("/users/settings");
    //     const settings: { [key: string]: any }[] = res.data.data ?? [];
    //     let videoAccess = settings.find((x) => x.key === "video");
    //     let audioAccess = settings.find((y) => y.key === "audio");
    //     let video = videoAccess?.value === "on" ? true : false;
    //     let audio = audioAccess?.value === "on" ? true : false;
    //     dispatch({
    //       type: "CHANGE_VALUES",
    //       payload: {
    //         loading: false,
    //         permissions: { false, false },
    //       },
    //     });
    //   } catch (error) {
    //     dispatch({ type: "STOP_LOADING" });
    //   }
    // };
    // getSettings();

    if (socket && socket.connected) {
      handleJoin();
    }
  }, [socket]);

  let content = null;

  const handleReTry = async (tries = 0, max_tries = 5) => {
    if (tries + 1 === max_tries) {
      toast.error("Couldn't join to the room!");
      dispatch({ type: 'STOP_LOADING' });
      window.location.reload();
    } else {
      await new Promise((r) => setTimeout(r, 1500));

      await handleJoin(tries + 1);
    }
  };

  const handleJoin = useCallback(
    async (tries = 0) => {
      dispatch({ type: 'START_LOADING' });

      axiosInstance
        .get<FetchDataType<WorkspaceRoomJoinType>>(`/rooms/${room_id}/join`)
        .then((res) => {
          setPermissionChecked(true);
          setMustJoin(true);
          //Setting token in redux for livekit
          reduxDispatch(setToken(res.data.data.token));
          dispatch({ type: 'STOP_LOADING' });
        })
        .catch((err) => {
          handleReTry(tries);

          // toast.error("Couldn't join to the room!");
        });
    },
    [room_id],
  );

  // const handlePassed =
  //   permissionChecked === false && !isReConnecting && !isSwitching;

  useBus(
    __BUS.rejoinRoom,
    () => {
      if (permissionChecked === true || isSwitching || isReConnecting) {
        handleJoin(0);
      }
    },
    [permissionChecked, isSwitching, isReConnecting],
  );
  if (!mustJoin || state.loading) {
    return (
      <div
        className={
          'items-center justify-center flex text-4xl text-muted bg-slate-400 h-full min-h-screen'
        }
      >
        <p>Please wait...</p>
      </div>
    );
  } else {
    content = (
      <>
        <LiveKitConnectionStatus />
        <RoomInner />
      </>
    );
  }

  // if (!mustJoin) content = <CheckPermissions2 onChecked={handleJoin} />;

  return (
    <RoomHolderContext.Provider
      value={{
        mediaPermissions: {
          video: state.permissions.video,
          audio: state.permissions.audio,
        },
        stream_loading: state.loading,
        changeStreamState,
        enableAudioAccess,
        enableVideoAccess,
        disableAudioAccess,
        disableVideoAccess,
        stream: state,
      }}
    >
      <ReactFlowProvider>
        <ChatWrapper>
          <RoomContext room_id={room_id} workspace_id={workspace_id}>
            {socket?.connected === false && (
              <Disconnected onReTry={handleReTry} />
            )}
            <LivekitRefactored>{content}</LivekitRefactored>
          </RoomContext>
        </ChatWrapper>
      </ReactFlowProvider>
    </RoomHolderContext.Provider>
  );
}
