import { MeetingNodeType } from "../.."
import MeetingNode from "../meeting-node"

type Props = {
  userNodes: MeetingNodeType[]
}

const TriplexMeetingView = ({ userNodes }: Props) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 h-full w-full">
      {userNodes.slice(0, 2).map((node) => {
        return (
          <div key={node.id} className="col-span-6">
            <MeetingNode node={node} />
          </div>
        )
      })}
      <div className="col-span-12 grid grid-cols-subgrid">
        {userNodes.slice(-1).map((node) => {
          return (
            <div key={node.id} className="col-span-6 col-start-4 ">
              <MeetingNode node={node} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TriplexMeetingView
