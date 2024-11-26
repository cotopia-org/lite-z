import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlowV2 from "../../react-flow/v2";
import UserNode from "../nodes/user";
import { useRoomContext } from "../../room/room-context";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import useAuth from "@/hooks/auth";
import { Track } from "livekit-client";
import ShareScreenNode from "./nodes/share-screen";
import { useSocket } from "@/routes/private-wrarpper";
import useBus from "use-bus";
import { __BUS } from "@/const/bus";

enum RoomRfNodeType {
  shareScreenNode = "shareScreenNode",
  userNode = "userNode",
}

export default function WithReactFlowV2({
  tracks,
}: {
  tracks: TrackReferenceOrPlaceholder[];
}) {
  const socket = useSocket();

  const { user } = useAuth();

  const rf = useRef<ReactFlowInstance<Node, Edge>>();

  const { room, updateUserCoords, objects, setObjects } = useRoomContext();

  const [isDragging, setIsDragging] = useState(false);

  //Participant nodes
  const participantNodes =
    room?.participants?.map((participant) => {
      const coords = participant?.coordinates?.split(",");

      let xcoord = coords?.[0] ?? 200;
      let ycoord = coords?.[1] ?? 200;

      const rfUserId = "" + participant?.username;
      if (user?.username === participant.username && isDragging) {
        xcoord =
          rf?.current?.getNode(rfUserId)?.position.x ?? coords?.[0] ?? 200;
        ycoord =
          rf?.current?.getNode(rfUserId)?.position.y ?? coords?.[1] ?? 200;
      }

      if (typeof xcoord === "string") xcoord = +xcoord;
      if (typeof ycoord === "string") ycoord = +ycoord;

      const isDraggable = user?.username === participant.username;

      let object: Node = {
        id: "" + participant?.username,
        type: "userNode",
        data: {
          username: participant.username,
          draggable: isDraggable,
          isDragging: false,
        },
        position: { x: xcoord, y: ycoord },
        //   parentId: RF_JAIL_ID,
        extent: "parent",
      };

      if (!isDraggable) object["draggable"] = false;

      return object;
    }) ?? [];

  console.log("objects", objects);

  //Sharescreen Nodes
  const shareScreenNodes: Node[] = [
    ...tracks
      ?.filter((x) => x.source === Track.Source.ScreenShare)
      ?.map((x, i) => {
        const shareScreenId = "share-screen-" + i;

        const isDraggable = user?.username === x.participant.identity; //and admin here

        return {
          id: shareScreenId,
          type: "shareScreenNode",
          data: {
            id: shareScreenId,
            track: x,
            label: "Share screen node",
          },
          position: {
            x: objects?.[shareScreenId]?.x ?? 200,
            y: objects?.[shareScreenId]?.y ?? 200,
          },
          className: "bg-white shadow-md",
          draggable: isDraggable,
          // extent: "parent",
        } as Node;
      }),
  ];

  const defaultNodes = useMemo(() => {
    return [...participantNodes, ...shareScreenNodes];
  }, [participantNodes.length, shareScreenNodes.length, objects]);

  const handleDragStopRfNodes = useCallback(
    (_: any, node: Node) => {
      setIsDragging(false);
      switch (node.type) {
        case RoomRfNodeType.shareScreenNode:
          //emit socket
          const sendingObject = {
            room_id: room?.id,
            coordinates: node.position,
            share_screen_id: node.id,
          };
          socket?.emit("updateShareScreenCoordinates", sendingObject);
          break;
        case RoomRfNodeType.userNode:
          if (!node?.data?.username) return;
          updateUserCoords((node.data as any)?.username, node.position);
          break;
      }
    },
    [socket, updateUserCoords]
  );

  useSocket("updateShareScreenCoordinates", (data) => {
    setObjects((prev) => ({
      ...prev,
      [data.share_screen_id]: { x: data.coordinates.x, y: data.coordinates.y },
    }));
  });

  useSocket("updateShareScreenSize", (data) => {
    console.log("updateShareScreenSize", data);
  });

  return (
    <div className='w-full h-screen'>
      <ReactFlowV2
        nodeTypes={{
          userNode: UserNode,
          shareScreenNode: ShareScreenNode,
        }}
        defaultNode={defaultNodes ?? []}
        onInit={(rfinstance) => (rf.current = rfinstance)}
        onNodeDragStop={handleDragStopRfNodes}
        onNodeDragStart={() => setIsDragging(true)}
        translateExtent={[
          [-200, 0],
          [3800, 1700],
        ]}
        hasJail
        background={room?.background}
      />
    </div>
  );
}
