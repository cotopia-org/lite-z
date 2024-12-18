import ToolbarBottomLeft from "../../toolbar/bottom-left"
import ToolbarBottomMiddle from "../../toolbar/bottom-middle"
import BottomLeftTools from "../../tools/bottom-left"
import BottomMiddleTools from "../../tools/bottom-middle"

interface Props {}

const BottomToolbar = (props: Props) => {
  return (
    <div className="relative w-full min-h-[80px]">
      <ToolbarBottomMiddle>
        <BottomMiddleTools />
      </ToolbarBottomMiddle>
      <ToolbarBottomLeft>
        <BottomLeftTools />
      </ToolbarBottomLeft>
    </div>
  )
}

export default BottomToolbar
