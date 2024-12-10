import { useParticipantTileCtx } from "@/components/shared/participant-tiles/participant-tile-provider"
import { cn } from "@/lib/utils"
import UserTileAvatar from "./avatar"
import MicButton from "@/components/shared/participant-tiles/rf-user-participant/actions-right/mic"
import { TrackReferenceOrPlaceholder } from "@livekit/components-core"
import { Track } from "livekit-client"
import AudioTrackHandler from "@/components/shared/participant-tiles/rf-user-participant/audio-handler"
import VideoTrackHandler from "@/components/shared/participant-tiles/rf-user-participant/video-handler"

type Props = {
  className?: string
}

const UserTile = ({ className = "" }: Props) => {
  const { ref, htmlProps, trackRef, targetUser, trackType } =
    useParticipantTileCtx()

  const trackReference = trackRef as TrackReferenceOrPlaceholder
  let video_clss = ""
  let trackContent = (
    <>
      <UserTileAvatar />
      {trackType === "audio" ? <AudioTrackHandler /> : null}
    </>
  )

  if (trackType === "video") {
    trackContent = <VideoTrackHandler />
    video_clss =
      "[&_.lk-participant-tile]:!absolute [&_.lk-participant-tile]:top-0 [&_.lk-participant-tile]:left-0 [&_.lk-participant-tile]:bottom-0 [&_.lk-participant-tile]:left-0 [&_.lk-participant-tile]:right-0 [&_.lk-participant-tile]:w-full [&_.lk-participant-tile]:h-full [&_video]:object-cover [&_video]:!h-full [&_video]:!w-auto [&_video]:!max-w-full"
  }

  return (
    <div
      className={cn(
        `user-tile bg-white/25 relative w-full h-full flex flex-col overflow-hidden
         p-3 items-center justify-center rounded-2xl`,
        video_clss,
        className
      )}
    >
      <div ref={ref} style={{ position: "relative" }} {...htmlProps}>
        {trackContent}
      </div>
      <MicButton
        className="mic-action absolute left-3 bottom-3 w-6 h-6"
        micSize={16}
        trackRef={{
          participant: trackReference?.participant,
          source: Track.Source.Microphone,
        }}
        forceMuted={
          trackReference?.participant?.identity !== targetUser?.username
        }
      />
    </div>
  )
}

export default UserTile
