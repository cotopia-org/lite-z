import React from "react"
import ToolbarTopRight from "../../toolbar/top-right"
import TopRightTools from "../../tools/top-right"
import ToolbarTopLeft from "../../toolbar/top-left"
import TopLeftTools from "../../tools/top-left"

interface Props {}

const TopToolbar = (props: Props) => {
  return (
    <div className="relative w-full min-h-[80px]">
      <ToolbarTopRight>
        <TopRightTools />
      </ToolbarTopRight>
      <ToolbarTopLeft>
        <TopLeftTools />
      </ToolbarTopLeft>
    </div>
  )
}

export default TopToolbar
