import { Node } from "@xyflow/react"
import InvisibleNode from "./invisible-node"

export type InvisibleNodeType = {
  node: Node
  invisible: boolean
  invisible_side?: string
  delta_x?: number
  delta_x_prime: number
  delta_y_prime: number
  delta_y?: number
  coverCenter: {
    x: number
    y: number
  }
  coveringArea: {
    x: { from: number; to: number }
    y: { from: number; to: number }
  }
  itemPositionX: number
  itemPositionY: number
  nodeHeight: number
}

type Props = {
  invisibleNodes: InvisibleNodeType[]
}

const InvisibleNodesViewer = ({ invisibleNodes }: Props) => {
  return (
    <div className="viewport-overlay overflow-hidden top-[0px] left-[16px] right-[16px] bottom-[0px] absolute">
      {invisibleNodes.map((n) => {
        return <InvisibleNode key={n.node.id} node={n} />
      })}
    </div>
  )
}

export default InvisibleNodesViewer
