import {
  TrackReference,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  useFeatureContext,
  useMaybeLayoutContext,
} from "@livekit/components-react"
import { useCallback } from "react"
import isTrackReferencePinned from "@/components/shared/room/sessions/wrapper/is-track-ref-pinned"
import { useParticipantTileCtx } from "../participant-tile-provider"

interface Props {}

const VideoTrackHandler = (props: Props) => {
  const { trackRef } = useParticipantTileCtx()

  const trackReference = trackRef as TrackReferenceOrPlaceholder

  const layoutContext = useMaybeLayoutContext()

  const handleSubscribe = useCallback(
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

  const autoManageSubscription = useFeatureContext()?.autoSubscription

  return (
    //@ts-ignore
    <VideoTrack
      trackRef={trackReference as TrackReference}
      onSubscriptionStatusChanged={handleSubscribe}
      manageSubscription={autoManageSubscription}
    />
  )
}

export default VideoTrackHandler
