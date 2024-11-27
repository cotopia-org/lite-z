import { useApi } from "@/hooks/swr";
import useLoading from "@/hooks/use-loading";
import useQueryParams from "@/hooks/use-query-params";
import useSetting from "@/hooks/use-setting";
import { playSoundEffect } from "@/lib/sound-effects";
import { useSocket } from "@/routes/private-wrarpper";
import axiosInstance, { FetchDataType } from "@/services/axios";
import { ScheduleType } from "@/types/calendar";
import { JobType } from "@/types/job";
import { LeaderboardType } from "@/types/leaderboard";
import { WorkspaceRoomJoinType, WorkspaceRoomType } from "@/types/room";
import {
  LivekitTrackPublishedType,
  updateCoordinatesEvent,
} from "@/types/socket";
import { UserMinimalType, WorkspaceUserType } from "@/types/user";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type LeftJoinType = { room_id: number; user: UserMinimalType };

type Props = {
  children: ReactNode;
  room_id: number;
  workspace_id?: string;
};

const DEFAULT_OBJECT_POSITION = { x: 200, y: 200 };

const RoomCtx = createContext<{
  room_id: number;
  room?: WorkspaceRoomType;
  workspace_id?: string;
  livekit_token?: string;
  openSidebar: (node: ReactNode) => void;
  updateUserCoords: (
    username: string,
    position: { x: number; y: number }
  ) => void;
  closeSidebar: () => void;
  sidebar?: ReactNode;
  videoState: boolean;
  audioState: boolean;
  changePermissionState: (key: "video" | "audio", newValue: boolean) => void;
  joinRoom: () => void;
  leaderboard: LeaderboardType[];
  scheduled: ScheduleType[];
  workspaceUsers: WorkspaceUserType[];
  workspaceJobs: JobType[];
  workingUsers: WorkspaceUserType[];
  onlineUsers: UserMinimalType[];
  usersHaveJobs: UserMinimalType[];
  usersHaveInProgressJobs: UserMinimalType[];
}>({
  room: undefined,
  livekit_token: undefined,
  room_id: 1,
  workspace_id: undefined,
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
});

export const useRoomContext = () => useContext(RoomCtx);

export default function RoomContext({
  children,
  room_id,
  workspace_id,
}: Props) {
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

  useSocket("roomUpdated", (data) => {
    setRoom(data);
  });

  //Update room object when background changed
  useSocket("roomBackgroundChanged", (data: WorkspaceRoomType) => {
    setRoom((prev) => ({
      ...((prev ?? {}) as WorkspaceRoomType),
      background: data.background,
    }));
  });

  const settings = useSetting();

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
          if (settings.sounds.userJoinLeft) playSoundEffect("joined");
          router(
            `/workspaces/${workspace_id}/rooms/${room_id}?token=${livekitToken}`
          );
          return;
        }
      });
  };

  const [permissionState, setPermissionState] = useState({
    audio: true,
    video: true,
  });

  const changePermissionState = (key: "video" | "audio", newValue: boolean) => {
    setPermissionState((prev) => ({ ...prev, [key]: newValue }));
  };

  const updateUserCoords = (
    username: string,
    position: { x: number; y: number }
  ) => {
    if (!socket) return;

    if (room === undefined) return;

    const participants = room?.participants ?? [];

    const participant_index = participants.findIndex(
      (x: any) => x.username === username
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

    socket?.emit("updateCoordinates", sendingObject);
  };

  const [sidebar, setSidebar] = useState<ReactNode>(<></>);
  const openSidebar = (sidebar: ReactNode) => setSidebar(sidebar);
  const closeSidebar = () => setSidebar(undefined);

  const { data: leaderboardData } = useApi(
    `/workspaces/${workspace_id}/leaderboard`
  );
  const leaderboardUsers: LeaderboardType[] =
    leaderboardData !== undefined ? leaderboardData.data : [];

  const { data: schedulesData } = useApi(
    `/workspaces/${workspace_id}/schedules`
  );
  const schedulesItems: ScheduleType[] =
    schedulesData !== undefined ? schedulesData?.data : [];

  const { data: workspaceUsersData, mutate: mutateWorkspaceUsers } = useApi(
    `/workspaces/${workspace_id}/users`
  );
  const workspaceUsers: WorkspaceUserType[] =
    workspaceUsersData !== undefined ? workspaceUsersData?.data : [];

  useSocket(
    "userLeftFromRoom",
    (data: LeftJoinType) => {
      mutateWorkspaceUsers();

      if (room === undefined) return;

      if (room_id !== data.room_id) return;

      const participants = room?.participants ?? [];

      const newParticipants = participants.filter((x) => x.id !== data.user.id);

      room.participants = newParticipants;

      setRoom(room);
    },
    [room, mutateWorkspaceUsers]
  );

  useSocket(
    "userJoinedToRoom",
    (data: LeftJoinType) => {
      mutateWorkspaceUsers();

      if (room === undefined) return;

      if (room_id !== data.room_id) return;

      const participants = room?.participants ?? [];

      room.participants = [...participants, data.user];

      setRoom(room);
    },
    [room, mutateWorkspaceUsers]
  );

  const workpaceJobItems: JobType[] = workspaceUsers
    .filter((x) => x.active_job !== undefined)
    .map((x) => x.active_job as JobType);

  const usersHaveJobs: UserMinimalType[] = [];

  const usersHaveInProgressJobs: UserMinimalType[] = [];

  const workingUsers = workspaceUsers.filter(
    (x) => x.active_job !== null && x.status === "online"
  );

  const onlineUsers = leaderboardUsers
    .filter(
      (x) =>
        x.user.active === 1 &&
        x.user.status === "online" &&
        x.user.workspace_id === +(workspace_id as string)
    )
    .map((x) => x.user);

  // useSocket("updateCoordinates", (data: updateCoordinatesEvent) => {
  //   setRoom((prev) => {
  //     return prev
  //       ? {
  //           ...prev,
  //           participants: prev.participants.map((participant) => {
  //             if (participant.username === data.username) {
  //               return {
  //                 ...participant,
  //                 coordinates: data.coordinates,
  //               };
  //             }

  //             return participant;
  //           }),
  //         }
  //       : undefined;
  //   });
  // });

  return (
    <RoomCtx.Provider
      value={{
        room,
        room_id: +room_id,
        workspace_id,
        sidebar,
        closeSidebar,
        openSidebar,
        updateUserCoords,
        audioState: permissionState.audio,
        videoState: permissionState.video,
        changePermissionState,
        livekit_token: (livekit_token as string) ?? undefined,
        joinRoom: handleJoinRoom,
        leaderboard: leaderboardUsers,
        scheduled: schedulesItems,
        workspaceUsers,
        workspaceJobs: workpaceJobItems,
        workingUsers: workingUsers,
        onlineUsers: onlineUsers,
        usersHaveJobs: usersHaveJobs,
        usersHaveInProgressJobs: usersHaveInProgressJobs,
      }}
    >
      {children}
    </RoomCtx.Provider>
  );
}
