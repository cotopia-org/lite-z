import { VARZ } from "@/const/varz"
import React from "react"

export default function JailNode() {
  return (
    <div
      className="flex flex-col pointer-events-none z-0 bg-black/40"
      style={{
        width: VARZ.jailWidth,
        height: VARZ.jailHeight,
      }}
    ></div>
  )
}
