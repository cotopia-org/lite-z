import { Node } from "@xyflow/react"
import InvisibleNode from "./invisible-node"
import { VARZ } from "@/const/varz"

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
    <div
      className="viewport-overlay overflow-hidden"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      }}
    >
      {invisibleNodes.map((n) => {
        return <InvisibleNode key={n.node.id} node={n} />
      })}
    </div>
  )
}

export default InvisibleNodesViewer
