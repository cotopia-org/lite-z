import React, { ReactNode } from "react"
import BoxHolder from "../../box-holder"
import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  onClose: () => void
  top: number
  left: number
  zIndex?: number
  width?: number
  title: string | ReactNode
  button?: ReactNode
  className?: string
}
export default function PopupBoxChild({
  children,
  onClose,
  top,
  left,
  zIndex,
  width = 300,
  title,
  button,
  className = "",
}: Props) {
  return (
    <div
      className={cn("bg-background rounded-2xl p-4 fixed mt-4", className)}
      style={{
        width,
        top: top,
        left: left,
        zIndex: zIndex ?? 100,
      }}
    >
      <BoxHolder has_divider title={title} button={button} onClose={onClose}>
        {children}
      </BoxHolder>
    </div>
  )
}
