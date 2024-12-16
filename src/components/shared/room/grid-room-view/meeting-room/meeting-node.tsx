import { MeetingNodeType } from ".."
import UserSessionWrapper from "../../sessions/wrapper/user-session-wrapper"
import MeetingParticipantTile from "./meeting-participant-tile"

type Props = {
  node: MeetingNodeType
}

const MeetingNode = ({ node }: Props) => {
  return (
    <UserSessionWrapper username={node.participant.username}>
      <MeetingParticipantTile node={node} />
    </UserSessionWrapper>
  )
}

export default MeetingNode
