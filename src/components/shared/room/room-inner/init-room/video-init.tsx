import { useLocalParticipant } from "@livekit/components-react"
import { Track } from "livekit-client"
import { useEffect } from "react"
import { useRoomHolder } from "../.."

export default function VideoInit() {
  const { mediaPermissions } = useRoomHolder()

  const participant = useLocalParticipant()

  const localParticipant = participant?.localParticipant
  let voiceTrack = undefined

  if (
    localParticipant &&
    typeof localParticipant?.getTrackPublication !== "undefined"
  ) {
    //@ts-nocheck
    voiceTrack = localParticipant?.getTrackPublication(Track.Source.Camera)
  }

  const track = voiceTrack?.track

  useEffect(() => {
    if (!track) {
      return
    }

    if (mediaPermissions?.video === true) {
      track.unmute()
    } else {
      track.mute()
      track.stop()
    }
  }, [mediaPermissions?.video, track])

  return null
}
