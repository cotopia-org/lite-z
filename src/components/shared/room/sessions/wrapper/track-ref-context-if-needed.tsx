import { TrackReferenceType } from "@/types/track-reference"
import {
  TrackRefContext,
  useMaybeTrackRefContext,
} from "@livekit/components-react"

function TrackRefContextIfNeeded(
  props: React.PropsWithChildren<{
    trackRef?: TrackReferenceType
  }>
) {
  const hasContext = !!useMaybeTrackRefContext()

  return props.trackRef && !hasContext ? (
    <TrackRefContext.Provider value={props.trackRef as any}>
      {props.children}
    </TrackRefContext.Provider>
  ) : (
    <>{props.children}</>
  )
}

export default TrackRefContextIfNeeded
