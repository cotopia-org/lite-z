import { NodeResizeControl } from "@xyflow/react";
import { SquareArrowOutDownRight } from "lucide-react";
import React, { memo } from "react";

function ShareScreenNode({ data }: any) {
  return (
    <div>
      <NodeResizeControl minWidth={500} minHeight={200}>
        <SquareArrowOutDownRight />
      </NodeResizeControl>
      {data?.label ?? "-"}
    </div>
  );
}

export default memo(ShareScreenNode);
