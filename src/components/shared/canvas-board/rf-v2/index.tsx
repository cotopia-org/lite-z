import { useCallback, useEffect, useRef } from "react";
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
  updateShareScreenSizeEvent,
  UserLeftJoinType,
} from "@/types/socket";
import UserNode from "./nodes/user";
import { doCirclesMeetRaw } from "../../room/sessions/room-audio-renderer";
import { VARZ } from "@/const/varz";
import JailNode from "./nodes/jail-node";
import { getPositionFromStringCoordinates } from "@/lib/utils";
import { UserMinimalType } from "@/types/user";
import BgNode from "./nodes/bg-node";
import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

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

  //Init livekit screenshare tracks
  const initShareScreenTracks = useRef<boolean>(false);
  const shareScreenTracks = useTracks([Track.Source.ScreenShare]);

  useEffect(() => {
    if (initShareScreenTracks.current === true) return;

    for (let track of shareScreenTracks) {
      const shareScreenNode = {
        id: track.publication.track?.sid,
        data: {
          room_id: room?.id,
          livekit: {
            track: {
              source: track.source,
            },
            participant: {
              identity: track.participant.identity,
            },
          },
        },
        position: { x: 200, y: 200 },
        parentId: VARZ.jailNodeId,
        extent: "parent",
        type: "shareScreenNode",
        draggable: false,
      } as Node;

      console.log("shareScreenNode", shareScreenNode);

      rf.current?.setNodes((prev) => {
        return [...prev, shareScreenNode];
      });
    }
  }, [rf.current, shareScreenTracks]);

  const participantsToRfNodes = useCallback(
    (participants: UserMinimalType[]) => {
      return (
        participants?.map((participant) => {
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

          let isMeet = !!isMyNode;

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
        }) ?? []
      );
    },
    [user?.username]
  );

  const addNodesToRf = useCallback((nodes: Node[], bgNode?: Node) => {
    let finalNodes: Node[] = [
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
    ];

    const myNode = nodes.find((x) => x.id === user?.username);

    finalNodes = [
      ...finalNodes,
      ...nodes.map((x) => {
        const isMyNode = x.id === user?.username;

        let isMeet = !!isMyNode;

        if (!isMyNode) {
          const myUserPosition = myNode?.position;

          if (myUserPosition) {
            const participantPosition = x.position;

            const { meet: participantMeet } = doCirclesMeetRaw(
              46,
              VARZ.voiceAreaRadius,
              myUserPosition,
              participantPosition
            );

            isMeet = participantMeet;
          }
        }

        return {
          ...x,
          data: {
            ...x?.data,
            meet: isMeet,
          },
          parentId: VARZ.jailNodeId,
          extent: "parent",
        } as Node;
      }),
    ];

    if (bgNode) finalNodes = [...finalNodes, bgNode];

    rf?.current?.setNodes(finalNodes);
  }, []);

  useEffect(() => {
    if (!rf.current) return;

    if (room?.participants?.length === 0) return;

    if (init.current === true) return;

    //Convert participants to rf nodes Node[]
    let nodes = participantsToRfNodes(room?.participants ?? []);

    //Add Node[] to react flow canvas
    addNodesToRf(nodes, {
      id: "bg-node",
      position: { x: -200, y: -200 },
      data: {},
      type: "bgNode",
      draggable: false,
    });

    init.current = true;
  }, [rf.current, room?.participants, addNodesToRf, participantsToRfNodes]);

  useBus(
    __BUS.initRoomParticipantsOnRf,
    (data: any) => {
      //Convert participants to rf nodes Node[]
      const nodes = participantsToRfNodes(data?.participants ?? []);

      //Add Node[] to react flow canvas
      addNodesToRf(nodes, {
        id: "bg-node",
        position: { x: -200, y: -200 },
        data: { background: data?.background },
        type: "bgNode",
        draggable: false,
      });
    },
    [participantsToRfNodes, addNodesToRf]
  );

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
            handleCircleMeet(node.id, node.position);
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

  useSocket("updateCoordinates", (data: updateCoordinatesEvent) => {
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
  });

  useSocket(
    "livekitEvent",
    (data: LivekitTrackPublishedType) => {
      switch (data.event) {
        case "track_published":
          switch (data.track.source) {
            case "SCREEN_SHARE":
              const isMyShareScreen =
                user?.username === data.participant.identity; //Or admin

              const shareScreenNode = {
                id: data.track.sid,
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
              rf.current?.setNodes((prev) => {
                return prev.filter((n) => n.id !== data.track.sid);
              });
              break;
          }
          break;
      }
    },
    [rf.current]
  );

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

  useSocket("updateShareScreenSize", (data: updateShareScreenSizeEvent) => {
    rf.current?.updateNode(data.id, {
      width: data.width,
      height: data.height,
    });
  });

  useSocket(
    "userLeftFromRoom",
    (data: UserLeftJoinType) => {
      if (data.room_id === room?.id) {
        rf.current?.setNodes((prev) => {
          console.log(
            "nodes",
            prev.filter((n) => n.id !== data.user.username)
          );
          return prev.filter((n) => n.id !== data.user.username);
        });
      }
    },
    [room?.id]
  );

  useSocket(
    "userJoinedToRoom",
    (data: UserLeftJoinType) => {
      if (!data?.user) return;

      if (data.room_id !== room?.id) return;

      if (!user) return;

      const isMe = user?.username === data.user.username;

      const currentPositionCoords = getPositionFromStringCoordinates(
        data.user.coordinates ?? ""
      ) ?? { x: 200, y: 200 };

      const meet = handleCircleMeet(data.user.username, currentPositionCoords);

      rf.current?.setNodes((prev) => [
        ...prev,
        {
          id: data.user.username,
          type: "userNode",
          data: {
            username: data.user.username,
            draggable: isMe,
            isDragging: false,
            meet,
          },
          position: { x: currentPositionCoords.x, y: currentPositionCoords.y },
          extent: "parent",
          deletable: false,
          draggable: isMe,
        },
      ]);
    },
    [user?.username]
  );

  return (
    <div className='w-full h-screen'>
      <ReactFlowV2
        nodeTypes={{
          userNode: UserNode,
          shareScreenNode: ShareScreenNode,
          jailNode: JailNode,
          bgNode: BgNode,
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
      />
    </div>
  );
}
