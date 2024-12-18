import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function ToolbarTopLeft({ children }: Props) {
  return <div className="absolute top-4 left-4 z-10">{children}</div>
}
