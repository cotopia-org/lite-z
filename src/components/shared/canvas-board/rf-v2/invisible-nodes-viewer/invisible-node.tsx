import CotopiaAvatar from "@/components/shared-ui/c-avatar"
import { InvisibleNodeType } from "."
import { cn } from "@/lib/utils"

const InvisibleNode = ({ node }: { node: InvisibleNodeType }) => {
  const {
    node: rfNode,
    invisible_side,
    delta_x,
    delta_y,
    coveringArea,
    itemPositionX,
    itemPositionY,
  } = node

  if (!delta_x || !delta_y) return null
  let clss = "flex flex-col items-center gap-y-1 absolute z-[2]"
  let style: { [key: string]: any } = {}

  switch (invisible_side) {
    case "right":
      clss += " right-0"
      if (delta_y < 0) {
        style["top"] = `${delta_y}px`
        clss += " !top-0 !right-0"
      }
      if (itemPositionY > coveringArea.y.to) {
        clss += " !bottom-0 !left-0"
      }
      style["top"] = `${delta_y}px`
      break
    case "left":
      clss += " left-0"
      if (delta_y < 0) {
        style["top"] = `${delta_y}px`
        clss += " !top-0 !left-0"
      }
      if (itemPositionY + coveringArea.y.from > coveringArea.y.to) {
        clss += " !bottom-0 !left-0"
      }
      style["top"] = `${delta_y}px`

      break
    case "bottom":
      clss += " !bottom-0"
      if (itemPositionY + coveringArea.y.from > coveringArea.y.to) {
        clss += " !bottom-0"
      }
      //   if (Math.floor(itemPositionX) > Math.floor(coveringArea.x.to)) {
      //     clss += "!right-0"
      //   }
      style["left"] = `${delta_x}px`
      break
    case "top":
      clss += " top-0"
      style["left"] = `${delta_x}px`
      break
  }

  return (
    <div style={style} className={clss}>
      <span className="font-medium text-xs italic">{rfNode.id}</span>
      <CotopiaAvatar
        className="w-7 h-7 [&_.avatar-fallback]:bg-blue-300 text-primary border-primary border"
        title={rfNode.id[0] ?? ""}
      />
    </div>
  )
}

export default InvisibleNode
