import { useState, useEffect, useCallback, ReactNode, useMemo } from "react";

import "@xyflow/react/dist/style.css";

import {
  ReactFlow,
  useNodesState,
  MiniMap,
  Controls,
  Node,
  NodeTypes,
  GetMiniMapNodeAttribute,
  OnNodeDrag,
  CoordinateExtent,
  NodeChange,
  NodeDimensionChange,
  ReactFlowInstance,
  Edge,
} from "@xyflow/react";
import JailNode from "./custom-nodes/jail-node";
import Toolbar from "../../room/toolbar";
import TopLeftTools from "../../room/tools/top-left";
import TopRightTools from "../../room/tools/top-right";
import BottomLeftTools from "../../room/tools/bottom-left";
import BottomMiddleTools from "../../room/tools/bottom-middle";
import BottomRightTools from "../../room/tools/bottom-right";
import BgNode from "./custom-nodes/bg-node";

const initBgColor = "#c9f1dd";

type Props = {
  nodeTypes: NodeTypes;
  defaultNode: Node[];
  onNodeDragStop?: OnNodeDrag<Node>;
  onNodeDragStart?: OnNodeDrag<Node>;
  onNodeDimensionChanges?: (changes: NodeDimensionChange[]) => void;
  onNodeDimensionChangesTurtle?: (changes: NodeDimensionChange[]) => void;
  translateExtent?: CoordinateExtent;
  onInit?: (rf: ReactFlowInstance<Node, Edge>) => void;
  background?: string;
  hasJail?: boolean;
};

let timeout: NodeJS.Timeout;

export default function ReactFlowV2({
  nodeTypes,
  defaultNode,
  onNodeDragStop,
  onNodeDragStart,
  onNodeDimensionChanges,
  onNodeDimensionChangesTurtle,
  translateExtent,
  onInit,
  hasJail = false,
  background,
}: Props) {
  //Generate ranom jail node
  const jailId = useMemo(() => {
    return `jail-${(Math.random() * 100000000000).toFixed(0)}`;
  }, []);

  const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const handleChangeNode = (changes: NodeChange<Node>[]) => {
    //Filtered dimensions
    const dimensionChanges = changes.filter(
      (change) => change.type === "dimensions"
    );

    //Trigger dimensions changes
    if (dimensionChanges?.length > 0) {
      clearTimeout(timeout);

      //Turtle triggering
      timeout = setTimeout(() => {
        if (onNodeDimensionChangesTurtle)
          //@ts-ignore
          onNodeDimensionChangesTurtle(dimensionChanges);
      }, 1000);

      //Normal triggering
      if (onNodeDimensionChanges)
        //@ts-ignore
        onNodeDimensionChanges(dimensionChanges);
    }

    onNodesChange(changes);
  };
  const [bgColor] = useState(initBgColor);

  useEffect(() => {
    let finalDefaultNodes = defaultNode ?? [];

    if (hasJail !== undefined && hasJail === true) {
      finalDefaultNodes = [
        ...finalDefaultNodes.map((n) => {
          n.parentId = jailId;
          n.extent = "parent";
          return n;
        }),
        {
          id: jailId,
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
    }

    if (background !== undefined) {
      finalDefaultNodes = [
        {
          id: "background-node",
          position: {
            x: -200,
            y: -200,
          },
          type: "bgNode",
          draggable: false,
          data: {
            background,
          },
          focusable: false,
          deletable: false,
          selectable: false,
        },
        ...finalDefaultNodes,
      ];
    }

    setNodes(finalDefaultNodes ?? []);
  }, [defaultNode, hasJail, jailId]);

  //We define finalNodeTypes because we want to add custom node type but always static such as jailNode and ...
  let finalNodeTypes = nodeTypes;

  if (hasJail) finalNodeTypes["jailNode"] = JailNode;
  if (background) finalNodeTypes["bgNode"] = BgNode;

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={handleChangeNode}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
      style={{ background: bgColor }}
      nodeTypes={finalNodeTypes}
      defaultViewport={defaultViewport}
      translateExtent={translateExtent}
      fitView
      attributionPosition='bottom-left'
      onInit={onInit}
    >
      {/* <MiniMap nodeColor={minimapNodeColor} />
      <Controls /> */}
      <Toolbar
        topLeft={<TopLeftTools />}
        topRight={<TopRightTools />}
        bottomLeft={<BottomLeftTools />}
        bottomMiddle={<BottomMiddleTools />}
        bottomRight={<BottomRightTools />}
      />
    </ReactFlow>
  );
}
