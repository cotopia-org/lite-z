import { getNodePositionFromCenter } from "@/lib/utils"
import { InvisibleNodeType } from "."
import CotopiaAvatar from "@/components/shared-ui/c-avatar"

type Props = {
  node: InvisibleNodeType

  avatar?: string
}

const MyNodeNavigator = ({ node, avatar }: Props) => {
  let nav_clss = `relative w-[48px] h-[48px] bg-red-600 rounded-full z-[2]`

  const { itemPositionX, itemPositionY, coverCenter } = node

  const { degree } = getNodePositionFromCenter(
    { x: coverCenter.x, y: coverCenter.y },
    { x: itemPositionX, y: itemPositionY }
  )

  return (
    <>
      <div style={{ transform: `rotate(${-degree}deg)` }} className={nav_clss}>
        {/* arrow content */}
        <div className=" w-6 h-6 absolute top-1/2 -translate-y-1/2 right-[-4.5px] rotate-[45deg] bg-red-600"></div>
        {/* arrow content */}
      </div>
      <CotopiaAvatar
        // src={avatar}
        className=" absolute left-1 top-1 w-[40px] h-[40px] z-[2] text-primary border-primary border cursor-pointer"
        title={node.node.id[0] ?? ""}
      />
    </>
  )
}

export default MyNodeNavigator
