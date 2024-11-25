import { useCallback, useMemo, useRef } from "react";
import ReactFlowV2 from "../../react-flow/v2";
import UserNode from "../nodes/user";
import { useRoomContext } from "../../room/room-context";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import useAuth from "@/hooks/auth";
import { Track } from "livekit-client";
import ShareScreenNode from "./nodes/share-screen";
import { useSocket } from "@/routes/private-wrarpper";

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

  const { room, updateUserCoords } = useRoomContext();

  //Participant nodes
  const participantNodes =
    room?.participants?.map((participant) => {
      const rfUserId = "" + participant?.username;
      const coords = participant?.coordinates?.split(",");

      let xcoord = coords?.[0] ?? 200;
      let ycoord = coords?.[1] ?? 200;

      if (user?.username === participant.username) {
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

  //Sharescreen Nodes
  const shareScreenNodes: Node[] = [
    ...tracks
      ?.filter((x) => x.source === Track.Source.ScreenShare)
      ?.map(
        (x, i) =>
          ({
            id: "share-screen-" + i,
            type: "shareScreenNode",
            data: {
              track: x,
              label: "Share screen node",
            },
            position: {
              x: rf?.current?.getNode("share-screen-" + i)?.position.x ?? 200,
              y: rf?.current?.getNode("share-screen-" + i)?.position.y ?? 200,
            },
            style: {
              width: 500,
              height: 200,
            },
            className: "bg-white shadow-md",
            // extent: "parent",
          } as Node)
      ),
  ];

  const defaultNodes = [...participantNodes, ...shareScreenNodes];

  const handleDragStopRfNodes = useCallback(
    (_: any, node: Node) => {
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
    console.log("data", data);
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
        translateExtent={[
          [-200, 0],
          [3800, 1700],
        ]}
        hasJail
        background='/assets/mock/gallery/template/sky-1.jpg'
      />
    </div>
  );
}
