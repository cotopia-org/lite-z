
import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import useWindowSize from "@/hooks/use-window-size"
import { AlignJustify } from "lucide-react"
import { useDashboardContext } from "../dashboard-wrapper"

export default function UserActionsMenuButton() {
  const { windowSize } = useWindowSize()
  const { sideBarOpen, setSideBarOpen } = useDashboardContext()

  function handlerClick() {
    setSideBarOpen(!sideBarOpen)
  }

  return (
    <>
      {windowSize.windowWidth <= 1023 && (
        <CotopiaIconButton variant={"outline"} onClick={handlerClick}>
          <AlignJustify />
        </CotopiaIconButton>
      )}
    </>
  )
}
