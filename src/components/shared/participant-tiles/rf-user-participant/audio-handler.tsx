import {
  AudioTrack,
  TrackReferenceOrPlaceholder,
  useMaybeLayoutContext,
} from "@livekit/components-react"
import React from "react"
import isTrackReferencePinned from "@/components/shared/room/sessions/wrapper/is-track-ref-pinned"
import { useParticipantTileCtx } from "../participant-tile-provider"

interface Props {}

const AudioTrackHandler = (props: Props) => {
  const { trackRef } = useParticipantTileCtx()

  const trackReference = trackRef as TrackReferenceOrPlaceholder

  const layoutContext = useMaybeLayoutContext()

  const handleSubscribe = React.useCallback(
    (subscribed: boolean) => {
      if (
        trackReference.source &&
        !subscribed &&
        layoutContext &&
        layoutContext.pin.dispatch &&
        isTrackReferencePinned(trackReference, layoutContext.pin.state)
      ) {
        layoutContext.pin.dispatch({ msg: "clear_pin" })
      }
    },
    [trackReference, layoutContext]
  )

  return (
    //@ts-ignore
    <AudioTrack
      trackRef={trackRef as any}
      onSubscriptionStatusChanged={handleSubscribe}
    />
  )
}

export default AudioTrackHandler
