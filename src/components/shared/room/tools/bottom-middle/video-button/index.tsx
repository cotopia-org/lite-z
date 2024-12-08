import { useLocalParticipant } from "@livekit/components-react"
import { Track } from "livekit-client"
import { useRoomHolder } from "../../.."
import { toast } from "sonner"
import { useCallback, useEffect, useState } from "react"
import StreamButton from "../stream-button"
import { VideoIcon, VideoOffIcon } from "@/components/icons"
import { colors } from "@/const/varz"

export default function VideoButtonTool() {
  const [navPermission, setNavPermission] = useState(true)

  const {
    enableVideoAccess,
    disableVideoAccess,
    mediaPermissions,
    stream_loading,
  } = useRoomHolder()

  const participant = useLocalParticipant()

  const localParticipant = participant.localParticipant

  let videoTrack = undefined

  if (
    localParticipant &&
    typeof localParticipant?.getTrackPublication !== "undefined"
  ) {
    //@ts-nocheck
    videoTrack = localParticipant?.getTrackPublication(Track.Source.Camera)
  }

  const track = videoTrack?.track

  const isUpstreamPaused = videoTrack?.isMuted ?? true

  const toggleUpstream = useCallback(async () => {
    if (!navPermission) {
      return toast.error(
        "Access to camera is blocked,please check your browser settings"
      )
    } else {
      if (!track) {
        // eslint-disable-next-line no-sequences
        return localParticipant.setCameraEnabled(true), enableVideoAccess()
      }
      if (isUpstreamPaused) {
        enableVideoAccess()
        track.unmute()
      } else {
        disableVideoAccess()
        track.mute()
        track.stop()
      }
    }
  }, [
    disableVideoAccess,
    enableVideoAccess,
    isUpstreamPaused,
    localParticipant,
    navPermission,
    track,
  ])

  useEffect(() => {
    navigator.permissions.query({ name: "camera" } as any).then((res) => {
      const permState = res.state
      if (permState === "denied") {
        setNavPermission(false)
      } else {
        setNavPermission(true)
      }
    })
  }, [])

  let title = "Video Off"

  let default_clss = ""
  let video_off_color = colors.foreground
  let video_on_color = colors.foreground

  if (!navPermission) {
    title = "Permission denied"
  }

  if (!navPermission || !mediaPermissions.video) {
    video_off_color = colors.error.default
    default_clss = " !bg-error-surface-default"
  }
  if (mediaPermissions.video) {
    video_on_color = colors.success.default
    default_clss = " !bg-success-surface-default"
  }

  if (track?.isMuted) title = "Video on"

  return (
    <StreamButton
      tooltipTitle={title}
      loading={stream_loading}
      onClick={toggleUpstream}
      className={default_clss}
    >
      {isUpstreamPaused ? (
        <VideoOffIcon color={video_off_color} size={20} />
      ) : (
        <VideoIcon color={video_on_color} size={20} />
      )}
    </StreamButton>
  )
}
