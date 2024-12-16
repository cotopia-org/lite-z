import { TrackReferenceOrPlaceholder } from "@livekit/components-core"
import { Track } from "livekit-client"

const useExcludeShareScreenTrack = (tracks: TrackReferenceOrPlaceholder[]) => {
  let finalTracks = []
  for (let item of tracks) {
    if (item.source !== Track.Source.ScreenShare) {
      finalTracks.push(item)
    }
  }
  return finalTracks
}

export default useExcludeShareScreenTrack
