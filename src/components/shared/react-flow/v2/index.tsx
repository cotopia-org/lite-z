import { useMemo, useState } from "react";

import "@xyflow/react/dist/style.css";

import {
  ReactFlow,
  useNodesState,
  Node,
  NodeTypes,
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
  onNodeDragStop?: OnNodeDrag<Node>;
  onNodeDragging?: OnNodeDrag<Node>;
  onNodeDragStart?: OnNodeDrag<Node>;
  onNodeDimensionChanges?: (changes: NodeDimensionChange[]) => void;
  onNodeDimensionChangesTurtle?: (changes: NodeDimensionChange[]) => void;
  translateExtent?: CoordinateExtent;
  onInit?: (rf: ReactFlowInstance<Node, Edge>) => void;
  hasJail?: boolean;
};

let timeout: NodeJS.Timeout;

export default function ReactFlowV2({
  nodeTypes,
  onNodeDragStop,
  onNodeDragging,
  onNodeDragStart,
  onNodeDimensionChanges,
  onNodeDimensionChangesTurtle,
  translateExtent,
  onInit,
  hasJail = false,
}: Props) {
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

  //We define finalNodeTypes because we want to add custom node type but always static such as jailNode and ...
  let finalNodeTypes = nodeTypes;

  if (hasJail) finalNodeTypes["jailNode"] = JailNode;

  return (
    <ReactFlow
      nodes={nodes}
      onNodeDrag={onNodeDragging}
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
