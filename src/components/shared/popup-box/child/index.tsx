import React, { ReactNode } from "react"
import BoxHolder from "../../box-holder"
import Rank from "@/components/shared/room/tools/top-right/time-tracking/details/rank";
import UserAvatar from "@/components/shared/user-avatar";
import CotopiaButton from "@/components/shared-ui/c-button";
import {ArrowLeft, Plus} from "lucide-react";

type Props = {
  children: ReactNode
  onClose: () => void
  top: number
  left: number
  zIndex?: number
  width?: number
  title: string | ReactNode,
  button?:  ReactNode,
}
export default function PopupBoxChild({
  children,
  onClose,
  top,
  left,
  zIndex,
  width = 300,
  title,
    button
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
        <BoxHolder has_divider title={title} button={button} onClose={onClose}>


            {children}


        </BoxHolder>
    </div>
  )
}
