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
  const up_nodes = userNodes
  // const up_nodes = userNodes
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)
  //   .concat(userNodes)

  const userLength = up_nodes.length
  console.log(userLength, "USERLENGTh")

  let content = <SingleMeetingView userNodes={up_nodes} />

  if (userLength === 1) {
    content = <SingleMeetingView userNodes={up_nodes} />
  }
  if (userLength === 2) {
    content = <DoubleMeetingView userNodes={up_nodes} />
  }
  if (userLength === 3) {
    content = <TriplexMeetingView userNodes={up_nodes} />
  }
  if (userLength === 4) {
    content = <FourPartsMeetingView userNodes={up_nodes} />
  }
  if (userLength > 4) {
    content = <MultiPartMeetingView nodes={up_nodes} />
  }

  return <div className="p-4 w-full h-full">{content}</div>
}

export default ParticipantsView
