import {
  PinState,
  TrackReferenceOrPlaceholder,
  isTrackReference,
  isTrackReferencePlaceholder,
} from "@livekit/components-core"

function isTrackReferencePinned(
  trackReference: TrackReferenceOrPlaceholder,
  pinState: PinState | undefined
): boolean {
  if (typeof pinState === "undefined") {
    return false
  }
  if (isTrackReference(trackReference)) {
    return pinState.some(
      (pinnedTrackReference) =>
        pinnedTrackReference?.participant?.identity ===
          trackReference?.participant?.identity &&
        isTrackReference(pinnedTrackReference) &&
        pinnedTrackReference.publication.trackSid ===
          trackReference.publication.trackSid
    )
  } else if (isTrackReferencePlaceholder(trackReference)) {
    return pinState.some(
      (pinnedTrackReference) =>
        pinnedTrackReference?.participant?.identity ===
          trackReference?.participant?.identity &&
        isTrackReferencePlaceholder(pinnedTrackReference) &&
        pinnedTrackReference.source === trackReference.source
    )
  } else {
    return false
  }
}

export default isTrackReferencePinned
