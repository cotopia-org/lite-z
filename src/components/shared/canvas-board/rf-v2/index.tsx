import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlowV2 from '../../react-flow/v2';
import { useRoomContext } from '../../room/room-context';
import {
  Edge,
  Node,
  ReactFlowInstance,
  Viewport,
  XYPosition,
} from '@xyflow/react';
import useAuth from '@/hooks/auth';
import ShareScreenNode from './nodes/share-screen';
import { useSocket } from '@/routes/private-wrarpper';
import useBus, { dispatch } from 'use-bus';
import { __BUS } from '@/const/bus';
import {
  LivekitTrackPublishedType,
  updateCoordinatesEvent,
  updateShareScreenCoordinatesEvent,
  updateShareScreenSizeEvent,
  UserLeftJoinType,
} from '@/types/socket';
import UserNode from './nodes/user';
import { VARZ } from '@/const/varz';
import JailNode from './nodes/jail-node';
import { getPositionFromStringCoordinates } from '@/lib/utils';
import { UserMinimalType } from '@/types/user';
import BgNode from './nodes/bg-node';
import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { checkNodesCollision } from '@/utils/utils';
import { doCirclesMeetRaw } from '../canvas-audio-rendrer';
import InvisibleNodesViewer, {
  InvisibleNodeType,
} from './invisible-nodes-viewer';

const userNodeBound = 86;

enum RoomRfNodeType {
  shareScreenNode = 'shareScreenNode',
  userNode = 'userNode',
}

