import useAuth from '@/hooks/auth';
import { useRoomContext } from '../room/room-context';
import { Node, XYPosition, useReactFlow } from '@xyflow/react';
import { ReactNode } from 'react';
import { VARZ } from '@/const/varz';
import { dispatch } from 'use-bus';
import { __BUS } from '@/const/bus';
import { doCirclesMeetRaw } from '../canvas-board/canvas-audio-rendrer';
import { useSocket } from '@/routes/private-wrarpper';

type UserTeleportationType = {
  username: string;
  trigger: (teleport: (onTeleport?: () => {}) => void) => ReactNode;
};

const getAroundPoints = (r: number, margin: number) => {
  //get the random angle between 0 and 2Pi (360deg)
  const angle = Math.random() * 2 * Math.PI;
  //calc distance from center of circle
  const distance = r + margin;
  //clac the distance from the center with the sin cos ratio in the x and y axis

  const xPosition = Math.cos(angle);
  const yPosition = Math.sin(angle);

  let x = distance * xPosition;
  let y = distance * yPosition;
  if (xPosition < 0) {
    x -= margin;
  } else {
    x += margin;
  }
  if (yPosition < 0) {
    y -= margin;
  } else {
    y += margin;
  }

  return { x, y };
};

export const useTeleport = (username: string) => {
  const socket = useSocket();
  const { user: myAccount } = useAuth();

  const { updateUserCoords, room_id } = useRoomContext();
  const rf = useReactFlow();

  const navigateHandler = (onTeleport?: () => void) => {
    if (!myAccount) return;
    if (myAccount?.username === username) return;

    const allNodes = rf?.getNodes();

    const currentUserNode = allNodes.find(
      (userNode) => userNode.id === username,
    );
    const myNode = allNodes.find(
      (userNode) => userNode.id === myAccount.username,
    );
    if (currentUserNode === undefined) return;

    const xdimension = currentUserNode?.position.x;
    const ydimension = currentUserNode?.position.y;
    const radius = 75;
    if (xdimension && ydimension) {
      const x = xdimension + radius;
      const y = ydimension + radius;
      const zoom = 1.5;

      rf.setCenter(x, y, { zoom, duration: 1000 });
      //calc radius of target user participant
      const { x: aroundX, y: aroundY } = getAroundPoints(
        radius,
        VARZ.teleportMargin,
      );
      let finalXCordinate = xdimension + aroundX;
      let finalYCordinate = ydimension + aroundY;

      const nPosition = {
        x: finalXCordinate,
        y: finalYCordinate,
      };

      if (myNode) updateUserCoords(myNode?.id, nPosition);

      dispatch({
        type: __BUS.onDragEndNode,
        node: { ...myNode, position: nPosition },
      });

      rf.updateNode(myAccount.username, {
        position: nPosition,
        data: { ...myNode?.data, meet: true },
      });

      const sendingObject = {
        room_id: room_id,
        coordinates: `${nPosition.x},${nPosition.y}`,
        username: myAccount.username,
      };

      socket?.emit('updateCoordinates', sendingObject);

      if (onTeleport) onTeleport();
    }
  };

  return { navigateHandler };
};

const UserTeleportation = ({ username, trigger }: UserTeleportationType) => {
  const rf = useReactFlow();

  const { navigateHandler } = useTeleport(username);
  return <>{trigger(navigateHandler)}</>;
};

export default UserTeleportation;
