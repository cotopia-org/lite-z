import { ReactNode } from "react"
import MeetingNode from "../meeting-node"
import { MeetingNodeType } from "../.."
import { cn } from "@/lib/utils"
type Props = {
  nodes: MeetingNodeType[]
}

// maximum counts  12:col-span-3 >12:col-span-2 >30:col-span-1,
const MAX_CAPACITY = 60
const MIDDLE_CAPACITY = 30
const INIT_CAPACITY = 12

const MultiPartMeetingView = ({ nodes }: Props) => {
  let default_clss = "w-full h-full grid gap-4"
  let clss = cn(default_clss, "grid-cols-12")
  if (nodes.length > MAX_CAPACITY) clss = cn(default_clss, "grid-rows")

  return (
    <>
      <div className="grid w-full h-full grid-cols-12 gap-4 overflow-auto">
        {nodes.map((node, i) => {
          return (
            <div key={i + 1} className="col-span-12 md:col-span-1">
              <MeetingNode node={node} />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default MultiPartMeetingView
