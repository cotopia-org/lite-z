import { useMemo } from "react"
import { MeetingNodeType } from "../.."
import DoubleMeetingView from "./double-meeting-view"
import FourPartsMeetingView from "./four-parts-view"
import MultiPartMeetingView from "./multi-part-meeting-view"
import SingleMeetingView from "./single-view"
import TriplexMeetingView from "./triplex-view"

type Props = {
  userNodes: MeetingNodeType[]
}

const ParticipantsView = ({ userNodes }: Props) => {
  //single view

  const userLength = useMemo(() => {
    return userNodes.length
  }, [userNodes])

  let content = <SingleMeetingView userNodes={userNodes} />

  if (userLength === 1) {
    content = <SingleMeetingView userNodes={userNodes} />
  }
  if (userLength === 2) {
    content = <DoubleMeetingView userNodes={userNodes} />
  }
  if (userLength === 3) {
    content = <TriplexMeetingView userNodes={userNodes} />
  }
  if (userLength === 4) {
    content = <FourPartsMeetingView userNodes={userNodes} />
  }
  if (userLength > 4 && userLength <= 9) {
    content = <MultiPartMeetingView nodes={userNodes} />
  }

  return <div className="p-4 w-full h-full">{content}</div>
}

export default ParticipantsView
