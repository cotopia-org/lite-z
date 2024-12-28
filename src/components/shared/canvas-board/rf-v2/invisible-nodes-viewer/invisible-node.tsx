import { InvisibleNodeType } from "."
import { useRoomContext } from "@/components/shared/room/room-context"
import useAuth from "@/hooks/auth"
import { VARZ } from "@/const/varz"
import UserNodeNavigator from "./user-node-navigator"
import { useReactFlow } from "@xyflow/react"

const InvisibleNode = ({ node }: { node: InvisibleNodeType }) => {
  const { room } = useRoomContext()
  const { user: myAccount } = useAuth()
  const rf = useReactFlow()

  const {
    node: rfNode,
    invisible_side,
    delta_x,
    delta_y,
    delta_y_prime,
    delta_x_prime,
    nodeHeight,
  } = node

  const is_my_node = myAccount.username === rfNode?.id
  const participants = room?.participants || []
  const current_user = participants.find((u) => u.username === rfNode.id)
  const avatar = current_user?.avatar?.url

  if (!delta_x || !delta_y) return null
  let clss = " absolute z-[2]"
  let style: { [key: string]: any } = {}

  const node_radius = nodeHeight / 2

  switch (invisible_side) {
    case "right":
      clss += " right-[15px]"
      if (delta_y < 0) {
        clss += " right-[15px] !top-[15px]"
      } else if (delta_y_prime - nodeHeight / 2 < 0) {
        clss += " !bottom-[15px] right-[15px]"
      } else
        style["top"] =
          `${delta_y + (node_radius - VARZ.invisibleArea.margin)}px`

      break
    case "left":
      clss += " left-[15px]"
      style["top"] = `${delta_y + node_radius}px`
      if (delta_y < 0) {
        clss += " !top-[15px] left-[15px]"
      }
      if (delta_y_prime < 0) {
        clss += " !bottom-[15px] left-[15px]"
        style["top"] = "initial"
      }
      break
    case "top":
      clss += " top-[15px]"
      style["left"] = `${delta_x + (node_radius - VARZ.invisibleArea.margin)}px`
      if (delta_x < 0) {
        style["left"] = `${delta_x + nodeHeight}px`
      }
      if (delta_x_prime < -(nodeHeight / 2 - VARZ.invisibleArea.margin)) {
        style["left"] = `${delta_x - node_radius}px`
      }
      break
    case "bottom":
      clss += " bottom-[15px]"
      if (delta_x_prime < 0) {
        clss += " !right-[15px] !bottom-[15px]"
      } else if (delta_x < -(nodeHeight / 2 - VARZ.invisibleArea.margin)) {
        clss += " !left-[15px] !bottom-[15px]"
      } else {
        style["left"] = `${delta_x + node_radius}px`
      }
      if (delta_y_prime < 0) {
        clss += " !bottom-[15px]"
      }

      break
  }

  const changeViewportHandler = () => {
    const x_position = rfNode.position.x
    const y_position = rfNode.position.y
    rf.setCenter(x_position, y_position, { zoom: 1.5, duration: 1000 })
  }

  return (
    <div style={style} className={clss}>
      <UserNodeNavigator
        onClick={changeViewportHandler}
        isMyNode={is_my_node}
        node={node}
        avatar={avatar}
      />
    </div>
  )
}

export default InvisibleNode
