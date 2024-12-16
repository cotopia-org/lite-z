import { ReactNode, useState } from "react"
import { useShareScreenCtx } from "./provider"
import { cn } from "@/lib/utils"
import Actions from "./actions"
import { VideoTrack } from "@/components/shared/video-track"
import { createPortal } from "react-dom"

type Props = {
  showAction?: boolean
  resizeNode?: ReactNode
  className?: string
}

const ShareScreenCard = ({
  showAction = true,
  resizeNode,
  className = "",
}: Props) => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const { identity, targetTrack } = useShareScreenCtx()

  let content = (
    <>
      <div
        className={cn(
          "h-full w-full [&_video]:!object-contain [&:hover_.actions]:opacity-100 [&:hover_.actions]:visible",
          className,
          isFullScreen
            ? "fixed top-0 left-0 bg-black"
            : "relative border shadow-lg rounded-xl overflow-hidden"
        )}
      >
        {!!showAction && (
          <Actions
            isFullScreen={isFullScreen}
            onExitFullScreen={() => setIsFullScreen(false)}
            identity={identity}
            onFullScreen={() => setIsFullScreen((prev) => !prev)}
          />
        )}
        {!!targetTrack && <VideoTrack trackRef={targetTrack} />}
      </div>
      {resizeNode && resizeNode}
    </>
  )

  return isFullScreen
    ? createPortal(content, document.getElementById("portal") as any)
    : content
}

export default ShareScreenCard
