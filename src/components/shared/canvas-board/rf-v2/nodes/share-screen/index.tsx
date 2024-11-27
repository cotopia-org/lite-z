import { NodeResizeControl } from "@xyflow/react";
import { SquareArrowOutDownRight } from "lucide-react";
import { memo, useState } from "react";
import Actions from "./actions";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useSocket } from "@/routes/private-wrarpper";
import { VideoTrack } from "@/components/shared/video-track";
import { useTracks } from "@livekit/components-react";
import useAuth from "@/hooks/auth";

function ShareScreenNode({ data }: any) {
  const socket = useSocket();

  const { user } = useAuth();

  const alltracks = useTracks();

  const targetTrack = alltracks.find(
    (track) =>
      track.source?.toLowerCase() ===
        data?.livekit?.track?.source?.toLowerCase() &&
      data?.livekit?.participant?.identity ===
        data?.livekit?.participant?.identity
  );

  const canResize = user?.username === targetTrack?.participant.identity;

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
        identity={data?.livekit?.track?.participant?.identity}
        onFullScreen={() => setIsFullScreen((prev) => !prev)}
      />
      {canResize && (
        <NodeResizeControl
          minWidth={500}
          minHeight={300}
          keepAspectRatio
          onResizeEnd={(_, params) => {
            socket?.emit("updateShareScreenSize", {
              room_id: data.room_id,
              id: data?.livekit?.id,
              width: params?.width,
              height: params?.height,
            });
          }}
        >
          <SquareArrowOutDownRight />
        </NodeResizeControl>
      )}
      {!!targetTrack && <VideoTrack trackRef={targetTrack} />}
    </div>
  );

  return isFullScreen
    ? createPortal(content, document.getElementById("portal") as any)
    : content;
}

export default memo(ShareScreenNode);
