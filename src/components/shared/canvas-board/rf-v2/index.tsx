import { useCallback, useRef } from "react";
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
      const coords = participant?.coordinates?.split(",");

      let xcoord = coords?.[0] ?? 200;
      let ycoord = coords?.[1] ?? 200;

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
          console.log("node", node);
          // const sendingObject = {
          //     room_id: room?.id,
          //     coordinates: newCoords,
          //     username,
          //   };

          //   socket?.emit("updateCoordinates", sendingObject);
          break;
        case RoomRfNodeType.userNode:
          if (!node?.data?.username) return;
          updateUserCoords((node.data as any)?.username, node.position);
          break;
      }
    },
    [socket, updateUserCoords]
  );

  return (
    <div className='w-screen h-screen'>
      <ReactFlowV2
        nodeTypes={{
          userNode: UserNode,
          shareScreenNode: ShareScreenNode,
        }}
        defaultNode={defaultNodes ?? []}
        minimapNodeColor={(n) => {
          if (n.type === "userNode") return "#000";
          return "#eee";
        }}
        onInit={(rfinstance) => (rf.current = rfinstance)}
        onNodeDragStop={handleDragStopRfNodes}
      />
    </div>
  );
}
