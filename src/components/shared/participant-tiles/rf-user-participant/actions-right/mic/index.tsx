import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import { cn } from "@/lib/utils"
import {
  TrackMutedIndicatorProps,
  useTrackMutedIndicator,
} from "@livekit/components-react"
import { Mic, MicOff } from "lucide-react"

type Props = {
  trackRef: TrackMutedIndicatorProps["trackRef"]
  forceMuted?: boolean
  className?: string
  micSize?: number
}

export default function MicButton({
  trackRef,
  forceMuted = false,
  className = "",
  micSize = 22,
}: Props) {
  const { isMuted } = useTrackMutedIndicator(trackRef)

  return (
    <CotopiaIconButton className={cn("w-8 h-8 text-black/60", className)}>
      {isMuted || forceMuted ? (
        <MicOff size={micSize} />
      ) : (
        <Mic size={micSize} />
      )}
    </CotopiaIconButton>
  )
}
