import { __BUS } from "@/const/bus";
import { useApi } from "@/hooks/swr";
import useLoading from "@/hooks/use-loading";
import useQueryParams from "@/hooks/use-query-params";
import useSetting from "@/hooks/use-setting";
import { playSoundEffect } from "@/lib/sound-effects";
import { uniqueById } from "@/lib/utils";
import { useSocket } from "@/routes/private-wrarpper";
import axiosInstance, { FetchDataType } from "@/services/axios";
import { ScheduleType } from "@/types/calendar";
import { JobType } from "@/types/job";
import { LeaderboardType } from "@/types/leaderboard";
import { WorkspaceRoomJoinType, WorkspaceRoomType } from "@/types/room";
import { UserMinimalType, UserType, WorkspaceUserType } from "@/types/user";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useBus from "use-bus";

type LeftJoinType = { room_id: number; user: UserMinimalType };

type Props = {
  children: ReactNode;
  room_id: number;
  workspace_id?: string;
};

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
  leaderboard: LeaderboardType[];
  scheduled: ScheduleType[];
  workpaceUsers: WorkspaceUserType[];
  workspaceJobs: JobType[];
  workingUsers: UserType[];
  onlineUsers: UserMinimalType[];
  usersHaveJobs: UserMinimalType[];
  usersHaveInProgressJobs: UserMinimalType[];
  updateRoom: (room: WorkspaceRoomType) => void;
  joinRoom: (room_id: number | string, onFulfilled?: () => void) => void;
}>({
  room: undefined,
  updateRoom: (room) => {},
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
  leaderboard: [],
  scheduled: [],
  workpaceUsers: [],
  workspaceJobs: [],
  workingUsers: [],
  onlineUsers: [],
  usersHaveJobs: [],
  usersHaveInProgressJobs: [],
  joinRoom: (room_id, onFulfilled) => {},
});

export const useRoomContext = () => useContext(RoomCtx);

export default function RoomContext({
  children,
  room_id,
  workspace_id,
}: Props) {
  const [room, setRoom] = useState<WorkspaceRoomType>();

  // const updateRoomParticipants = (participants: UserMinimalType[]) => {
  //   console.log("participants", participants);

  //   setRoom((prev) => {
  //     const nValue = { ...(prev as WorkspaceRoomType), participants };

  //     return nValue;
  //   });
  // };

  const {
    startLoading: startJoinLoading,
    stopLoading: stopJoinLoading,
    isLoading: joinLoading,
  } = useLoading();

  const handleJoin = async (
    room_id: string | number,
    onFulfilled?: () => void
  ) => {
    startJoinLoading();
    socket?.emit("joinedRoom", room_id, async () => {
      axiosInstance
        .get<FetchDataType<WorkspaceRoomJoinType>>(`/rooms/${room_id}/join`)
        .then((res) => {
          setRoom((prev) => {
            return {
              ...(prev as WorkspaceRoomType),
              participants: res.data.data.participants ?? [],
            };
          });
          stopJoinLoading();
          if (onFulfilled) onFulfilled();
        })
        .catch((err) => {
          toast.error("Couldn't join to the room!");
          stopJoinLoading();
          if (onFulfilled) onFulfilled();
        });
    });
  };

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

  const settings = useSetting();

  const { query } = useQueryParams();
  const livekit_token = query?.token ?? undefined;

  const socket = useSocket();

  const navigate = useNavigate();

  const handleJoinRoom = async (
    room_id: string | number,
    onFulfilled?: () => void
  ) => {
    startJoinLoading();
    socket?.emit("joinedRoom", room_id, async () => {
      axiosInstance
        .get<FetchDataType<WorkspaceRoomJoinType>>(`/rooms/${room_id}/join`)
        .then((res) => {
          stopJoinLoading();
          if (onFulfilled) onFulfilled();

          setRoom((prev) => {
            return {
              ...(prev as WorkspaceRoomType),
              participants: res.data.data.participants ?? [],
            };
          });

          const livekitToken = res.data.data.token; //Getting livekit token from joinObject

          if (livekitToken) {
            if (settings.sounds.userJoinLeft) playSoundEffect("joined");
            navigate(
              `/workspaces/${workspace_id}/rooms/${room_id}?token=${livekitToken}`
            );
            return;
          }
        })
        .catch((err) => {
          toast.error("Couldn't join to the room!");
          stopJoinLoading();
          if (onFulfilled) onFulfilled();
        });
    });
  };

  // useBus(
  //   __BUS.rejoinMeet,
  //   () => {
  //     handleJoin(room_id);
  //   },
  //   [room_id, handleJoin]
  // );

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

    console.log(
      "participants[participant_index]",
      participants[participant_index]
    );

    setRoom({ ...room, participants });
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
  const workpaceUsers =
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

  const { data: workpaceJobs } = useApi(`/workspaces/${workspace_id}/jobs`);
  const workpaceJobItems: JobType[] =
    workpaceJobs !== undefined ? workpaceJobs?.data : [];

  let usersHaveSchedules: number[] = [];
  for (let job of workpaceJobItems) {
    for (let jobMember of job.members) {
      usersHaveSchedules.push(jobMember.id);
    }
  }

  const usersHaveJobs = useMemo(() => {
    let users: UserMinimalType[] = [];

    for (let job of workpaceJobItems) {
      for (let member of job.members) {
        users.push(member);
      }
    }

    return uniqueById(users) as UserMinimalType[];
  }, [workpaceJobItems]);

  const usersHaveInProgressJobs = useMemo(() => {
    let users: UserMinimalType[] = [];

    for (let job of workpaceJobItems) {
      if (job.status === "in_progress")
        for (let member of job.members) {
          users.push(member);
        }
    }

    return uniqueById(users) as UserMinimalType[];
  }, [workpaceJobItems]);

  const usersWithInprogressJobIds = usersHaveInProgressJobs.map((x) => x.id);

  const workingUsers = leaderboardUsers
    .filter(
      (x) =>
        x.user.active === 1 &&
        x.user.room_id !== null &&
        x.user.workspace_id === +(workspace_id as string) &&
        usersHaveSchedules.includes(x.user.id) &&
        usersWithInprogressJobIds.includes(x.user.id)
    )
    .map((x) => x.user);

  const onlineUsers = leaderboardUsers
    .filter(
      (x) =>
        x.user.active === 1 &&
        x.user.status === "online" &&
        x.user.workspace_id === +(workspace_id as string)
    )
    .map((x) => x.user);

  return (
    <RoomCtx.Provider
      value={{
        room,
        updateRoom: setRoom,
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
        workpaceUsers,
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
