import RoomSettings from '@/components/shared/room/settings';
import RoomSidebar from '@/components/shared/room/sidebar';
import { cn } from '@/lib/utils';
import { WorkspaceRoomShortType, WorkspaceRoomType } from '@/types/room';
import { createContext, useContext, useEffect, useState } from 'react';
import WorkspaceRoomPage from './rooms/room';
import WorkspaceRootPage from './workspace-root';
import { useLoading, useValues } from '@/hooks';
import { UserMinimalType, WorkspaceUserType } from '@/types/user';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/services/axios';
import { useSocket } from '@/routes/private-wrarpper';
import useAuth from '@/hooks/auth';

type LeftJoinType = { room_id: number; user: UserMinimalType };

const WorkspaceContext = createContext<{
  users: WorkspaceUserType[];
  activeRoom: WorkspaceRoomType | WorkspaceRoomShortType | undefined;
  setActiveRoom: (
    room: WorkspaceRoomType | WorkspaceRoomShortType | undefined,
  ) => void;
  changeUserRoom: (user_id: number, room_id: number) => void;
  workspaceFetchingLoading?: boolean;
}>({
  users: [],
  activeRoom: undefined,
  setActiveRoom: () => {},
  changeUserRoom: () => {},
  workspaceFetchingLoading: false,
});

export const useWorkspace = () => useContext(WorkspaceContext);

export default function WorkspacePage() {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const { user } = useAuth();

  const { workspace_id } = useParams();

  const { values, changeKey } = useValues<{
    activeRoom: WorkspaceRoomType | WorkspaceRoomShortType | undefined;
    users: WorkspaceUserType[];
  }>({ activeRoom: undefined, users: [] });

  const changeUserRoom = (user_id: number, room_id: number | null) => {
    const users = values?.users ?? [];
    const userIndex = users.findIndex((user) => user.id === user_id);
    if (userIndex !== -1) {
      users[userIndex].room_id = room_id;
      changeKey('users', users);
    }
  };

  useEffect(() => {
    async function getWorkspaceUsers(workspace_id: string) {
      startLoading();

      axiosInstance
        .get(`/workspaces/${workspace_id}/users`)
        .then((res) => {
          const users: WorkspaceUserType[] = res.data?.data ?? [];
          //Set workspace users to users
          changeKey('users', users);
          stopLoading();
        })
        .catch((err) => {
          stopLoading();
        });
    }
    if (workspace_id !== undefined) getWorkspaceUsers(workspace_id);
  }, [workspace_id]);

  useSocket(
    'userLeftFromRoom',
    (data: LeftJoinType) => {
      if (data.user.id !== user.id) changeUserRoom(data.user.id, null);
    },
    [user],
  );

  useSocket(
    'userJoinedToRoom',
    (data: LeftJoinType) => {
      changeUserRoom(data.user.id, data.room_id);
    },
    [],
  );

  let mainRoomHolderClss = 'main-room-holder w-full h-screen overflow-hidden';

  let parentSidebarClass = cn(
    'fixed right-0 top-0 bottom-0 w-full md:w-[376px] h-screen overflow-y-auto z-10',
  );

  return (
    <WorkspaceContext.Provider
      value={{
        users: values?.users ?? [],
        changeUserRoom,
        activeRoom: values?.activeRoom,
        setActiveRoom: (room) => changeKey('activeRoom', room),
        workspaceFetchingLoading: isLoading,
      }}
    >
      <div id="lobby-page" className={mainRoomHolderClss}>
        {values?.activeRoom ? <WorkspaceRoomPage /> : <WorkspaceRootPage />}
        <div className={cn(parentSidebarClass, 'border-l')}>
          <RoomSidebar>
            <RoomSettings />
          </RoomSidebar>
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
}
