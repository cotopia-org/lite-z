import { getNodePositionFromCenter } from "@/lib/utils"
import { InvisibleNodeType } from "."
import CotopiaAvatar from "@/components/shared-ui/c-avatar"

type Props = {
  node: InvisibleNodeType
  isMyNode?: boolean
  avatar?: string
  onClick?: () => void
}

const UserNodeNavigator = ({
  node,
  avatar,
  isMyNode = false,
  onClick,
}: Props) => {
  let nav_clss = `relative rounded-full z-[2]`
  let avatar_clss =
    "absolute left-1 top-1 z-[2] text-primary border-primary border cursor-pointer"
  let arrow_clss = "absolute top-1/2 -translate-y-1/2 rotate-[45deg]"

  if (isMyNode) {
    nav_clss += " bg-red-600 w-[48px] h-[48px] "
    avatar_clss += " w-[40px] h-[40px]"
    arrow_clss += " w-6 h-6 bg-red-600 right-[-4.5px]"
  } else {
    nav_clss += " bg-cyan-400 w-[30px] h-[30px]"
    avatar_clss += " w-[22px] h-[22px]"
    arrow_clss += " w-[15px] h-[15px] bg-cyan-400 right-[-3.7px]"
  }

  const { itemPositionX, itemPositionY, coverCenter } = node

  const { degree } = getNodePositionFromCenter(
    { x: coverCenter.x, y: coverCenter.y },
    { x: itemPositionX, y: itemPositionY }
  )

  return (
    <>
      <div style={{ transform: `rotate(${-degree}deg)` }} className={nav_clss}>
        {/* arrow content */}
        <div className={arrow_clss}></div>
        {/* arrow content */}
      </div>
      <CotopiaAvatar
        onClick={onClick}
        src={avatar}
        className={avatar_clss}
        title={node.node.id[0] ?? ""}
      />
    </>
  )
}

export default UserNodeNavigator
