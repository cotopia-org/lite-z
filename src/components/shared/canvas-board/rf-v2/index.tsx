import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlowV2 from "../../react-flow/v2";
import { useRoomContext } from "../../room/room-context";
import { Edge, Node, ReactFlowInstance, XYPosition } from "@xyflow/react";
import useAuth from "@/hooks/auth";
import ShareScreenNode from "./nodes/share-screen";
import { useSocket } from "@/routes/private-wrarpper";
import useBus, { dispatch } from "use-bus";
import { __BUS } from "@/const/bus";
import {
  LivekitTrackPublishedType,
  updateCoordinatesEvent,
  updateShareScreenCoordinatesEvent,
} from "@/types/socket";
import UserNode from "./nodes/user";
import { doCirclesMeetRaw } from "../../room/sessions/room-audio-renderer";
import { VARZ } from "@/const/varz";
import JailNode from "./nodes/jail-node";

enum RoomRfNodeType {
  shareScreenNode = "shareScreenNode",
  userNode = "userNode",
}

export default function WithReactFlowV2() {
  const socket = useSocket();

  const { user } = useAuth();

  const rf = useRef<ReactFlowInstance<Node, Edge>>();

  const { room, updateUserCoords } = useRoomContext();

  //Init react flow
  const init = useRef<boolean>(false);

  //Init first (initial) tracks
  const initTracks = useRef<boolean>(false);
  //Todo - Mohammad hossein should give us current tracks api

  useEffect(() => {
    if (!rf.current) return;

    if (room?.participants?.length === 0) return;

    if (init.current === true) return;

    let nodes =
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

        const isMyNode = user?.username === participant.username;

        const isDraggable = !!isMyNode;
        const isMeet = !!isMyNode;

        let object: Node = {
          id: "" + participant?.username,
          type: "userNode",
          data: {
            username: participant.username,
            draggable: isDraggable,
            isDragging: false,
            meet: isMeet,
          },
          position: { x: xcoord, y: ycoord },
          extent: "parent",
          deletable: false,
        };

        if (!isDraggable) object["draggable"] = false;

        return object;
      }) ?? [];

    rf.current.setNodes([
      {
        id: VARZ.jailNodeId,
        position: {
          x: 0,
          y: 0,
        },
        type: "jailNode",
        draggable: false,
        data: {},
        focusable: false,
        deletable: false,
        selectable: false,
      },
      ...nodes.map(
        (x) =>
          ({
            ...x,
            parentId: VARZ.jailNodeId,
            extent: "parent",
          } as Node)
      ),
    ]);

    init.current = false;
  }, [rf.current, room?.participants]);

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

          const targetUserName = (node.data as any)?.username;
          updateUserCoords(targetUserName, node.position);

          const allNodes = rf.current?.getNodes() ?? [];
          for (let node of allNodes) {
            const isMeet = handleCircleMeet(node.id, node.position);
          }

          break;
      }
    },
    [socket, updateUserCoords]
  );

  const handleCircleMeet = (
    targetUserName: string,
    targetPosition: XYPosition
  ) => {
    const targetUserNode = rf?.current?.getNode(targetUserName);

    if (targetUserNode === undefined) return;

    const position = targetPosition;

    if (!user?.username) return;

    const myUserPosition = rf.current?.getNode(user?.username)?.position;

    if (myUserPosition === undefined) return;

    const { meet } = doCirclesMeetRaw(
      46,
      VARZ.voiceAreaRadius,
      myUserPosition,
      position
    );

    rf.current?.updateNode(targetUserName, {
      data: { ...targetUserNode?.data, meet },
    });

    return meet;
  };

  useSocket(
    "updateCoordinates",
    (data: updateCoordinatesEvent) => {
      const coordsSplitted = data.coordinates.split(",");

      if (coordsSplitted.length !== 2) return;

      const position = {
        x: +coordsSplitted?.[0],
        y: +coordsSplitted?.[1],
      };

      const node = rf.current?.getNode(data.username);

      if (!node) return;

      handleCircleMeet(data.username, position);

      rf.current?.updateNode(data.username, { position });
    },
    [rf.current]
  );

  useSocket("livekitEvent", (data: LivekitTrackPublishedType) => {
    switch (data.event) {
      case "track_published":
        switch (data.track.source) {
          case "SCREEN_SHARE":
            const isMyShareScreen =
              user?.username === data.participant.identity; //Or admin

            const shareScreenNode = {
              id: data.id,
              data: {
                room_id: room?.id,
                livekit: data,
              },
              position: { x: 200, y: 200 },
              parentId: VARZ.jailNodeId,
              extent: "parent",
              type: "shareScreenNode",
              draggable: isMyShareScreen,
            } as Node;

            rf.current?.setNodes((prev) => {
              return [...prev, shareScreenNode];
            });

            break;
        }
        break;
      case "track_unpublished":
        switch (data.track.source) {
          case "SCREEN_SHARE":
            rf.current?.setNodes((prev) =>
              prev.filter((n) => n.id !== data.id)
            );
            break;
        }
        break;
    }
  });

  useSocket(
    "updateShareScreenCoordinates",
    (data: updateShareScreenCoordinatesEvent) => {
      rf.current?.updateNode(data.share_screen_id, {
        position: data.coordinates,
      });
    }
  );

  useSocket("updateShareScreenCoordinates", (data) => {
    console.log("data", data);
  });

  useBus(__BUS.changeMyShareScreenCoord, ({ data }) => {});

  useSocket("updateShareScreenSize", (data) => {
    console.log("updateShareScreenSize", data);
  });

  return (
    <div className='w-full h-screen'>
      <ReactFlowV2
        nodeTypes={{
          userNode: UserNode,
          shareScreenNode: ShareScreenNode,
          jailNode: JailNode,
        }}
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
