import { NodeResizeControl, useReactFlow } from "@xyflow/react"
import { SquareArrowOutDownRight } from "lucide-react"
import { memo, useState } from "react"
import Actions from "./actions"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { useSocket } from "@/routes/private-wrarpper"
import { VideoTrack } from "@/components/shared/video-track"
import { useTracks } from "@livekit/components-react"
import useAuth from "@/hooks/auth"

import { VARZ } from "@/const/varz"
import { doCirclesMeetRaw } from "../../../canvas-audio-rendrer"

function ShareScreenNode({ data }: any) {
  const socket = useSocket()

  const [isFullScreen, setIsFullScreen] = useState(false)

  const { user } = useAuth()

  const alltracks = useTracks()

  console.log(alltracks, "ALLTRACKS")

  const targetTrack = alltracks.find((track) => {
    console.log(track, data?.livekit?.track?.source, "inner track")
    return (
      track.source?.toLowerCase() ===
        data?.livekit?.track?.source?.toLowerCase() &&
      data?.livekit?.participant?.identity === track.participant.identity
    )
  })

  const canResize = user?.username === targetTrack?.participant.identity

  const rf = useReactFlow()

  if (!user) return null

  const myUser = rf.getNode(user.username)
  const targetUser = rf.getNode(data?.livekit?.participant?.identity)

  const currentPositionCoords = myUser?.position

  if (currentPositionCoords === undefined) return null

  if (targetUser === undefined) return null

  const { meet } = doCirclesMeetRaw(
    46,
    VARZ.voiceAreaRadius,
    currentPositionCoords,
    targetUser?.position
  )

  if (!meet) return null

  let content = (
    <>
      <div
        className={cn(
          "h-full w-full [&_video]:!object-contain [&:hover_.actions]:opacity-100 [&:hover_.actions]:visible",
          isFullScreen
            ? "fixed top-0 left-0 bg-black"
            : "relative border shadow-lg rounded-xl overflow-hidden"
        )}
      >
        <Actions
          isFullScreen={isFullScreen}
          onExitFullScreen={() => setIsFullScreen(false)}
          identity={data?.livekit?.participant?.identity}
          onFullScreen={() => setIsFullScreen((prev) => !prev)}
        />
        {!!targetTrack && <VideoTrack trackRef={targetTrack} />}
      </div>
      {canResize && (
        <NodeResizeControl
          minWidth={500}
          minHeight={300}
          keepAspectRatio
          onResizeEnd={(_, params) => {
            socket?.emit("updateShareScreenSize", {
              room_id: data.room_id,
              id: data?.livekit?.track?.sid,
              width: params?.width,
              height: params?.height,
            })
          }}
        >
          <SquareArrowOutDownRight />
        </NodeResizeControl>
      )}
    </>
  )

  return isFullScreen
    ? createPortal(content, document.getElementById("portal") as any)
    : content
}

export default memo(ShareScreenNode)
