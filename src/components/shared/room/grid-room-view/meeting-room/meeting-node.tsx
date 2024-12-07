import { MeetingNodeType, MeetingTileType } from ".."
import UserSessionWrapper from "../../sessions/wrapper/user-session-wrapper"
import MeetingParticipantTile from "./meeting-participant-tile"

type Props = {
  node: MeetingNodeType
}

const MeetingNode = ({ node }: Props) => {
  let view = <MeetingParticipantTile node={node} />
  if (node.type === MeetingTileType.ShareScreenTile) {
    view = <>share screen card</>
  }

  return (
    <UserSessionWrapper username={node.participant.username}>
      {view}
    </UserSessionWrapper>
  )
}

export default MeetingNode
