import { MeetingNodeType } from "../.."
import SingleMeetingView from "./single-view"
import MultipleMeetingView from "./double-meeting-view"

type Props = {
  userNodes: MeetingNodeType[]
}

const ParticipantsView = ({ userNodes }: Props) => {
  //single view
  const up_nodes = userNodes

  const userLength = up_nodes.length

  let content = <SingleMeetingView userNodes={up_nodes} />

  if (userLength > 1) {
    content = <MultipleMeetingView userNodes={up_nodes} />
  }

  return <div className="p-4 w-full h-[calc(100vh-160px)] overflow-y-auto">{content}</div>
}

export default ParticipantsView
