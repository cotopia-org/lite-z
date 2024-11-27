import ReactFlowV2 from "@/components/shared/react-flow/v2";
import UserNode from "@/components/shared/canvas-board/rf-v2/nodes/user";
import { useRef } from "react";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import screenShareNode from "./custom-node/screen-share-node";

export default function SampleRfV2() {
  const reactFlow = useRef<ReactFlowInstance<Node, Edge>>();

  //   reactFlow.current?.setNodes((nds) =>
  //     nds.map((node) => {
  //       if (node.id === "4") {
  //         return {
  //           ...node,
  //           position: {
  //             x: Math.random() * 1000,
  //             y: Math.random() * 600,
  //           },
  //         };
  //       }

  //       return node;
  //     })
  //   )

  return (
    <div className='w-screen h-screen'>
      <ReactFlowV2
        nodeTypes={{
          UserNode,
          screenShareNode,
        }}
        onInit={(rf) => (reactFlow.current = rf)}
      />
    </div>
  );
}
