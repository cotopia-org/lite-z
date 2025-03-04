import { __BUS } from '@/const/bus';
import useAuth from '@/hooks/auth';
import useLoading from '@/hooks/use-loading';
import useQueryParams from '@/hooks/use-query-params';
import useSetting from '@/hooks/use-setting';
import { playSoundEffect } from '@/lib/sound-effects';
import { useWorkspace } from '@/pages/workspace';
import { useSocket } from '@/routes/private-wrarpper';
import axiosInstance, { FetchDataType } from '@/services/axios';
import { ScheduleType } from '@/types/calendar';
import { JobType } from '@/types/job';
import { LeaderboardType } from '@/types/leaderboard';
import { PaymentType } from '@/types/payment';
import { WorkspaceRoomJoinType, WorkspaceRoomType } from '@/types/room';

import { UserMinimalType, WorkspaceUserType } from '@/types/user';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dispatch } from 'use-bus';

type LeftJoinType = { room_id: number; user: UserMinimalType };

type Props = {
  children: ReactNode;
  room_id: number;
  workspace_id: number;
};

const RoomCtx = createContext<{
  room_id: number;
  updateParticipants: (participants: UserMinimalType[]) => void;
  room?: WorkspaceRoomType;
  roomLoading?: boolean;
  workspace_id: number;
  livekit_token?: string;
  openSidebar: (node: ReactNode) => void;
  updateUserCoords: (
    username: string,
    position: { x: number; y: number },
  ) => void;
  closeSidebar: () => void;
  sidebar?: ReactNode;
  videoState: boolean;
  audioState: boolean;
  changePermissionState: (key: 'video' | 'audio', newValue: boolean) => void;
  joinRoom: () => void;
  leaderboard: LeaderboardType[];
  scheduled: ScheduleType[];
  workspaceUsers: WorkspaceUserType[];
  workspaceJobs: JobType[];
  workingUsers: WorkspaceUserType[];
  onlineUsers: UserMinimalType[];
  usersHaveJobs: UserMinimalType[];
  usersHaveInProgressJobs: UserMinimalType[];
  payments: PaymentType[];
  showSidebar: boolean;
  showSidebarInMobile: () => void;
  closeSidebarInMobile: () => void;
}>({
  room: undefined,
  updateParticipants: (participants: UserMinimalType[]) => {},
  livekit_token: undefined,
  room_id: 1,
  workspace_id: 1,
  sidebar: undefined,
  updateUserCoords: (username, position) => {},
  openSidebar: (item) => {},
  closeSidebar: () => {},
  audioState: false,
  videoState: false,
  changePermissionState: (key, newValue) => {},
  joinRoom: () => {},
  leaderboard: [],
  scheduled: [],
  workspaceUsers: [],
  workspaceJobs: [],
  workingUsers: [],
  onlineUsers: [],
  usersHaveJobs: [],
  usersHaveInProgressJobs: [],
  payments: [],
  showSidebar: false,
  showSidebarInMobile: () => {},
  closeSidebarInMobile: () => {},
});

export const useRoomContext = () => useContext(RoomCtx);

export function EasyRoomContext({ children }: { children: ReactNode }) {
  const { workspace_id, room_id } = useParams();

  if (!room_id || !workspace_id) return null;

  return (
    <RoomContext room_id={+room_id} workspace_id={+workspace_id}>
      {children}
    </RoomContext>
  );
}

