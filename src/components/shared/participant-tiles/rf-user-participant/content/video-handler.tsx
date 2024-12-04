import {
  TrackReference,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  useFeatureContext,
  useMaybeLayoutContext,
} from "@livekit/components-react"
import { useParticipantTileCtx } from "../../participant-tile-provider"
import { useCallback } from "react"
import isTrackReferencePinned from "@/components/shared/room/sessions/wrapper/is-track-ref-pinned"

interface Props {}

const RfVideoHandler = (props: Props) => {
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

export default RfVideoHandler
