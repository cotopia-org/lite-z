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
import { LeaderboardType } from '@/types/leaderboard';
import { ScheduleType } from '@/types/calendar';
import { ReactFlowProvider } from '@xyflow/react';

type LeftJoinType = { room_id: number; user: UserMinimalType };

const WorkspaceContext = createContext<{
  users: WorkspaceUserType[];
  activeRoom: WorkspaceRoomType | WorkspaceRoomShortType | undefined;
  setActiveRoom: (
    room: WorkspaceRoomType | WorkspaceRoomShortType | undefined,
  ) => void;
  changeUserRoom: (user_id: number, room_id: number) => void;
  workspaceFetchingLoading?: boolean;
  leadeboard: LeaderboardType[];
  schudules: ScheduleType[];
  workspace_id: string;
}>({
  users: [],
  activeRoom: undefined,
  setActiveRoom: () => {},
  changeUserRoom: () => {},
  workspaceFetchingLoading: false,
  leadeboard: [],
  schudules: [],
  //@ts-ignore
  workspace_id: undefined,
});

export const useWorkspace = () => useContext(WorkspaceContext);

export default function WorkspacePage() {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const { user } = useAuth();

  const { workspace_id } = useParams();

  const { values, changeKey } = useValues<{
    activeRoom: WorkspaceRoomType | WorkspaceRoomShortType | undefined;
    users: WorkspaceUserType[];
    leaderboard: LeaderboardType[];
    schedules: ScheduleType[];
  }>({ activeRoom: undefined, users: [], leaderboard: [], schedules: [] });

  const changeUserRoom = (user_id: number, room_id: number | null) => {
    const users = values?.users ?? [];
    const userIndex = users.findIndex((user) => user.id === user_id);
    if (userIndex !== -1) {
      users[userIndex].room_id = room_id;
      changeKey('users', users);
    }
  };

  useEffect(() => {
    //schedules getting function
    async function getSchedules(workspace_id: string) {
      return axiosInstance
        .get(`/workspaces/${workspace_id}/schedules`)
        .then((res) => {
          const schedules: ScheduleType[] = res.data?.data ?? [];
          return schedules;
        });
    }

    //leaderboard getting function
    async function getLeaderboard(workspace_id: string) {
      return axiosInstance
        .get(`/workspaces/${workspace_id}/leaderboard`)
        .then((res) => {
          const leaderboard: LeaderboardType[] = res.data?.data ?? [];
          return leaderboard;
        });
    }

    //Workspace users getting function
    async function getWorkspaceUsers(workspace_id: string) {
      return axiosInstance
        .get(`/workspaces/${workspace_id}/users`)
        .then((res) => {
          const users: WorkspaceUserType[] = res.data?.data ?? [];
          return users;
        });
    }

    async function getAllData(workspace_id: string) {
      startLoading();
      Promise.all([
        getSchedules(workspace_id),
        getLeaderboard(workspace_id),
        getWorkspaceUsers(workspace_id),
      ])
        .then(([schedules, leaderboard, users]) => {
          changeKey('schedules', schedules);
          changeKey('leaderboard', leaderboard);
          changeKey('users', users);
          stopLoading();
        })
        .catch((err) => {
          stopLoading();
        });
    }

    if (workspace_id !== undefined) {
      getAllData(workspace_id);
    }
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
        leadeboard: values?.leaderboard ?? [],
        schudules: values?.schedules ?? [],
        workspace_id: workspace_id as string,
      }}
    >
      <ReactFlowProvider>
        <div id="lobby-page" className={mainRoomHolderClss}>
          {values?.activeRoom ? <WorkspaceRoomPage /> : <WorkspaceRootPage />}
          <div className={cn(parentSidebarClass, 'border-l')}>
            <RoomSidebar>
              <RoomSettings />
            </RoomSidebar>
          </div>
        </div>
      </ReactFlowProvider>
    </WorkspaceContext.Provider>
  );
}
