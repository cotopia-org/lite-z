import { useState, useEffect, useCallback, ReactNode } from "react";

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

const initBgColor = "#c9f1dd";

type Props = {
  nodeTypes: NodeTypes;
  defaultNode: Node[];
  minimapNodeColor?: GetMiniMapNodeAttribute<Node>;
  onNodeDragStop?: OnNodeDrag<Node>;
  onNodeDimensionChanges?: (changes: NodeDimensionChange[]) => void;
  onNodeDimensionChangesTurtle?: (changes: NodeDimensionChange[]) => void;
  translateExtent?: CoordinateExtent;
  onInit?: (rf: ReactFlowInstance<Node, Edge>) => void;
};

let timeout: NodeJS.Timeout;

export default function ReactFlowV2({
  nodeTypes,
  defaultNode,
  minimapNodeColor,
  onNodeDragStop,
  onNodeDimensionChanges,
  onNodeDimensionChangesTurtle,
  translateExtent,
  onInit,
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

  useEffect(() => {
    setNodes(defaultNode ?? []);
  }, [defaultNode]);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={handleChangeNode}
      onNodeDragStop={onNodeDragStop}
      style={{ background: bgColor }}
      nodeTypes={nodeTypes}
      defaultViewport={defaultViewport}
      translateExtent={translateExtent}
      fitView
      attributionPosition='bottom-left'
      onInit={onInit}
    >
      <MiniMap nodeColor={minimapNodeColor} />
      <Controls />
    </ReactFlow>
  );
}
