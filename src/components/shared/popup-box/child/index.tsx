import { ReactNode } from "react"
import BoxHolder from "../../box-holder"

type Props = {
  children: ReactNode
  onClose: () => void
  top: number
  left: number
  zIndex?: number
  width?: number
  title: string | ReactNode
}
export default function PopupBoxChild({
  children,
  onClose,
  top,
  left,
  zIndex,
  width = 300,
  title,
}: Props) {
  return (
    <div
      className="bg-background rounded-2xl p-4 fixed mt-4"
      style={{
        width,
        top: top,
        left: left,
        zIndex: zIndex ?? 100,
      }}
    >
      <BoxHolder has_divider title={title} onClose={onClose}>
        {children}
      </BoxHolder>
    </div>
  )
}
