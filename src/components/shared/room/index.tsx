'use client';

import RoomContext from './room-context';
import RoomInner from './room-inner';
import { WorkspaceRoomJoinType } from '@/types/room';
import { useCallback, useEffect, useState } from 'react';
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
import { __BUS } from '@/const/bus';
import useBus, { dispatch } from 'use-bus';

type Props = {
  token?: string;
  workspace_id: number;
  room_id: number;
  isReConnecting?: boolean;
  isSwitching?: boolean;
};

export default function RoomHolder({ workspace_id, room_id }: Props) {
  const reduxDispatch = useAppDispatch();
  const [_, setRefresher] = useState(0);

  useBus(__BUS.refreshRoomHolder, () => {
    setTimeout(() => {
      setRefresher(Math.random() * 20000000);
    }, 200);
  });
  const { isLoading, startLoading, stopLoading } = useLoading();

  const socket = useSocket();

  useEffect(() => {
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
      dispatch(__BUS.refreshNodeAudio);
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
            <LivekitRefactored disconnect={!socket?.connected}>
              {content}
            </LivekitRefactored>
          </RoomContext>
        </ChatWrapper>
      </ReactFlowProvider>
    </MediaPermissionProvider>
  );
}
