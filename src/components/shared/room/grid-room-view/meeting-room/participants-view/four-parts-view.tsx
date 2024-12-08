import { MeetingNodeType } from "../.."
import MeetingNode from "../meeting-node"

type Props = {
  userNodes: MeetingNodeType[]
}

const FourPartsMeetingView = ({ userNodes }: Props) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 h-full w-full">
      {userNodes.map((node) => {
        return (
          <div key={node.id} className="col-span-6">
            <MeetingNode node={node} />
          </div>
        )
      })}
    </div>
  )
}

export default FourPartsMeetingView
