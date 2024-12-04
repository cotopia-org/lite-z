import { TrackReferenceOrPlaceholder } from "@livekit/components-core"
import ParticipantTileProvider from "../participant-tile-provider"
import UserCircle from "./user-circle"

const RfUserParticipant = ({
  username,
  isDragging,
  meet,
  trackRef,
}: {
  username: string
  isDragging: boolean
  meet: boolean
  trackRef: TrackReferenceOrPlaceholder
}) => {
  return (
    <ParticipantTileProvider trackRef={trackRef} username={username}>
      <UserCircle meet={meet} isDragging={isDragging} />
    </ParticipantTileProvider>
  )
}

export default RfUserParticipant
