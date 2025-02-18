import RoomSettings from '@/components/shared/room/settings';
import RoomSidebar from '@/components/shared/room/sidebar';
import { cn, urlWithQueryParams } from '@/lib/utils';
import { WorkspaceRoomShortType, WorkspaceRoomType } from '@/types/room';
import { createContext, useContext, useEffect } from 'react';
import WorkspaceRoomPage from './rooms/room';
import WorkspaceRootPage from './workspace-root';
import { useLoading, useValues } from '@/hooks';
import { UserMinimalType, UserType, WorkspaceUserType } from '@/types/user';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/services/axios';
import { useSocket } from '@/routes/private-wrarpper';
import useAuth from '@/hooks/auth';
import { LeaderboardType } from '@/types/leaderboard';
import { ScheduleType } from '@/types/calendar';
import { ReactFlowProvider } from '@xyflow/react';
import { JobType } from '@/types/job';
import { dispatch } from 'use-bus';
import { __BUS } from '@/const/bus';

type LeftJoinType = { room_id: number; user: UserMinimalType };

const WorkspaceContext = createContext<{
  users: WorkspaceUserType[];
  changeItem: (key: string, value: any) => void;
  changeItems: (values: { [key: string]: any }) => void;
  myJobs: JobType[];
  suggestedJobs: JobType[];
  parentJobs: JobType[];
  activeRoom: WorkspaceRoomType | WorkspaceRoomShortType | undefined;
  setActiveRoom: (
    room: WorkspaceRoomType | WorkspaceRoomShortType | undefined,
  ) => void;
  changeUserRoom: (user_id: number, room_id: number) => void;
  leaveLocalUserFromActiveRoom: () => void;
  workspaceFetchingLoading?: boolean;
  leadeboard: LeaderboardType[];
  schudules: ScheduleType[];
  workspace_id: string;
}>({
  users: [],
  myJobs: [],
  parentJobs: [],
  suggestedJobs: [],
  activeRoom: undefined,
  setActiveRoom: () => {},
  changeUserRoom: () => {},
  leaveLocalUserFromActiveRoom: () => {},
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

  const { values, changeKey, changeBulk } = useValues<{
    activeRoom: WorkspaceRoomType | WorkspaceRoomShortType | undefined;
    users: WorkspaceUserType[];
    leaderboard: LeaderboardType[];
    schedules: ScheduleType[];
    jobs: {
      myJobs: JobType[];
      suggestedJobs: JobType[];
      parentJobs: JobType[];
    };
  }>({
    activeRoom: undefined,
    users: [],
    leaderboard: [],
    schedules: [],
    jobs: {
      myJobs: [],
      suggestedJobs: [],
      parentJobs: [],
    },
  });

  const leaveLocalUserFromActiveRoom = () => {
    const allUsers = [...values.users];
    const user_index = allUsers.findIndex((a) => a.id === user.id);

    if (user_index > -1) {
      allUsers[user_index] = { ...allUsers[user_index], room_id: null };
    }
    changeKey('users', allUsers);
  };

  const changeUserRoom = (user_id: number, room_id: number | null) => {
    const users = values?.users ?? [];
    const userIndex = users.findIndex((user) => user.id === user_id);

    if (userIndex !== -1) {
      users[userIndex].room_id = room_id;
      if (room_id !== null) users[userIndex].status = 'online';
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

    //getting jobs function
    async function getJobs(workspace_id: string) {
      return axiosInstance
        .get(urlWithQueryParams(`/users/me/jobs`, { workspace_id }))
        .then((res) => {
          const jobs: JobType[] = res.data?.data ?? [];
          return jobs;
        });
    }
    //getting parent jobs function
    async function getParentJobs() {
      return axiosInstance.get('/users/mentionedJobs').then((res) => {
        const jobs: JobType[] = res.data?.data ?? [];
        return jobs;
      });
    }
    //getting suggested jobs function
    async function getSuggestedJobs() {
      return axiosInstance
        .get(urlWithQueryParams(`/users/mentionedJobs`, { suggests: true }))
        .then((res) => {
          const jobs: JobType[] = res.data?.data ?? [];
          return jobs;
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
        getJobs(workspace_id),
        getSuggestedJobs(),
        getParentJobs(),
      ])
        .then(
          ([
            schedules,
            leaderboard,
            users,
            jobs,
            suggestedJobs,
            parentJobs,
          ]) => {
            changeKey('schedules', schedules);
            changeKey('leaderboard', leaderboard);
            changeKey('users', users);
            changeBulk({
              jobs: {
                myJobs: jobs,
                suggestedJobs: suggestedJobs,
                parentJobs: parentJobs,
              },
            });

            stopLoading();
          },
        )
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
    [user, changeUserRoom],
  );

  useSocket(
    'userJoinedToRoom',
    (data: LeftJoinType) => {
      console.log('user joined', data);
      changeUserRoom(data.user.id, data.room_id);
    },
    [changeUserRoom],
  );
  useSocket('timeStopped', (data: JobType) => {
    dispatch(__BUS.stopWorkTimer);
  });

  useSocket('timeStarted', (data: JobType) => {
    dispatch(__BUS.startWorkTimer);
  });

  useSocket(
    'jobCreated',
    (job: JobType) => {
      const jobMembers = job?.members || [];

      const isMyJob = jobMembers.map((j) => j.id).includes(user.id);

      const jobsState = values?.jobs || {};

      const myJobs = jobsState?.myJobs || [];

      const lastActiveJob = myJobs.find((j) => j.status === 'in_progress');

      if (isMyJob) {
        const latestJobs = [...myJobs].map((i) => {
          if (lastActiveJob && i.id === lastActiveJob.id) {
            return { ...i, status: 'paused' };
          } else {
            return i;
          }
        });
        const newJobs = [job, ...latestJobs];
        changeBulk({ jobs: { ...jobsState, myJobs: newJobs } });
      }
    },
    [values],
  );
  useSocket(
    'jobSuggested',
    (job: JobType) => {
      const latestJobs = values?.jobs || {};
      const suggestedJobs = latestJobs?.suggestedJobs || [];
      changeBulk({
        jobs: { ...latestJobs, suggestedJobs: [job, ...suggestedJobs] },
      });
    },
    [values],
  );
  useSocket(
    'activeJobUpdated',
    (userData: UserType) => {
      const timeStarted = userData.timeStarted;
      if (!!timeStarted) {
        dispatch(__BUS.startWorkTimer);
      } else {
        dispatch(__BUS.stopWorkTimer);
      }
      const isMyJob = userData.id === user.id;
      if (!isMyJob) {
        const latestUsers = [...values.users];
        const updatedUsers = latestUsers.map((u) => {
          if (u.id === userData.id) {
            return userData;
          } else {
            return u;
          }
        });
        changeKey('users', updatedUsers);
      }
    },
    [values, user],
  );

  let mainRoomHolderClss = 'main-room-holder w-full h-screen overflow-hidden';

  let parentSidebarClass = cn(
    'fixed right-0 top-0 bottom-0 w-full md:w-[376px] h-screen overflow-y-auto z-10',
  );

  return (
    <WorkspaceContext.Provider
      value={{
        users: values?.users ?? [],
        myJobs: values?.jobs?.myJobs ?? [],
        parentJobs: values?.jobs?.parentJobs ?? [],
        suggestedJobs: values?.jobs?.suggestedJobs ?? [],
        changeUserRoom,
        changeItem: changeKey,
        changeItems: changeBulk,
        activeRoom: values?.activeRoom,
        setActiveRoom: (room) => changeKey('activeRoom', room),
        workspaceFetchingLoading: isLoading,
        leadeboard: values?.leaderboard ?? [],
        schudules: values?.schedules ?? [],
        workspace_id: workspace_id as string,
        leaveLocalUserFromActiveRoom,
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
