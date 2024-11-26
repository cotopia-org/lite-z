import { VideoTrack } from "@livekit/components-react";
import { NodeResizeControl } from "@xyflow/react";
import { SquareArrowOutDownRight } from "lucide-react";
import { memo, useState } from "react";
import Actions from "./actions";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

function ShareScreenNode({ data }: any) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  let content = (
    <div
      className={cn(
        "h-full w-full [&_video]:!object-contain [&:hover_.actions]:opacity-100 [&:hover_.actions]:visible",
        isFullScreen ? "fixed top-0 left-0 bg-black" : "relative"
      )}
    >
      <Actions
        isFullScreen={isFullScreen}
        onExitFullScreen={() => setIsFullScreen(false)}
        identity={data?.track?.participant?.identity}
        onFullScreen={() => setIsFullScreen(true)}
      />
      <NodeResizeControl minWidth={500} minHeight={300} keepAspectRatio>
        <SquareArrowOutDownRight />
      </NodeResizeControl>
      <VideoTrack trackRef={data?.track} />
    </div>
  );

  return isFullScreen
    ? createPortal(content, document.getElementById("portal") as any)
    : content;
}

export default memo(ShareScreenNode);
