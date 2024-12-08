import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type Props = {
  size?: number

  className?: string
  isSpeaking?: boolean
  children: ReactNode
}

const SpeakingShower = ({
  size = 64,
  isSpeaking = false,
  children,
  className = "",
}: Props) => {
  let clss =
    "relative  flex items-center justify-center rounded-full bg-transparent"

  if (isSpeaking) {
    clss += " !bg-green-700"
  }

  return (
    <div style={{ width: size, height: size }} className={cn(clss, className)}>
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        {children}
      </div>
    </div>
  )
}

export default SpeakingShower
