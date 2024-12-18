import { MeetingNodeType } from "../.."
import MeetingNode from "../meeting-node"

interface Props {
  userNodes: MeetingNodeType[]
}

const SingleMeetingView = ({ userNodes }: Props) => {
  return (
    <div className="grid h-full w-full grid-cols-12">
      {userNodes.map((userNode) => {
        return (
          <div key={userNode.id} className="col-span-12">
            <MeetingNode node={userNode} />
          </div>
        )
      })}
    </div>
  )
}

export default SingleMeetingView
