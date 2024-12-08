import { MeetingNodeType } from "../.."
import { ReactNode } from "react"
type Props = {
  nodes: any[]
}

const FULL_GRID_INDEX = [5, 8]
const MAX_INDEX = 8

const MultiPartMeetingView = ({ nodes }: Props) => {
  return (
    <div className="grid w-full h-full grid-cols-12 gap-4">
      {nodes.map((node, i) => {
        let view: ReactNode = (
          <div key={i + 1} className="col-span-4 bg-red-200"></div>
        )
        return view
      })}
    </div>
  )
}

export default MultiPartMeetingView
