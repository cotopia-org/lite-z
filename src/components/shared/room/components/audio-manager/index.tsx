import { useParticipants } from '@livekit/components-react';
import { useRoomContext } from '../../room-context';
import { useSocket } from '@/routes/private-wrarpper';
import { __BUS } from '@/const/bus';
import { useReactFlow, XYPosition } from '@xyflow/react';
import { updateCoordinatesEvent } from '@/types/socket';
import useAuth from '@/hooks/auth';
import { VARZ } from '@/const/varz';

const BOUNDRY_RADIUS = 50;

//@ts-ignore
const LiveKitAudioManager = () => {
  const participants = useParticipants();

  const rf = useReactFlow();

  const { room } = useRoomContext();

  const { user } = useAuth();

  const checkBoundaries = () => {
    if (!user) return;

    const myUserNode = rf.getNode(user?.username);

    if (myUserNode === undefined) return;

    for (let participant of participants) {
      const participantNode = rf.getNode(participant.identity);
      if (participantNode !== undefined) {
        if (isOverlap(myUserNode.position, participantNode.position)) {
          setVolume(participant.identity, 100);
        }
      } else {
        setVolume(participant.identity, 0);
      }
    }
  };

  const isOverlap = (position1: XYPosition, position2: XYPosition): boolean => {
    const distance = Math.sqrt(
      Math.pow(position1.x - position2.x, 2) +
        Math.pow(position1?.y - position2?.y, 2),
    );

    return distance < VARZ.voiceAreaRadius;
  };

  const setVolume = (userName: string, volume: number) => {
    if (room) {
      const participant = participants.find((x) => x.identity === userName);

      if (participant !== undefined) {
        participant.audioLevel = volume;
      }
    }
  };

  useSocket('updateCoordinates', (data: updateCoordinatesEvent) => {
    checkBoundaries();
  });

  return null;
};

export default LiveKitAudioManager;