export default function WithReactFlowV2() {
  const socket = useSocket();

  const { user } = useAuth();

  const rf = useRef<ReactFlowInstance<Node, Edge>>();

  const { room, updateUserCoords } = useRoomContext();

  const [invisibleNodes, setInvisibleNodes] = useState<InvisibleNodeType[]>([]);

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
        extent: 'parent',
        type: 'shareScreenNode',
        draggable: false,
      } as Node;

      rf.current?.setNodes((prev) => {
        return [...prev, shareScreenNode];
      });

      initShareScreenTracks.current = true;
    }
  }, [rf.current, shareScreenTracks]);

  const participantsToRfNodes = useCallback(
    (participants: UserMinimalType[]) => {
      return (
        participants?.map((participant) => {
          const coords = participant?.coordinates?.split(',');

          const rfUserId = '' + participant?.username;

          let xcoord =
            coords?.[0] ?? rf?.current?.getNode(rfUserId)?.position.x ?? 200;
          let ycoord =
            coords?.[1] ?? rf?.current?.getNode(rfUserId)?.position.y ?? 200;

          if (typeof xcoord === 'string' && !isNaN(+xcoord)) {
            xcoord = +xcoord;
          } else {
            xcoord = 200;
          }
          if (typeof ycoord === 'string' && !isNaN(+ycoord)) {
            ycoord = +ycoord;
          } else {
            ycoord = 200;
          }

          const isMyNode = user?.username === participant.username;

          const isDraggable = !!isMyNode;

          let isMeet = !!isMyNode;

          let object: Node = {
            id: '' + participant?.username,
            type: 'userNode',
            data: {
              username: participant.username,
              draggable: isDraggable,
              isDragging: false,
              meet: isMeet,
            },
            position: { x: xcoord, y: ycoord },
            extent: 'parent',
            deletable: false,
          };

          if (!isDraggable) object['draggable'] = false;

          return object;
        }) ?? []
      );
    },
    [user?.username],
  );

  const addNodesToRf = useCallback((nodes: Node[], bgNode?: Node) => {
    let finalNodes: Node[] = [
      {
        id: VARZ.jailNodeId,
        position: {
          x: 0,
          y: 0,
        },
        type: 'jailNode',
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
              participantPosition,
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
          extent: 'parent',
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

    for (let node of nodes) {
      handleCircleMeet(node.id, node.position);
    }

    //Add Node[] to react flow canvas
    addNodesToRf(nodes, {
      id: 'bg-node',
      position: { x: -200, y: -200 },
      data: {},
      type: 'bgNode',
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
        id: 'bg-node',
        position: { x: -200, y: -200 },
        data: { background: data?.background },
        type: 'bgNode',
        draggable: false,
      });
    },
    [participantsToRfNodes, addNodesToRf],
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
          socket?.emit('updateShareScreenCoordinates', sendingObject);
          dispatch({
            type: __BUS.changeMyShareScreenCoord,
            data: sendingObject,
          });
          break;
        case RoomRfNodeType.userNode:
          if (!node?.data?.username) return;

          const allNodes = rf.current?.getNodes() ?? [];
          const droped_node = allNodes.find(
            (n) => n.data.username === node.data.username,
          ) as Node;
          const targetUserName = (droped_node.data as any)?.username;
          updateUserCoords(targetUserName, droped_node?.position);

          for (let n of allNodes) {
            handleCircleMeet(n.id, n?.position);
          }
          break;
      }
    },
    [socket, updateUserCoords, rf?.current],
  );

  const handleCircleMeet = (
    targetUserName: string,
    targetPosition: XYPosition,
    node?: Node,
  ) => {
    let targetUserNode = rf?.current?.getNode(targetUserName);

    if (targetUserNode === undefined && node === undefined) return;

    if (node) targetUserNode = node;

    const position = targetPosition;

    if (!user?.username) return;

    const myUserPosition = rf.current?.getNode(user?.username)?.position;

    if (myUserPosition === undefined) return;

    const { meet } = doCirclesMeetRaw(
      46,
      VARZ.voiceAreaRadius,
      myUserPosition,
      position,
    );

    rf.current?.updateNode(targetUserName, {
      data: { ...targetUserNode?.data, meet },
    });

    return meet;
  };

  useSocket('updateCoordinates', (data: updateCoordinatesEvent) => {
    console.log('updateCoordinates', data);

    const coordsSplitted = data.coordinates.split(',');

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
    'livekitEvent',
    (data: LivekitTrackPublishedType) => {
      switch (data.event) {
        case 'track_published':
          switch (data.track.source) {
            case 'SCREEN_SHARE':
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
                extent: 'parent',
                type: 'shareScreenNode',
                draggable: isMyShareScreen,
              } as Node;

              rf.current?.setNodes((prev) => {
                return [...prev, shareScreenNode];
              });

              break;
          }
          break;
        case 'track_unpublished':
          switch (data.track.source) {
            case 'SCREEN_SHARE':
              rf.current?.setNodes((prev) => {
                return prev.filter((n) => n.id !== data.track.sid);
              });
              break;
          }
          break;
      }
    },
    [rf.current],
  );

  useSocket(
    'updateShareScreenCoordinates',
    (data: updateShareScreenCoordinatesEvent) => {
      rf.current?.updateNode(data.share_screen_id, {
        position: data.coordinates,
      });
    },
  );

  useSocket('updateShareScreenCoordinates', (data) => {});

  useBus(__BUS.changeMyShareScreenCoord, ({ data }) => {});

  useSocket('updateShareScreenSize', (data: updateShareScreenSizeEvent) => {
    rf.current?.updateNode(data.id, {
      width: data.width,
      height: data.height,
    });
  });

  useSocket(
    'userLeftFromRoom',
    (data: UserLeftJoinType) => {
      if (data.room_id === room?.id) {
        rf.current?.setNodes((prev) => {
          return prev.filter((n) => n.id !== data.user.username);
        });
      }
    },
    [room?.id],
  );

  useSocket(
    'userJoinedToRoom',
    (data: UserLeftJoinType) => {
      if (!data?.user) return;

      if (data.room_id !== room?.id) return;

      if (!user) return;

      const isMe = user?.username === data.user.username;

      const currentPositionCoords = getPositionFromStringCoordinates(
        data.user.coordinates ?? '',
      ) ?? { x: 200, y: 200 };

      const meet = handleCircleMeet(data.user.username, currentPositionCoords);

      const nNode: Node = {
        id: data.user.username,
        type: 'userNode',
        data: {
          username: data.user.username,
          draggable: isMe,
          isDragging: false,
          meet,
        },
        position: { x: currentPositionCoords.x, y: currentPositionCoords.y },
        extent: 'parent',
        deletable: false,
        draggable: isMe,
      };

      rf.current?.setNodes((prev) => [...prev, nNode]);

      handleCircleMeet(nNode.id, nNode?.position, nNode);
    },
    [user?.username],
  );

  const dragNodeHandler = useCallback(
    (e: any, draggingNode: Node) => {
      if (draggingNode.type === VARZ.shareScreenNodeType) return;
      let my_node = draggingNode;
      if (!user) return;
      //get all nodes from react flow
      let nodes = rf?.current?.getNodes() || [];
      //separating user nodes from all nodes including dragging node (my node)
      let flatted_nodes = nodes.filter((node) => {
        const isUserNode =
          node.type !== VARZ.jailNodeType &&
          node.type !== VARZ.backgroundNodeType &&
          node.type !== VARZ.shareScreenNodeType &&
          node.id !== my_node.id;
        return isUserNode;
      });

      const jail_node = nodes.find((n) => n.type === VARZ.jailNodeType);
      //colect all nodes that have collisions with my node
      let collisions: Node[] = [];
      let lvl1_x: number | undefined;
      let lvl1_y: number | undefined;
      for (let n of flatted_nodes) {
        const { has_collied, x_position, y_position } = checkNodesCollision(
          my_node,
          n,
          jail_node,
        );

        if (has_collied) {
          collisions.push(n);
          lvl1_x = x_position;
          lvl1_y = y_position;
        }
      }
      let has_collision = collisions.length > 0;
      if (has_collision && lvl1_x && lvl1_y) {
        rf.current?.updateNode(user.username, {
          ...my_node,
          position: { x: lvl1_x, y: lvl1_y },
        });
        let next_collisions: Node[] = [];
        for (let n of flatted_nodes) {
          const { has_collied } = checkNodesCollision(
            { ...my_node, position: { x: lvl1_x, y: lvl1_y } },
            n,
          );
          if (has_collied) {
            next_collisions.push(n);
          }
        }

        if (next_collisions.length > 0) {
          const target_node = next_collisions[next_collisions.length - 1];
          const { x_position: last_x, y_position: last_y } =
            checkNodesCollision(
              {
                ...my_node,
                position: {
                  x: flatted_nodes[flatted_nodes.length - 2]?.position.x,
                  y: flatted_nodes[flatted_nodes.length - 2]?.position.y,
                },
              },
              target_node,
              jail_node,
            );
          rf.current?.updateNode(user.username, {
            ...my_node,
            position: { x: last_x, y: last_y },
          });
        }
      }
    },
    [rf?.current, user],
  );

  const changeViewportHandler = useCallback(
    (viewport: Viewport & { width: number; height: number }) => {
      const properX = Math.abs(viewport.x);
      const properY = Math.abs(viewport.y);
      const properWidth = viewport.width;
      const properHeight = viewport.height;
      let userNodeHeight = userNodeBound * viewport.zoom;

      //Covering area will be from properX to properWidth + properX // properY to properHeight + properY
      const coveringArea = {
        x: { from: properX, to: properX + properWidth },
        y: { from: properY, to: properY + properHeight },
      };
      const coverCenter = {
        x: properX + properWidth / 2,
        y: properY + properHeight / 2,
      };
      if (!user) return;
      const nodes = rf?.current?.getNodes() || [];
      const user_nodes = nodes.filter(
        (node) =>
          node.type !== VARZ.jailNodeType &&
          node.type !== VARZ.backgroundNodeType,
      );
      const flatted_nodes = user_nodes
        .map((item, index) => {
          const itemPositionX = item.position.x * viewport.zoom;
          const itemPositionY = item.position.y * viewport.zoom;
          const offsets = user_nodes
            .filter((_, otherIndex) => otherIndex !== index) //remove current item from others
            .map((otherNode) => {
              const otherPositionX = otherNode.position.x * viewport.zoom;
              const otherPositionY = otherNode.position.y * viewport.zoom;

              const abs_deltaX = Math.abs(itemPositionX - otherPositionX);
              const abs_deltaY = Math.abs(itemPositionY - otherPositionY);
              const deltaX = itemPositionX - otherPositionX;
              const deltaY = itemPositionY - otherPositionY;
              let x_dir = 1;
              let y_dir = 1;
              if (deltaX < 0) {
                x_dir = -1;
              }
              if (deltaY < 0) {
                y_dir = -1;
              }

              const has_overlap =
                abs_deltaX < userNodeHeight || abs_deltaY < userNodeHeight;

              const additional_margin = 20; // additional margin for more spacing from other node
              if (has_overlap) {
                return {
                  id: item.id,
                  offsetX:
                    (abs_deltaX + userNodeBound + additional_margin) * x_dir,
                  offsetY:
                    (abs_deltaY + userNodeBound + additional_margin) * y_dir,
                };
              }
              return null;
            })
            .filter(Boolean);

          //Visible situation
          //If item's left direction is less than viewport's x and viewport's y is less than item's y

          const inTheRightSide = itemPositionX > coveringArea.x.to;
          const inTheLeftSide =
            itemPositionX + userNodeHeight <= coveringArea.x.from;
          const inTheTopSide =
            itemPositionY + userNodeHeight <= coveringArea.y.from;
          const inTheBottomSide = coveringArea.y.to < itemPositionY;
          //define direction based on invisible side of node
          let dir = undefined;
          //calc delta_x and delta_y to find difference of x point and y point from viewport
          let delta_x = undefined;
          let delta_y = undefined;
          //calc distance between end of covering height and  client y
          let delta_y_prime =
            coveringArea.y.to - (itemPositionY + userNodeHeight);
          //calc distance between end covering width and client x
          let delta_x_prime =
            coveringArea.x.to - (itemPositionX + userNodeHeight);

          if (inTheRightSide) {
            dir = 'right';
            delta_x = Math.floor(itemPositionX - coveringArea.x.to);
            delta_y = Math.floor(itemPositionY - coveringArea.y.from);
          } else if (inTheLeftSide) {
            dir = 'left';
            delta_x = Math.floor(itemPositionX - coveringArea.x.from);
            delta_y = Math.floor(itemPositionY - coveringArea.y.from);
          } else if (inTheTopSide) {
            delta_x = Math.floor(itemPositionX - coveringArea.x.from);
            delta_y = Math.floor(itemPositionY - coveringArea.y.from);
            dir = 'top';
          } else if (inTheBottomSide) {
            delta_x = Math.floor(itemPositionX - coveringArea.x.from);
            delta_y = Math.floor(itemPositionY - coveringArea.y.to);
            dir = 'bottom';
          }

          const isInvisible =
            inTheRightSide || inTheLeftSide || inTheTopSide || inTheBottomSide;

          return {
            node: item,
            invisible: isInvisible,
            invisible_side: dir,
            delta_x,
            delta_y,
            zoom: viewport.zoom,
            delta_x_prime,
            delta_y_prime,
            coveringArea,
            coverCenter,
            itemPositionX,
            itemPositionY,
            nodeHeight: userNodeHeight,
            offsets,
          };
        })
        .filter((n) => !!n.invisible);
      setInvisibleNodes(flatted_nodes);
    },
    [rf?.current, user],
  );

  return (
    <div className="w-full h-screen relative z-[10]">
      <InvisibleNodesViewer invisibleNodes={invisibleNodes} />
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
        onViewportChange={changeViewportHandler}
        onNodeDragging={dragNodeHandler}
        onNodeDragStop={handleDragStopRfNodes}
        translateExtent={[
          [0, 0],
          [VARZ.jailWidth - 150, VARZ.jailHeight],
        ]}
        hasJail
      />
    </div>
  );
}
