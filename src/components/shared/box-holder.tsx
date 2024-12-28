import React, { ReactNode } from "react"
import CotopiaIconButton from "../shared-ui/c-icon-button"
import { ArrowLeft, X } from "lucide-react"
import CotopiaButton from "@/components/shared-ui/c-button"

type Props = {
  title: string | ReactNode
  children: ReactNode
  onClose?: () => void
  has_divider?: boolean
  className?: string
  button?: undefined | ReactNode
}
export default function BoxHolder({
  title,
  children,
  has_divider = false,
  onClose,
  className,
  button,
}: Props) {
  let title_node = title

  if (typeof title === "string") {
    title_node = <span className="text-lg font-medium">{title}</span>
  }

  return (
    <div className={`flex flex-col gap-y-4 ${className ?? ""}`}>
      <div className="box-header flex flex-row items-center justify-between">
        {title_node}
        <div className={"flex flex-row gap-x-2"}>
          {button}
          {!!onClose && (
            <CotopiaIconButton
              onClick={onClose}
              className="w-5 h-5 opacity-80 hover:opacity-100"
            >
              <X className="text-grayscale-subtitle w-4 h-4" />
            </CotopiaIconButton>
          )}
        </div>
      </div>
      {has_divider && <hr />}
      <div className="box-children">{children}</div>
    </div>
  )
}
