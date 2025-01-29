'use client';

import RoomContext from './room-context';
import RoomInner from './room-inner';
import { WorkspaceRoomJoinType } from '@/types/room';
import { useCallback, useEffect } from 'react';
import LiveKitConnectionStatus from './connection-status';
import ChatWrapper from '../chat-wrapper';
import { ReactFlowProvider } from '@xyflow/react';
import { toast } from 'sonner';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { useSocket } from '@/routes/private-wrarpper';
import Disconnected from './connection-status/disconnected';
import { useAppDispatch } from '@/store';
import { setToken } from '@/store/slices/livekit-slice';
import LivekitRefactored from '../livekit-refactored';
import { useLoading } from '@/hooks';
import MediaPermissionProvider from '@/pages/workspace/permission-context';

type Props = {
  token?: string;
  workspace_id: number;
  room_id: number;
  isReConnecting?: boolean;
  isSwitching?: boolean;
};

export default function RoomHolder({ workspace_id, room_id }: Props) {
  const reduxDispatch = useAppDispatch();

  const { isLoading, startLoading, stopLoading } = useLoading();

  const socket = useSocket();

  useEffect(() => {
    // const getSettings = async () => {
    //   try {
    //     dispatch({ type: 'START_LOADING' });
    //     const res = await axiosInstance.get('/users/settings');
    //     const settings: { [key: string]: any }[] = res.data.data ?? [];
    //     let videoAccess = settings.find((x) => x.key === 'video');
    //     let audioAccess = settings.find((y) => y.key === 'audio');
    //     let video = videoAccess?.value === 'on' ? true : false;
    //     let audio = audioAccess?.value === 'on' ? true : false;
    //
    //     dispatch({
    //       type: 'CHANGE_VALUES',
    //       payload: {
    //         loading: false,
    //         permissions: { video, audio },
    //       },
    //     });
    //   } catch (error) {
    //     dispatch({ type: 'STOP_LOADING' });
    //   }
    // };
    // getSettings();

    if (socket && socket.connected) {
      handleJoin();
    }
  }, [socket?.connected]);

  let content = null;

  const handleReTry = async (tries = 0, max_tries = 5) => {
    if (tries + 1 === max_tries) {
      toast.error("Couldn't join to the room!");
      window.location.reload();
    } else {
      await new Promise((r) => setTimeout(r, 1500));
      await handleJoin(tries + 1);
    }
  };

  const handleJoin = useCallback(
    async (tries = 0) => {
      startLoading();
      axiosInstance
        .get<FetchDataType<WorkspaceRoomJoinType>>(`/rooms/${room_id}/join`)
        .then((res) => {
          // setMustJoin(true);
          //Setting token in redux for livekit
          stopLoading();
          reduxDispatch(setToken(res.data.data.token));
        })
        .catch((err) => {
          stopLoading();
          handleReTry(tries);
        });
    },
    [room_id],
  );

  if (isLoading) {
    content = (
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

  return (
    <MediaPermissionProvider>
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
    </MediaPermissionProvider>
  );
}
