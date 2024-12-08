import { MeetingNodeType } from "../.."
import MeetingNode from "../meeting-node"

type Props = {
  userNodes: MeetingNodeType[]
}

const DoubleMeetingView = ({ userNodes }: Props) => {
  return (
    <div className="grid h-full w-full grid-rows-8 grid-flow-col gap-4">
      {userNodes.map((node) => {
        return (
          <div key={node.id} className="row-start-2 row-end-8">
            <MeetingNode node={node} />
          </div>
        )
      })}
    </div>
  )
}

export default DoubleMeetingView
