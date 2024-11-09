import React, { ReactNode } from "react"
import CotopiaIconButton from "../shared-ui/c-icon-button"
import { X } from "lucide-react"

type Props = {
  title: string | ReactNode
  children: ReactNode
  onClose?: () => void
  has_divider?: boolean
  className?: string
}
export default function BoxHolder({
  title,
  children,
  has_divider = false,
  onClose,
  className,
}: Props) {
  let title_node = title

  if (typeof title === "string") {
    title_node = <span className="text-lg font-medium">{title}</span>
  }

  return (
    <div className={`flex flex-col gap-y-4 ${className ?? ""}`}>
      <div className="flex flex-row items-center justify-between">
        {title_node}
        {!!onClose && (
          <CotopiaIconButton
            onClick={onClose}
            className="w-5 h-5 opacity-80 hover:opacity-100"
          >
            <X className="text-grayscale-subtitle w-4 h-4" />
          </CotopiaIconButton>
        )}
      </div>
      {has_divider && <hr />}
      <div>{children}</div>
    </div>
  )
}
