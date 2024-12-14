import { cn } from "@/lib/utils"
import { MeetingNodeType } from "../.."
import MeetingNode from "../meeting-node"

type Props = {
  userNodes: MeetingNodeType[]
}

const NORMAL_CAPACITY = 12
const QUIET_CAPACITY = 5

const MultipleMeetingView = ({ userNodes }: Props) => {

  let nodeClassName = "node-col w-full"        

  if ( userNodes.length < QUIET_CAPACITY ) {
    nodeClassName = cn(nodeClassName, 'xl:w-[calc(50%-16px)]')
  } else if ( userNodes.length > NORMAL_CAPACITY ) {
    nodeClassName = cn(nodeClassName, 'xl:w-[calc(33.3333%-16px)]')
  } else {
    nodeClassName = cn(nodeClassName, 'xl:w-[calc(25%-16px)]')
  }

  return (
    <div className="flex flex-row justify-center flex-wrap h-full w-ful gap-4">
      {userNodes.map((node) => {
        return (
          <div key={node.id} className={nodeClassName}>
            <MeetingNode node={node} />
          </div>
        )
      })}
    </div>
  )
}

export default MultipleMeetingView
