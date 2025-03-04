import { ReactNode } from "react"
import ToolbarTopLeft from "./top-left"
import ToolbarTopRight from "./top-right"
import ToolbarBottomLeft from "./bottom-left"
import ToolbarBottomRight from "./bottom-right"
import ToolbarBottomMiddle from "./bottom-middle"

type Props = {
  topLeft?: ReactNode
  topRight?: ReactNode
  bottomLeft?: ReactNode
  bottomMiddle?: ReactNode
  bottomRight?: ReactNode
  className?: string
}

export default function Toolbar({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  bottomMiddle,
}: Props) {
  let clss = "relative h-screen w-full"

  return (
    <div className={clss}>
      <ToolbarTopLeft>{topLeft}</ToolbarTopLeft>
      <ToolbarTopRight>{topRight}</ToolbarTopRight>
      <ToolbarBottomLeft>{bottomLeft}</ToolbarBottomLeft>
      <ToolbarBottomMiddle>{bottomMiddle}</ToolbarBottomMiddle>
      <ToolbarBottomRight>{bottomRight}</ToolbarBottomRight>
    </div>
  )
}