export default function RoomContext({
  children,
  room_id,
  workspace_id,
}: Props) {
  const { user: profile } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const showSidebarInMobile = () => {
    setShowSidebar(true);
  };
  const closeSidebarInMobile = () => {
    setShowSidebar(false);
  };

  const [myPayments, setPayments] = useState<PaymentType[]>([]);
  useEffect(() => {
    Notification.requestPermission();

    async function getPayments() {
      axiosInstance
        .get(`/users/me/payments`)
        .then((res) => setPayments(res.data?.data ?? []));
    }

    getPayments();
  }, []);

  const [room, setRoom] = useState<WorkspaceRoomType>();
  const { startLoading, stopLoading, isLoading } = useLoading();

  const fetchRoom = (roomId: string | number) => {
    startLoading();
    axiosInstance
      .get<FetchDataType<WorkspaceRoomType>>(`/rooms/${roomId}`)
      .then(async (res) => {
        setRoom(res?.data?.data);
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  useEffect(() => {
    fetchRoom(room_id);
  }, [room_id]);

  useSocket('roomUpdated', (data) => {
    setRoom(data);
  });
  useSocket('toggleMegaphone', (data) => {
    const is_megaphone = data?.is_megaphone || false;
    setRoom(data);
    if (is_megaphone) {
      playSoundEffect('megaphoneEnable');
    }
    if (!is_megaphone) {
      playSoundEffect('megaphoneDisable');
    }
    dispatch(__BUS.refreshNodeAudio);
  });

  useSocket(
    'toggleHardMuted',
    (user: UserMinimalType) => {
      setRoom((prev) => {
        let newRoom: WorkspaceRoomType = prev as WorkspaceRoomType;
        newRoom.participants = newRoom?.participants.map((item) => {
          if (item.id === user.id) {
            return user;
          } else {
            return item;
          }
        });
        return newRoom;
      });
    },
    [profile],
  );
  useSocket('timeStarted', (user: UserMinimalType) => {
    setRoom((prev) => {
      let newRoom: WorkspaceRoomType = prev as WorkspaceRoomType;
      newRoom.participants = newRoom?.participants.map((item) => {
        if (item.id === user.id) {
          return { ...user, hasTimeCounted: true };
        } else {
          return item;
        }
      });
      return newRoom;
    });
  });

  useSocket('timeEnded', (user: UserMinimalType) => {
    setRoom((prev) => {
      let newRoom: WorkspaceRoomType = prev as WorkspaceRoomType;
      newRoom.participants = newRoom?.participants.map((item) => {
        if (item.id === user.id) {
          return { ...user, hasTimeCounted: false };
        } else {
          return item;
        }
      });
      return newRoom;
    });
  });

  //Update room object when background changed
  useSocket('roomBackgroundChanged', (data: WorkspaceRoomType) => {
    setRoom((prev) => ({
      ...((prev ?? {}) as WorkspaceRoomType),
      background: data.background,
    }));
  });

  useSocket('userUpdated', (user) => {
    setRoom((prev) => {
      let newRoom: WorkspaceRoomType = prev as WorkspaceRoomType;
      newRoom.participants = newRoom?.participants.map((item) => {
        if (item.id === user.id) return user;
        return item;
      });
      return newRoom;
    });
  });

  const { setActiveRoom, users, leadeboard, schudules } = useWorkspace();

  const { reduxSettings } = useSetting();

  const { query } = useQueryParams();
  const livekit_token = query?.token ?? undefined;

  const socket = useSocket();

  const router = useNavigate();

  const handleJoinRoom = async () => {
    axiosInstance
      .get<FetchDataType<WorkspaceRoomJoinType>>(`/rooms/${room_id}/join`)
      .then((res) => {
        const livekitToken = res.data.data.token; //Getting livekit token from joinObject
        if (livekitToken) {
          if (reduxSettings.sounds.userJoinLeft) playSoundEffect('joined');

          setActiveRoom(room);

          // router(
          //   `/workspaces/${workspace_id}/rooms/${room_id}?token=${livekitToken}`,
          // );
          return;
        }
      });

    dispatch(__BUS.refreshNodeAudio);
  };

  const [permissionState, setPermissionState] = useState({
    audio: true,
    video: true,
  });

  const changePermissionState = (key: 'video' | 'audio', newValue: boolean) => {
    setPermissionState((prev) => ({ ...prev, [key]: newValue }));
  };

  const updateUserCoords = (
    username: string,
    position: { x: number; y: number },
  ) => {
    if (!socket) return;

    if (room === undefined) return;

    const participants = room?.participants ?? [];

    const participant_index = participants.findIndex(
      (x: any) => x.username === username,
    );

    if (participant_index === -1) return setRoom(room);

    participants[participant_index] = {
      ...participants[participant_index],
      coordinates: `${position.x},${position.y}`,
    };

    setRoom({ ...room, participants });

    const sendingObject = {
      room_id: room?.id,
      coordinates: `${position.x},${position.y}`,
      username: participants[participant_index].username,
    };

    socket?.emit('updateCoordinates', sendingObject);
  };

  const [sidebar, setSidebar] = useState<ReactNode>(<></>);
  const openSidebar = (sidebar: ReactNode) => setSidebar(sidebar);
  const closeSidebar = () => setSidebar(undefined);

  useSocket(
    'userLeftFromRoom',
    (data: LeftJoinType) => {
      if (room === undefined) return;

      if (room_id !== data.room_id) return;

      const participants = room?.participants ?? [];

      const newParticipants = participants.filter((x) => x.id !== data.user.id);

      room.participants = newParticipants;

      setRoom(room);
    },
    [room],
  );

  useSocket(
    'userJoinedToRoom',
    (data: LeftJoinType) => {
      if (room === undefined) return;

      if (room_id !== data.room_id) return;

      const participants = room?.participants ?? [];

      room.participants = [...participants, data.user];

      setRoom(room);

      dispatch(__BUS.refreshNodeAudio);
    },
    [room],
  );

  const workpaceJobItems: JobType[] = users
    .filter((x) => x.active_job !== undefined)
    .map((x) => x.active_job as JobType);

  const usersHaveJobs: UserMinimalType[] = [];

  const usersHaveInProgressJobs: UserMinimalType[] = [];

  const workingUsers = users.filter(
    (x) => x.active_job !== null && x.status === 'online',
  );

  const onlineUsers = leadeboard
    .filter(
      (x) =>
        x.user.active === 1 &&
        x.user.status === 'online' &&
        x.user.workspace_id === workspace_id,
    )
    .map((x) => x.user);

  const updateParticipants = (participants: UserMinimalType[]) => {
    setRoom((prev) => ({ ...(prev as WorkspaceRoomType), participants }));
  };

  return (
    <RoomCtx.Provider
      value={{
        room,
        updateParticipants,
        room_id: +room_id,
        workspace_id,
        sidebar,
        closeSidebar,
        openSidebar,
        roomLoading: isLoading,
        updateUserCoords,
        audioState: permissionState.audio,
        videoState: permissionState.video,
        changePermissionState,
        livekit_token: (livekit_token as string) ?? undefined,
        joinRoom: handleJoinRoom,
        leaderboard: leadeboard,
        scheduled: schudules,
        workspaceUsers: users,
        workspaceJobs: workpaceJobItems,
        workingUsers: workingUsers,
        //@ts-ignore
        onlineUsers: onlineUsers,
        usersHaveJobs: usersHaveJobs,
        usersHaveInProgressJobs: usersHaveInProgressJobs,
        payments: myPayments,
        showSidebar,
        showSidebarInMobile,
        closeSidebarInMobile,
      }}
    >
      {children}
    </RoomCtx.Provider>
  );
}
