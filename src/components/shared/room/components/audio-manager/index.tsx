import { useParticipants } from "@livekit/components-react";
import { useRoomContext } from "../../room-context";
import { UserMinimalType } from "@/types/user";
import { useSocket } from "@/routes/private-wrarpper";
import useBus from "use-bus";
import { __BUS } from "@/const/bus";
import { useReactFlow } from "@xyflow/react";

const DEFAULT_TILE_POSITION = [0, 0];
const BOUNDRY_RADIUS = 50;
const BOUNDRY_CENTER_X = 500;
const BOUNDRY_CENTER_Y = 500;

//@ts-ignore
const LiveKitAudioManager = () => {
  const participants = useParticipants();

  const rf = useReactFlow();

  const { room } = useRoomContext();
  const users = room?.participants ?? [];

  const checkBoundaries = () => {
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        if (isOverlap(users[i], users[j])) {
          const volume1 = 100;
          const volume2 = 100;

          setVolume("" + users[i].username, volume1);
          setVolume("" + users[j].username, volume2);
        } else {
          setVolume("" + users[i].username, 0);
          setVolume("" + users[j].username, 0);
        }
      }
    }
  };

  const isOverlap = (
    user1: UserMinimalType,
    user2: UserMinimalType
  ): boolean => {
    const user1Coordinates = rf?.getNode(user1.username)?.position;
    const user2Coordinates = rf?.getNode(user2.username)?.position;

    if (!user1Coordinates || !user2Coordinates) return false;

    const distance = Math.sqrt(
      Math.pow(user1Coordinates.x - user2Coordinates.x, 2) +
        Math.pow(user1Coordinates?.y - user2Coordinates?.y, 2)
    );

    return distance < 2 * BOUNDRY_RADIUS; //Because we have 2 users
  };

  // const calculateVolume = (user: UserMinimalType): number => {
  //   const userNode = rf.getNode(user?.username);

  //   if (!userNode) return 0;

  //   const userCoordinates = userNode?.position;

  //   const distanceFromCenter = Math.sqrt(
  //     Math.pow(userCoordinates.x - BOUNDRY_CENTER_X, 2) +
  //       Math.pow(userCoordinates.y - BOUNDRY_CENTER_Y, 2)
  //   );
  //   const maxDistance = BOUNDRY_RADIUS;
  //   const volume = distanceFromCenter / maxDistance; // Normalize volume between 0 and 1
  //   return Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1
  // };

  const setVolume = (userName: string, volume: number) => {
    if (room) {
      const participant = participants.find((x) => x.identity === userName);

      if (participant !== undefined) {
        participant.audioLevel = volume;
      }
    }
  };

  useSocket("updateCoordinates", (data: any) => {
    checkBoundaries();
  });

  return null;
};

export default LiveKitAudioManager;
