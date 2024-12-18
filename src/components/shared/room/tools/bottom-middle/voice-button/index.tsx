import { useLocalParticipant } from "@livekit/components-react"
import { Track } from "livekit-client"
import { useRoomHolder } from "../../.."
import { toast } from "sonner"
import StreamButton from "../stream-button"
import { MicIcon, MicOffIcon } from "@/components/icons"
import { useCallback, useEffect, useState } from "react"
import { colors } from "@/const/varz"

export default function VoiceButtonTool() {
  const [navPermission, setNavPermission] = useState(true)

  const {
    enableAudioAccess,
    disableAudioAccess,
    mediaPermissions,
    stream_loading,
  } = useRoomHolder()
  const participant = useLocalParticipant()

  const localParticipant = participant.localParticipant
  let voiceTrack = undefined
  if (
    localParticipant &&
    typeof localParticipant?.getTrackPublication !== "undefined"
  ) {
    //@ts-nocheck
    voiceTrack = localParticipant?.getTrackPublication(Track.Source.Microphone)
  }

  const track = voiceTrack?.track
  const isMuted = voiceTrack?.isMuted ?? true

  const toggleMute = useCallback(async () => {
    if (!navPermission) {
      return toast.error(
        "Access to microphone is blocked,please check your browser settings"
      )
    } else {
      if (!track) {
        // eslint-disable-next-line no-sequences
        return localParticipant.setMicrophoneEnabled(true), enableAudioAccess()
      }
      if (track.isMuted) {
        track.unmute()
        enableAudioAccess()
      } else {
        track.mute()
        track.stop()
        disableAudioAccess()
      }
    }
  }, [
    disableAudioAccess,
    enableAudioAccess,
    localParticipant,
    navPermission,
    track,
  ])

  useEffect(() => {
    navigator.permissions.query({ name: "microphone" } as any).then((res) => {
      const permState = res.state
      if (permState === "denied") {
        setNavPermission(false)
      } else {
        setNavPermission(true)
      }
    })
  }, [])

  let title = "Mic Off"

  let default_clss = ""
  let mic_off_color = colors.foreground
  let mic_on_color = colors.foreground

  if (!navPermission) {
    title = "Permission denied"
  }

  if (!navPermission || !mediaPermissions.audio) {
    mic_off_color = colors.error.default
    default_clss = " !bg-error-surface-default"
  }
  if (mediaPermissions.audio) {
    mic_on_color = colors.success.default
    default_clss = " !bg-success-surface-default"
  }

  if (track?.isMuted) title = "Mic on"

  return (
    <StreamButton
      onClick={toggleMute}
      tooltipTitle={title}
      loading={stream_loading}
      className={default_clss}
    >
      {isMuted ? (
        <MicOffIcon color={mic_off_color} size={20} />
      ) : (
        <MicIcon color={mic_on_color} size={20} />
      )}
    </StreamButton>
  )
}
