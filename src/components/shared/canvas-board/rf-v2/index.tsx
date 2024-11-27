import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlowV2 from "../../react-flow/v2";
import UserNode from "../nodes/user";
import { useRoomContext } from "../../room/room-context";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import useAuth from "@/hooks/auth";
import ShareScreenNode from "./nodes/share-screen";
import { useSocket } from "@/routes/private-wrarpper";
import useBus, { dispatch } from "use-bus";
import { __BUS } from "@/const/bus";
import { updateCoordinatesEvent } from "@/types/socket";

enum RoomRfNodeType {
  shareScreenNode = "shareScreenNode",
  userNode = "userNode",
}

export default function WithReactFlowV2() {
  const socket = useSocket();

  const { user } = useAuth();

  const rf = useRef<ReactFlowInstance<Node, Edge>>();

  const { room, updateUserCoords, objects, setObjects } = useRoomContext();

  const shareScreenObjects = Object.keys(objects)
    .map((objectKey) => ({ ...objects[objectKey] }))
    .filter((x) => x?.meta && x?.meta?.track?.source === "SCREEN_SHARE");

  const init = useRef<boolean>(false);

  useEffect(() => {
    if (!rf.current) return;
    if (init.current === true) return;

    rf.current.setNodes(
      room?.participants?.map((participant) => {
        const coords = participant?.coordinates?.split(",");

        const rfUserId = "" + participant?.username;

        let xcoord =
          coords?.[0] ?? rf?.current?.getNode(rfUserId)?.position.x ?? 200;
        let ycoord =
          coords?.[1] ?? rf?.current?.getNode(rfUserId)?.position.y ?? 200;

        if (typeof xcoord === "string" && !isNaN(+xcoord)) {
          xcoord = +xcoord;
        } else {
          xcoord = 200;
        }
        if (typeof ycoord === "string" && !isNaN(+ycoord)) {
          ycoord = +ycoord;
        } else {
          ycoord = 200;
        }

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
          extent: "parent",
        };

        if (!isDraggable) object["draggable"] = false;

        return object;
      }) ?? []
    );

    init.current = false;
  }, [rf.current, room?.participants]);

  //Sharescreen Nodes
  // const shareScreenNodes: Node[] = [
  //   ...shareScreenObjects?.map((x, i) => {
  //     const shareScreenId = x?.meta?.id;

  //     const isDraggable = user?.username === x?.meta?.participant?.identity; //and admin here

  //     return {
  //       id: shareScreenId,
  //       type: "shareScreenNode",
  //       data: {
  //         room_id: room?.id,
  //         id: shareScreenId,
  //         track: x?.meta,
  //         label: "Share screen node",
  //       },
  //       position: {
  //         x: rf?.current?.getNode(shareScreenId)?.position.x ?? 200,
  //         y: rf?.current?.getNode(shareScreenId)?.position.y ?? 200,
  //       },
  //       className: "bg-white shadow-md",
  //       draggable: isDraggable,
  //       // extent: "parent",
  //     } as Node;
  //   }),
  // ];

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
          dispatch({
            type: __BUS.changeMyShareScreenCoord,
            data: sendingObject,
          });
          break;
        case RoomRfNodeType.userNode:
          if (!node?.data?.username) return;
          updateUserCoords((node.data as any)?.username, node.position);

          break;
      }
    },
    [socket, updateUserCoords]
  );

  useSocket("updateCoordinates", (data: updateCoordinatesEvent) => {
    const coordsSplitted = data.coordinates.split(",");

    if (coordsSplitted.length !== 2) return;

    const position = {
      x: +coordsSplitted?.[0],
      y: +coordsSplitted?.[1],
    };
    rf.current?.updateNode(data.username, { position });
  });

  useSocket("updateShareScreenCoordinates", (data) => {
    setObjects((prev) => ({
      ...prev,
      [data.share_screen_id]: { x: data.coordinates.x, y: data.coordinates.y },
    }));
  });

  useSocket("updateShareScreenCoordinates", (data) => {
    setObjects((prev) => ({
      ...prev,
      [data.share_screen_id]: { x: data.coordinates.x, y: data.coordinates.y },
    }));
  });

  useBus(__BUS.changeMyShareScreenCoord, ({ data }) => {
    setObjects((prev) => ({
      ...prev,
      [data.share_screen_id]: { x: data.coordinates.x, y: data.coordinates.y },
    }));
  });

  useSocket("updateShareScreenSize", (data) => {
    console.log("updateShareScreenSize", data);
  });

  const nodes = useMemo(() => {
    return rf.current?.getNodes() ?? [];
  }, []);

  return (
    <div className='w-full h-screen'>
      <ReactFlowV2
        nodeTypes={{
          userNode: UserNode,
          shareScreenNode: ShareScreenNode,
        }}
        defaultNode={nodes}
        onInit={(rfinstance) => {
          rf.current = rfinstance;
        }}
        onNodeDragStop={handleDragStopRfNodes}
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
