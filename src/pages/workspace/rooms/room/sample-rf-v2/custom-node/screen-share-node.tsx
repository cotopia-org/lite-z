import { NodeResizeControl } from "@xyflow/react";
import { SquareArrowOutDownRight } from "lucide-react";
import { memo, useState } from "react";

export default memo(({ data }: any) => {
  const [rect, setRect] = useState({ width: 300, height: 200 });

  return (
    <>
      <NodeResizeControl minWidth={rect.width} minHeight={rect.height}>
        <SquareArrowOutDownRight />
      </NodeResizeControl>
      <div>{data.label}</div>
    </>
  );
});
