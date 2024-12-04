import CotopiaAvatar from "@/components/shared-ui/c-avatar"
import { useParticipantTileCtx } from "../../participant-tile-provider"
import RfAudioHandler from "./audio-handler"
import RfVideoHandler from "./video-handler"
import RfUserTileActions from "../actions"

interface Props {
  meet: boolean
}

const RfUserTileContent = ({ meet }: Props) => {
  const { trackType, targetUser, livekitIdentity, userFullName, isSpeaking } =
    useParticipantTileCtx()

  let clss =
    "relative z-[10] user-circle transition-all w-full h-full [&_.lk-participant-tile]:!absolute [&_.lk-participant-tile]:w-full [&_.lk-participant-tile]:h-full [&_.lk-participant-tile]:top-0 [&_.lk-participant-tile]:left-0 rounded-full p-1 [&_video]:h-full [&_video]:object-cover [&_video]:rounded-full [&_video]:h-full [&_video]:w-full w-[96px] h-[96px] flex flex-col items-center justify-center"
  let showAvatar = true

  let trackContent: any = null

  if (trackType === "video" && meet) showAvatar = false

  //Scale down the user profile if user isn't in user's area
  if (!meet) clss += ` scale-[0.6]`

  //Highlight user circle in different states
  if (isSpeaking && meet) {
    clss += ` bg-green-700`
  }

  if (!isSpeaking) {
    clss += ` bg-black/10`
  }

  if (!meet) {
    clss += ` bg-gray-600`
  }

  if (trackType === "audio") {
    trackContent = <RfAudioHandler />
  }
  if (trackType === "video") {
    trackContent = <RfVideoHandler />
  }

  return (
    <div className={clss}>
      <div className="relative w-[86px] h-[86px] rounded-full flex flex-col items-center justify-center">
        {showAvatar && (
          <CotopiaAvatar
            className="absolute top-0 left-0 w-full h-full z-[1]"
            src={targetUser?.avatar?.url ?? ""}
            title={userFullName?.[0] ?? livekitIdentity?.[0]}
          />
        )}
        {trackContent}
      </div>
      <RfUserTileActions />
    </div>
  )
}

export default RfUserTileContent
