import ReactFlowV2 from "@/components/shared/react-flow/v2";
import userNode from "./custom-node/user-node";
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
          userNode,
          screenShareNode,
        }}
        defaultNode={[
          {
            id: "2",
            type: "userNode",
            data: {
              label: "K",
            },
            position: { x: 200, y: 200 },
          },
          {
            id: "3",
            type: "userNode",
            data: { label: "M" },
            position: { x: 300, y: 300 },
          },
          {
            id: "4",
            type: "screenShareNode",
            data: { label: "My Screen Share Card" },
            position: { x: 300, y: 700 },
            style: {
              width: 300,
              height: 200,
            },
            className: "shadow-md rounded-md bg-white",
          },
        ]}
        onInit={(rf) => (reactFlow.current = rf)}
      />
    </div>
  );
}
