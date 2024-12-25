import CotopiaAvatar from "@/components/shared-ui/c-avatar"
import { InvisibleNodeType } from "."
import { useRoomContext } from "@/components/shared/room/room-context"
import useAuth from "@/hooks/auth"
import MyNodeNavigator from "./my-node-navigator"
import { UserMinimalType } from "@/types/user"

const InvisibleNode = ({ node }: { node: InvisibleNodeType }) => {
  const { room } = useRoomContext()
  const { user: myAccount } = useAuth()

  const { node: rfNode, invisible_side, delta_x, delta_y, delta_y_prime } = node

  const is_my_node = myAccount.username === rfNode?.id
  const participants = room?.participants || []
  const current_user = participants.find((u) => u.username === rfNode.id)
  const avatar = current_user?.avatar?.url

  if (!delta_x || !delta_y) return null
  let clss = " absolute z-[2]"
  let style: { [key: string]: any } = {}

  switch (invisible_side) {
    case "right":
      clss += is_my_node ? " right-[10px]" : " right-0"
      style["top"] = `${delta_y}px`
      if (delta_y < 0) {
        style["top"] = `${delta_y}px`
        clss += is_my_node ? " right-[10px] !top-[10px]" : " !top-0 !right-0"
      }
      if (delta_y_prime - 85 < 0) {
        style["bottom"] = 0
        style["top"] = "initial"
      }
      break
    case "left":
      clss += is_my_node ? " left-[10px]" : " left-0"
      style["top"] = `${delta_y}px`
      if (delta_y < 0) {
        clss += is_my_node ? " !top-[10px] left-[10px]" : " !top-0 !left-0"
      }
      if (delta_y_prime - 85 < 0) {
        style["bottom"] = 0
        style["top"] = "initial"
      }
      break
    case "bottom":
      clss += " !bottom-0"
      style["left"] = `${delta_x}px`
      if (delta_y_prime - 85 < 0) {
        clss += " !bottom-0"
      }
      break
    case "top":
      clss += is_my_node ? " top-[10px]" : " top-0"
      style["left"] = `${delta_x}px`
      break
  }

  let view = (
    <CotopiaAvatar
      src={avatar}
      className="w-7 h-7 text-primary border-primary border cursor-pointer"
      title={rfNode.id[0] ?? ""}
    />
  )

  if (is_my_node) {
    view = <MyNodeNavigator node={node} avatar={avatar} />
  }

  return (
    <div style={style} className={clss}>
      {view}
    </div>
  )
}

export default InvisibleNode
