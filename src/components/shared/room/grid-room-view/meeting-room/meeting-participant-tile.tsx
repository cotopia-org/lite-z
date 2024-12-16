import { ParticipantTileProvider } from "@/components/shared/participant-tiles"
import { useUserSessionCtx } from "../../sessions/wrapper/user-session"
import { TrackReferenceOrPlaceholder } from "@livekit/components-core"
import { MeetingNodeType } from ".."
import UserTile from "./user-tile"

interface Props {
  node: MeetingNodeType
}

const MeetingParticipantTile = ({ node }: Props) => {
  const { track: trackRef } = useUserSessionCtx()

  return (
    <ParticipantTileProvider
      username={node.participant.username}
      trackRef={trackRef as TrackReferenceOrPlaceholder}
    >
      <UserTile />
    </ParticipantTileProvider>
  )
}

export default MeetingParticipantTile
